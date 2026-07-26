import axios from "axios";
import { store } from "../store";
import { env } from "../utils/env";

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
