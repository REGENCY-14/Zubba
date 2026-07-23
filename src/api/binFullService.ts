import { api } from "./axios";
import { ApiResponse } from "../types/api.types";

export const binFullService = {
  getStatus: async () => {
    const { data } = await api.get<ApiResponse<{ is_active: boolean; request_id: string | null }>>(
      "/customers/bin-full/status",
    );
    return data;
  },
  setSignal: async (payload: {
    isActive: boolean;
    pickupAddress?: string;
    pickupLocation?: { type: "Point"; coordinates: [number, number] };
  }) => {
    const { data } = await api.post<ApiResponse<unknown>>("/customers/bin-full", payload);
    return data;
  },
};
