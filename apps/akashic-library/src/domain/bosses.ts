import type { BossDefinition } from './types';

export const BOSSES: readonly BossDefinition[] = [
  {
    id: 'ghost',
    roomId: 'shadow_mirror_hall',
    name: 'Veyra',
    title: 'The Ghost',
    description: 'A figure that asks whether you can look clearly and stay present.',
    requiredStats: {
      courage: 3,
      compassion: 2,
    },
    rewardXP: 20,
  },
  {
    id: 'critic',
    roomId: 'hall_of_echoes',
    name: 'Orin',
    title: 'The Critic',
    description: 'A guardian of old standards and repeated inner verdicts.',
    requiredStats: {
      clarity: 4,
      discipline: 2,
    },
    rewardXP: 30,
  },
  {
    id: 'scarcity_beast',
    roomId: 'scarcity_vault',
    name: 'Thel',
    title: 'The Scarcity Beast',
    description: 'A keeper of narrowed futures and inherited lack.',
    requiredStats: {
      selfWorth: 4,
      discipline: 2,
    },
    rewardXP: 45,
  },
];

export function getBossById(id: BossDefinition['id']): BossDefinition | null {
  return BOSSES.find((boss) => boss.id === id) ?? null;
}
