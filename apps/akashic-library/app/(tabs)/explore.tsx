import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ROOMS } from '../../src/domain/rooms';
import { getRoomLockReasons } from '../../src/engine/UnlockEngine';
import { usePlayerStore } from '../../src/state/usePlayerStore';
import { colors, disabledStyle, roomMoods, styles } from '../../src/ui/theme';

export default function MapScreen() {
  const router = useRouter();

  const player = usePlayerStore((s) => s.player);

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.eyebrow}>Archive map</Text>
      <Text style={styles.title}>Rooms of the Library</Text>
      <Text style={styles.body}>
        Each chamber opens through ritual work and reflection integration.
      </Text>

      {ROOMS.map((room) => {
        const unlocked = player.unlockedRooms.includes(room.id);
        const lockReasons = getRoomLockReasons(player, room.id);
        const mood = roomMoods[room.id];

        return (
          <View
            key={room.id}
            style={[
              styles.panelRaised,
              {
                borderColor: unlocked ? mood.accent : colors.border,
                backgroundColor: unlocked ? mood.glow : colors.surface,
              },
              disabledStyle(!unlocked),
            ]}
          >
            <Text style={[styles.heading, { color: unlocked ? mood.accent : colors.text }]}>
              {room.name}
            </Text>
            <Text style={styles.body}>{room.description}</Text>

            {!unlocked && lockReasons.length > 0 && (
              <View style={{ gap: 4 }}>
                <Text style={styles.heading}>Locked because</Text>
                {lockReasons.map((reason) => (
                  <Text key={reason} style={styles.subtle}>
                    - {reason}
                  </Text>
                ))}
              </View>
            )}

            <View style={styles.row}>
              <Text style={styles.body}>
                Status: {unlocked ? 'Unlocked' : 'Locked'}
              </Text>

              <Pressable
                disabled={!unlocked}
                onPress={() => router.push(`/room/${room.id}`)}
                style={[
                  styles.button,
                  unlocked && styles.buttonPrimary,
                  disabledStyle(!unlocked),
                ]}
              >
                <Text style={unlocked ? styles.buttonTextAccent : styles.buttonText}>
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
