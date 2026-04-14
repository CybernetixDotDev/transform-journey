import type { StatBlock, StatDefinition, StatId } from './types';

export const STAT_IDS: readonly StatId[] = [
  'courage',
  'clarity',
  'compassion',
  'discipline',
  'selfWorth',
];

export const STATS: readonly StatDefinition[] = [
  {
    id: 'courage',
    name: 'Courage',
    description: 'Your capacity to act despite fear and uncertainty.',
  },
  {
    id: 'clarity',
    name: 'Clarity',
    description: 'Pattern recognition and clean decision-making.',
  },
  {
    id: 'compassion',
    name: 'Compassion',
    description: 'Sensitivity, empathy, and connection to meaning.',
  },
  {
    id: 'discipline',
    name: 'Discipline',
    description: 'Consistency, resolve, and follow-through.',
  },
  {
    id: 'selfWorth',
    name: 'SelfWorth',
    description: 'The ability to honor your value without external proof.',
  },
];

export const DEFAULT_STATS: StatBlock = {
  courage: 0,
  clarity: 0,
  compassion: 0,
  discipline: 0,
  selfWorth: 0,
};

export function getStatName(statId: StatId): string {
  return STATS.find((stat) => stat.id === statId)?.name ?? statId;
}
