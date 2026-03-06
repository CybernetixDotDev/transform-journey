import type { RitualDefinition } from './types';

export const RITUALS: readonly RitualDefinition[] = [
  {
    id: 'echo-hall-reflection',
    roomId: 'echo-hall',
    name: 'Ritual of Reflection',
    description:
      'The echoes of the hall respond only to those who listen carefully. Choose how you approach the silence.',
    choices: [
      {
        id: 'listen-deeply',
        label: 'Listen to the echoes',
        description:
          'You quiet your thoughts and allow the chamber to reveal what it remembers.',
        effects: {
          insight: 2,
          attunement: 1,
        },
      },
      {
        id: 'speak-into-void',
        label: 'Speak into the void',
        description:
          'You challenge the chamber with your own voice and will.',
        effects: {
          will: 2,
          might: 1,
        },
      },
      {
        id: 'walk-the-perimeter',
        label: 'Walk the perimeter',
        description:
          'You study the room, searching for patterns hidden in the architecture.',
        effects: {
          insight: 1,
          agility: 1,
        },
      },
    ],
  },
];