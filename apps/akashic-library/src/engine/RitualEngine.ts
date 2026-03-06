import type { BossId, PlayerState, RoomId, RitualLogEntry } from '../domain/types';

export function hasCompletedRitualForRoom(
  player: PlayerState,
  roomId: RoomId
): boolean {
  return player.ritualHistory.some((r) => r.roomId === roomId);
}

export function hasCompletedRitualForRoomToday(
  player: PlayerState,
  roomId: RoomId,
  now: Date = new Date()
): boolean {
  const yyyyMmDd = now.toISOString().slice(0, 10);
  return player.ritualHistory.some(
    (r) => r.roomId === roomId && r.completedAt.slice(0, 10) === yyyyMmDd
  );
}

export function lastRitualForRoom(
  ritualHistory: RitualLogEntry[],
  roomId: RoomId
): RitualLogEntry | undefined {
  for (let i = ritualHistory.length - 1; i >= 0; i -= 1) {
    const entry = ritualHistory[i];
    if (entry.roomId === roomId) return entry;
  }
  return undefined;
}

export function hasCompletedRitualForBoss(
  player: PlayerState,
  bossId: BossId
): boolean {
  return player.ritualHistory.some((r) => r.bossId === bossId);
}