import { api } from "./axios";
import { ApiResponse } from "../types/api.types";

export const subscriptionService = {
  verifyGoogle: async (payload: { purchaseToken: string; productId: string; packageName?: string }) => {
    const { data } = await api.post<ApiResponse<{ isActive: boolean }>>("/subscriptions/google/verify", payload);
    return data;
  },
  getMySubscription: async () => {
    const { data } = await api.get<ApiResponse<{ subscription: unknown }>>("/subscriptions/me");
    return data;
  },
};
