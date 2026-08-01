import axios from "axios";
import { store } from "../store";
import { logout, updateAccessToken } from "../slices/auth/authSlice";
import { env } from "../utils/env";
import { authStorage } from "../utils/authStorage";
import { ApiResponse } from "../types/api.types";

export const api = axios.create({
  baseURL: env.apiUrl,
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token.trim()}`;
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (!original || original._retry || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    original._retry = true;
    const refreshToken = store.getState().auth.refreshToken;
    if (!refreshToken) {
      await authStorage.clear();
      store.dispatch(logout());
      return Promise.reject(error);
    }

    if (!refreshPromise) {
      refreshPromise = axios
        .post<ApiResponse<{ accessToken: string }>>(
          `${env.apiUrl}/auth/refresh-token`,
          { refreshToken },
        )
        .then((res) => {
          const accessToken = res.data.data.accessToken;
          store.dispatch(updateAccessToken(accessToken));
          const stored = authStorage.get();
          return stored.then((s) => {
            if (s) {
              authStorage.save({
                userId: s.userId,
                accessToken,
                refreshToken: s.refreshToken,
                lastAuthenticatedAt: s.lastAuthenticatedAt,
              });
            }
            return accessToken;
          });
        })
        .catch(async () => {
          await authStorage.clear();
          store.dispatch(logout());
          return null;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    const newToken = await refreshPromise;
    if (!newToken) return Promise.reject(error);

    original.headers.Authorization = `Bearer ${newToken.trim()}`;
    return api(original);
  },
);
