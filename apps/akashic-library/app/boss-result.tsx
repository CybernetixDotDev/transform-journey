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
    <ScrollView
      contentContainerStyle={[
        styles.screen,
        {
          paddingBottom: 28,
        },
      ]}
    >
      <View style={{ gap: 8, alignItems: 'center' }}>
        <Text style={styles.eyebrow}>Integration complete</Text>
        <Text style={[styles.title, { textAlign: 'center' }]}>
          Reflection Integrated
        </Text>
        <Text style={[styles.body, { textAlign: 'center' }]}>
          A part of the inner archive has been met and carried forward.
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
        <Text style={styles.eyebrow}>Reflection record</Text>
        <View style={{ gap: 6 }}>
          <Text style={[styles.heading, { color: colors.accentStrong }]}>
            {boss ? boss.title : result.bossId}
          </Text>
          {boss && <Text style={styles.subtle}>{boss.name}</Text>}
        </View>

        <Text style={styles.body}>
          {boss
            ? `You integrated ${boss.title} and carried its reflection forward.`
            : 'You integrated the reflection and carried it forward.'}
        </Text>

        {boss && (
          <View style={[styles.dividerRow, { gap: 6 }]}>
            <Text style={styles.eyebrow}>Represents</Text>
            <Text style={styles.body}>{boss.represents}</Text>
          </View>
        )}

        <View style={styles.row}>
          <Text style={styles.body}>XP gained</Text>
          <Text style={[styles.statText, { color: colors.success }]}>
            +{result.rewardXP}
          </Text>
        </View>

        <Text style={styles.subtle}>Completed: {result.completedAt}</Text>
      </View>

      <View style={[styles.panel, { gap: 12 }]}>
        <Text style={styles.heading}>
          {unlockedRoom ? 'A New Room Opens' : 'Journey State'}
        </Text>
        {unlockedRoom ? (
          <>
            <Text style={[styles.heading, { color: colors.success }]}>
              {unlockedRoom.name}
            </Text>
            <Text style={styles.body}>{unlockedRoom.description}</Text>
            <Text style={styles.subtle}>
              You can enter now or return to the map to review the archive.
            </Text>
          </>
        ) : (
          <View style={{ gap: 8 }}>
            <Text
              style={[
                styles.heading,
                { color: result.isEndOfV1 ? colors.gold : colors.text },
              ]}
            >
              {result.isEndOfV1 ? 'Current journey complete' : 'No new room unlocked'}
            </Text>
            <Text style={styles.body}>
              {result.isEndOfV1
                ? 'You have completed the V1 path. The archive is quiet for now; return to the map to review your progress or restart when you are ready.'
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
