import type { BossDefinition } from './types';

export const BOSSES: readonly BossDefinition[] = [
  {
    id: 'librarian-sentinel',
    roomId: 'echo-hall',
    name: 'Orin',
    title: 'Librarian Sentinel',
    description: 'A disciplined guardian enforcing forgotten entry rites.',
    requiredStats: {
      will: 4,
      insight: 3,
    },
    rewardXP: 20,
  },
  {
    id: 'mirror-keeper',
    roomId: 'mirror-archive',
    name: 'Veyra',
    title: 'Mirror Keeper',
    description: 'A duelist that bends perception with reflected intent.',
    requiredStats: {
      insight: 4,
      agility: 4,
    },
    rewardXP: 30,
  },
  {
    id: 'vault-oracle',
    roomId: 'astral-vault',
    name: 'Thel',
    title: 'Vault Oracle',
    description: 'A prophetic entity channeling sealed astral indexes.',
    requiredStats: {
      attunement: 4,
      will: 4,
    },
    rewardXP: 45,
  },
];