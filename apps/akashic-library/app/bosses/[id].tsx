import { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
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
    if (!bossCheck.ok || bossIntegrated) return;

    const defeated = defeatBoss(boss.id, boss.rewardXP);
    if (defeated) {
      router.replace(BOSS_RESULT_ROUTE);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.eyebrow}>Reflection encounter</Text>
      <Text style={styles.title}>{boss.title}</Text>
      <Text style={[styles.heading, { color: colors.accentStrong }]}>{boss.name}</Text>
      <Text style={styles.body}>{boss.description}</Text>

      <View style={styles.panelRaised}>
        <Text style={styles.heading}>Represents</Text>
        <Text style={styles.body}>{boss.represents}</Text>
        <Text style={styles.heading}>Prompt</Text>
        <Text style={[styles.body, { color: colors.text }]}>
          {reflectionPrompt}
        </Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.heading}>Readiness Requirements</Text>

        {Object.entries(boss.requiredStats).length === 0 ? (
          <Text style={styles.subtle}>-</Text>
        ) : (
          Object.entries(boss.requiredStats).map(([statId, required]) => {
            const key = statId as keyof typeof player.stats;

            return (
              <View
                key={statId}
                style={styles.row}
              >
                <Text style={styles.body}>{getStatName(key)}</Text>
                <Text style={styles.statText}>
                  {player.stats[key]} / {required}
                </Text>
              </View>
            );
          })
        )}

        <Text style={styles.body}>Integration XP: {boss.rewardXP}</Text>
        <Text style={styles.body}>Integrated: {bossIntegrated ? 'Yes' : 'No'}</Text>
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

      <Pressable
        disabled={!bossCheck.ok || bossIntegrated}
        onPress={handleChallengeBoss}
        style={[
          styles.button,
          styles.buttonPrimary,
          disabledStyle(!bossCheck.ok || bossIntegrated),
        ]}
      >
        <Text style={styles.buttonTextAccent}>
          {bossIntegrated ? 'Reflection Integrated' : 'Integrate Reflection'}
        </Text>
      </Pressable>

      <Pressable
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
