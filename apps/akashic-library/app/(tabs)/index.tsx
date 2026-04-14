import { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { getArchetypeById } from '../../src/domain/archetypes';
import { getRoomById } from '../../src/domain/rooms';
import { getStatName, STAT_IDS } from '../../src/domain/stats';
import type { StatId } from '../../src/domain/types';
import { usePlayerStore } from '../../src/state/usePlayerStore';
import { colors, styles } from '../../src/ui/theme';

const statOrder: readonly StatId[] = STAT_IDS;

export default function HomeScreen() {
  const router = useRouter();

  const player = usePlayerStore((state) => state.player);

  const reset = usePlayerStore((state) => state.reset);

  const archetype = useMemo(
    () => getArchetypeById(player.archetypeId),
    [player.archetypeId]
  );

  const firstUnlockedRoom = useMemo(
    () => (player.unlockedRooms[0] ? getRoomById(player.unlockedRooms[0]) : null),
    [player.unlockedRooms]
  );

  if (!player.archetypeId) {
    return (
      <ScrollView contentContainerStyle={styles.screen}>
        <Text style={styles.eyebrow}>Quiet cosmic archive</Text>
        <Text style={styles.title}>Akashic Library</Text>

        <View style={styles.panelRaised}>
          <Text style={styles.heading}>The first door is waiting</Text>
          <Text style={styles.body}>
            Begin the Soul Scan to receive your archetype and open the first room
            in the archive.
          </Text>

          <ActionButton
            label="Begin Soul Scan"
            onPress={() => router.push('/soul-scan')}
            primary
          />

          <Text style={styles.subtle}>
            This experience is reflective and symbolic, not therapeutic.
          </Text>
        </View>

        <Text style={styles.subtle}>
          Progress is saved locally on this device.
        </Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.eyebrow}>Archive index</Text>
      <Text style={styles.title}>Akashic Library</Text>

      <View style={styles.panelRaised}>
        <Text style={styles.eyebrow}>Soul Scan</Text>
        <Text style={[styles.heading, { fontSize: 22 }]}>
          {archetype?.name ?? player.archetypeId}
        </Text>
        {archetype && <Text style={styles.body}>{archetype.description}</Text>}
        <Text style={styles.subtle}>
          Last saved locally: {new Date(player.updatedAt).toLocaleString()}
        </Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.heading}>Inner Measures</Text>

        {statOrder.map((id) => (
          <View key={id} style={styles.row}>
            <Text style={styles.body}>{getStatName(id)}</Text>
            <Text style={styles.statText}>{player.stats[id]}</Text>
          </View>
        ))}
      </View>

      <View style={styles.panel}>
        <Text style={styles.heading}>Current Threshold</Text>
        {firstUnlockedRoom ? (
          <>
            <Text style={[styles.heading, { color: colors.accentStrong }]}>
              {firstUnlockedRoom.name}
            </Text>
            <Text style={styles.body}>{firstUnlockedRoom.description}</Text>
            <ActionButton
              label="Enter Room"
              onPress={() => router.push(`/room/${firstUnlockedRoom.id}`)}
              primary
            />
          </>
        ) : (
          <Text style={styles.body}>No room is unlocked yet.</Text>
        )}
      </View>

      <View style={styles.panel}>
        <Text style={styles.heading}>Journey Record</Text>
        <View style={styles.row}>
          <Text style={styles.body}>Ascension XP</Text>
          <Text style={styles.statText}>{player.ascensionPoints}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.body}>Open rooms</Text>
          <Text style={styles.statText}>{player.unlockedRooms.length}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.body}>Integrated reflections</Text>
          <Text style={styles.statText}>{player.defeatedBosses.length}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.body}>Rituals completed</Text>
          <Text style={styles.statText}>{player.ritualHistory.length}</Text>
        </View>
      </View>

      <ActionButton label="Open Map" onPress={() => router.push('/(tabs)/explore')} />
      <ActionButton label="Restart Journey" onPress={() => void reset()} />
    </ScrollView>
  );
}

function ActionButton({
  label,
  onPress,
  primary = false,
}: {
  label: string;
  onPress: () => void;
  primary?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, primary && styles.buttonPrimary, { alignSelf: 'flex-start' }]}
    >
      <Text style={primary ? styles.buttonTextAccent : styles.buttonText}>{label}</Text>
    </Pressable>
  );
}
