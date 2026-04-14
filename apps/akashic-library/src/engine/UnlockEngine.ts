import { ROOM_ORDER, ROOMS } from '../domain/rooms';
import { BOSSES } from '../domain/bosses';
import { getStatName } from '../domain/stats';
import type { PlayerState, RoomId } from '../domain/types';

export function getNextRoomToUnlock(roomId: RoomId): RoomId | null {
  const index = ROOM_ORDER.indexOf(roomId);
  if (index < 0) return null;

  return ROOM_ORDER[index + 1] ?? null;
}

export function canUnlockRoom(player: PlayerState, roomId: RoomId): boolean {
  const room = ROOMS.find((candidate) => candidate.id === roomId);
  if (!room) return false;

  if (player.unlockedRooms.includes(roomId)) return true;

  for (const [statId, required] of Object.entries(room.requiredStatToUnlock ?? {})) {
    const current = player.stats[statId as keyof typeof player.stats];
    if (current < (required ?? 0)) return false;
  }

  return true;
}

export function unlockRoom(player: PlayerState, roomId: RoomId): PlayerState {
  if (player.unlockedRooms.includes(roomId)) return player;

  return {
    ...player,
    unlockedRooms: [...player.unlockedRooms, roomId],
  };
}

export function unlockNextRoomAfterBoss(
  player: PlayerState,
  defeatedRoomId: RoomId
): PlayerState {
  const nextRoomId = getNextRoomToUnlock(defeatedRoomId);
  if (!nextRoomId || !canUnlockRoom(player, nextRoomId)) return player;

  return unlockRoom(player, nextRoomId);
}

export function getUnlockedRoomAfterBoss(
  before: PlayerState,
  after: PlayerState
): RoomId | null {
  return (
    after.unlockedRooms.find((roomId) => !before.unlockedRooms.includes(roomId)) ??
    null
  );
}

export function getRoomLockReasons(
  player: PlayerState,
  roomId: RoomId
): string[] {
  if (player.unlockedRooms.includes(roomId)) return [];

  const reasons: string[] = [];
  const room = ROOMS.find((candidate) => candidate.id === roomId);
  if (!room) return ['Room not found.'];

  const roomIndex = ROOM_ORDER.indexOf(roomId);
  if (roomIndex > 0) {
    const previousRoomId = ROOM_ORDER[roomIndex - 1];
    const previousRoom = ROOMS.find((candidate) => candidate.id === previousRoomId);
    const previousBoss = previousRoom
      ? BOSSES.find((candidate) => candidate.id === previousRoom.bossId)
      : null;

    if (previousRoom && !player.unlockedRooms.includes(previousRoom.id)) {
      reasons.push(`Complete ${previousRoom.name} first.`);
    }

    if (previousBoss && !player.defeatedBosses.includes(previousBoss.id)) {
      reasons.push(`Defeat ${previousBoss.title} in ${previousRoom?.name ?? 'the previous room'}.`);
    }
  }

  for (const [statId, required] of Object.entries(room.requiredStatToUnlock ?? {})) {
    const key = statId as keyof typeof player.stats;
    const current = player.stats[key];
    const threshold = required ?? 0;

    if (current < threshold) {
      reasons.push(
        `Increase ${getStatName(key)} to ${threshold} (currently ${current}).`
      );
    }
  }

  return reasons.length > 0 ? reasons : ['Progress further to unlock this room.'];
}
