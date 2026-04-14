import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { SOUL_SCAN_QUESTIONS, runSoulScan } from '../src/engine/SoulScanEngine';
import { usePlayerStore } from '../src/state/usePlayerStore';
import { colors, styles } from '../src/ui/theme';

export default function SoulScanScreen() {
  const router = useRouter();

  const completeSoulScan = usePlayerStore((state) => state.completeSoulScan);
  const archetypeId = usePlayerStore((state) => state.player.archetypeId);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const fade = useRef(new Animated.Value(1)).current;
  const slide = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (archetypeId) {
      router.replace('/(tabs)');
    }
  }, [archetypeId, router]);

  useEffect(() => {
    fade.setValue(0);
    slide.setValue(12);
    Animated.timing(fade, {
      toValue: 1,
      duration: 240,
      useNativeDriver: true,
    }).start(() => setIsTransitioning(false));
    Animated.timing(slide, {
      toValue: 0,
      duration: 240,
      useNativeDriver: true,
    }).start();
  }, [currentQuestionIndex, fade, slide]);

  const total = SOUL_SCAN_QUESTIONS.length;
  const currentQuestion = SOUL_SCAN_QUESTIONS[currentQuestionIndex];
  const progress = currentQuestionIndex + 1;
  const storedOptionId = answers[currentQuestion.id] ?? null;
  const activeSelectedOptionId = selectedOptionId ?? storedOptionId;

  const submitSoulScan = (nextAnswers: Record<string, string>) => {
    const selectedOptionIds = SOUL_SCAN_QUESTIONS.map(
      (question) => nextAnswers[question.id]
    ).filter(Boolean);

    completeSoulScan(runSoulScan(selectedOptionIds));
    router.replace('/(tabs)');
  };

  const onSelect = (optionId: string) => {
    if (isTransitioning || isCompleting) return;

    const nextAnswers = {
      ...answers,
      [currentQuestion.id]: optionId,
    };

    setIsTransitioning(true);
    setSelectedOptionId(optionId);
    setAnswers(nextAnswers);

    if (currentQuestionIndex === total - 1) {
      setIsCompleting(true);
      Animated.sequence([
        Animated.delay(360),
        Animated.timing(fade, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
        }),
      ]).start(() => {
        submitSoulScan(nextAnswers);
      });
      return;
    }

    Animated.sequence([
      Animated.delay(180),
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 0,
          duration: 170,
          useNativeDriver: true,
        }),
        Animated.timing(slide, {
          toValue: -10,
          duration: 170,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setCurrentQuestionIndex((index) => index + 1);
      setSelectedOptionId(null);
    });
  };

  const goBack = () => {
    if (isTransitioning || isCompleting) return;

    if (currentQuestionIndex === 0) {
      router.back();
      return;
    }

    setIsTransitioning(true);
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 10,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentQuestionIndex((index) => index - 1);
      setSelectedOptionId(null);
    });
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.screen,
        {
          flexGrow: 1,
          justifyContent: 'space-between',
        },
      ]}
    >
      <View style={{ gap: 8, alignItems: 'center' }}>
        <Text style={styles.eyebrow}>First threshold</Text>
        <Text style={[styles.title, { textAlign: 'center' }]}>Soul Scan</Text>
        <Text style={[styles.body, { textAlign: 'center' }]}>
          Answer honestly. This is reflective and symbolic, not therapeutic.
        </Text>
      </View>

      <Animated.View
        style={{
          gap: 16,
          opacity: fade,
          transform: [{ translateY: slide }],
        }}
      >
        <View style={{ gap: 8, alignItems: 'center' }}>
          <Text style={styles.subtle}>
            {progress} / {total}
          </Text>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {SOUL_SCAN_QUESTIONS.map((question, index) => (
              <View
                key={question.id}
                style={{
                  width: index === currentQuestionIndex ? 22 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor:
                    index <= currentQuestionIndex ? colors.accent : colors.borderStrong,
                }}
              />
            ))}
          </View>
        </View>

        <View style={[styles.panelRaised, { gap: 16 }]}>
          <Text style={[styles.heading, { fontSize: 22, textAlign: 'center' }]}>
            {currentQuestion.prompt}
          </Text>

          <View style={{ gap: 10 }}>
            {currentQuestion.options.map((option) => {
              const selected = activeSelectedOptionId === option.id;
              const lockedOut = selectedOptionId !== null && !selected;

              return (
                <Pressable
                  key={option.id}
                  onPress={() => onSelect(option.id)}
                  disabled={isTransitioning || isCompleting}
                  style={[
                    styles.button,
                    selected && styles.buttonPrimary,
                    {
                      alignItems: 'flex-start',
                      borderColor: selected ? colors.accentStrong : colors.borderStrong,
                      backgroundColor: selected
                        ? 'rgba(185, 167, 255, 0.24)'
                        : colors.surfaceSoft,
                      opacity: lockedOut ? 0.5 : 1,
                    },
                  ]}
                >
                  <Text
                    style={[
                      selected ? styles.buttonTextAccent : styles.buttonText,
                      { lineHeight: 22 },
                    ]}
                  >
                    {option.label}
                  </Text>
                  {selected && (
                    <Text style={styles.subtle}>
                      {isCompleting ? 'Reading the pattern...' : 'Chosen'}
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      </Animated.View>

      <Pressable onPress={goBack} style={styles.button}>
        <Text style={styles.buttonText}>Back</Text>
      </Pressable>
    </ScrollView>
  );
}
