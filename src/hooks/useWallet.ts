import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { walletService } from "../api/walletService";

export type RawWalletTransaction = {
  id?: string;
  transaction_type?: string;
  amount?: number | string;
  created_at?: string;
  status?: string;
  [key: string]: unknown;
};

export type WalletTransactionsParams = {
  page?: number;
  limit?: number;
};

export const walletKeys = {
  all: ["wallet"] as const,
  balance: () => [...walletKeys.all, "balance"] as const,
  transactions: (params?: WalletTransactionsParams) =>
    [...walletKeys.all, "transactions", params ?? {}] as const,
};

async function fetchWalletBalance(): Promise<number> {
  const res = await walletService.getWallet();
  if (res.success) {
    return res.data.wallet.available_balance;
  }
  return 0;
}

async function fetchWalletTransactions(
  params?: WalletTransactionsParams,
): Promise<RawWalletTransaction[]> {
  const res = await walletService.getTransactions(params);
  if (res.success && Array.isArray(res.data.items)) {
    return res.data.items as RawWalletTransaction[];
  }
  return [];
}

export function useWalletBalance() {
  return useQuery<number>({
    queryKey: walletKeys.balance(),
    queryFn: fetchWalletBalance,
    staleTime: 2 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    placeholderData: (previousData) => previousData,
  });
}

export function useWalletTransactions(params?: WalletTransactionsParams) {
  return useQuery<RawWalletTransaction[]>({
    queryKey: walletKeys.transactions(params),
    queryFn: () => fetchWalletTransactions(params),
    staleTime: 2 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    placeholderData: keepPreviousData,
  });
}

export function useInvalidateWallet() {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: walletKeys.all,
      refetchType: "all",
    });
}
