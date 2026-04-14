import type { RoomId } from './assetTypes';

export const roomAssets: Record<
  RoomId,
  {
    environment: any;
    icon: any;
    sigil: any;
  }
> = {
  ancestral_chamber: {
    environment: require('../../assets/rooms/ancestral_chamber/environment/rooms_ancestral_chamber_environment_v01.png'),
    icon: require('../../assets/rooms/ancestral_chamber/icon/rooms_ancestral_chamber_icon_v01.png'),
    sigil: require('../../assets/rooms/ancestral_chamber/sigil/rooms_ancestral_chamber_sigil_v01.png'),
  },
  chamber_of_boundaries: {
    environment: require('../../assets/rooms/chamber_of_boundaries/environment/rooms_chamber_of_boundaries_environment_v01.png'),
    icon: require('../../assets/rooms/chamber_of_boundaries/icon/rooms_chamber_of_boundaries_icon_v01.png'),
    sigil: require('../../assets/rooms/chamber_of_boundaries/sigil/rooms_chamber_of_boundaries_sigil_v01.png'),
  },
  childhood_room: {
    environment: require('../../assets/rooms/childhood_room/environment/rooms_childhood_environment_v01.png'),
    icon: require('../../assets/rooms/childhood_room/icon/rooms_childhood_icon_v01.png'),
    sigil: require('../../assets/rooms/childhood_room/sigil/rooms_childhood_sigil_v01.png'),
  },
  future_self_chamber: {
    environment: require('../../assets/rooms/future_self_chamber/environment/rooms_future_self_chamber_environment_v01.png'),
    icon: require('../../assets/rooms/future_self_chamber/icon/rooms_future_self_chamber_icon_v01.png'),
    sigil: require('../../assets/rooms/future_self_chamber/sigil/rooms_future_self_chamber_sigil_v01.png'),
  },
  hall_of_echoes: {
    environment: require('../../assets/rooms/hall_of_echoes/environment/rooms_hall_of_echoes_environment_v01.png'),
    icon: require('../../assets/rooms/hall_of_echoes/icon/rooms_hall_of_echoes_icon_v01.png'),
    sigil: require('../../assets/rooms/hall_of_echoes/sigil/rooms_hall_of_echoes_sigil_v01.png'),
  },
  hall_of_masks: {
    environment: require('../../assets/rooms/hall_of_masks/environment/rooms_hall_of_masks_environment_v01.png'),
    icon: require('../../assets/rooms/hall_of_masks/icon/rooms_hall_of_masks_icon_v01.png'),
    sigil: require('../../assets/rooms/hall_of_masks/sigil/rooms_hall_of_masks_sigil_v01.png'),
  },
  hall_of_patterns: {
    environment: require('../../assets/rooms/hall_of_patterns/environment/rooms_hall_of_patterns_environment_v01.png'),
    icon: require('../../assets/rooms/hall_of_patterns/icon/rooms_hall_of_patterns_icon_v01.png'),
    sigil: require('../../assets/rooms/hall_of_patterns/sigil/rooms_hall_of_patterns_sigil_v01.png'),
  },
  integration_sanctuary: {
    environment: require('../../assets/rooms/integration_sanctuary/environment/rooms_integration_sanctuary_environment_v01.png'),
    icon: require('../../assets/rooms/integration_sanctuary/icon/rooms_integration_sanctuary_icon_v01.png'),
    sigil: require('../../assets/rooms/integration_sanctuary/sigil/rooms_integration_sanctuary_sigil_v01.png'),
  },
  relationship_atrium: {
    environment: require('../../assets/rooms/relationship_atrium/environment/rooms_relationship_atrium_environment_v01.png'),
    icon: require('../../assets/rooms/relationship_atrium/icon/rooms_relationship_atrium_icon_v01.png'),
    sigil: require('../../assets/rooms/relationship_atrium/sigil/rooms_relationship_atrium_sigil_v01.png'),
  },
  scarcity_vault: {
    environment: require('../../assets/rooms/scarcity_vault/environment/rooms_scarcity_vault_environment_v01.png'),
    icon: require('../../assets/rooms/scarcity_vault/icon/rooms_scarcity_vault_icon_v01.png'),
    sigil: require('../../assets/rooms/scarcity_vault/sigil/rooms_scarcity_vault_sigil_v01.png'),
  },
  shadow_mirror_hall: {
    environment: require('../../assets/rooms/shadow_mirror_hall/environment/rooms_shadow_mirror_hall_environment_v01.png'),
    icon: require('../../assets/rooms/shadow_mirror_hall/icon/rooms_shadow_mirror_hall_icon_v01.png'),
    sigil: require('../../assets/rooms/shadow_mirror_hall/sigil/rooms_shadow_mirror_hall_sigil_v01.png'),
  },
  threshold_chamber: {
    environment: require('../../assets/rooms/threshold_chamber/environment/rooms_threshold_chamber_environment_v01.png'),
    icon: require('../../assets/rooms/threshold_chamber/icon/rooms_threshold_chamber_icon_v01.png'),
    sigil: require('../../assets/rooms/threshold_chamber/sigil/rooms_threshold_chamber_sigil_v01.png'),
  },
};

export function getRoomAsset(
  id: RoomId,
  type: 'environment' | 'icon' | 'sigil'
) {
  return roomAssets[id][type];
}