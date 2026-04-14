import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BOSSES } from '../domain/bosses';
import { DEFAULT_STATS, STAT_IDS } from '../domain/stats';
import type { PlayerState, RoomId } from '../domain/types';
import { canChallengeBoss } from '../engine/BossEngine';
import { selectReflectionPrompt } from '../engine/ReflectionEngine';
import { completeRitual } from '../engine/RitualEngine';
import { runSoulScan } from '../engine/SoulScanEngine';
import { getRoomLockReasons } from '../engine/UnlockEngine';
import { createDefaultPlayerState, usePlayerStore } from '../state/usePlayerStore';

vi.mock('@react-native-async-storage/async-storage', () => {
  const storage = new Map<string, string>();

  return {
    default: {
      getItem: vi.fn((key: string) => Promise.resolve(storage.get(key) ?? null)),
      setItem: vi.fn((key: string, value: string) => {
        storage.set(key, value);
        return Promise.resolve();
      }),
      removeItem: vi.fn((key: string) => {
        storage.delete(key);
        return Promise.resolve();
      }),
      clear: vi.fn(() => {
        storage.clear();
        return Promise.resolve();
      }),
    },
  };
});

const todayIso = () => new Date().toISOString();

const createPlayer = (overrides: Partial<PlayerState> = {}): PlayerState => ({
  ...createDefaultPlayerState(),
  ...overrides,
  stats: {
    ...DEFAULT_STATS,
    ...(overrides.stats ?? {}),
  },
});

const firstBoss = BOSSES.find((boss) => boss.id === 'ghost');
const secondBoss = BOSSES.find((boss) => boss.id === 'critic');
const finalBoss = BOSSES.find((boss) => boss.id === 'scarcity_beast');

if (!firstBoss || !secondBoss || !finalBoss) {
  throw new Error('Expected V1 boss definitions to exist.');
}

const setStorePlayer = (player: PlayerState) => {
  usePlayerStore.setState({
    hydrated: true,
    player,
    lastRitualResult: null,
    lastBossResult: null,
  });
};

describe('SoulScanEngine', () => {
  it('returns a valid archetype, valid stat values, and the first room', () => {
    const result = runSoulScan(['q1-a', 'q2-a', 'q3-a', 'q4-a', 'q5-a']);

    expect(['warrior', 'seer', 'alchemist']).toContain(result.archetypeId);
    expect(result.firstRoomId).toBe('shadow_mirror_hall');

    for (const statId of STAT_IDS) {
      expect(result.startingStats[statId]).toBeGreaterThanOrEqual(0);
      expect(result.startingStats[statId]).toBeLessThanOrEqual(10);
    }
  });
});

describe('RitualEngine', () => {
  it('completing a ritual increases expected stats and records history', () => {
    const player = createPlayer({
      unlockedRooms: ['shadow_mirror_hall'],
      stats: {
        ...DEFAULT_STATS,
        courage: 1,
        clarity: 1,
      },
    });

    const next = completeRitual(
      player,
      'shadow_mirror_hall',
      { courage: 2, clarity: 1 },
      undefined,
      new Date('2026-04-14T08:00:00.000Z')
    );

    expect(next.stats.courage).toBe(3);
    expect(next.stats.clarity).toBe(2);
    expect(next.ritualHistory).toHaveLength(1);
    expect(next.ritualHistory[0]).toMatchObject({
      roomId: 'shadow_mirror_hall',
      completedAt: '2026-04-14T08:00:00.000Z',
    });
  });
});

describe('ReflectionEngine', () => {
  it('falls back to the base prompt when no prompt variant matches', () => {
    const player = createPlayer({
      archetypeId: 'warrior',
      stats: {
        ...DEFAULT_STATS,
        clarity: 1,
      },
    });

    expect(selectReflectionPrompt(player, secondBoss)).toBe(secondBoss.prompt);
  });

  it('selects an archetype-specific prompt deterministically', () => {
    const player = createPlayer({
      archetypeId: 'seer',
      stats: {
        ...DEFAULT_STATS,
        clarity: 4,
      },
    });

    expect(selectReflectionPrompt(player, secondBoss)).toBe(
      'What pattern can you name without turning it into a verdict?'
    );
  });

  it('selects a stat-specific prompt when the stat criteria match', () => {
    const player = createPlayer({
      archetypeId: 'warrior',
      stats: {
        ...DEFAULT_STATS,
        clarity: 4,
      },
    });

    expect(selectReflectionPrompt(player, secondBoss)).toBe(
      'How can your clarity guide the next step without demanding perfection?'
    );
  });

  it('selects a progression-specific prompt for the final reflection', () => {
    const player = createPlayer({
      archetypeId: 'warrior',
      defeatedBosses: ['ghost', 'critic'],
      stats: {
        ...DEFAULT_STATS,
        selfWorth: 4,
      },
    });

    expect(selectReflectionPrompt(player, finalBoss)).toBe(
      'What abundance can you carry forward after integrating the earlier reflections?'
    );
  });

  it('selects a prompt from a prior ritual choice memory', () => {
    const player = createPlayer({
      archetypeId: 'seer',
      stats: {
        ...DEFAULT_STATS,
        courage: 3,
      },
      ritualChoices: [
        {
          id: 'choice-memory',
          roomId: 'shadow_mirror_hall',
          ritualId: 'shadow_mirror_hall-mirror',
          choiceId: 'soften-the-gaze',
          effects: {
            compassion: 2,
            courage: 1,
          },
          completedAt: todayIso(),
        },
      ],
    });

    expect(selectReflectionPrompt(player, firstBoss)).toBe(
      'You chose to soften your gaze; what becomes easier to meet now?'
    );
  });

  it('selects a prompt from prior reflection memory', () => {
    const player = createPlayer({
      archetypeId: 'warrior',
      stats: {
        ...DEFAULT_STATS,
        clarity: 1,
      },
      reflectionHistory: [
        {
          id: 'ghost-memory',
          bossId: 'ghost',
          roomId: 'shadow_mirror_hall',
          prompt: firstBoss.prompt,
          rewardXP: firstBoss.rewardXP,
          unlockedRoomId: 'hall_of_echoes',
          integratedAt: todayIso(),
        },
      ],
    });

    expect(selectReflectionPrompt(player, secondBoss)).toBe(
      'After meeting The Ghost, which echo can be heard without becoming your identity?'
    );
  });

  it('selects a prompt from a repeated ritual choice pattern', () => {
    const choiceMemory = {
      roomId: 'scarcity_vault' as const,
      ritualId: 'scarcity_vault-release',
      choiceId: 'choose-enough',
      effects: {
        selfWorth: 2,
        discipline: 1,
      },
      completedAt: todayIso(),
    };
    const player = createPlayer({
      archetypeId: 'warrior',
      ritualChoices: [
        {
          ...choiceMemory,
          id: 'choice-memory-1',
        },
        {
          ...choiceMemory,
          id: 'choice-memory-2',
        },
      ],
    });

    expect(selectReflectionPrompt(player, finalBoss)).toBe(
      'You have practiced choosing enough; what would enough look like inside this vault?'
    );
  });
});

describe('BossEngine', () => {
  it('cannot challenge the first boss before completing a ritual', () => {
    const player = createPlayer({
      unlockedRooms: ['shadow_mirror_hall'],
      stats: {
        ...DEFAULT_STATS,
        courage: 3,
        compassion: 2,
      },
    });

    const check = canChallengeBoss(player, 'shadow_mirror_hall', firstBoss);

    expect(check.ok).toBe(false);
    expect(check.reasons).toContain("Complete today's ritual to begin integration.");
  });

  it('can challenge the first boss after ritual and stat requirements are met', () => {
    const player = createPlayer({
      unlockedRooms: ['shadow_mirror_hall'],
      stats: {
        ...DEFAULT_STATS,
        courage: 3,
        compassion: 2,
      },
      ritualHistory: [
        {
          id: 'ritual-today',
          roomId: 'shadow_mirror_hall',
          completedAt: todayIso(),
        },
      ],
    });

    const check = canChallengeBoss(player, 'shadow_mirror_hall', firstBoss);

    expect(check.ok).toBe(true);
    expect(check.reasons).toEqual([]);
  });
});

describe('usePlayerStore', () => {
  beforeEach(() => {
    setStorePlayer(createDefaultPlayerState());
  });

  it('completes the second room loop and unlocks scarcity_vault', () => {
    const player = createPlayer({
      unlockedRooms: ['shadow_mirror_hall', 'hall_of_echoes'],
      defeatedBosses: ['ghost'],
      ascensionPoints: firstBoss.rewardXP,
      stats: {
        ...DEFAULT_STATS,
        courage: 3,
        clarity: 2,
        compassion: 7,
        discipline: 2,
        selfWorth: 10,
      },
      ritualHistory: [
        {
          id: 'first-room-ritual',
          roomId: 'shadow_mirror_hall',
          completedAt: todayIso(),
        },
      ],
    });
    setStorePlayer(player);

    usePlayerStore.getState().completeRitual({
      roomId: 'hall_of_echoes',
      effects: {
        clarity: 2,
        compassion: 1,
      },
    });

    expect(
      canChallengeBoss(
        usePlayerStore.getState().player,
        'hall_of_echoes',
        secondBoss
      ).ok
    ).toBe(true);

    const defeated = usePlayerStore.getState().defeatBoss('critic');
    const state = usePlayerStore.getState();

    expect(defeated).toBe(true);
    expect(state.player.ascensionPoints).toBe(
      firstBoss.rewardXP + secondBoss.rewardXP
    );
    expect(state.player.defeatedBosses).toEqual(['ghost', 'critic']);
    expect(state.player.unlockedRooms).toContain('scarcity_vault');
    expect(state.lastBossResult).toMatchObject({
      bossId: 'critic',
      roomId: 'hall_of_echoes',
      rewardXP: secondBoss.rewardXP,
      unlockedRoomId: 'scarcity_vault',
    });
  });

  it('records ritual choice memory when completing a ritual', () => {
    const player = createPlayer({
      unlockedRooms: ['shadow_mirror_hall'],
    });
    setStorePlayer(player);

    usePlayerStore.getState().completeRitual({
      roomId: 'shadow_mirror_hall',
      ritualId: 'shadow_mirror_hall-mirror',
      choiceId: 'soften-the-gaze',
      effects: {
        compassion: 2,
        courage: 1,
      },
    });

    const state = usePlayerStore.getState();

    expect(state.player.ritualChoices).toHaveLength(1);
    expect(state.player.ritualChoices[0]).toMatchObject({
      roomId: 'shadow_mirror_hall',
      ritualId: 'shadow_mirror_hall-mirror',
      choiceId: 'soften-the-gaze',
      effects: {
        compassion: 2,
        courage: 1,
      },
    });
  });

  it('completes the Scarcity Vault loop without unlocking another room', () => {
    const player = createPlayer({
      unlockedRooms: ['shadow_mirror_hall', 'hall_of_echoes', 'scarcity_vault'],
      defeatedBosses: ['ghost', 'critic'],
      ascensionPoints: firstBoss.rewardXP + secondBoss.rewardXP,
      stats: {
        ...DEFAULT_STATS,
        courage: 3,
        clarity: 4,
        compassion: 8,
        discipline: 2,
        selfWorth: 2,
      },
      ritualHistory: [
        {
          id: 'first-room-ritual',
          roomId: 'shadow_mirror_hall',
          completedAt: todayIso(),
        },
        {
          id: 'second-room-ritual',
          roomId: 'hall_of_echoes',
          completedAt: todayIso(),
        },
      ],
    });
    setStorePlayer(player);

    usePlayerStore.getState().completeRitual({
      roomId: 'scarcity_vault',
      effects: {
        selfWorth: 2,
        compassion: 1,
      },
    });

    expect(
      canChallengeBoss(
        usePlayerStore.getState().player,
        'scarcity_vault',
        finalBoss
      ).ok
    ).toBe(true);

    const defeated = usePlayerStore.getState().defeatBoss('scarcity_beast');
    const state = usePlayerStore.getState();

    expect(defeated).toBe(true);
    expect(state.player.ascensionPoints).toBe(
      firstBoss.rewardXP + secondBoss.rewardXP + finalBoss.rewardXP
    );
    expect(state.player.defeatedBosses).toEqual([
      'ghost',
      'critic',
      'scarcity_beast',
    ]);
    expect(state.player.unlockedRooms).toEqual([
      'shadow_mirror_hall',
      'hall_of_echoes',
      'scarcity_vault',
    ]);
    expect(state.lastBossResult).toMatchObject({
      bossId: 'scarcity_beast',
      roomId: 'scarcity_vault',
      rewardXP: finalBoss.rewardXP,
      unlockedRoomId: null,
      isEndOfV1: true,
    });
  });

  it('defeatBoss grants XP, marks boss defeated, unlocks hall_of_echoes, and sets lastBossResult', () => {
    const player = createPlayer({
      unlockedRooms: ['shadow_mirror_hall'],
      stats: {
        ...DEFAULT_STATS,
        courage: 3,
        compassion: 2,
      },
      ritualHistory: [
        {
          id: 'ritual-today',
          roomId: 'shadow_mirror_hall',
          completedAt: todayIso(),
        },
      ],
    });
    setStorePlayer(player);

    const defeated = usePlayerStore.getState().defeatBoss('ghost');
    const state = usePlayerStore.getState();

    expect(defeated).toBe(true);
    expect(state.player.ascensionPoints).toBe(firstBoss.rewardXP);
    expect(state.player.defeatedBosses).toContain('ghost');
    expect(state.player.unlockedRooms).toContain('hall_of_echoes' satisfies RoomId);
    expect(state.player.reflectionHistory).toHaveLength(1);
    expect(state.player.reflectionHistory[0]).toMatchObject({
      bossId: 'ghost',
      roomId: 'shadow_mirror_hall',
      prompt: firstBoss.prompt,
      rewardXP: firstBoss.rewardXP,
      unlockedRoomId: 'hall_of_echoes',
    });
    expect(state.lastBossResult).toMatchObject({
      bossId: 'ghost',
      roomId: 'shadow_mirror_hall',
      rewardXP: firstBoss.rewardXP,
      unlockedRoomId: 'hall_of_echoes',
    });
    expect(state.lastBossResult?.completedAt).toEqual(expect.any(String));
  });

  it('clearLastBossResult clears result state without clearing progression', () => {
    const player = createPlayer({
      unlockedRooms: ['shadow_mirror_hall'],
      stats: {
        ...DEFAULT_STATS,
        courage: 3,
        compassion: 2,
      },
      ritualHistory: [
        {
          id: 'ritual-today',
          roomId: 'shadow_mirror_hall',
          completedAt: todayIso(),
        },
      ],
    });
    setStorePlayer(player);

    usePlayerStore.getState().defeatBoss('ghost');
    usePlayerStore.getState().clearLastBossResult();

    const state = usePlayerStore.getState();
    expect(state.lastBossResult).toBeNull();
    expect(state.player.ascensionPoints).toBe(firstBoss.rewardXP);
    expect(state.player.defeatedBosses).toContain('ghost');
    expect(state.player.unlockedRooms).toContain('hall_of_echoes');
  });
});

describe('UnlockEngine', () => {
  it('explains that a locked room needs the previous boss defeated', () => {
    const player = createPlayer({
      unlockedRooms: ['shadow_mirror_hall'],
      stats: {
        ...DEFAULT_STATS,
        courage: 3,
      },
    });

    expect(getRoomLockReasons(player, 'hall_of_echoes')).toContain(
      'Integrate The Ghost in Shadow Mirror Hall.'
    );
  });

  it('explains required stat gaps for locked rooms', () => {
    const player = createPlayer({
      unlockedRooms: ['shadow_mirror_hall', 'hall_of_echoes'],
      defeatedBosses: ['ghost'],
      stats: {
        ...DEFAULT_STATS,
        clarity: 2,
      },
    });

    expect(getRoomLockReasons(player, 'scarcity_vault')).toContain(
      'Increase Clarity to 4 (currently 2).'
    );
  });
});
