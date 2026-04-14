import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { SOUL_SCAN_QUESTIONS, runSoulScan } from '../src/engine/SoulScanEngine';
import { usePlayerStore } from '../src/state/usePlayerStore';

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
    <ScrollView contentContainerStyle={{ padding: 18, gap: 16 }}>
      <Text style={{ fontSize: 26, fontWeight: '700' }}>Soul Scan</Text>
      <Text style={{ opacity: 0.75 }}>
        Answer honestly. This is reflective and symbolic, not therapeutic.
      </Text>

      <View style={{ padding: 12, borderWidth: 1, borderRadius: 12 }}>
        <Text>
          Progress: {answeredCount}/{total}
        </Text>
      </View>

      {SOUL_SCAN_QUESTIONS.map((question) => (
        <View
          key={question.id}
          style={{ padding: 14, borderWidth: 1, borderRadius: 12, gap: 10 }}
        >
          <Text style={{ fontSize: 16, fontWeight: '600' }}>{question.prompt}</Text>

          {question.options.map((option) => {
            const selected = answers[question.id] === option.id;
            return (
              <Pressable
                key={option.id}
                onPress={() => onSelect(question.id, option.id)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  borderRadius: 10,
                  borderWidth: 1,
                  opacity: selected ? 1 : 0.85,
                }}
              >
                <Text style={{ fontWeight: selected ? '700' : '500' }}>
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
        style={{
          paddingVertical: 14,
          paddingHorizontal: 14,
          borderRadius: 12,
          borderWidth: 1,
          opacity: canSubmit ? 1 : 0.4,
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '700' }}>Complete Soul Scan</Text>
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
        <Text style={{ fontWeight: '600' }}>Back</Text>
      </Pressable>
    </ScrollView>
  );
}
