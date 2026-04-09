export type ArchetypeId =
  | 'alchemist'
  | 'architect'
  | 'creator'
  | 'healer'
  | 'seer'
  | 'warrior';

export type BossId =
  | 'abandoner'
  | 'ancestral_thread'
  | 'avoider'
  | 'chaos_weaver'
  | 'clinger'
  | 'critic'
  | 'ghost'
  | 'martyr'
  | 'performer'
  | 'saboteur'
  | 'scarcity_beast'
  | 'shadow_child';

export type RoomId =
  | 'ancestral_chamber'
  | 'chamber_of_boundaries'
  | 'childhood_room'
  | 'future_self_chamber'
  | 'hall_of_echoes'
  | 'hall_of_masks'
  | 'hall_of_patterns'
  | 'integration_sanctuary'
  | 'relationship_atrium'
  | 'scarcity_vault'
  | 'shadow_mirror_hall'
  | 'threshold_chamber';

export type RitualId =
  | 'breath_ritual'
  | 'cord_cutting_ritual'
  | 'fire_of_transmutation'
  | 'future_self_ritual'
  | 'grounding_ritual'
  | 'heart_opening_ritual'
  | 'inner_child_ritual'
  | 'mirror_ritual'
  | 'release_ritual'
  | 'shadow_dialogue_ritual';

export type ArchetypeAssetType = 'model' | 'portrait' | 'sigil';
export type BossAssetType = 'icon' | 'model' | 'portrait';
export type RoomAssetType = 'environment' | 'icon' | 'sigil';
export type RitualAssetType = 'environment' | 'sigil';