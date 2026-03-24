import AsyncStorage from '@react-native-async-storage/async-storage';
import { CACHE_TTL_MS } from '../constants/config';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export const setCache = async <T>(key: string, data: T): Promise<void> => {
  const entry: CacheEntry<T> = { data, timestamp: Date.now() };
  await AsyncStorage.setItem(key, JSON.stringify(entry));
};

export const getCache = async <T>(key: string): Promise<T | null> => {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;

  try {
    const entry: CacheEntry<T> = JSON.parse(raw);
    const isExpired = Date.now() - entry.timestamp > CACHE_TTL_MS;

    if (isExpired) {
      await AsyncStorage.removeItem(key);
      return null;
    }

    return entry.data;
  } catch {
    await AsyncStorage.removeItem(key);
    return null;
  }
};
