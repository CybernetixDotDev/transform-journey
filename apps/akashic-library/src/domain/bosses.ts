import type { BossDefinition } from './types';

export const BOSSES: readonly BossDefinition[] = [
  {
    id: 'librarian-sentinel',
    roomId: 'echo-hall',
    name: 'Orin',
    title: 'Librarian Sentinel',
    description: 'A disciplined guardian enforcing forgotten entry rites.',
    baseStats: {
      might: 4,
      insight: 3,
      will: 4,
      agility: 2,
      attunement: 3,
    },
  },
  {
    id: 'mirror-keeper',
    roomId: 'mirror-archive',
    name: 'Veyra',
    title: 'Mirror Keeper',
    description: 'A duelist that bends perception with reflected intent.',
    baseStats: {
      might: 2,
      insight: 4,
      will: 3,
      agility: 4,
      attunement: 3,
    },
  },
  {
    id: 'vault-oracle',
    roomId: 'astral-vault',
    name: 'Thel',
    title: 'Vault Oracle',
    description: 'A prophetic entity channeling sealed astral indexes.',
    baseStats: {
      might: 3,
      insight: 4,
      will: 4,
      agility: 2,
      attunement: 4,
    },
  },
];
