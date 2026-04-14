import type { RitualDefinition } from './types';

export const RITUALS: readonly RitualDefinition[] = [
  {
    id: 'shadow_mirror_hall-mirror',
    roomId: 'shadow_mirror_hall',
    name: 'Mirror Ritual',
    description:
      'Stand before the mirror and choose one honest way to meet what appears.',
    choices: [
      {
        id: 'name-the-shadow',
        label: 'Name the shadow',
        description: 'Give one avoided pattern a clear, simple name.',
        effects: {
          courage: 2,
          clarity: 1,
        },
      },
      {
        id: 'soften-the-gaze',
        label: 'Soften the gaze',
        description: 'Stay with the reflection without turning it into a verdict.',
        effects: {
          compassion: 2,
          courage: 1,
        },
      },
    ],
  },
  {
    id: 'hall_of_echoes-reflection',
    roomId: 'hall_of_echoes',
    name: 'Ritual of Reflection',
    description:
      'Listen for the repeated echo and choose how you will respond to it today.',
    choices: [
      {
        id: 'listen-deeply',
        label: 'Listen deeply',
        description: 'Quiet the noise and identify the pattern underneath it.',
        effects: {
          clarity: 2,
          compassion: 1,
        },
      },
      {
        id: 'answer-with-discipline',
        label: 'Answer with discipline',
        description: 'Choose one small action that breaks the repeated loop.',
        effects: {
          discipline: 2,
          clarity: 1,
        },
      },
    ],
  },
  {
    id: 'scarcity_vault-release',
    roomId: 'scarcity_vault',
    name: 'Vault Release Ritual',
    description:
      'Open one locked ledger and choose what no longer needs to define your worth.',
    choices: [
      {
        id: 'return-the-ledger',
        label: 'Return the ledger',
        description: 'Release one old measure that made your value feel conditional.',
        effects: {
          selfWorth: 2,
          compassion: 1,
        },
      },
      {
        id: 'choose-enough',
        label: 'Choose enough',
        description: 'Name one grounded sign that there is enough for the next step.',
        effects: {
          selfWorth: 2,
          discipline: 1,
        },
      },
    ],
  },
];
