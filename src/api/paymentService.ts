import { api } from "./axios";
import { ApiResponse } from "../types/api.types";

export const paymentService = {
  initPayment: async () => {
    const { data } = await api.post<ApiResponse<{ authorization_url: string }>>(`/payment/initialize`);
    return data;
  },
  verifyPayment: async (reference: string) => {
    const { data } = await api.get<ApiResponse<{}>>(`payments/verify/${reference}`)
    return data
  },
  getSubscriptionPlans: async () => {
    const { data } = await api.get<ApiResponse<{}>>(`payments/plans`)
    return data
  },
  subscribeToPlan: async (planCode: string, authorization: string) => {
    const { data } = await api.post<ApiResponse<{}>>(
        `/payment/initialize`,
        { planCode, authorization }
    );
    return data;
  },

};
