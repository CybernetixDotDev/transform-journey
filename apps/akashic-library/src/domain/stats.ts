import type { StatDefinition, StatBlock } from './types';

export const STATS: readonly StatDefinition[] = [
  {
    id: 'might',
    name: 'Courage',
    description: 'Your capacity to act despite fear and uncertainty.',
  },
  {
    id: 'insight',
    name: 'Clarity',
    description: 'Pattern recognition and clean decision-making.',
  },
  {
    id: 'will',
    name: 'Discipline',
    description: 'Consistency, resolve, and follow-through.',
  },
  {
    id: 'agility',
    name: 'Adaptability',
    description: 'Flexibility, speed, and recovery when things change.',
  },
  {
    id: 'attunement',
    name: 'Compassion',
    description: 'Sensitivity, empathy, and connection to meaning.',
  },
];

export const DEFAULT_STATS: StatBlock = {
  might: 0,
  insight: 0,
  will: 0,
  agility: 0,
  attunement: 0,
};