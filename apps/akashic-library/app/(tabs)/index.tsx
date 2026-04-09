import { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { usePlayerStore } from '../../src/state/usePlayerStore';
import type { StatId } from '../../src/domain/types';
import { BOSSES } from '../../src/domain/bosses';
import { DEFAULT_STATS } from '../../src/domain/stats';

const statOrder: StatId[] = ['might', 'insight', 'will', 'agility', 'attunement'];

export default function HomeScreen() {
  const router = useRouter();

  const player = usePlayerStore((s) => s.player);

  const setArchetype = usePlayerStore((s) => s.setArchetype);
  const updateStat = usePlayerStore((s) => s.updateStat);
  const addAscensionPoints = usePlayerStore((s) => s.addAscensionPoints);
  const completeRitual = usePlayerStore((s) => s.completeRitual);
  const defeatBoss = usePlayerStore((s) => s.defeatBoss);
  const reset = usePlayerStore((s) => s.reset);

  const lastRitual = useMemo(
    () => player.ritualHistory[player.ritualHistory.length - 1],
    [player.ritualHistory]
  );

  // ---- Onboarding gate ----
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
            This experience is reflective and symbolic — not therapeutic.
          </Text>
        </View>

        <View style={{ padding: 14, borderWidth: 1, borderRadius: 12, gap: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: '600' }}>Dev Controls</Text>
          <Text style={{ opacity: 0.75 }}>
            If you want to re-run onboarding or clear progress:
          </Text>
          <ActionButton label="Reset ALL state" onPress={() => void reset()} />
        </View>
      </ScrollView>
    );
  }

  // ---- Main V1 Control Room ----
  return (
    <ScrollView contentContainerStyle={{ padding: 18, gap: 14 }}>
      <Text style={{ fontSize: 26, fontWeight: '700' }}>Akashic Library</Text>

      <View style={{ padding: 14, borderWidth: 1, borderRadius: 12, gap: 6 }}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>Player</Text>
        <Text>Archetype: {player.archetypeId}</Text>
        <Text>Ascension Points: {player.ascensionPoints}</Text>
        <Text>Unlocked Rooms: {player.unlockedRooms.length}</Text>
        <Text>Defeated Bosses: {player.defeatedBosses.length}</Text>
        <Text>Rituals Completed: {player.ritualHistory.length}</Text>
        <Text style={{ opacity: 0.7, fontSize: 12 }}>Updated: {player.updatedAt}</Text>
      </View>

      <View style={{ padding: 14, borderWidth: 1, borderRadius: 12, gap: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>Stats</Text>

        {statOrder.map((id) => (
          <View key={id} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>{id}</Text>
            <Text>{player.stats[id]}</Text>
          </View>
        ))}

        <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
          {statOrder.map((id) => (
            <ActionButton key={id} label={`+1 ${id}`} onPress={() => updateStat(id, 1)} />
          ))}
        </View>

        <ActionButton
          label="Reset stats to 0"
          onPress={() =>
            setArchetype(player.archetypeId ?? 'scribe', { ...DEFAULT_STATS })
          }
        />
      </View>

      <View style={{ padding: 14, borderWidth: 1, borderRadius: 12, gap: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>Actions (V1 Debug)</Text>

        <ActionButton label="+10 Ascension Points" onPress={() => addAscensionPoints(10)} />

        <ActionButton
          label="Complete ritual (hall_of_echoes)"
          onPress={() => completeRitual({ roomId: 'hall_of_echoes' })}
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
            label="Re-run Soul Scan"
            onPress={() => router.push('/soul-scan')}
          />
          <ActionButton label="Reset ALL state" onPress={() => void reset()} />
        </View>
      </View>

      <View style={{ padding: 14, borderWidth: 1, borderRadius: 12, gap: 6 }}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>Last Ritual</Text>
        <Text>
          {lastRitual ? `${lastRitual.roomId} @ ${lastRitual.completedAt}` : '—'}
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