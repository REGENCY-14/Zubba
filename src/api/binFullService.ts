import { api } from "./axios";
import { ApiResponse } from "../types/api.types";

export type BinFullStatus = {
  is_active: boolean;
  request_id: string | null;
  retry_count: number;
  last_error: string | null;
};

export type BinFullSetResult = BinFullStatus & {
  immediateResult?: {
    assigned?: boolean;
    request?: unknown;
  };
};

export function normalizeBinFullStatus(data: unknown): BinFullStatus {
  const record =
    data && typeof data === "object" ? (data as Record<string, unknown>) : {};

  const isActive = record.is_active ?? record.isActive;

  return {
    is_active: Boolean(isActive),
    request_id: (record.request_id ?? record.requestId ?? null) as string | null,
    retry_count: Number(record.retry_count ?? record.retryCount ?? 0),
    last_error: (record.last_error ?? record.lastError ?? null) as string | null,
  };
}

export const binFullService = {
  getStatus: async () => {
    const { data } = await api.get<ApiResponse<BinFullStatus>>(
      "/customers/bin-full/status",
    );
    return data;
  },
  setSignal: async (payload: {
    isActive: boolean;
    pickupAddress?: string;
    pickupLocation?: { type: "Point"; coordinates: [number, number] };
  }) => {
    const { data } = await api.post<ApiResponse<BinFullSetResult>>(
      "/customers/bin-full",
      payload,
    );
    return data;
  },
};
