import { api } from "./axios";
import { ApiResponse } from "../types/api.types";

export type SubscriptionPlan = {
  id: string;
  name: string;
  description?: { features?: string[] };
  interval: string;
  amount: string;
  amount_saved?: number | null;
  plan_code: string;
};

export const subscriptionService = {
  verifyGoogle: async (payload: { purchaseToken: string; productId: string; packageName?: string }) => {
    const { data } = await api.post<ApiResponse<{ isActive: boolean }>>("/subscriptions/google/verify", payload);
    return data;
  },
  getMySubscription: async () => {
    const { data } = await api.get<ApiResponse<{ subscription: unknown }>>("/subscriptions/me");
    return data;
  },
  activateSubscription: async (payload: { reference: string; planCode: string }) => {
    const { data } = await api.post<ApiResponse<{ isActive: boolean }>>(
      "/payments/subscriptions/activate",
      payload,
    );
    return data;
  },
};

export const paymentPlansService = {
  getPlans: async () => {
    const { data } = await api.get<ApiResponse<SubscriptionPlan[]>>("/payments/plans");
    return data;
  },
};
