export type StatId =
  | 'courage'
  | 'clarity'
  | 'compassion'
  | 'discipline'
  | 'selfWorth';

export type ArchetypeId = 'warrior' | 'seer' | 'alchemist';

export type RoomId =
  | 'shadow_mirror_hall'
  | 'hall_of_echoes'
  | 'scarcity_vault';

export type BossId =
  | 'critic'
  | 'ghost'
  | 'scarcity_beast';

export type StatBlock = Record<StatId, number>;

export type StatDefinition = {
  id: StatId;
  name: string;
  description: string;
};

export type ArchetypeDefinition = {
  id: ArchetypeId;
  name: string;
  description: string;
  statBias: Partial<StatBlock>;
  startingStats: StatBlock;
};

export type RoomDefinition = {
  id: RoomId;
  name: string;
  theme: StatId;
  description: string;
  bossId: BossId;
  requiredStatToUnlock?: Partial<StatBlock>;
};

export type BossDefinition = {
  id: BossId;
  roomId: RoomId;
  name: string;
  title: string;
  description: string;
  requiredStats: Partial<StatBlock>;
  rewardXP: number;
};

export type RitualEffect = Partial<StatBlock>;

export type RitualChoice = {
  id: string;
  label: string;
  description: string;
  effects: RitualEffect;
};

export type RitualDefinition = {
  id: string;
  roomId: RoomId;
  name: string;
  description: string;
  choices: RitualChoice[];
  repeatable?: boolean;
};

export type RitualLogEntry = {
  id: string;
  roomId: RoomId;
  bossId?: BossId;
  ritualId?: string;
  completedAt: string;
};

export type PlayerState = {
  version: 1;
  createdAt: string;
  updatedAt: string;
  archetypeId: ArchetypeId | null;
  stats: StatBlock;
  ascensionPoints: number;
  unlockedRooms: RoomId[];
  defeatedBosses: BossId[];
  ritualHistory: RitualLogEntry[];
};
