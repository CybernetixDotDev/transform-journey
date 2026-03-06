import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ROOMS } from '../../src/domain/rooms';
import { usePlayerStore } from '../../src/state/usePlayerStore';

export default function MapScreen() {
  const router = useRouter();

  const player = usePlayerStore((s) => s.player);

  return (
    <ScrollView contentContainerStyle={{ padding: 18, gap: 14 }}>
      <Text style={{ fontSize: 26, fontWeight: '700' }}>Map</Text>
      <Text style={{ opacity: 0.75 }}>
        Select a room. Locked rooms will open as you progress.
      </Text>

      {ROOMS.map((room) => {
        const unlocked = player.unlockedRooms.includes(room.id);

        return (
          <View
            key={room.id}
            style={{
              padding: 14,
              borderWidth: 1,
              borderRadius: 12,
              gap: 8,
              opacity: unlocked ? 1 : 0.5,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '700' }}>{room.name}</Text>
            <Text style={{ opacity: 0.8 }}>{room.description}</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontWeight: '600' }}>
                Status: {unlocked ? 'Unlocked' : 'Locked'}
              </Text>

              <Pressable
                disabled={!unlocked}
                onPress={() => router.push(`/room/${room.id}`)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  borderRadius: 10,
                  borderWidth: 1,
                  opacity: unlocked ? 1 : 0.4,
                }}
              >
                <Text style={{ fontWeight: '700' }}>
                  {unlocked ? 'Enter' : 'Locked'}
                </Text>
              </Pressable>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}