import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import type { RoomId } from '../../src/domain/types';
import { RITUALS } from '../../src/domain/rituals';
import { usePlayerStore } from '../../src/state/usePlayerStore';

export default function RitualScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const roomId = params.id as RoomId | undefined;

  const player = usePlayerStore((s) => s.player);
  const completeRitual = usePlayerStore((s) => s.completeRitual);

  const ritual = useMemo(
    () => RITUALS.find((r) => r.roomId === roomId),
    [roomId]
  );

  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);

  if (!roomId || !ritual) {
    return (
      <View style={{ flex: 1, padding: 18, justifyContent: 'center', gap: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>Ritual not found</Text>
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

  const selectedChoice =
    ritual.choices.find((choice) => choice.id === selectedChoiceId) ?? null;

  const handleResolveRitual = () => {
    if (!selectedChoice) {
      Alert.alert('Choose a path', 'Select one ritual choice before continuing.');
      return;
    }

    completeRitual({
      roomId,
      effects: selectedChoice.effects,
    });

    Alert.alert(
      'Ritual Complete',
      `${selectedChoice.label} has altered your path.`,
      [
        {
          text: 'Return to Room',
          onPress: () =>
            router.replace({
            pathname: '/room/[id]',
            params: { id: roomId },
            }),
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 18, gap: 14 }}>
      <Text style={{ fontSize: 26, fontWeight: '700' }}>{ritual.name}</Text>
      <Text style={{ opacity: 0.8 }}>{ritual.description}</Text>

      <View
        style={{
          padding: 14,
          borderWidth: 1,
          borderRadius: 12,
          gap: 6,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '700' }}>Current Stats</Text>
        <Text>Might: {player.stats.might}</Text>
        <Text>Insight: {player.stats.insight}</Text>
        <Text>Will: {player.stats.will}</Text>
        <Text>Agility: {player.stats.agility}</Text>
        <Text>Attunement: {player.stats.attunement}</Text>
      </View>

      <View style={{ gap: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: '700' }}>Choose your approach</Text>

        {ritual.choices.map((choice) => {
          const selected = choice.id === selectedChoiceId;

          return (
            <Pressable
              key={choice.id}
              onPress={() => setSelectedChoiceId(choice.id)}
              style={{
                padding: 14,
                borderWidth: 1,
                borderRadius: 12,
                gap: 8,
                backgroundColor: selected ? '#f3f4f6' : 'transparent',
              }}
            >
              <Text style={{ fontWeight: '700' }}>{choice.label}</Text>
              <Text style={{ opacity: 0.8 }}>{choice.description}</Text>

              <View style={{ gap: 2 }}>
                <Text style={{ fontWeight: '600' }}>Effects</Text>
                {Object.entries(choice.effects).map(([statId, delta]) => (
                  <Text key={statId}>
                    {statId}: +{delta}
                  </Text>
                ))}
              </View>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={handleResolveRitual}
        style={{
          paddingVertical: 12,
          paddingHorizontal: 14,
          borderRadius: 12,
          borderWidth: 1,
          alignItems: 'center',
          opacity: selectedChoice ? 1 : 0.6,
        }}
      >
        <Text style={{ fontWeight: '700' }}>Resolve Ritual</Text>
      </Pressable>

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
    </ScrollView>
  );
}