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

export type ReflectionPromptCriteria = {
  archetypeId?: ArchetypeId;
  minStats?: Partial<StatBlock>;
  maxStats?: Partial<StatBlock>;
  integratedReflectionsAtLeast?: number;
  memory?: ReflectionMemoryCriteria;
};

export type ReflectionPromptVariant = {
  id: string;
  prompt: string;
  criteria: ReflectionPromptCriteria;
};

export type ReflectionMemoryCriteria = {
  completedRitualChoiceId?: string;
  repeatedRitualChoice?: {
    choiceId: string;
    atLeast: number;
  };
  integratedReflectionId?: BossId;
};

export type BossDefinition = {
  id: BossId;
  roomId: RoomId;
  name: string;
  title: string;
  description: string;
  represents: string;
  prompt: string;
  promptVariants?: readonly ReflectionPromptVariant[];
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

export type RitualChoiceHistoryEntry = {
  id: string;
  roomId: RoomId;
  ritualId: string;
  choiceId: string;
  effects: RitualEffect;
  completedAt: string;
};

export type ReflectionHistoryEntry = {
  id: string;
  bossId: BossId;
  roomId: RoomId;
  prompt: string;
  rewardXP: number;
  unlockedRoomId: RoomId | null;
  integratedAt: string;
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
  ritualChoices: RitualChoiceHistoryEntry[];
  reflectionHistory: ReflectionHistoryEntry[];
};
