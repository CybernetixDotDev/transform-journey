import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { SOUL_SCAN_QUESTIONS, runSoulScan } from '../src/engine/SoulScanEngine';
import { usePlayerStore } from '../src/state/usePlayerStore';
import { colors, disabledStyle, styles } from '../src/ui/theme';

export default function SoulScanScreen() {
  const router = useRouter();

  const completeSoulScan = usePlayerStore((state) => state.completeSoulScan);
  const archetypeId = usePlayerStore((state) => state.player.archetypeId);

  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (archetypeId) {
      router.replace('/(tabs)');
    }
  }, [archetypeId, router]);

  const answeredCount = Object.keys(answers).length;
  const total = SOUL_SCAN_QUESTIONS.length;
  const canSubmit = answeredCount === total;

  const selectedOptionIds = useMemo(
    () => SOUL_SCAN_QUESTIONS.map((question) => answers[question.id]).filter(Boolean),
    [answers]
  );

  const onSelect = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const onSubmit = () => {
    if (!canSubmit) return;

    completeSoulScan(runSoulScan(selectedOptionIds));
    router.replace('/(tabs)');
  };

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.eyebrow}>First threshold</Text>
      <Text style={styles.title}>Soul Scan</Text>
      <Text style={styles.body}>
        Answer honestly. This is reflective and symbolic, not therapeutic.
      </Text>

      <View style={styles.panel}>
        <Text style={styles.body}>
          Progress: {answeredCount}/{total}
        </Text>
      </View>

      {SOUL_SCAN_QUESTIONS.map((question) => (
        <View
          key={question.id}
          style={styles.panelRaised}
        >
          <Text style={styles.heading}>{question.prompt}</Text>

          {question.options.map((option) => {
            const selected = answers[question.id] === option.id;
            return (
              <Pressable
                key={option.id}
                onPress={() => onSelect(question.id, option.id)}
                style={[
                  styles.button,
                  selected && styles.buttonPrimary,
                  {
                    alignItems: 'flex-start',
                    backgroundColor: selected
                      ? 'rgba(185, 167, 255, 0.18)'
                      : colors.surfaceSoft,
                  },
                ]}
              >
                <Text style={selected ? styles.buttonTextAccent : styles.buttonText}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}

      <Pressable
        onPress={onSubmit}
        disabled={!canSubmit}
        style={[
          styles.button,
          styles.buttonPrimary,
          disabledStyle(!canSubmit),
        ]}
      >
        <Text style={styles.buttonTextAccent}>Complete Soul Scan</Text>
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
