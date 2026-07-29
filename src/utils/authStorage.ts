import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_KEY = "auth_state";
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export interface StoredAuth {
  userId: string;
  accessToken: string;
  refreshToken: string;
  lastAuthenticatedAt: string;
}

/** @deprecated Legacy shape kept for one-time migration reads */
interface LegacyStoredAuth {
  user?: { id: string };
  accessToken: string;
  refreshToken: string;
}

export const authStorage = {
  save: async (data: Omit<StoredAuth, "lastAuthenticatedAt"> & { lastAuthenticatedAt?: string }) => {
    const payload: StoredAuth = {
      userId: data.userId,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      lastAuthenticatedAt: data.lastAuthenticatedAt ?? new Date().toISOString(),
    };
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(payload));
  },

  get: async (): Promise<StoredAuth | null> => {
    const json = await AsyncStorage.getItem(AUTH_KEY);
    if (!json) return null;

    const parsed = JSON.parse(json) as StoredAuth | LegacyStoredAuth;

    if ("userId" in parsed && parsed.userId) {
      return parsed as StoredAuth;
    }

    const legacy = parsed as LegacyStoredAuth;
    if (legacy.user?.id && legacy.accessToken && legacy.refreshToken) {
      return {
        userId: legacy.user.id,
        accessToken: legacy.accessToken,
        refreshToken: legacy.refreshToken,
        lastAuthenticatedAt: new Date().toISOString(),
      };
    }

    return null;
  },

  isSessionValid: (stored: StoredAuth | null) => {
    if (!stored?.lastAuthenticatedAt) return false;
    const age = Date.now() - new Date(stored.lastAuthenticatedAt).getTime();
    return age <= SESSION_MAX_AGE_MS;
  },

  clear: async () => {
    await AsyncStorage.removeItem(AUTH_KEY);
  },
};
