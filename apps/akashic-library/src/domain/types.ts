export type StatId =
  | 'might'
  | 'insight'
  | 'will'
  | 'agility'
  | 'attunement';

export type ArchetypeId = 'scribe' | 'warden' | 'seer';

export type RoomId = 'echo-hall' | 'mirror-archive' | 'astral-vault';

export type BossId = 'librarian-sentinel' | 'mirror-keeper' | 'vault-oracle';

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
  baseStats: StatBlock;
};
