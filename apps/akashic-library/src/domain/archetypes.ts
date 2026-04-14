import type { ArchetypeDefinition } from './types';

export const ARCHETYPES: readonly ArchetypeDefinition[] = [
  {
    id: 'warrior',
    name: 'Warrior',
    description: 'A path of direct action, boundaries, and courageous motion.',
    statBias: {
      courage: 2,
      discipline: 1,
    },
    startingStats: {
      courage: 4,
      clarity: 2,
      compassion: 2,
      discipline: 3,
      selfWorth: 2,
    },
  },
  {
    id: 'seer',
    name: 'Seer',
    description: 'A path of pattern recognition, intuition, and inner listening.',
    statBias: {
      clarity: 2,
      compassion: 1,
    },
    startingStats: {
      courage: 2,
      clarity: 4,
      compassion: 3,
      discipline: 2,
      selfWorth: 2,
    },
  },
  {
    id: 'alchemist',
    name: 'Alchemist',
    description: 'A path of transformation, self-trust, and integration.',
    statBias: {
      selfWorth: 2,
      compassion: 1,
    },
    startingStats: {
      courage: 2,
      clarity: 2,
      compassion: 3,
      discipline: 2,
      selfWorth: 4,
    },
  },
];

export function getArchetypeById(id: ArchetypeDefinition['id'] | null): ArchetypeDefinition | null {
  if (!id) return null;
  return ARCHETYPES.find((archetype) => archetype.id === id) ?? null;
}
