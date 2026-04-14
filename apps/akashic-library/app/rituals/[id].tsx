import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import type { RoomId } from '../../src/domain/types';
import { RITUALS } from '../../src/domain/rituals';
import { STATS, getStatName } from '../../src/domain/stats';
import { usePlayerStore } from '../../src/state/usePlayerStore';
import { colors, styles } from '../../src/ui/theme';

export default function RitualScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const roomId = params.id as RoomId | undefined;

  const player = usePlayerStore((state) => state.player);
  const completeRitual = usePlayerStore((state) => state.completeRitual);

  const ritual = useMemo(
    () => RITUALS.find((candidate) => candidate.roomId === roomId),
    [roomId]
  );

  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);

  if (!roomId || !ritual) {
    return (
      <View style={styles.screenCenter}>
        <Text style={styles.heading}>Ritual not found</Text>
        <Pressable
          onPress={() => router.back()}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Back</Text>
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
      ritualId: ritual.id,
      choiceId: selectedChoice.id,
      effects: selectedChoice.effects,
    });

    router.replace({
      pathname: '/ritual-result',
      params: { roomId },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.eyebrow}>Ritual chamber</Text>
      <Text style={styles.title}>{ritual.name}</Text>
      <Text style={styles.body}>{ritual.description}</Text>

      <View style={styles.panel}>
        <Text style={styles.heading}>Current Stats</Text>
        {STATS.map((stat) => (
          <View key={stat.id} style={styles.row}>
            <Text style={styles.body}>{stat.name}</Text>
            <Text style={styles.statText}>{player.stats[stat.id]}</Text>
          </View>
        ))}
      </View>

      <View style={{ gap: 10 }}>
        <Text style={styles.heading}>Choose your approach</Text>

        {ritual.choices.map((choice) => {
          const selected = choice.id === selectedChoiceId;

          return (
            <Pressable
              key={choice.id}
              onPress={() => setSelectedChoiceId(choice.id)}
              style={[
                styles.panelRaised,
                selected && {
                  borderColor: colors.accent,
                  backgroundColor: 'rgba(185, 167, 255, 0.18)',
                },
              ]}
            >
              <Text style={[styles.heading, selected && { color: colors.accentStrong }]}>
                {choice.label}
              </Text>
              <Text style={styles.body}>{choice.description}</Text>

              <View style={{ gap: 2 }}>
                <Text style={styles.heading}>Effects</Text>
                {Object.entries(choice.effects).map(([statId, delta]) => (
                  <Text key={statId} style={styles.body}>
                    {getStatName(statId as keyof typeof choice.effects)}: +{delta}
                  </Text>
                ))}
              </View>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={handleResolveRitual}
        style={[
          styles.button,
          styles.buttonPrimary,
          { opacity: selectedChoice ? 1 : 0.6 },
        ]}
      >
        <Text style={styles.buttonTextAccent}>Resolve Ritual</Text>
      </Pressable>

      <Pressable
        onPress={() => router.back()}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Back</Text>
      </Pressable>
    </ScrollView>
  );
}
