import { create } from 'zustand';

import { DEFAULT_STATS, STAT_IDS } from '../domain/stats';
import { BOSSES } from '../domain/bosses';
import type {
  ArchetypeId,
  BossId,
  PlayerState,
  RitualLogEntry,
  RoomId,
  StatBlock,
  StatId,
} from '../domain/types';
import type { SoulScanResult } from '../engine/SoulScanEngine';
import { canChallengeBoss } from '../engine/BossEngine';
import { completeRitual as resolveRitual } from '../engine/RitualEngine';
import {
  getUnlockedRoomAfterBoss,
  getNextRoomToUnlock,
  unlockNextRoomAfterBoss,
  unlockRoom as resolveUnlockRoom,
} from '../engine/UnlockEngine';
import {
  clearPlayerState,
  loadPlayerState,
  savePlayerState,
} from '../storage/persistence';

type CompleteRitualInput = Omit<RitualLogEntry, 'id' | 'completedAt'> & {
  effects?: Partial<StatBlock>;
};

type RitualResult = {
  roomId: RoomId;
  effects: Partial<StatBlock>;
  before: StatBlock;
  after: StatBlock;
};

export type BossResult = {
  bossId: BossId;
  roomId: RoomId;
  rewardXP: number;
  unlockedRoomId: RoomId | null;
  isEndOfV1: boolean;
  completedAt: string;
};

type PlayerStore = {
  hydrated: boolean;
  player: PlayerState;
  lastRitualResult: RitualResult | null;
  lastBossResult: BossResult | null;

  hydrate: () => Promise<void>;
  reset: () => Promise<void>;

  completeSoulScan: (result: SoulScanResult) => void;
  setArchetype: (archetypeId: ArchetypeId, startingStats?: StatBlock) => void;
  addAscensionPoints: (amount: number) => void;

  unlockRoom: (roomId: RoomId) => void;
  defeatBoss: (bossId: BossId, rewardXP?: number) => boolean;

  completeRitual: (entry: CompleteRitualInput) => void;
  setLastRitualResult: (result: RitualResult) => void;
  clearLastRitualResult: () => void;
  clearLastBossResult: () => void;

  updateStat: (statId: StatId, delta: number) => void;
};

const clampStat = (value: number): number => Math.max(0, Math.min(10, value));

const copyStatBlock = (stats: Partial<StatBlock>): StatBlock =>
  STAT_IDS.reduce(
    (next, statId) => ({
      ...next,
      [statId]: clampStat(stats[statId] ?? 0),
    }),
    { ...DEFAULT_STATS }
  );

const safePositive = (value: number): number => {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, value);
};

const logPersistError = (err: unknown): void => {
  if (__DEV__) {
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

export const usePlayerStore = create<PlayerStore>((set, get) => {
  const persistMutation = (update: (player: PlayerState) => PlayerState): void => {
    let nextPlayer: PlayerState | null = null;

    set((state) => {
      const updated = update(state.player);
      const stamped: PlayerState = {
        ...updated,
        stats: copyStatBlock(updated.stats),
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
    lastRitualResult: null,
    lastBossResult: null,

    hydrate: async () => {
      const loaded = await loadPlayerState();
      const player = loaded
        ? { ...loaded, stats: copyStatBlock(loaded.stats) }
        : createDefaultPlayerState();

      set({ hydrated: true, player });

      if (!loaded) {
        await savePlayerState(player).catch(logPersistError);
      }
    },

    reset: async () => {
      const player = createDefaultPlayerState();

      await clearPlayerState().catch(logPersistError);
      await savePlayerState(player).catch(logPersistError);

      set({ hydrated: true, player, lastRitualResult: null, lastBossResult: null });
    },

    completeSoulScan: (result) => {
      persistMutation((player) =>
        resolveUnlockRoom(
          {
            ...player,
            archetypeId: result.archetypeId,
            stats: copyStatBlock(result.startingStats),
          },
          result.firstRoomId
        )
      );
    },

    setArchetype: (archetypeId, startingStats) => {
      persistMutation((player) => ({
        ...player,
        archetypeId,
        stats: copyStatBlock(startingStats ?? player.stats),
      }));
    },

    addAscensionPoints: (amount) => {
      const safeAmount = safePositive(amount);

      persistMutation((player) => ({
        ...player,
        ascensionPoints: player.ascensionPoints + safeAmount,
      }));
    },

    unlockRoom: (roomId) => {
      persistMutation((player) => resolveUnlockRoom(player, roomId));
    },

    defeatBoss: (bossId, rewardXP) => {
      let defeated = false;
      let bossResult: BossResult | null = null;

      persistMutation((player) => {
        const boss = BOSSES.find((candidate) => candidate.id === bossId);
        if (!boss || !canChallengeBoss(player, boss.roomId, boss).ok) {
          return player;
        }

        const safeReward = safePositive(rewardXP ?? boss?.rewardXP ?? 0);
        const completedAt = new Date().toISOString();
        const defeatedPlayer: PlayerState = {
          ...player,
          defeatedBosses: [...player.defeatedBosses, bossId],
          ascensionPoints: player.ascensionPoints + safeReward,
        };

        const nextPlayer = unlockNextRoomAfterBoss(defeatedPlayer, boss.roomId);

        defeated = true;
        bossResult = {
          bossId,
          roomId: boss.roomId,
          rewardXP: safeReward,
          unlockedRoomId: getUnlockedRoomAfterBoss(player, nextPlayer),
          isEndOfV1: getNextRoomToUnlock(boss.roomId) === null,
          completedAt,
        };

        return nextPlayer;
      });

      if (bossResult) {
        set({ lastBossResult: bossResult });
      }

      return defeated;
    },

    completeRitual: (entry) => {
      const before = copyStatBlock(get().player.stats);

      persistMutation((player) =>
        resolveRitual(player, entry.roomId, entry.effects ?? {}, entry.bossId)
      );

      const after = copyStatBlock(get().player.stats);

      set({
        lastRitualResult: {
          roomId: entry.roomId,
          effects: entry.effects ?? {},
          before,
          after,
        },
      });
    },

    setLastRitualResult: (result) => {
      set({ lastRitualResult: result });
    },

    clearLastRitualResult: () => {
      set({ lastRitualResult: null });
    },

    clearLastBossResult: () => {
      set({ lastBossResult: null });
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
