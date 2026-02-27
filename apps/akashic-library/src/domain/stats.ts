import type { StatDefinition } from './types';

export const STATS: readonly StatDefinition[] = [
  {
    id: 'might',
    name: 'Might',
    description: 'Physical force and melee impact.',
  },
  {
    id: 'insight',
    name: 'Insight',
    description: 'Pattern reading and tactical awareness.',
  },
  {
    id: 'will',
    name: 'Will',
    description: 'Mental resilience and resolve.',
  },
  {
    id: 'agility',
    name: 'Agility',
    description: 'Speed, reflexes, and movement control.',
  },
  {
    id: 'attunement',
    name: 'Attunement',
    description: 'Connection to arcane and library currents.',
  },
];
