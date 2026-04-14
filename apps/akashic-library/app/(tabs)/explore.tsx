import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ROOMS } from '../../src/domain/rooms';
import { getRoomLockReasons } from '../../src/engine/UnlockEngine';
import { usePlayerStore } from '../../src/state/usePlayerStore';
import { getRoomAsset } from '../../src/assets';
import { colors, disabledStyle, roomMoods, styles } from '../../src/ui/theme';

export default function MapScreen() {
  const router = useRouter();

  const player = usePlayerStore((s) => s.player);

  return (
    <ScrollView contentContainerStyle={[styles.screen, { paddingBottom: 28 }]}>
      <View style={styles.heroPanel}>
        <Text style={styles.eyebrow}>Archive map</Text>
        <Text style={styles.title}>Rooms of the Library</Text>
        <Text style={styles.body}>
          Each chamber opens through ritual work and reflection integration.
        </Text>
      </View>

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
                gap: 12,
                borderColor: unlocked ? mood.accent : colors.border,
                backgroundColor: unlocked ? mood.glow : colors.surface,
              },
              disabledStyle(!unlocked),
            ]}
          >
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <Image
                source={getRoomAsset(room.id, 'icon')}
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 8,
                  opacity: unlocked ? 1 : 0.62,
                  backgroundColor: colors.surfaceSoft,
                }}
                resizeMode="contain"
              />
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={styles.eyebrow}>
                  {unlocked ? 'Open chamber' : 'Sealed chamber'}
                </Text>
                <Text
                  style={[styles.heading, { color: unlocked ? mood.accent : colors.text }]}
                >
                  {room.name}
                </Text>
              </View>
            </View>
            <Text style={styles.body}>{room.description}</Text>

            {!unlocked && lockReasons.length > 0 && (
              <View style={[styles.panel, { backgroundColor: colors.surfaceSoft }]}>
                <Text style={styles.heading}>To Open This Room</Text>
                {lockReasons.map((reason) => (
                  <Text key={reason} style={styles.subtle}>
                    - {reason}
                  </Text>
                ))}
              </View>
            )}

            <View style={[styles.row, { alignItems: 'center' }]}>
              <Text style={styles.body}>
                Access: {unlocked ? 'Unlocked' : 'Locked'}
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
