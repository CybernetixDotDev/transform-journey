import type {
  BossId,
  PlayerState,
  RitualEffect,
  RitualLogEntry,
  RoomId,
  StatBlock,
} from '../domain/types';

export function hasCompletedRitualForRoom(
  player: PlayerState,
  roomId: RoomId
): boolean {
  return player.ritualHistory.some((entry) => entry.roomId === roomId);
}

export function hasCompletedRitualForRoomToday(
  player: PlayerState,
  roomId: RoomId,
  now: Date = new Date()
): boolean {
  const yyyyMmDd = now.toISOString().slice(0, 10);
  return player.ritualHistory.some(
    (entry) => entry.roomId === roomId && entry.completedAt.slice(0, 10) === yyyyMmDd
  );
}

export function lastRitualForRoom(
  ritualHistory: RitualLogEntry[],
  roomId: RoomId
): RitualLogEntry | undefined {
  for (let index = ritualHistory.length - 1; index >= 0; index -= 1) {
    const entry = ritualHistory[index];
    if (entry.roomId === roomId) return entry;
  }
  return undefined;
}

export function hasCompletedRitualForBoss(
  player: PlayerState,
  bossId: BossId
): boolean {
  return player.ritualHistory.some((entry) => entry.bossId === bossId);
}

function clampStat(value: number): number {
  return Math.max(0, Math.min(10, value));
}

export function applyRitualEffects(
  stats: StatBlock,
  effects: RitualEffect
): StatBlock {
  const next: StatBlock = { ...stats };

  for (const [statId, delta] of Object.entries(effects)) {
    const key = statId as keyof StatBlock;
    next[key] = clampStat(next[key] + (delta ?? 0));
  }

  return next;
}

export function completeRitual(
  player: PlayerState,
  roomId: RoomId,
  effects: RitualEffect,
  bossId?: BossId,
  now: Date = new Date()
): PlayerState {
  const completedAt = now.toISOString();

  return {
    ...player,
    stats: applyRitualEffects(player.stats, effects),
    updatedAt: completedAt,
    ritualHistory: [
      ...player.ritualHistory,
      {
        id: completedAt,
        roomId,
        bossId,
        completedAt,
      },
    ],
  };
}
