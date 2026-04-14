import { ROOMS } from '../domain/rooms';
import type { PlayerState, RoomId, StatId } from '../domain/types';

export type DailyQuest = {
  id: string;
  roomId: RoomId;
  statId: StatId;
  prompt: string;
};

export function generateDailyQuest(player: PlayerState): DailyQuest | null {
  const room = ROOMS.find((candidate) =>
    player.unlockedRooms.includes(candidate.id)
  );

  if (!room) return null;

  return {
    id: `daily-${room.id}`,
    roomId: room.id,
    statId: room.theme,
    prompt: 'Complete the room ritual and record one grounded observation.',
  };
}
