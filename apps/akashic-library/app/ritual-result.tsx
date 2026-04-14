import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { getStatName } from '../src/domain/stats';
import { usePlayerStore } from '../src/state/usePlayerStore';
import { colors, styles } from '../src/ui/theme';

export default function RitualResultScreen() {
  const router = useRouter();

  const result = usePlayerStore((state) => state.lastRitualResult);
  const clear = usePlayerStore((state) => state.clearLastRitualResult);

  if (!result) {
    return (
      <View style={styles.screenCenter}>
        <Text style={styles.heading}>
          No ritual result found
        </Text>

        <Pressable
          onPress={() => router.back()}
          style={[styles.button, { minWidth: 180 }]}
        >
          <Text style={styles.buttonText}>Back</Text>
        </Pressable>
      </View>
    );
  }

  const changedStats = Object.keys(result.after).filter((statId) => {
    const key = statId as keyof typeof result.after;
    return result.before[key] !== result.after[key];
  });

  return (
    <ScrollView
      contentContainerStyle={[
        styles.screen,
        {
          paddingBottom: 28,
        },
      ]}
    >
      <View style={{ gap: 8, alignItems: 'center' }}>
        <Text style={styles.eyebrow}>Ritual record</Text>
        <Text style={[styles.title, { textAlign: 'center' }]}>Ritual Complete</Text>

        <Text style={[styles.body, { textAlign: 'center' }]}>
          Your chosen path has altered your inner balance.
        </Text>
      </View>

      <View
        style={[
          styles.panelRaised,
          {
            gap: 12,
            borderColor: colors.accent,
            backgroundColor: 'rgba(185, 167, 255, 0.16)',
          },
        ]}
      >
        <Text style={styles.heading}>What Shifted</Text>

        {changedStats.length > 0 ? (
          changedStats.map((statId) => {
            const key = statId as keyof typeof result.after;
            const beforeValue = result.before[key];
            const afterValue = result.after[key];
            const delta = afterValue - beforeValue;

            return (
              <View
                key={statId}
                style={[
                  styles.dividerRow,
                  {
                    gap: 6,
                  },
                ]}
              >
                <View style={styles.row}>
                  <Text style={styles.heading}>{getStatName(key)}</Text>
                  <Text style={[styles.statText, { color: colors.success }]}>
                    {delta > 0 ? `+${delta}` : delta}
                  </Text>
                </View>
                <Text style={styles.body}>
                  {beforeValue} to {afterValue}
                </Text>
              </View>
            );
          })
        ) : (
          <Text style={styles.body}>No visible stat changes were recorded.</Text>
        )}
      </View>

      <View style={[styles.panel, { gap: 10 }]}>
        <Text style={styles.heading}>Current Totals</Text>

        {Object.entries(result.after).map(([statId, value]) => (
          <View
            key={statId}
            style={[
              styles.row,
              {
                paddingTop: 6,
                borderTopWidth: 1,
                borderTopColor: colors.border,
              },
            ]}
          >
            <Text style={styles.body}>
              {getStatName(statId as keyof typeof result.after)}
            </Text>
            <Text style={[styles.statText, { color: colors.accentStrong }]}>
              {value}
            </Text>
          </View>
        ))}
      </View>

      <Text style={[styles.subtle, { textAlign: 'center' }]}>
        Return to the room when you are ready to approach the reflection.
      </Text>

      <Pressable
        onPress={() => {
          clear();
          router.replace({
            pathname: '/room/[id]',
            params: { id: result.roomId },
          });
        }}
        style={[styles.button, styles.buttonPrimary]}
      >
        <Text style={styles.buttonTextAccent}>Return to Room</Text>
      </Pressable>
    </ScrollView>
  );
}
