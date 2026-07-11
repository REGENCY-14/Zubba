import axios from "axios";
import { store } from "../store";
import { config } from "dotenv"

export const api = axios.create({
  baseURL: (globalThis as any).process?.env?.EXPO_PUBLIC_API_URL,
});

api.interceptors.request.use(config => {
  const token = store.getState().auth.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token.trim()}`;
  }

  return config;
});