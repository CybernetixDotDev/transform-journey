export type StatId =
  | 'might'
  | 'insight'
  | 'will'
  | 'agility'
  | 'attunement';

export type ArchetypeId = 'scribe' | 'warden' | 'seer';

export type RoomId =
  | 'hall_of_echoes'
  | 'shadow_mirror_hall'
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
  startingStats: StatBlock;
};

export type RoomDefinition = {
  id: RoomId;
  name: string;
  description: string;
  bossId: BossId;
};

export type BossDefinition = {
  id: BossId;
  roomId: RoomId;
  name: string;
  title: string;
  description: string;

  // V1 bosses are threshold gates (not full stat mirrors)
  requiredStats: Partial<StatBlock>;
  rewardXP: number;
};

export type RitualLogEntry = {
  id: string; // simple unique id (we can use Date.now().toString() in V1)
  roomId: RoomId;
  bossId?: BossId; // optional: link ritual to boss attempt/defeat later
  completedAt: string; // ISO timestamp
};

export type PlayerState = {
  version: 1;

  // timestamps as ISO strings = easy to store + debug
  createdAt: string;
  updatedAt: string;

  // null until Soul Scan assigns it
  archetypeId: ArchetypeId | null;

  // core progression
  stats: StatBlock;
  ascensionPoints: number;

  // world progression
  unlockedRooms: RoomId[];
  defeatedBosses: BossId[];

  // activity history (V1 minimal)
  ritualHistory: RitualLogEntry[];
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