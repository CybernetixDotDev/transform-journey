import { useMemo, useRef, useState } from 'react';
import { Alert, Animated, Pressable, ScrollView, Text, View } from 'react-native';
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
  const [isResolving, setIsResolving] = useState(false);
  const contentFade = useRef(new Animated.Value(1)).current;

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
    if (isResolving) return;

    if (!selectedChoice) {
      Alert.alert('Choose a path', 'Select one ritual choice before continuing.');
      return;
    }

    setIsResolving(true);

    Animated.sequence([
      Animated.delay(220),
      Animated.timing(contentFade, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start(() => {
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
    });
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.screen,
        {
          paddingBottom: 28,
        },
      ]}
    >
      <Animated.View style={{ gap: 14, opacity: contentFade }}>
        <View style={{ gap: 8 }}>
          <Text style={styles.eyebrow}>Ritual chamber</Text>
          <Text style={styles.title}>{ritual.name}</Text>
          <Text style={styles.body}>{ritual.description}</Text>
        </View>

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
            const dimmed = Boolean(selectedChoiceId) && !selected;

            return (
              <Pressable
                key={choice.id}
                onPress={() => {
                  if (!isResolving) setSelectedChoiceId(choice.id);
                }}
                disabled={isResolving}
                style={[
                  styles.panelRaised,
                  {
                    gap: 12,
                    opacity: dimmed ? 0.62 : 1,
                  },
                  selected && {
                    borderColor: colors.accentStrong,
                    backgroundColor: 'rgba(185, 167, 255, 0.24)',
                  },
                ]}
              >
                <View style={styles.row}>
                  <Text
                    style={[
                      styles.heading,
                      selected && { color: colors.accentStrong },
                    ]}
                  >
                    {choice.label}
                  </Text>
                  {selected && <Text style={styles.subtle}>Chosen</Text>}
                </View>

                <Text style={styles.body}>{choice.description}</Text>

                <View
                  style={[
                    styles.panel,
                    {
                      backgroundColor: colors.surfaceSoft,
                      gap: 6,
                    },
                  ]}
                >
                  <Text style={styles.eyebrow}>Effects</Text>
                  {Object.entries(choice.effects).map(([statId, delta]) => (
                    <View key={statId} style={styles.row}>
                      <Text style={styles.body}>
                        {getStatName(statId as keyof typeof choice.effects)}
                      </Text>
                      <Text style={[styles.statText, { color: colors.success }]}>
                        +{delta}
                      </Text>
                    </View>
                  ))}
                </View>

                {selected && isResolving && (
                  <Text style={styles.subtle}>Sealing the ritual...</Text>
                )}
              </Pressable>
            );
          })}
        </View>
      </Animated.View>

      <Pressable
        onPress={handleResolveRitual}
        style={[
          styles.button,
          styles.buttonPrimary,
          { opacity: selectedChoice && !isResolving ? 1 : 0.6 },
        ]}
      >
        <Text style={styles.buttonTextAccent}>
          {isResolving ? 'Sealing Ritual...' : 'Resolve Ritual'}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.back()}
        disabled={isResolving}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Back</Text>
      </Pressable>
    </ScrollView>
  );
}
