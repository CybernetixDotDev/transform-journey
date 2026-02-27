import type { ArchetypeDefinition } from './types';

export const ARCHETYPES: readonly ArchetypeDefinition[] = [
  {
    id: 'scribe',
    name: 'Scribe',
    description: 'A knowledge-focused path with balanced utility.',
    startingStats: {
      might: 2,
      insight: 4,
      will: 3,
      agility: 2,
      attunement: 4,
    },
  },
  {
    id: 'warden',
    name: 'Warden',
    description: 'A protector path with strong frontline pressure.',
    startingStats: {
      might: 4,
      insight: 2,
      will: 4,
      agility: 2,
      attunement: 2,
    },
  },
  {
    id: 'seer',
    name: 'Seer',
    description: 'A precision path that predicts and outmaneuvers.',
    startingStats: {
      might: 2,
      insight: 4,
      will: 3,
      agility: 4,
      attunement: 2,
    },
  },
];
