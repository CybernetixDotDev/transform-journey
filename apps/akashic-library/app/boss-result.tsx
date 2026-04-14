import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { getBossById } from '../src/domain/bosses';
import { getRoomById } from '../src/domain/rooms';
import { usePlayerStore } from '../src/state/usePlayerStore';

export default function BossResultScreen() {
  const router = useRouter();

  const result = usePlayerStore((state) => state.lastBossResult);
  const clear = usePlayerStore((state) => state.clearLastBossResult);

  if (!result) {
    return (
      <View
        style={{
          flex: 1,
          padding: 18,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: '700' }}>
          No boss result found
        </Text>

        <Pressable
          onPress={() => router.replace('/(tabs)/explore')}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 14,
            borderRadius: 12,
            borderWidth: 1,
            alignItems: 'center',
            minWidth: 180,
          }}
        >
          <Text style={{ fontWeight: '700' }}>Return to Map</Text>
        </Pressable>
      </View>
    );
  }

  const boss = getBossById(result.bossId);
  const unlockedRoom = result.unlockedRoomId
    ? getRoomById(result.unlockedRoomId)
    : null;

  const continueToNext = () => {
    const nextRoomId = result.unlockedRoomId;
    clear();

    if (nextRoomId) {
      router.replace({
        pathname: '/room/[id]',
        params: { id: nextRoomId },
      });
      return;
    }

    router.replace('/(tabs)/explore');
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 18, gap: 14 }}>
      <Text style={{ fontSize: 28, fontWeight: '700' }}>
        Boss Defeated
      </Text>

      <View style={{ padding: 14, borderWidth: 1, borderRadius: 12, gap: 8 }}>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>
          {boss ? `${boss.title} - ${boss.name}` : result.bossId}
        </Text>
        <Text>XP gained: {result.rewardXP}</Text>
        <Text style={{ opacity: 0.7, fontSize: 12 }}>
          Completed: {result.completedAt}
        </Text>
      </View>

      <View style={{ padding: 14, borderWidth: 1, borderRadius: 12, gap: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: '700' }}>Progression</Text>
        {unlockedRoom ? (
          <>
            <Text>Next room unlocked:</Text>
            <Text style={{ fontSize: 18, fontWeight: '700' }}>
              {unlockedRoom.name}
            </Text>
            <Text style={{ opacity: 0.75 }}>{unlockedRoom.description}</Text>
          </>
        ) : (
          <Text>No new room unlocked.</Text>
        )}
      </View>

      <Pressable
        onPress={continueToNext}
        style={{
          paddingVertical: 12,
          paddingHorizontal: 14,
          borderRadius: 12,
          borderWidth: 1,
          alignItems: 'center',
        }}
      >
        <Text style={{ fontWeight: '700' }}>
          {unlockedRoom ? 'Enter Next Room' : 'Return to Map'}
        </Text>
      </Pressable>

      {unlockedRoom && (
        <Pressable
          onPress={() => {
            clear();
            router.replace('/(tabs)/explore');
          }}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 14,
            borderRadius: 12,
            borderWidth: 1,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontWeight: '700' }}>Return to Map</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}
