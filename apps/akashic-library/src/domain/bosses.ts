import type { BossDefinition } from './types';

export const BOSSES: readonly BossDefinition[] = [
  {
    id: 'critic',
    roomId: 'hall_of_echoes',
    name: 'Orin',
    title: 'The Critic',
    description: 'A disciplined guardian enforcing forgotten entry rites.',
    requiredStats: {
      will: 4,
      insight: 3,
    },
    rewardXP: 20,
  },
  {
    id: 'ghost',
    roomId: 'shadow_mirror_hall',
    name: 'Veyra',
    title: 'The Ghost',
    description: 'A duelist that bends perception with reflected intent.',
    requiredStats: {
      insight: 4,
      agility: 4,
    },
    rewardXP: 30,
  },
  {
    id: 'scarcity_beast',
    roomId: 'scarcity_vault',
    name: 'Thel',
    title: 'The Scarcity Beast',
    description: 'A prophetic entity channeling sealed astral indexes.',
    requiredStats: {
      attunement: 4,
      will: 4,
    },
    rewardXP: 45,
  },
];