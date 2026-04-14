import type { BossDefinition, PlayerState, RoomId } from '../domain/types';
import { getStatName } from '../domain/stats';
import { hasCompletedRitualForRoomToday } from './RitualEngine';

export type BossCheck = {
  ok: boolean;
  reasons: string[];
};

export function canChallengeBoss(
  player: PlayerState,
  roomId: RoomId,
  boss: BossDefinition
): BossCheck {
  const reasons: string[] = [];

  if (boss.roomId !== roomId) {
    reasons.push('Boss does not belong to this room.');
  }

  if (!player.unlockedRooms.includes(roomId)) {
    reasons.push('Room is locked.');
  }

  if (player.defeatedBosses.includes(boss.id)) {
    reasons.push('Boss already defeated.');
  }

  if (!hasCompletedRitualForRoomToday(player, roomId)) {
    reasons.push("Complete today's ritual to challenge this boss.");
  }

  for (const [statId, required] of Object.entries(boss.requiredStats)) {
    const key = statId as keyof typeof player.stats;
    const current = player.stats[key];
    const threshold = required ?? 0;

    if (current < threshold) {
      reasons.push(
        `Increase ${getStatName(key)} to ${threshold} (currently ${current}).`
      );
    }
  }

  return { ok: reasons.length === 0, reasons };
}
