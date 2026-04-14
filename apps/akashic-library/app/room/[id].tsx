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
import { getStatName } from '../../src/domain/stats';
import { usePlayerStore } from '../../src/state/usePlayerStore';
import { canChallengeBoss } from '../../src/engine/BossEngine';
import { getRoomAsset, getBossAsset } from '../../src/assets';
import { colors, disabledStyle, roomMoods, styles } from '../../src/ui/theme';

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
      <View style={styles.screenCenter}>
        <Text style={styles.heading}>Room not found</Text>
        <Pressable
          onPress={() => router.back()}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Back</Text>
        </Pressable>
      </View>
    );
  }

  const mood = roomMoods[roomId];
  const unlocked = player.unlockedRooms.includes(roomId);
  const bossIntegrated = boss ? player.defeatedBosses.includes(boss.id) : false;

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
          backgroundColor: 'rgba(9,10,18,0.72)',
        }}
      >
        <View
          style={{
            backgroundColor: 'rgba(9,10,18,0.72)',
            borderColor: mood.accent,
            borderWidth: 1,
            borderRadius: 8,
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
              color: colors.text,
              textAlign: 'center',
            }}
          >
            {room.name}
          </Text>

          <Text
            style={{
              color: colors.textMuted,
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
              borderColor: colors.border,
              borderRadius: 8,
              gap: 6,
              opacity: unlocked ? 1 : 0.65,
              backgroundColor: colors.surfaceSoft,
            }}
          >
            <Text style={styles.heading}>
              Access
            </Text>
            <Text style={styles.body}>
              Status: {unlocked ? 'Unlocked' : 'Locked'}
            </Text>
            {!unlocked && (
              <Text style={styles.subtle}>
                This room is locked. Return to the map and progress to unlock it.
              </Text>
            )}
          </View>

          {boss && (
            <View
              style={{
                padding: 14,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                gap: 8,
                opacity: unlocked ? 1 : 0.65,
                backgroundColor: colors.surfaceSoft,
              }}
            >
              <Text style={styles.heading}>
                Reflection
              </Text>

              <Image
                source={getBossAsset(boss.id, 'portrait')}
                style={{
                  width: '100%',
                  height: 220,
                  borderRadius: 8,
                  backgroundColor: 'rgba(255,255,255,0.04)',
                }}
                resizeMode="contain"
              />

              <Text style={[styles.heading, { color: mood.accent }]}>
                {boss.title} - {boss.name}
              </Text>

              <Text style={styles.body}>
                {boss.description}
              </Text>
              <Text style={styles.body}>
                Represents: {boss.represents}
              </Text>

              <Text style={styles.heading}>
                Readiness Requirements
              </Text>

              {Object.entries(boss.requiredStats).length === 0 ? (
                <Text style={styles.subtle}>-</Text>
              ) : (
                Object.entries(boss.requiredStats).map(([statId, required]) => (
                  <View
                    key={statId}
                    style={styles.row}
                  >
                    <Text style={styles.body}>
                      {getStatName(statId as keyof typeof player.stats)}
                    </Text>
                    <Text style={styles.statText}>
                      {player.stats[statId as keyof typeof player.stats]} / {required}
                    </Text>
                  </View>
                ))
              )}

              <Text style={styles.body}>
                Reflection integrated: {bossIntegrated ? 'Yes' : 'No'}
              </Text>
            </View>
          )}

          <View
            style={{
              padding: 14,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 8,
              gap: 10,
              backgroundColor: colors.surfaceSoft,
            }}
          >
            <Text style={styles.heading}>Room Actions</Text>

            <Pressable
              disabled={!unlocked}
              onPress={() =>
                router.push({
                  pathname: '/rituals/[id]',
                  params: { id: roomId },
                })
              }
              style={[
                styles.button,
                styles.buttonPrimary,
                disabledStyle(!unlocked),
              ]}
            >
              <Text style={styles.buttonTextAccent}>Begin Ritual</Text>
            </Pressable>

            <Pressable
              disabled={!unlocked || !boss || bossIntegrated || !bossCheck.ok}
              onPress={() => {
                if (!boss) return;

                router.push({
                  pathname: '/bosses/[id]',
                  params: { id: boss.id },
                });
              }}
              style={[
                styles.button,
                disabledStyle(!unlocked || !boss || bossIntegrated || !bossCheck.ok),
              ]}
            >
              <Text style={styles.buttonText}>
                {bossIntegrated
                  ? 'Reflection Integrated'
                  : bossCheck.ok
                    ? 'Begin Integration'
                    : 'Reflection Locked'}
              </Text>
            </Pressable>

            {boss && !bossIntegrated && bossCheck.reasons.length > 0 && (
              <View style={{ gap: 6 }}>
                <Text style={styles.heading}>
                  To begin integration:
                </Text>
                {bossCheck.reasons.map((r) => (
                  <Text key={r} style={styles.subtle}>
                    - {r}
                  </Text>
                ))}
              </View>
            )}

            <Pressable
              onPress={() => router.replace('/(tabs)/explore')}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Back to Map</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}
