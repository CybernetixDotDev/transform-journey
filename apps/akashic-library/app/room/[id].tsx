import { useMemo } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import type { RoomId } from '../../src/domain/types';
import { ROOMS } from '../../src/domain/rooms';
import { BOSSES } from '../../src/domain/bosses';
import { usePlayerStore } from '../../src/state/usePlayerStore';
import { canChallengeBoss } from '../../src/engine/BossEngine';
import { getRoomAsset, getBossAsset } from '../../src/assets';

export default function RoomScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();

  const player = usePlayerStore((s) => s.player);

  const roomId = params.id as RoomId | undefined;

  const room = useMemo(() => ROOMS.find((r) => r.id === roomId), [roomId]);
  const boss = useMemo(
    () => (room ? BOSSES.find((b) => b.id === room.bossId) : undefined),
    [room]
  );

  if (!roomId || !room) {
    return (
      <View style={{ flex: 1, padding: 18, justifyContent: 'center', gap: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>Room not found</Text>
        <Pressable
          onPress={() => router.back()}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 14,
            borderRadius: 12,
            borderWidth: 1,
          }}
        >
          <Text style={{ fontWeight: '700' }}>Back</Text>
        </Pressable>
      </View>
    );
  }

  const unlocked = player.unlockedRooms.includes(roomId);
  const bossDefeated = boss ? player.defeatedBosses.includes(boss.id) : false;

  const bossCheck = boss
    ? canChallengeBoss(player, roomId, boss)
    : { ok: false, reasons: [] as string[] };

  return (
    <ImageBackground
      source={getRoomAsset(roomId, 'environment')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={{
          padding: 18,
          gap: 14,
          minHeight: '100%',
        }}
      >
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.45)',
            borderRadius: 18,
            padding: 16,
            gap: 14,
          }}
        >
          <Image
            source={getRoomAsset(roomId, 'sigil')}
            style={{ width: 88, height: 88, alignSelf: 'center' }}
            resizeMode="contain"
          />

          <Text
            style={{
              fontSize: 26,
              fontWeight: '700',
              color: '#fff',
              textAlign: 'center',
            }}
          >
            {room.name}
          </Text>

          <Text
            style={{
              opacity: 0.9,
              color: '#fff',
              textAlign: 'center',
              lineHeight: 22,
            }}
          >
            {room.description}
          </Text>

          <View
            style={{
              padding: 14,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.25)',
              borderRadius: 12,
              gap: 6,
              opacity: unlocked ? 1 : 0.65,
              backgroundColor: 'rgba(255,255,255,0.06)',
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>
              Access
            </Text>
            <Text style={{ color: '#fff' }}>
              Status: {unlocked ? 'Unlocked' : 'Locked'}
            </Text>
            {!unlocked && (
              <Text style={{ opacity: 0.8, color: '#fff' }}>
                This room is locked. Return to the map and progress to unlock it.
              </Text>
            )}
          </View>

          {boss && (
            <View
              style={{
                padding: 14,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.25)',
                borderRadius: 12,
                gap: 8,
                opacity: unlocked ? 1 : 0.65,
                backgroundColor: 'rgba(255,255,255,0.06)',
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>
                Boss
              </Text>

              <Image
                source={getBossAsset(boss.id, 'portrait')}
                style={{
                  width: '100%',
                  height: 220,
                  borderRadius: 12,
                  backgroundColor: 'rgba(255,255,255,0.04)',
                }}
                resizeMode="contain"
              />

              <Text style={{ fontWeight: '600', color: '#fff' }}>
                {boss.title} — {boss.name}
              </Text>

              <Text style={{ opacity: 0.88, color: '#fff', lineHeight: 21 }}>
                {boss.description}
              </Text>

              <Text
                style={{
                  fontWeight: '700',
                  marginTop: 6,
                  color: '#fff',
                }}
              >
                Required Stats
              </Text>

              {Object.entries(boss.requiredStats).length === 0 ? (
                <Text style={{ opacity: 0.75, color: '#fff' }}>—</Text>
              ) : (
                Object.entries(boss.requiredStats).map(([statId, required]) => (
                  <View
                    key={statId}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text style={{ color: '#fff' }}>{statId}</Text>
                    <Text style={{ color: '#fff' }}>
                      {player.stats[statId as keyof typeof player.stats]} / {required}
                    </Text>
                  </View>
                ))
              )}

              <Text style={{ opacity: 0.8, marginTop: 6, color: '#fff' }}>
                Boss defeated: {bossDefeated ? 'Yes' : 'No'}
              </Text>
            </View>
          )}

          <View
            style={{
              padding: 14,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.25)',
              borderRadius: 12,
              gap: 10,
              backgroundColor: 'rgba(255,255,255,0.06)',
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>
              Room Actions (V1)
            </Text>

            <Pressable
              disabled={!unlocked}
              onPress={() =>
                router.push({
                  pathname: '/rituals/[id]',
                  params: { id: roomId },
                })
              }
              style={{
                paddingVertical: 12,
                paddingHorizontal: 14,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.25)',
                opacity: unlocked ? 1 : 0.4,
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.08)',
              }}
            >
              <Text style={{ fontWeight: '700', color: '#fff' }}>Begin Ritual</Text>
            </Pressable>

            <Pressable
              disabled={!unlocked || !boss || bossDefeated || !bossCheck.ok}
              onPress={() => {
                if (!boss) return;

                router.push({
                  pathname: '/bosses/[id]',
                  params: { id: boss.id },
                });
              }}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 14,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.25)',
                opacity: !unlocked || !boss || bossDefeated || !bossCheck.ok ? 0.4 : 1,
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.08)',
              }}
            >
              <Text style={{ fontWeight: '700', color: '#fff' }}>
                {bossDefeated
                  ? 'Boss Defeated'
                  : bossCheck.ok
                    ? 'Challenge Boss'
                    : 'Boss Locked'}
              </Text>
            </Pressable>

            {boss && !bossDefeated && bossCheck.reasons.length > 0 && (
              <View style={{ gap: 6 }}>
                <Text style={{ fontWeight: '700', color: '#fff' }}>
                  To challenge this boss:
                </Text>
                {bossCheck.reasons.map((r) => (
                  <Text key={r} style={{ opacity: 0.85, color: '#fff' }}>
                    • {r}
                  </Text>
                ))}
              </View>
            )}

            <Pressable
              onPress={() => router.back()}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 14,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.25)',
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.08)',
              }}
            >
              <Text style={{ fontWeight: '700', color: '#fff' }}>Back to Map</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}