import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { getBossById } from '../src/domain/bosses';
import { getRoomById } from '../src/domain/rooms';
import { usePlayerStore } from '../src/state/usePlayerStore';
import { colors, styles } from '../src/ui/theme';

export default function BossResultScreen() {
  const router = useRouter();

  const result = usePlayerStore((state) => state.lastBossResult);
  const clear = usePlayerStore((state) => state.clearLastBossResult);
  const reset = usePlayerStore((state) => state.reset);

  if (!result) {
    return (
      <View style={styles.screenCenter}>
        <Text style={styles.heading}>
          No reflection result found
        </Text>

        <Pressable
          onPress={() => router.replace('/(tabs)/explore')}
          style={[styles.button, { minWidth: 180 }]}
        >
          <Text style={styles.buttonText}>Return to Map</Text>
        </Pressable>
      </View>
    );
  }

  const boss = getBossById(result.bossId);
  const unlockedRoom = result.unlockedRoomId
    ? getRoomById(result.unlockedRoomId)
    : null;

  const continueToNext = () => {
    const nextRoomId = result.unlockedRoomId;
    clear();

    if (nextRoomId) {
      router.replace({
        pathname: '/room/[id]',
        params: { id: nextRoomId },
      });
      return;
    }

    router.replace('/(tabs)/explore');
  };

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.eyebrow}>Integration complete</Text>
      <Text style={styles.title}>Reflection Integrated</Text>

      <View style={styles.panelRaised}>
        <Text style={[styles.heading, { color: colors.accentStrong }]}>
          {boss ? `${boss.title} - ${boss.name}` : result.bossId}
        </Text>
        <Text style={styles.body}>
          {boss
            ? `You integrated ${boss.title} and carried its reflection forward.`
            : 'You integrated the reflection and carried it forward.'}
        </Text>
        {boss && <Text style={styles.body}>Reflection: {boss.represents}</Text>}
        <Text style={styles.statText}>XP gained: {result.rewardXP}</Text>
        <Text style={styles.subtle}>
          Completed: {result.completedAt}
        </Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.heading}>Progression</Text>
        {unlockedRoom ? (
          <>
            <Text style={styles.body}>Next room unlocked</Text>
            <Text style={[styles.heading, { color: colors.success }]}>
              {unlockedRoom.name}
            </Text>
            <Text style={styles.body}>{unlockedRoom.description}</Text>
          </>
        ) : (
          <View style={{ gap: 6 }}>
            <Text style={styles.heading}>
              {result.isEndOfV1 ? 'Current journey complete' : 'No new room unlocked'}
            </Text>
            <Text style={styles.body}>
              {result.isEndOfV1
                ? 'You have completed the V1 path. Return to the map to review your progress or reset when you want to begin again.'
                : 'Return to the map to continue reviewing your progress.'}
            </Text>
          </View>
        )}
      </View>

      <Pressable
        onPress={continueToNext}
        style={[styles.button, styles.buttonPrimary]}
      >
        <Text style={styles.buttonTextAccent}>
          {unlockedRoom ? 'Enter Next Room' : 'Return to Map'}
        </Text>
      </Pressable>

      {unlockedRoom && (
        <Pressable
          onPress={() => {
            clear();
            router.replace('/(tabs)/explore');
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Return to Map</Text>
        </Pressable>
      )}

      {result.isEndOfV1 && (
        <Pressable
          onPress={() => {
            clear();
            void reset().then(() => router.replace('/(tabs)'));
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Restart Journey</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}
