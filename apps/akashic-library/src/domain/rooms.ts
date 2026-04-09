import type { RoomId, RoomDefinition } from './types';

export const ROOMS: readonly RoomDefinition[] = [
  {
    id: 'hall_of_echoes',
    name: 'Hall of Echoes',
    description: 'A chamber where old catalog chants still reverberate.',
    bossId: 'critic',
  },
  {
    id: 'shadow_mirror_hall',
    name: 'Shadow Mirror Hall',
    description: 'A reflective wing that returns altered versions of truth.',
    bossId: 'ghost',
  },
  {
    id: 'scarcity_vault',
    name: 'Scarcity Vault',
    description: 'A sealed nexus storing records of distant futures.',
    bossId: 'scarcity_beast',
  },
];

export const ROOM_ORDER: readonly RoomId[] = [
  'hall_of_echoes',
  'shadow_mirror_hall',
  'scarcity_vault',
];