import AsyncStorage from '@react-native-async-storage/async-storage';

import type { PlayerState } from '@/src/domain/types';

export const PLAYER_STATE_STORAGE_KEY = 'akashic.playerState.v1';

export async function loadPlayerState(): Promise<PlayerState | null> {
  try {
    const raw = await AsyncStorage.getItem(PLAYER_STATE_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<PlayerState>;
    if (parsed.version !== 1) return null;

    return parsed as PlayerState;
  } catch {
    return null;
  }
}

export async function savePlayerState(state: PlayerState): Promise<void> {
  await AsyncStorage.setItem(PLAYER_STATE_STORAGE_KEY, JSON.stringify(state));
}

export async function clearPlayerState(): Promise<void> {
  await AsyncStorage.removeItem(PLAYER_STATE_STORAGE_KEY);
}
