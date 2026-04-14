import type { RoomDefinition, RoomId } from './types';

export const ROOMS: readonly RoomDefinition[] = [
  {
    id: 'shadow_mirror_hall',
    name: 'Shadow Mirror Hall',
    theme: 'courage',
    description: 'A reflective hall for facing avoided truths without force.',
    bossId: 'ghost',
  },
  {
    id: 'hall_of_echoes',
    name: 'Hall of Echoes',
    theme: 'clarity',
    description: 'A chamber where repeated patterns become easier to hear.',
    bossId: 'critic',
    requiredStatToUnlock: {
      courage: 3,
    },
  },
  {
    id: 'scarcity_vault',
    name: 'Scarcity Vault',
    theme: 'selfWorth',
    description: 'A sealed vault for loosening old contracts with lack.',
    bossId: 'scarcity_beast',
    requiredStatToUnlock: {
      clarity: 4,
    },
  },
];

export const ROOM_ORDER: readonly RoomId[] = [
  'shadow_mirror_hall',
  'hall_of_echoes',
  'scarcity_vault',
];

export const FIRST_ROOM_ID: RoomId = ROOM_ORDER[0];

export function getRoomById(id: RoomId): RoomDefinition | null {
  return ROOMS.find((room) => room.id === id) ?? null;
}
