import { api } from "./axios";
import { ApiResponse } from "../types/api.types";

export type InitiatePickupPaymentPayload = {
  amount: number;
  phone: string;
  provider: string;
  requestId: string;
  email?: string;
  clientInitiated?: boolean;
  payment_method?: "mobile_money" | "card";
};

export type InitiatePickupPaymentResponse = {
  reference: string;
  amount: number;
  status: string;
  transaction_id?: string;
};

export type PaymentStatusResponse = {
  status: "pending" | "success" | "failed" | string;
  reference: string;
  amount?: number;
};

export const paymentService = {
  initPayment: async () => {
    const { data } = await api.post<ApiResponse<{ authorization_url: string }>>(`/payment/initialize`);
    return data;
  },
  verifyPayment: async (reference: string) => {
    const { data } = await api.get<ApiResponse<{}>>(`payments/verify/${reference}`);
    return data;
  },
  verifyPaymentStatus: async (reference: string) => {
    const { data } = await api.get<ApiResponse<PaymentStatusResponse>>(
      `/payments/status/${reference}`,
    );
    return data;
  },
  initiatePickupPayment: async (payload: InitiatePickupPaymentPayload) => {
    const { data } = await api.post<ApiResponse<InitiatePickupPaymentResponse>>(
      "/payments/mobile-money/initiate",
      {
        ...payload,
        clientInitiated: payload.clientInitiated ?? true,
      },
    );
    return data;
  },
  getSubscriptionPlans: async () => {
    const { data } = await api.get<ApiResponse<{}>>(`payments/plans`);
    return data;
  },
  subscribeToPlan: async (planCode: string, authorization: string) => {
    const { data } = await api.post<ApiResponse<{}>>(`/payment/initialize`, {
      planCode,
      authorization,
    });
    return data;
  },
};
