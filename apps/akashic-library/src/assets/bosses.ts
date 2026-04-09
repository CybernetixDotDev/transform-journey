import type { BossId } from './assetTypes';

export const bossAssets: Record<
  BossId,
  {
    icon: any;
    model: any;
    portrait: any;
  }
> = {
  abandoner: {
    icon: require('../../assets/bosses/abandoner/icon/bosses_abandoner_icon_v01.png'),
    model: require('../../assets/bosses/abandoner/model/bosses_abandoner_model_v01.png'),
    portrait: require('../../assets/bosses/abandoner/portrait/bosses_abandoner_portrait_v01.png'),
  },
  ancestral_thread: {
    icon: require('../../assets/bosses/ancestral_thread/icon/bosses_ancestral_thread_icon.png'),
    model: require('../../assets/bosses/ancestral_thread/model/bosses_ancestral_thread_model_v01.png'),
    portrait: require('../../assets/bosses/ancestral_thread/portrait/bosses_ancestral_thread_portrait_v01.png'),
  },
  avoider: {
    icon: require('../../assets/bosses/avoider/icon/bosses_avoider_icon_v01.png'),
    model: require('../../assets/bosses/avoider/model/bosses_avoider_model_v01.png'),
    portrait: require('../../assets/bosses/avoider/portrait/bosses_avoider_portrait_v01.png'),
  },
  chaos_weaver: {
    icon: require('../../assets/bosses/chaos_weaver/icon/bosses_chaos_weaver_icon_v01.png'),
    model: require('../../assets/bosses/chaos_weaver/model/bosses_chaos_weaver_model_v01.png'),
    portrait: require('../../assets/bosses/chaos_weaver/portrait/bosses_chaos_weaver_portrait_v01.png'),
  },
  clinger: {
    icon: require('../../assets/bosses/clinger/icon/bosses_clinger_icon_v01.png'),
    model: require('../../assets/bosses/clinger/model/bosses_clinger_model_v01.png'),
    portrait: require('../../assets/bosses/clinger/portrait/bosses_clinger_portrait_v01.png'),
  },
  critic: {
    icon: require('../../assets/bosses/critic/icon/bosses_critic_icon_v01.png'),
    model: require('../../assets/bosses/critic/model/bosses_critic_model_v01.png'),
    portrait: require('../../assets/bosses/critic/portrait/bosses_critic_portrait_v01.png'),
  },
  ghost: {
    icon: require('../../assets/bosses/ghost/icon/bosses_ghost_icon_v01.png'),
    model: require('../../assets/bosses/ghost/model/bosses_ghost_model_v01.png'),
    portrait: require('../../assets/bosses/ghost/portrait/bosses_ghost_portrait_v01.png'),
  },
  martyr: {
    icon: require('../../assets/bosses/martyr/icon/bosses_martyr_icon_v01.png'),
    model: require('../../assets/bosses/martyr/model/bosses_martyr_model_v01.png'),
    portrait: require('../../assets/bosses/martyr/portrait/bosses_martyr_portrait_v01.png'),
  },
  performer: {
    icon: require('../../assets/bosses/performer/icon/bosses_performer_icon_v01.png'),
    model: require('../../assets/bosses/performer/model/bosses_performer_model_v01.png'),
    portrait: require('../../assets/bosses/performer/portrait/bosses_performer_portrait_v01.png'),
  },
  saboteur: {
    icon: require('../../assets/bosses/saboteur/icon/bosses_saboteur_icon_v01.png'),
    model: require('../../assets/bosses/saboteur/model/bosses_saboteur_model_v01.png'),
    portrait: require('../../assets/bosses/saboteur/portrait/bosses_saboteur_portrait_v01.png'),
  },
  scarcity_beast: {
    icon: require('../../assets/bosses/scarcity_beast/icon/bosses_scarcity_beast_icon_v01.png'),
    model: require('../../assets/bosses/scarcity_beast/model/bosses_scarcity_beast_model_v01.png'),
    portrait: require('../../assets/bosses/scarcity_beast/portrait/bosses_scarcity_beast_portrait_v01.png'),
  },
  shadow_child: {
    icon: require('../../assets/bosses/shadow_child/icon/bosses_shadow_child_icon.png'),
    model: require('../../assets/bosses/shadow_child/model/bosses_shadow_child_model_v01.png'),
    portrait: require('../../assets/bosses/shadow_child/portrait/bosses_shadow_child_portrait_v01.png'),
  },
};

export function getBossAsset(
  id: BossId,
  type: 'icon' | 'model' | 'portrait'
) {
  return bossAssets[id][type];
}