import type { RoomDefinition } from './types';

export const ROOMS: readonly RoomDefinition[] = [
  {
    id: 'echo-hall',
    name: 'Echo Hall',
    description: 'A chamber where old catalog chants still reverberate.',
    bossId: 'librarian-sentinel',
  },
  {
    id: 'mirror-archive',
    name: 'Mirror Archive',
    description: 'A reflective wing that returns altered versions of truth.',
    bossId: 'mirror-keeper',
  },
  {
    id: 'astral-vault',
    name: 'Astral Vault',
    description: 'A sealed nexus storing records of distant futures.',
    bossId: 'vault-oracle',
  },
];
