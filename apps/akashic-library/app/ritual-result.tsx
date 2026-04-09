import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { usePlayerStore } from '../src/state/usePlayerStore';

const STAT_LABELS: Record<string, string> = {
  might: 'Might',
  insight: 'Insight',
  will: 'Will',
  agility: 'Agility',
  attunement: 'Attunement',
};

export default function RitualResultScreen() {
  const router = useRouter();

  const result = usePlayerStore((s) => s.lastRitualResult);
  const clear = usePlayerStore((s) => s.clearLastRitualResult);

  if (!result) {
    return (
      <View
        style={{
          flex: 1,
          padding: 18,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: '700' }}>
          No ritual result found
        </Text>

        <Pressable
          onPress={() => router.back()}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 14,
            borderRadius: 12,
            borderWidth: 1,
            alignItems: 'center',
            minWidth: 180,
          }}
        >
          <Text style={{ fontWeight: '700' }}>Back</Text>
        </Pressable>
      </View>
    );
  }

  const changedStats = Object.keys(result.after).filter((stat) => {
    const key = stat as keyof typeof result.after;
    return result.before[key] !== result.after[key];
  });

  return (
    <ScrollView contentContainerStyle={{ padding: 18, gap: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: '700' }}>
        Ritual Complete ✨
      </Text>

      <Text style={{ opacity: 0.8 }}>
        Your chosen path has altered your inner balance.
      </Text>

      <View
        style={{
          padding: 14,
          borderWidth: 1,
          borderRadius: 12,
          gap: 10,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '700' }}>Changed Stats</Text>

        {changedStats.length > 0 ? (
          changedStats.map((stat) => {
            const key = stat as keyof typeof result.after;
            const beforeValue = result.before[key];
            const afterValue = result.after[key];
            const delta = afterValue - beforeValue;
            const label = STAT_LABELS[stat] ?? stat;

            return (
              <View
                key={stat}
                style={{
                  paddingVertical: 8,
                  borderTopWidth: 1,
                }}
              >
                <Text style={{ fontWeight: '700' }}>{label}</Text>
                <Text>
                  {beforeValue} → {afterValue} {delta > 0 ? `( +${delta} )` : `(${delta})`}
                </Text>
              </View>
            );
          })
        ) : (
          <Text style={{ opacity: 0.8 }}>No stat changes recorded.</Text>
        )}
      </View>

      <View
        style={{
          padding: 14,
          borderWidth: 1,
          borderRadius: 12,
          gap: 8,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '700' }}>Current Totals</Text>

        {Object.entries(result.after).map(([stat, value]) => (
          <Text key={stat}>
            {STAT_LABELS[stat] ?? stat}: {value}
          </Text>
        ))}
      </View>

      <Pressable
        onPress={() => {
          clear();
          router.replace({
            pathname: '/room/[id]',
            params: { id: result.roomId },
          });
        }}
        style={{
          paddingVertical: 12,
          paddingHorizontal: 14,
          borderRadius: 12,
          borderWidth: 1,
          alignItems: 'center',
        }}
      >
        <Text style={{ fontWeight: '700' }}>Return to Room</Text>
      </Pressable>
    </ScrollView>
  );
}