import { ARCHETYPES } from '../domain/archetypes';
import { DEFAULT_STATS, STAT_IDS } from '../domain/stats';
import { FIRST_ROOM_ID } from '../domain/rooms';
import type { ArchetypeId, RoomId, StatBlock, StatId } from '../domain/types';

export type SoulScanOption = {
  id: string;
  label: string;
  archetypeWeights: Partial<Record<ArchetypeId, number>>;
  statDeltas: Partial<Record<StatId, number>>;
};

export type SoulScanQuestion = {
  id: string;
  prompt: string;
  options: SoulScanOption[];
};

export const SOUL_SCAN_QUESTIONS: readonly SoulScanQuestion[] = [
  {
    id: 'q1',
    prompt: 'When pressure rises, you tend to...',
    options: [
      {
        id: 'q1-a',
        label: 'Act directly and protect what matters.',
        archetypeWeights: { warrior: 2 },
        statDeltas: { courage: 2, discipline: 1 },
      },
      {
        id: 'q1-b',
        label: 'Look for the pattern underneath the noise.',
        archetypeWeights: { seer: 2 },
        statDeltas: { clarity: 2 },
      },
      {
        id: 'q1-c',
        label: 'Find what can be transformed instead of forced.',
        archetypeWeights: { alchemist: 2 },
        statDeltas: { selfWorth: 1, compassion: 1 },
      },
    ],
  },
  {
    id: 'q2',
    prompt: 'Your strength is most visible when you...',
    options: [
      {
        id: 'q2-a',
        label: 'Move first and make the path safer.',
        archetypeWeights: { warrior: 2 },
        statDeltas: { courage: 2 },
      },
      {
        id: 'q2-b',
        label: 'Notice what others have missed.',
        archetypeWeights: { seer: 2 },
        statDeltas: { clarity: 2, compassion: 1 },
      },
      {
        id: 'q2-c',
        label: 'Turn a difficult pattern into useful material.',
        archetypeWeights: { alchemist: 2 },
        statDeltas: { selfWorth: 2 },
      },
    ],
  },
  {
    id: 'q3',
    prompt: 'When you are blocked, the next honest step is...',
    options: [
      {
        id: 'q3-a',
        label: 'Take the smallest brave action.',
        archetypeWeights: { warrior: 2 },
        statDeltas: { courage: 1, discipline: 1 },
      },
      {
        id: 'q3-b',
        label: 'Get clear about what is actually happening.',
        archetypeWeights: { seer: 2 },
        statDeltas: { clarity: 2 },
      },
      {
        id: 'q3-c',
        label: 'Change your relationship to the pattern.',
        archetypeWeights: { alchemist: 2 },
        statDeltas: { selfWorth: 1, compassion: 1 },
      },
    ],
  },
  {
    id: 'q4',
    prompt: 'Your inner compass is guided mostly by...',
    options: [
      {
        id: 'q4-a',
        label: 'Courage and commitment.',
        archetypeWeights: { warrior: 2 },
        statDeltas: { courage: 1, discipline: 1 },
      },
      {
        id: 'q4-b',
        label: 'Clarity and meaning.',
        archetypeWeights: { seer: 2 },
        statDeltas: { clarity: 1, compassion: 1 },
      },
      {
        id: 'q4-c',
        label: 'Integration and self-trust.',
        archetypeWeights: { alchemist: 2 },
        statDeltas: { selfWorth: 2 },
      },
    ],
  },
  {
    id: 'q5',
    prompt: 'The room you are ready to enter asks you to...',
    options: [
      {
        id: 'q5-a',
        label: 'Face what you have avoided.',
        archetypeWeights: { warrior: 1 },
        statDeltas: { courage: 2 },
      },
      {
        id: 'q5-b',
        label: 'Listen for the repeated pattern.',
        archetypeWeights: { seer: 1 },
        statDeltas: { clarity: 2 },
      },
      {
        id: 'q5-c',
        label: 'Release an old measure of worth.',
        archetypeWeights: { alchemist: 1 },
        statDeltas: { selfWorth: 2 },
      },
    ],
  },
];

export type SoulScanResult = {
  archetypeId: ArchetypeId;
  startingStats: StatBlock;
  firstRoomId: RoomId;
};

const clampStat = (value: number): number => Math.max(0, Math.min(10, value));

export function runSoulScan(answerOptionIds: string[]): SoulScanResult {
  const archetypeScore: Record<ArchetypeId, number> = {
    warrior: 0,
    seer: 0,
    alchemist: 0,
  };

  const stats: StatBlock = { ...DEFAULT_STATS };
  const selected = new Set(answerOptionIds);

  for (const question of SOUL_SCAN_QUESTIONS) {
    const option = question.options.find((candidate) => selected.has(candidate.id));
    if (!option) continue;

    for (const [archetypeId, weight] of Object.entries(option.archetypeWeights)) {
      archetypeScore[archetypeId as ArchetypeId] += weight ?? 0;
    }

    for (const [statId, delta] of Object.entries(option.statDeltas)) {
      const key = statId as StatId;
      stats[key] = clampStat(stats[key] + (delta ?? 0));
    }
  }

  const archetypeOrder = ARCHETYPES.map((archetype) => archetype.id);
  let best = archetypeOrder[0];

  for (const archetypeId of archetypeOrder) {
    if (archetypeScore[archetypeId] > archetypeScore[best]) {
      best = archetypeId;
    }
  }

  const archetype = ARCHETYPES.find((candidate) => candidate.id === best);
  const startingStats = { ...(archetype?.startingStats ?? DEFAULT_STATS) };

  for (const statId of STAT_IDS) {
    startingStats[statId] = clampStat(startingStats[statId] + stats[statId]);
  }

  return {
    archetypeId: best,
    startingStats,
    firstRoomId: FIRST_ROOM_ID,
  };
}
