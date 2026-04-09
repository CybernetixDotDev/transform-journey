import { DEFAULT_STATS } from '../domain/stats';
import type { ArchetypeId, StatBlock, StatId } from '../domain/types';

export type SoulScanOption = {
  id: string;
  label: string;
  // influences archetype selection
  archetypeWeights: Partial<Record<ArchetypeId, number>>;
  // influences starting stats
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
    prompt: 'When pressure rises, you tend to…',
    options: [
      {
        id: 'q1-a',
        label: 'Hold the line and push through.',
        archetypeWeights: { warden: 2 },
        statDeltas: { will: 2, might: 1 },
      },
      {
        id: 'q1-b',
        label: 'Look for the pattern and the hidden lever.',
        archetypeWeights: { scribe: 2 },
        statDeltas: { insight: 2 },
      },
      {
        id: 'q1-c',
        label: 'Breathe, sense the current, and respond intuitively.',
        archetypeWeights: { seer: 2 },
        statDeltas: { attunement: 2 },
      },
    ],
  },
  {
    id: 'q2',
    prompt: 'Your strength is most visible when you…',
    options: [
      {
        id: 'q2-a',
        label: 'Act decisively and protect what matters.',
        archetypeWeights: { warden: 2 },
        statDeltas: { might: 2, will: 1 },
      },
      {
        id: 'q2-b',
        label: 'Study, record, and make sense of complexity.',
        archetypeWeights: { scribe: 2 },
        statDeltas: { insight: 2 },
      },
      {
        id: 'q2-c',
        label: 'Notice subtle signals others miss.',
        archetypeWeights: { seer: 2 },
        statDeltas: { attunement: 2, insight: 1 },
      },
    ],
  },
  {
    id: 'q3',
    prompt: 'In a new place, you instinctively…',
    options: [
      {
        id: 'q3-a',
        label: 'Scan for risks and secure the perimeter.',
        archetypeWeights: { warden: 2 },
        statDeltas: { will: 1, agility: 1 },
      },
      {
        id: 'q3-b',
        label: 'Map the layout and learn the rules.',
        archetypeWeights: { scribe: 2 },
        statDeltas: { insight: 2 },
      },
      {
        id: 'q3-c',
        label: 'Feel the atmosphere and follow the pull.',
        archetypeWeights: { seer: 2 },
        statDeltas: { attunement: 2 },
      },
    ],
  },
  {
    id: 'q4',
    prompt: 'When you’re blocked, the fastest way forward is…',
    options: [
      {
        id: 'q4-a',
        label: 'Discipline, repetition, endurance.',
        archetypeWeights: { warden: 2 },
        statDeltas: { will: 2 },
      },
      {
        id: 'q4-b',
        label: 'Reframe the problem and change the approach.',
        archetypeWeights: { scribe: 2 },
        statDeltas: { insight: 2 },
      },
      {
        id: 'q4-c',
        label: 'Wait for the right moment and move fluidly.',
        archetypeWeights: { seer: 2 },
        statDeltas: { agility: 2, attunement: 1 },
      },
    ],
  },
  {
    id: 'q5',
    prompt: 'Your inner compass is guided mostly by…',
    options: [
      {
        id: 'q5-a',
        label: 'Duty and commitment.',
        archetypeWeights: { warden: 2 },
        statDeltas: { will: 1, might: 1 },
      },
      {
        id: 'q5-b',
        label: 'Truth and clarity.',
        archetypeWeights: { scribe: 2 },
        statDeltas: { insight: 2 },
      },
      {
        id: 'q5-c',
        label: 'Meaning and intuition.',
        archetypeWeights: { seer: 2 },
        statDeltas: { attunement: 2 },
      },
    ],
  },
];

const clampStat = (value: number): number => Math.max(0, Math.min(10, value));

export type SoulScanResult = {
  archetypeId: ArchetypeId;
  startingStats: StatBlock;
  firstRoomId: 'hall_of_echoes'; // V1 fixed first room
};

export function runSoulScan(answerOptionIds: string[]): SoulScanResult {
  const archetypeScore: Record<ArchetypeId, number> = {
    scribe: 0,
    warden: 0,
    seer: 0,
  };

  const stats: StatBlock = { ...DEFAULT_STATS };

  const selected = new Set(answerOptionIds);

  for (const q of SOUL_SCAN_QUESTIONS) {
    const option = q.options.find((o) => selected.has(o.id));
    if (!option) continue;

    for (const [a, w] of Object.entries(option.archetypeWeights)) {
      archetypeScore[a as ArchetypeId] += w ?? 0;
    }

    for (const [s, d] of Object.entries(option.statDeltas)) {
      const statId = s as StatId;
      stats[statId] = clampStat(stats[statId] + (d ?? 0));
    }
  }

  // deterministic tie-break order
  const archetypeOrder: ArchetypeId[] = ['scribe', 'warden', 'seer'];
  let best: ArchetypeId = archetypeOrder[0];

  for (const a of archetypeOrder) {
    if (archetypeScore[a] > archetypeScore[best]) best = a;
  }

  return {
    archetypeId: best,
    startingStats: stats,
    firstRoomId: 'hall_of_echoes',
  };
}