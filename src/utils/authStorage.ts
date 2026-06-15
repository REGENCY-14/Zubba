import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../slices/auth/auth.types";

const AUTH_KEY = "auth_state";

export interface StoredAuth {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const authStorage = {
  save: async (data: StoredAuth) => {
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(data));
  },

  get: async (): Promise<StoredAuth | null> => {
    const json = await AsyncStorage.getItem(AUTH_KEY);
    return json ? JSON.parse(json) : null;
  },

  clear: async () => {
    await AsyncStorage.removeItem(AUTH_KEY);
  },
};