import type { BossDefinition, PlayerState, RoomId } from '../domain/types';
import { ROOM_ORDER } from '../domain/rooms';
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

  if (!player.unlockedRooms.includes(roomId)) {
    reasons.push('Room is locked.');
  }

  if (player.defeatedBosses.includes(boss.id)) {
    reasons.push('Boss already defeated.');
  }

  // Require ritual completion today for this room (V1 strict)
  if (!hasCompletedRitualForRoomToday(player, roomId)) {
    reasons.push('Complete today’s ritual to challenge this boss.');
  }

  // Stat thresholds
  for (const [statId, required] of Object.entries(boss.requiredStats)) {
    const current = player.stats[statId as keyof typeof player.stats];
    const req = required ?? 0;
    if (current < req) {
      reasons.push(`Increase ${statId} to ${req} (currently ${current}).`);
    }
  }

  return { ok: reasons.length === 0, reasons };
}

export function getNextRoomToUnlock(roomId: RoomId): RoomId | null {
  const idx = ROOM_ORDER.indexOf(roomId);
  if (idx < 0) return null;
  const next = ROOM_ORDER[idx + 1];
  return next ?? null;
}