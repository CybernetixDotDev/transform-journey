import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { usePlayerStore } from '../src/state/usePlayerStore';
import { colors } from '../src/ui/theme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const hydrated = usePlayerStore((state) => state.hydrated);
  const hydrate = usePlayerStore((state) => state.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  // Block rendering until store is hydrated
  if (!hydrated) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <ThemeProvider
      value={{
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: colors.background,
          card: colors.surface,
          text: colors.text,
          border: colors.border,
          primary: colors.accent,
        },
      }}
    >
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
