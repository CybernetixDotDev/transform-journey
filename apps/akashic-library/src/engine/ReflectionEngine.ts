import type {
  BossDefinition,
  PlayerState,
  ReflectionPromptCriteria,
  ReflectionPromptVariant,
  StatBlock,
} from '../domain/types';

function statCriteriaScore(
  stats: StatBlock,
  minStats: ReflectionPromptCriteria['minStats'],
  maxStats: ReflectionPromptCriteria['maxStats']
): number | null {
  let score = 0;

  for (const [statId, required] of Object.entries(minStats ?? {})) {
    const current = stats[statId as keyof StatBlock];

    if (current < required) return null;
    score += 2;
  }

  for (const [statId, maximum] of Object.entries(maxStats ?? {})) {
    const current = stats[statId as keyof StatBlock];

    if (current > maximum) return null;
    score += 2;
  }

  return score;
}

function memoryCriteriaScore(
  player: PlayerState,
  memory: ReflectionPromptCriteria['memory']
): number | null {
  let score = 0;

  if (!memory) return score;

  if (memory.completedRitualChoiceId) {
    const completedChoice = (player.ritualChoices ?? []).some(
      (entry) => entry.choiceId === memory.completedRitualChoiceId
    );

    if (!completedChoice) return null;
    score += 2;
  }

  if (memory.repeatedRitualChoice) {
    const count = (player.ritualChoices ?? []).filter(
      (entry) => entry.choiceId === memory.repeatedRitualChoice?.choiceId
    ).length;

    if (count < memory.repeatedRitualChoice.atLeast) return null;
    score += 2;
  }

  if (memory.integratedReflectionId) {
    const integratedReflection = (player.reflectionHistory ?? []).some(
      (entry) => entry.bossId === memory.integratedReflectionId
    );

    if (!integratedReflection) return null;
    score += 2;
  }

  return score;
}

function promptVariantScore(
  player: PlayerState,
  variant: ReflectionPromptVariant
): number | null {
  const { criteria } = variant;
  let score = 0;

  if (criteria.archetypeId) {
    if (player.archetypeId !== criteria.archetypeId) return null;
    score += 3;
  }

  const statScore = statCriteriaScore(
    player.stats,
    criteria.minStats,
    criteria.maxStats
  );
  if (statScore === null) return null;
  score += statScore;

  if (criteria.integratedReflectionsAtLeast !== undefined) {
    if (player.defeatedBosses.length < criteria.integratedReflectionsAtLeast) {
      return null;
    }

    score += 1;
  }

  const memoryScore = memoryCriteriaScore(player, criteria.memory);
  if (memoryScore === null) return null;
  score += memoryScore;

  return score;
}

export function selectReflectionPrompt(
  player: PlayerState,
  boss: BossDefinition
): string {
  let bestVariant: ReflectionPromptVariant | null = null;
  let bestScore = -1;

  for (const variant of boss.promptVariants ?? []) {
    const score = promptVariantScore(player, variant);

    if (score !== null && score > bestScore) {
      bestVariant = variant;
      bestScore = score;
    }
  }

  return bestVariant?.prompt ?? boss.prompt;
}
