import { create } from 'zustand';

import { DEFAULT_STATS } from '../domain/stats';
import type {
  ArchetypeId,
  BossId,
  PlayerState,
  RitualLogEntry,
  RoomId,
  StatBlock,
  StatId,
} from '../domain/types';
import {
  clearPlayerState,
  loadPlayerState,
  savePlayerState,
} from '../storage/persistence';

type CompleteRitualInput = Omit<RitualLogEntry, 'id' | 'completedAt'> & {
  bossId?: BossId;
};

type PlayerStore = {
  hydrated: boolean;
  player: PlayerState;

  hydrate: () => Promise<void>;
  reset: () => Promise<void>;

  setArchetype: (archetypeId: ArchetypeId, startingStats?: StatBlock) => void;
  addAscensionPoints: (amount: number) => void;

  unlockRoom: (roomId: RoomId) => void;
  defeatBoss: (bossId: BossId, rewardXP?: number) => void;

  completeRitual: (entry: CompleteRitualInput) => void;
  updateStat: (statId: StatId, delta: number) => void;
};

const clampStat = (value: number): number => Math.max(0, Math.min(10, value));

const normalizeStatBlock = (stats: StatBlock): StatBlock => ({
  might: clampStat(stats.might),
  insight: clampStat(stats.insight),
  will: clampStat(stats.will),
  agility: clampStat(stats.agility),
  attunement: clampStat(stats.attunement),
});

const safePositive = (value: number): number => {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, value);
};

const buildRitualId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const logPersistError = (err: unknown): void => {
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.warn('Failed to persist player state', err);
  }
};

export const createDefaultPlayerState = (): PlayerState => {
  const now = new Date().toISOString();

  return {
    version: 1,
    createdAt: now,
    updatedAt: now,
    archetypeId: null,
    stats: { ...DEFAULT_STATS },
    ascensionPoints: 0,
    unlockedRooms: [],
    defeatedBosses: [],
    ritualHistory: [],
  };
};

export const usePlayerStore = create<PlayerStore>((set) => {
  const persistMutation = (update: (player: PlayerState) => PlayerState): void => {
    let nextPlayer: PlayerState | null = null;

    set((state) => {
      const updated = update(state.player);
      const stamped: PlayerState = {
        ...updated,
        updatedAt: new Date().toISOString(),
      };

      nextPlayer = stamped;
      return { player: stamped };
    });

    if (nextPlayer) {
      void savePlayerState(nextPlayer).catch(logPersistError);
    }
  };

  return {
    hydrated: false,
    player: createDefaultPlayerState(),

    hydrate: async () => {
      const loaded = await loadPlayerState();

      const isValidV1 = loaded?.version === 1;
      const player = isValidV1 ? loaded : createDefaultPlayerState();

      set({ hydrated: true, player });

      // Persist if missing OR invalid/outdated
      if (!loaded || !isValidV1) {
        await savePlayerState(player).catch(logPersistError);
      }
    },

    reset: async () => {
      const player = createDefaultPlayerState();

      await clearPlayerState().catch(logPersistError);
      await savePlayerState(player).catch(logPersistError);

      set({ hydrated: true, player });
    },

    setArchetype: (archetypeId, startingStats) => {
      persistMutation((player) => ({
        ...player,
        archetypeId,
        stats: normalizeStatBlock(startingStats ?? player.stats),
      }));
    },

    addAscensionPoints: (amount) => {
      const safeAmount = safePositive(amount);

      persistMutation((player) => ({
        ...player,
        ascensionPoints: Math.max(0, player.ascensionPoints + safeAmount),
      }));
    },

    unlockRoom: (roomId) => {
      persistMutation((player) => {
        if (player.unlockedRooms.includes(roomId)) return player;

        return {
          ...player,
          unlockedRooms: [...player.unlockedRooms, roomId],
        };
      });
    },

    defeatBoss: (bossId, rewardXP = 0) => {
      const safeReward = safePositive(rewardXP);

      persistMutation((player) => {
        const defeatedBosses = player.defeatedBosses.includes(bossId)
          ? player.defeatedBosses
          : [...player.defeatedBosses, bossId];

        return {
          ...player,
          defeatedBosses,
          ascensionPoints: Math.max(0, player.ascensionPoints + safeReward),
        };
      });
    },

    completeRitual: (entry) => {
      persistMutation((player) => ({
        ...player,
        ritualHistory: [
          ...player.ritualHistory,
          {
            ...entry,
            id: buildRitualId(),
            completedAt: new Date().toISOString(),
          },
        ],
      }));
    },

    updateStat: (statId, delta) => {
      const safeDelta = Number.isFinite(delta) ? delta : 0;

      persistMutation((player) => ({
        ...player,
        stats: {
          ...player.stats,
          [statId]: clampStat(player.stats[statId] + safeDelta),
        },
      }));
    },
  };
});