import type { BossDefinition } from './types';

export const BOSSES: readonly BossDefinition[] = [
  {
    id: 'ghost',
    roomId: 'shadow_mirror_hall',
    name: 'Veyra',
    title: 'The Ghost',
    description: 'A figure that asks whether you can look clearly and stay present.',
    represents: 'The part of you that disappears when being seen feels unsafe.',
    prompt: 'What truth can you look at gently without turning away?',
    promptVariants: [
      {
        id: 'ghost-warrior',
        prompt: 'Where can your courage be visible without becoming armor?',
        criteria: {
          archetypeId: 'warrior',
        },
      },
      {
        id: 'ghost-low-courage',
        prompt: 'What small truth can you stay with before asking yourself to be brave?',
        criteria: {
          maxStats: {
            courage: 2,
          },
        },
      },
      {
        id: 'ghost-softened-gaze',
        prompt: 'You chose to soften your gaze; what becomes easier to meet now?',
        criteria: {
          memory: {
            completedRitualChoiceId: 'soften-the-gaze',
          },
        },
      },
    ],
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
    represents: 'The inner voice that mistakes harsh judgment for protection.',
    prompt: 'What standard can become guidance instead of a sentence?',
    promptVariants: [
      {
        id: 'critic-seer',
        prompt: 'What pattern can you name without turning it into a verdict?',
        criteria: {
          archetypeId: 'seer',
        },
      },
      {
        id: 'critic-high-clarity',
        prompt: 'How can your clarity guide the next step without demanding perfection?',
        criteria: {
          minStats: {
            clarity: 4,
          },
        },
      },
      {
        id: 'critic-after-ghost',
        prompt: 'After meeting The Ghost, which echo can be heard without becoming your identity?',
        criteria: {
          memory: {
            integratedReflectionId: 'ghost',
          },
        },
      },
    ],
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
    represents: 'The old contract that says worth must be proven before it is held.',
    prompt: 'What proof can you stop demanding from yourself today?',
    promptVariants: [
      {
        id: 'scarcity-alchemist',
        prompt: 'What old measure of worth is ready to be transformed instead of obeyed?',
        criteria: {
          archetypeId: 'alchemist',
        },
      },
      {
        id: 'scarcity-v1-ending',
        prompt: 'What abundance can you carry forward after integrating the earlier reflections?',
        criteria: {
          integratedReflectionsAtLeast: 2,
          minStats: {
            selfWorth: 4,
          },
        },
      },
      {
        id: 'scarcity-repeated-enough',
        prompt: 'You have practiced choosing enough; what would enough look like inside this vault?',
        criteria: {
          memory: {
            repeatedRitualChoice: {
              choiceId: 'choose-enough',
              atLeast: 2,
            },
          },
        },
      },
    ],
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
