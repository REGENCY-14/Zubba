import { api } from "./axios";
import { ApiResponse } from "../types/api.types";

export const walletService = {
  getWallet: async () => {
    const { data } = await api.get<ApiResponse<{ wallet: { available_balance: number } }>>("/wallet");
    return data;
  },
  getTransactions: async (params?: { page?: number; limit?: number }) => {
    const { data } = await api.get<ApiResponse<{ items: unknown[] }>>("/wallet/transactions", { params });
    return data;
  },
  initiateDeposit: async (payload: { amount: number; phone: string; provider?: string; email?: string }) => {
    const { data } = await api.post<ApiResponse<{ reference: string }>>("/wallet/deposit/initiate", payload);
    return data;
  },
  withdraw: async (payload: { amount: number; phone: string; provider?: string; name?: string }) => {
    const { data } = await api.post<ApiResponse<unknown>>("/wallet/withdraw", payload);
    return data;
  },
  payForRequest: async (requestId: string) => {
    const { data } = await api.post<ApiResponse<{ status: string }>>("/payments/wallet/pay", { requestId });
    return data;
  },
};
