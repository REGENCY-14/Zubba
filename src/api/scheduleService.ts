import { api } from "../api/axios";
import { ApiResponse } from "../types/api.types";

export interface Schedule {
  id: string;
  customer_id: string;
  driver_id: string | null;
  pickup_address: string;
  pickup_location: {
    type: 'Point';
    coordinates: [number, number];
  };
  phone: string | null;
  note: string | null;
  frequency: 'one_time' | 'daily' | 'weekly' | 'monthly';
  scheduled_date: string;
  start_time: string | null;
  end_time: string | null;
  status: 'scheduled' | 'paused' | 'cancelled' | 'completed';
  estimated_price: number;
  created_at: string;
  updated_at: string;
  cancelled_at: string | null;
  processed_at: string | null;
  retry_count: number;
  last_error: string | null;
}

export interface CreateScheduleData {
  driver_id?: string | null;
  pickup_address: string;
  pickup_location: {
    type: "Point";
    coordinates: [number, number];
  };
  phone?: string | null;
  note?: string | null;
  frequency?: "one_time" | "daily" | "weekly" | "monthly";
  scheduled_date: string;
  start_time?: string | null;
  end_time?: string | null;
  estimated_price?: number;
}

export const scheduleService = {
  createSchedule: async (data: CreateScheduleData) => {
    const response = await api.post<ApiResponse<{ schedule: Schedule }>>(
      "/schedules",
      data,
    );
    return response.data;
  },

  getSchedules: async (params?: {
    year?: number;
    month?: number;
    day?: number;
    limit?: number;
    page?: number;
  }) => {
    const response = await api.get<
      ApiResponse<{
        items: Schedule[];
        metadata: {
          total: number;
          pages: number;
          current_page: number;
          limit: number;
        };
      }>
    >("/schedules", { params });
    return response.data;
  },

  getSchedule: async (id: string) => {
    const response = await api.get<ApiResponse<{ schedule: Schedule }>>(
      `/schedules/${id}`,
    );
    return response.data;
  },

  updateSchedule: async (id: string, data: Partial<CreateScheduleData>) => {
    const response = await api.patch<ApiResponse<{ schedule: Schedule }>>(
      `/schedules/${id}`,
      data,
    );
    return response.data;
  },

  updateScheduleStatus: async (
    id: string,
    status: "scheduled" | "paused" | "cancelled",
  ) => {
    const response = await api.patch<ApiResponse<{ schedule: Schedule }>>(
      `/schedules/${id}/status`,
      { status },
    );
    return response.data;
  },

  retrySchedule: async (id: string) => {
    const response = await api.post<ApiResponse<{ processed: boolean }>>(
      `/schedules/${id}/retry`,
    );
    return response.data;
  },

  deleteSchedule: async (id: string) => {
    const response = await api.delete<ApiResponse<{ message: string }>>(
      `/schedules/${id}`,
    );
    return response.data;
  },
};
