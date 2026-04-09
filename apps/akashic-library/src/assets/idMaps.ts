import type {
  RoomId as AssetRoomId,
  BossId as AssetBossId,
} from './assetTypes';
import type {
  RoomId as DomainRoomId,
  BossId as DomainBossId,
} from '../domain/types';

export const ROOM_ASSET_ID_BY_DOMAIN_ID: Record<DomainRoomId, AssetRoomId> = {
  'hall_of_echoes': 'hall_of_echoes',
  'shadow_mirror_hall': 'shadow_mirror_hall',
  'scarcity_vault': 'scarcity_vault',
};

export const BOSS_ASSET_ID_BY_DOMAIN_ID: Record<DomainBossId, AssetBossId> = {
  'critic': 'critic',
  'ghost': 'ghost',
  'scarcity_beast': 'scarcity_beast',
};