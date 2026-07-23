import { api } from "./axios";
import { ApiResponse } from "../types/api.types";

export type DeviceSession = {
  id: string;
  device_name: string | null;
  platform: string | null;
  ip_address: string | null;
  last_active_at: string;
  created_at: string;
};

export const deviceService = {
  registerPushToken: async (payload: {
    expoPushToken: string;
    platform?: string;
    deviceName?: string;
    appVersion?: string;
  }) => {
    const { data } = await api.post<ApiResponse<unknown>>("/devices/register-push-token", payload);
    return data;
  },
  getSessions: async () => {
    const { data } = await api.get<ApiResponse<{ items: DeviceSession[] }>>("/devices/sessions");
    return data;
  },
  revokeSession: async (sessionId: string) => {
    const { data } = await api.delete<ApiResponse<unknown>>(`/devices/sessions/${sessionId}`);
    return data;
  },
};
