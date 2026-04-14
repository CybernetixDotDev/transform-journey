import { StyleSheet } from 'react-native';
import type { ViewStyle } from 'react-native';

import type { RoomId } from '../domain/types';

export const colors = {
  background: '#090A12',
  surface: '#11131F',
  surfaceRaised: '#171A29',
  surfaceSoft: 'rgba(255,255,255,0.07)',
  border: 'rgba(216, 206, 255, 0.18)',
  borderStrong: 'rgba(216, 206, 255, 0.34)',
  text: '#F4F0FF',
  textMuted: '#BBB5D4',
  textSubtle: '#8F89AA',
  accent: '#B9A7FF',
  accentStrong: '#D9C8FF',
  gold: '#E8C77A',
  success: '#8EE6C4',
  locked: '#6F6888',
  shadow: '#05050A',
};

export const spacing = {
  screen: 18,
  panel: 14,
  gap: 14,
  tight: 8,
};

export const roomMoods: Record<RoomId, { accent: string; glow: string }> = {
  shadow_mirror_hall: {
    accent: '#B9A7FF',
    glow: 'rgba(185, 167, 255, 0.22)',
  },
  hall_of_echoes: {
    accent: '#8EDBFF',
    glow: 'rgba(142, 219, 255, 0.18)',
  },
  scarcity_vault: {
    accent: '#E8C77A',
    glow: 'rgba(232, 199, 122, 0.18)',
  },
};

export const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    padding: spacing.screen,
    gap: spacing.gap,
    backgroundColor: colors.background,
  },
  screenCenter: {
    flex: 1,
    padding: spacing.screen,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0,
  },
  body: {
    color: colors.textMuted,
    lineHeight: 22,
  },
  subtle: {
    color: colors.textSubtle,
    lineHeight: 20,
  },
  panel: {
    padding: spacing.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    gap: spacing.tight,
    backgroundColor: colors.surface,
  },
  panelRaised: {
    padding: spacing.panel,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 8,
    gap: spacing.tight,
    backgroundColor: colors.surfaceRaised,
  },
  heroPanel: {
    padding: 18,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 8,
    gap: 10,
    backgroundColor: colors.surfaceRaised,
  },
  accentPanel: {
    padding: spacing.panel,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 8,
    gap: spacing.tight,
    backgroundColor: 'rgba(185, 167, 255, 0.14)',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.tight,
  },
  dividerRow: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    backgroundColor: colors.surfaceSoft,
  },
  buttonPrimary: {
    backgroundColor: 'rgba(185, 167, 255, 0.18)',
    borderColor: colors.accent,
  },
  buttonText: {
    fontWeight: '700',
    color: colors.text,
  },
  buttonTextAccent: {
    fontWeight: '700',
    color: colors.accentStrong,
  },
  statText: {
    color: colors.text,
  },
});

export const disabledStyle = (disabled: boolean): ViewStyle => ({
  opacity: disabled ? 0.42 : 1,
});
