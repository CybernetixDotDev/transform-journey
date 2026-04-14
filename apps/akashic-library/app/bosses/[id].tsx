import { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import type { Href } from 'expo-router';

import type { BossId } from '../../src/domain/types';
import { BOSSES } from '../../src/domain/bosses';
import { getStatName } from '../../src/domain/stats';
import { usePlayerStore } from '../../src/state/usePlayerStore';
import { canChallengeBoss } from '../../src/engine/BossEngine';

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
      <View style={{ flex: 1, padding: 18, justifyContent: 'center', gap: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>Boss not found</Text>
        <Pressable
          onPress={() => router.back()}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 14,
            borderRadius: 12,
            borderWidth: 1,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontWeight: '700' }}>Back</Text>
        </Pressable>
      </View>
    );
  }

  const bossDefeated = player.defeatedBosses.includes(boss.id);
  const bossCheck = canChallengeBoss(player, boss.roomId, boss);

  const handleChallengeBoss = () => {
    if (!bossCheck.ok || bossDefeated) return;

    const defeated = defeatBoss(boss.id, boss.rewardXP);
    if (defeated) {
      router.replace(BOSS_RESULT_ROUTE);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 18, gap: 14 }}>
      <Text style={{ fontSize: 26, fontWeight: '700' }}>{boss.name}</Text>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>{boss.title}</Text>
      <Text style={{ opacity: 0.8 }}>{boss.description}</Text>

      <View
        style={{
          padding: 14,
          borderWidth: 1,
          borderRadius: 12,
          gap: 8,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '700' }}>Required Stats</Text>

        {Object.entries(boss.requiredStats).length === 0 ? (
          <Text style={{ opacity: 0.75 }}>-</Text>
        ) : (
          Object.entries(boss.requiredStats).map(([statId, required]) => {
            const key = statId as keyof typeof player.stats;

            return (
              <View
                key={statId}
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}
              >
                <Text>{getStatName(key)}</Text>
                <Text>
                  {player.stats[key]} / {required}
                </Text>
              </View>
            );
          })
        )}

        <Text style={{ marginTop: 6 }}>Reward XP: {boss.rewardXP}</Text>
        <Text>Defeated: {bossDefeated ? 'Yes' : 'No'}</Text>
      </View>

      {!bossDefeated && bossCheck.reasons.length > 0 && (
        <View style={{ padding: 14, borderWidth: 1, borderRadius: 12, gap: 6 }}>
          <Text style={{ fontWeight: '700' }}>You are not ready yet:</Text>
          {bossCheck.reasons.map((reason) => (
            <Text key={reason} style={{ opacity: 0.8 }}>
              - {reason}
            </Text>
          ))}
        </View>
      )}

      <Pressable
        disabled={!bossCheck.ok || bossDefeated}
        onPress={handleChallengeBoss}
        style={{
          paddingVertical: 12,
          paddingHorizontal: 14,
          borderRadius: 12,
          borderWidth: 1,
          alignItems: 'center',
          opacity: !bossCheck.ok || bossDefeated ? 0.4 : 1,
        }}
      >
        <Text style={{ fontWeight: '700' }}>
          {bossDefeated ? 'Boss Defeated' : 'Face the Boss'}
        </Text>
      </Pressable>

      <Pressable
        onPress={() =>
          router.replace({
            pathname: '/room/[id]',
            params: { id: boss.roomId },
          })
        }
        style={{
          paddingVertical: 12,
          paddingHorizontal: 14,
          borderRadius: 12,
          borderWidth: 1,
          alignItems: 'center',
        }}
      >
        <Text style={{ fontWeight: '700' }}>Back to Room</Text>
      </Pressable>
    </ScrollView>
  );
}
