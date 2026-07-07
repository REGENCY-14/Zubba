import { api } from "./axios";
import { ApiResponse } from "../types/api.types";

export type ScheduleFrequency = "one_time" | "daily" | "weekly" | "monthly";
export type ScheduleStatus = "scheduled" | "paused" | "cancelled" | "completed";

export interface Schedule {
  id: string;
  driverId: string | null;
  pickupAddress: string;
  phone: string | null;
  note: string | null;
  frequency: ScheduleFrequency;
  scheduledDate: string;
  startTime: string | null;
  endTime: string | null;
  status: ScheduleStatus;
  estimatedPrice: number;
  createdAt: string;
}

export interface CreateScheduleInput {
  driver_id?: string;
  pickup_address: string;
  phone?: string;
  note?: string;
  frequency?: ScheduleFrequency;
  scheduled_date: string;
  start_time?: string;
  end_time?: string;
}

export type UpdateScheduleInput = Partial<CreateScheduleInput>;

export interface ScheduleListFilters {
  current_page?: number;
  limit?: number;
  year?: number;
  month?: number;
  day?: number;
}

export interface PaginationMetadata {
  total: number;
  pages: number;
  current_page: number;
  limit: number;
}

export const scheduleService = {
  createSchedule: async (payload: CreateScheduleInput) => {
    const { data } = await api.post<ApiResponse<{ schedule: Schedule }>>(
      `/schedules`,
      payload,
    );
    return data;
  },

  getSchedules: async (filters?: ScheduleListFilters) => {
    const { data } = await api.get<
      ApiResponse<{ schedules: Schedule[]; metadata: PaginationMetadata }>
    >(`/schedules`, { params: filters });
    return data;
  },

  getSchedule: async (scheduleId: string) => {
    const { data } = await api.get<ApiResponse<{ schedule: Schedule }>>(
      `/schedules/${scheduleId}`,
    );
    return data;
  },

  updateSchedule: async (scheduleId: string, payload: UpdateScheduleInput) => {
    const { data } = await api.patch<ApiResponse<{ schedule: Schedule }>>(
      `/schedules/${scheduleId}`,
      payload,
    );
    return data;
  },

  updateScheduleStatus: async (
    scheduleId: string,
    status: Exclude<ScheduleStatus, "completed">,
  ) => {
    const { data } = await api.patch<ApiResponse<{ schedule: Schedule }>>(
      `/schedules/${scheduleId}/status`,
      { status },
    );
    return data;
  },

  deleteSchedule: async (scheduleId: string) => {
    const { data } = await api.delete<ApiResponse<{}>>(
      `/schedules/${scheduleId}`,
    );
    return data;
  },
};
