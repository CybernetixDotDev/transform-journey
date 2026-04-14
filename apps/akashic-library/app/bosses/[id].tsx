import { useMemo, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import type { Href } from 'expo-router';

import type { BossId } from '../../src/domain/types';
import { BOSSES } from '../../src/domain/bosses';
import { getStatName } from '../../src/domain/stats';
import { usePlayerStore } from '../../src/state/usePlayerStore';
import { canChallengeBoss } from '../../src/engine/BossEngine';
import { selectReflectionPrompt } from '../../src/engine/ReflectionEngine';
import { colors, disabledStyle, styles } from '../../src/ui/theme';

const BOSS_RESULT_ROUTE = '/boss-result' as Href;

export default function BossScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const bossId = params.id as BossId | undefined;

  const player = usePlayerStore((state) => state.player);
  const defeatBoss = usePlayerStore((state) => state.defeatBoss);
  const [isIntegrating, setIsIntegrating] = useState(false);
  const contentFade = useRef(new Animated.Value(1)).current;

  const boss = useMemo(() => BOSSES.find((candidate) => candidate.id === bossId), [bossId]);

  if (!bossId || !boss) {
    return (
      <View style={styles.screenCenter}>
        <Text style={styles.heading}>Reflection not found</Text>
        <Pressable
          onPress={() => router.back()}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Back</Text>
        </Pressable>
      </View>
    );
  }

  const bossIntegrated = player.defeatedBosses.includes(boss.id);
  const bossCheck = canChallengeBoss(player, boss.roomId, boss);
  const reflectionPrompt = selectReflectionPrompt(player, boss);

  const handleChallengeBoss = () => {
    if (!bossCheck.ok || bossIntegrated || isIntegrating) return;

    setIsIntegrating(true);

    Animated.sequence([
      Animated.delay(260),
      Animated.timing(contentFade, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      const defeated = defeatBoss(boss.id, boss.rewardXP);
      if (defeated) {
        router.replace(BOSS_RESULT_ROUTE);
        return;
      }

      setIsIntegrating(false);
      contentFade.setValue(1);
    });
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.screen,
        {
          paddingBottom: 28,
        },
      ]}
    >
      <Animated.View style={{ gap: 14, opacity: contentFade }}>
        <View style={{ gap: 8, alignItems: 'center' }}>
          <Text style={styles.eyebrow}>Reflection encounter</Text>
          <Text style={[styles.title, { textAlign: 'center' }]}>{boss.title}</Text>
          <Text style={[styles.heading, { color: colors.accentStrong }]}>
            {boss.name}
          </Text>
          <Text style={[styles.body, { textAlign: 'center' }]}>{boss.description}</Text>
        </View>

        <View
          style={[
            styles.panelRaised,
            {
              gap: 14,
              borderColor: colors.accent,
              backgroundColor: 'rgba(185, 167, 255, 0.14)',
            },
          ]}
        >
          <View style={{ gap: 6 }}>
            <Text style={styles.eyebrow}>Represents</Text>
            <Text style={[styles.body, { color: colors.text }]}>
              {boss.represents}
            </Text>
          </View>

          <View style={[styles.dividerRow, { gap: 6 }]}>
            <Text style={styles.eyebrow}>Prompt</Text>
            <Text style={[styles.heading, { lineHeight: 26 }]}>
              {reflectionPrompt}
            </Text>
          </View>
        </View>

        <View style={[styles.panel, { gap: 10 }]}>
          <View style={styles.row}>
            <Text style={styles.heading}>Readiness</Text>
            <Text style={[styles.statText, { color: bossCheck.ok ? colors.success : colors.gold }]}>
              {bossCheck.ok ? 'Ready' : 'Preparing'}
            </Text>
          </View>

          {Object.entries(boss.requiredStats).length === 0 ? (
            <Text style={styles.subtle}>No stat threshold required.</Text>
          ) : (
            Object.entries(boss.requiredStats).map(([statId, required]) => {
              const key = statId as keyof typeof player.stats;
              const current = player.stats[key];
              const met = current >= required;

              return (
                <View
                  key={statId}
                  style={[
                    styles.row,
                    {
                      paddingTop: 6,
                      borderTopWidth: 1,
                      borderTopColor: colors.border,
                    },
                  ]}
                >
                  <Text style={styles.body}>{getStatName(key)}</Text>
                  <Text style={[styles.statText, { color: met ? colors.success : colors.gold }]}>
                    {current} / {required}
                  </Text>
                </View>
              );
            })
          )}

          <View style={styles.row}>
            <Text style={styles.body}>Integration XP</Text>
            <Text style={[styles.statText, { color: colors.accentStrong }]}>
              {boss.rewardXP}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.body}>Integrated</Text>
            <Text style={styles.statText}>{bossIntegrated ? 'Yes' : 'No'}</Text>
          </View>
        </View>

        {!bossIntegrated && bossCheck.reasons.length > 0 && (
          <View style={styles.panel}>
            <Text style={styles.heading}>Before Integration</Text>
            {bossCheck.reasons.map((reason) => (
              <Text key={reason} style={styles.subtle}>
                - {reason}
              </Text>
            ))}
          </View>
        )}
      </Animated.View>

      <Pressable
        disabled={!bossCheck.ok || bossIntegrated || isIntegrating}
        onPress={handleChallengeBoss}
        style={[
          styles.button,
          styles.buttonPrimary,
          disabledStyle(!bossCheck.ok || bossIntegrated || isIntegrating),
        ]}
      >
        <Text style={styles.buttonTextAccent}>
          {isIntegrating
            ? 'Integrating...'
            : bossIntegrated
              ? 'Reflection Integrated'
              : 'Integrate Reflection'}
        </Text>
      </Pressable>

      <Pressable
        disabled={isIntegrating}
        onPress={() =>
          router.replace({
            pathname: '/room/[id]',
            params: { id: boss.roomId },
          })
        }
        style={styles.button}
      >
        <Text style={styles.buttonText}>Back to Room</Text>
      </Pressable>
    </ScrollView>
  );
}
