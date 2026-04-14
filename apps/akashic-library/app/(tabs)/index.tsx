import { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { getArchetypeById } from '../../src/domain/archetypes';
import { BOSSES } from '../../src/domain/bosses';
import { getRoomById } from '../../src/domain/rooms';
import { DEFAULT_STATS, getStatName, STAT_IDS } from '../../src/domain/stats';
import type { StatId } from '../../src/domain/types';
import { usePlayerStore } from '../../src/state/usePlayerStore';

const statOrder: readonly StatId[] = STAT_IDS;

export default function HomeScreen() {
  const router = useRouter();

  const player = usePlayerStore((state) => state.player);

  const setArchetype = usePlayerStore((state) => state.setArchetype);
  const addAscensionPoints = usePlayerStore((state) => state.addAscensionPoints);
  const completeRitual = usePlayerStore((state) => state.completeRitual);
  const defeatBoss = usePlayerStore((state) => state.defeatBoss);
  const reset = usePlayerStore((state) => state.reset);

  const archetype = useMemo(
    () => getArchetypeById(player.archetypeId),
    [player.archetypeId]
  );

  const firstUnlockedRoom = useMemo(
    () => (player.unlockedRooms[0] ? getRoomById(player.unlockedRooms[0]) : null),
    [player.unlockedRooms]
  );

  const lastRitual = useMemo(
    () => player.ritualHistory[player.ritualHistory.length - 1],
    [player.ritualHistory]
  );

  if (!player.archetypeId) {
    return (
      <ScrollView contentContainerStyle={{ padding: 18, gap: 14 }}>
        <Text style={{ fontSize: 26, fontWeight: '700' }}>Akashic Library</Text>

        <View style={{ padding: 14, borderWidth: 1, borderRadius: 12, gap: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: '600' }}>Welcome</Text>
          <Text style={{ opacity: 0.75 }}>
            Begin the Soul Scan to receive your archetype and unlock your first room.
          </Text>

          <ActionButton
            label="Begin Soul Scan"
            onPress={() => router.push('/soul-scan')}
          />

          <Text style={{ opacity: 0.6, fontSize: 12 }}>
            This experience is reflective and symbolic, not therapeutic.
          </Text>
        </View>

        <View style={{ padding: 14, borderWidth: 1, borderRadius: 12, gap: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: '600' }}>Debug</Text>
          <Text style={{ opacity: 0.75 }}>
            Reset clears local AsyncStorage-backed progress.
          </Text>
          <ActionButton label="Reset ALL state" onPress={() => void reset()} />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 18, gap: 14 }}>
      <Text style={{ fontSize: 26, fontWeight: '700' }}>Akashic Library</Text>

      <View style={{ padding: 14, borderWidth: 1, borderRadius: 12, gap: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>Soul Scan Result</Text>
        <Text style={{ fontSize: 20, fontWeight: '700' }}>
          {archetype?.name ?? player.archetypeId}
        </Text>
        {archetype && <Text style={{ opacity: 0.75 }}>{archetype.description}</Text>}
        <Text style={{ opacity: 0.7, fontSize: 12 }}>
          Saved locally: {player.updatedAt}
        </Text>
      </View>

      <View style={{ padding: 14, borderWidth: 1, borderRadius: 12, gap: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>Initial Stats</Text>

        {statOrder.map((id) => (
          <View key={id} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>{getStatName(id)}</Text>
            <Text>{player.stats[id]}</Text>
          </View>
        ))}
      </View>

      <View style={{ padding: 14, borderWidth: 1, borderRadius: 12, gap: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>First Room</Text>
        {firstUnlockedRoom ? (
          <>
            <Text style={{ fontSize: 18, fontWeight: '700' }}>
              {firstUnlockedRoom.name}
            </Text>
            <Text style={{ opacity: 0.75 }}>{firstUnlockedRoom.description}</Text>
            <ActionButton
              label="Enter First Room"
              onPress={() => router.push(`/room/${firstUnlockedRoom.id}`)}
            />
          </>
        ) : (
          <Text style={{ opacity: 0.75 }}>No room is unlocked yet.</Text>
        )}
      </View>

      <View style={{ padding: 14, borderWidth: 1, borderRadius: 12, gap: 6 }}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>Debug State</Text>
        <Text>Archetype ID: {player.archetypeId}</Text>
        <Text>Ascension Points: {player.ascensionPoints}</Text>
        <Text>Unlocked Rooms: {player.unlockedRooms.join(', ') || '-'}</Text>
        <Text>Defeated Bosses: {player.defeatedBosses.length}</Text>
        <Text>Rituals Completed: {player.ritualHistory.length}</Text>
      </View>

      <View style={{ padding: 14, borderWidth: 1, borderRadius: 12, gap: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>Debug Actions</Text>

        <ActionButton label="+10 Ascension Points" onPress={() => addAscensionPoints(10)} />

        <ActionButton
          label="Complete ritual (shadow_mirror_hall)"
          onPress={() => completeRitual({ roomId: 'shadow_mirror_hall' })}
        />

        <ActionButton
          label="Defeat boss #1 (reward XP)"
          onPress={() => {
            const boss = BOSSES[0];
            defeatBoss(boss.id, boss.rewardXP);
          }}
        />

        <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
          <ActionButton
            label="Reset stats to 0"
            onPress={() =>
              setArchetype(player.archetypeId ?? 'warrior', { ...DEFAULT_STATS })
            }
          />
          <ActionButton label="Reset ALL state" onPress={() => void reset()} />
        </View>
      </View>

      <View style={{ padding: 14, borderWidth: 1, borderRadius: 12, gap: 6 }}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>Last Ritual</Text>
        <Text>
          {lastRitual ? `${lastRitual.roomId} @ ${lastRitual.completedAt}` : '-'}
        </Text>
      </View>
    </ScrollView>
  );
}

function ActionButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderWidth: 1,
        alignSelf: 'flex-start',
      }}
    >
      <Text style={{ fontWeight: '600' }}>{label}</Text>
    </Pressable>
  );
}
