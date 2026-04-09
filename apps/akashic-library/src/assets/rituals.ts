import type { RitualId } from './assetTypes';

export const ritualAssets: Record<
  RitualId,
  {
    environment: any;
    sigil: any;
  }
> = {
  breath_ritual: {
    environment: require('../../assets/rituals/breath_ritual/environment/rituals_breath_ritual_environment_v01.png'),
    sigil: require('../../assets/rituals/breath_ritual/sigil/rituals_breath_ritual_sigil_v01.png'),
  },
  cord_cutting_ritual: {
    environment: require('../../assets/rituals/cord_cutting_ritual/environment/rituals_cord_cutting_environment_v01.png'),
    sigil: require('../../assets/rituals/cord_cutting_ritual/sigil/rituals_cord_cutting_sigil_v01.png'),
  },
  fire_of_transmutation: {
    environment: require('../../assets/rituals/fire_of_transmutation/environment/rituals_fire_of_transmutation_environment_v01.png'),
    sigil: require('../../assets/rituals/fire_of_transmutation/sigil/rituals_fire_of_transmutation_sigil_v01.png'),
  },
  future_self_ritual: {
    environment: require('../../assets/rituals/future_self_ritual/environment/rituals_future_self_environment_v01.png'),
    sigil: require('../../assets/rituals/future_self_ritual/sigil/rituals_future_self_sigil_v01.png'),
  },
  grounding_ritual: {
    environment: require('../../assets/rituals/grounding_ritual/environment/rituals_grounding_environment_v01.png'),
    sigil: require('../../assets/rituals/grounding_ritual/sigil/rituals_grounding_sigil_v01.png'),
  },
  heart_opening_ritual: {
    environment: require('../../assets/rituals/heart_opening_ritual/environment/rituals_heart_opening_environment_v01.png'),
    sigil: require('../../assets/rituals/heart_opening_ritual/sigil/rituals_heart_opening_sigil_v01.png'),
  },
  inner_child_ritual: {
    environment: require('../../assets/rituals/inner_child_ritual/environment/rituals_inner_child_environment_v01.png'),
    sigil: require('../../assets/rituals/inner_child_ritual/sigil/rituals_inner_child_sigil_v01.png'),
  },
  mirror_ritual: {
    environment: require('../../assets/rituals/mirror_ritual/environment/rituals_mirror_environment_v01.png'),
    sigil: require('../../assets/rituals/mirror_ritual/sigil/rituals_mirror_sigil_v01.png'),
  },
  release_ritual: {
    environment: require('../../assets/rituals/release_ritual/environment/rituals_release_environment_v01.png'),
    sigil: require('../../assets/rituals/release_ritual/sigil/rituals_release_sigil_v01.png'),
  },
  shadow_dialogue_ritual: {
    environment: require('../../assets/rituals/shadow_dialogue_ritual/environment/rituals_shadow_dialogue_environment_v01.png'),
    sigil: require('../../assets/rituals/shadow_dialogue_ritual/sigil/rituals_shadow_dialogue_sigil_v01.png'),
  },
};

export function getRitualAsset(
  id: RitualId,
  type: 'environment' | 'sigil'
) {
  return ritualAssets[id][type];
}