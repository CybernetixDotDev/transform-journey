import type { ArchetypeId } from './assetTypes';

export const archetypeAssets: Record<
  ArchetypeId,
  {
    model: any;
    portrait: any;
    sigil: any;
  }
> = {
  alchemist: {
    model: require('../../assets/archetypes/alchemist/model/archetype_alchemist_model_v01.png'),
    portrait: require('../../assets/archetypes/alchemist/portrait/archetype_alchemist_portrait_v01.png'),
    sigil: require('../../assets/archetypes/alchemist/sigil/archetype_alchemist_sigil_v01.png'),
  },
  architect: {
    model: require('../../assets/archetypes/architect/model/archetype_architect_model_v01.png'),
    portrait: require('../../assets/archetypes/architect/portrait/archetype_architect_portrait_v01.png'),
    sigil: require('../../assets/archetypes/architect/sigil/archetype_architect_sigil_v01.png'),
  },
  creator: {
    model: require('../../assets/archetypes/creator/model/archetype_creator_model_v01.png'),
    portrait: require('../../assets/archetypes/creator/portrait/archetype_creator_portrait_v01.png'),
    sigil: require('../../assets/archetypes/creator/sigil/archetype_creator_sigil_v01.png'),
  },
  healer: {
    model: require('../../assets/archetypes/healer/model/archetype_healer_model_v01.png'),
    portrait: require('../../assets/archetypes/healer/portrait/archetype_healer_portrait_v01.png'),
    sigil: require('../../assets/archetypes/healer/sigil/archetype_healer_sigil_v01.png'),
  },
  seer: {
    model: require('../../assets/archetypes/seer/model/archetype_seer_model_v01.png'),
    portrait: require('../../assets/archetypes/seer/portrait/archetype_seer_portrait_v01.png'),
    sigil: require('../../assets/archetypes/seer/sigil/archetype_seer_sigil_v01.png'),
  },
  warrior: {
    model: require('../../assets/archetypes/warrior/model/archetype_warrior_model_v01.png'),
    portrait: require('../../assets/archetypes/warrior/portrait/archetype_warrior_portrait_v01.png'),
    sigil: require('../../assets/archetypes/warrior/sigil/archetype_warrior_sigil_v01.png'),
  },
};

export function getArchetypeAsset(
  id: ArchetypeId,
  type: 'model' | 'portrait' | 'sigil'
) {
  return archetypeAssets[id][type];
}