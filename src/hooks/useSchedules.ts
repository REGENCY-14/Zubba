import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  scheduleService,
  Schedule as ApiSchedule,
} from "../api/scheduleService";
import {
  parseLocalDateString,
  reverseFrequencyMap,
} from "../constants/scheduleConstants";

export type ScheduleItem = {
  id: string;
  driver: string;
  driverId: string | null;
  date: string;
  timeRange: string;
  location: string;
  rawYear: number;
  rawMonth: number;
  rawDay: number | null;
  rawStartTime: string;
  rawEndTime: string;
  frequency: string;
  status: "scheduled" | "completed" | "cancelled" | "processing" | "failed";
  retryCount?: number;
  estimatedPrice?: number;
  lastError?: string;
};

export const scheduleKeys = {
  all: ["schedules"] as const,
  list: () => [...scheduleKeys.all, "list"] as const,
};

export function mapApiScheduleToItem(s: ApiSchedule): ScheduleItem {
  const date = parseLocalDateString(s.scheduled_date);

  let status: ScheduleItem["status"] = "scheduled";
  if (s.status === "completed") status = "completed";
  else if (s.status === "cancelled") status = "cancelled";
  else if (s.processed_at && s.status === "scheduled") status = "processing";
  else if (s.last_error && s.retry_count && s.retry_count > 0) status = "failed";

  return {
    id: s.id,
    driver: "Assigned driver",
    driverId: s.driver_id,
    date: date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    timeRange:
      s.start_time && s.end_time
        ? `${s.start_time} - ${s.end_time}`
        : s.start_time || s.end_time || "",
    location: s.pickup_address || "No location set",
    rawYear: date.getFullYear(),
    rawMonth: date.getMonth(),
    rawDay: date.getDate(),
    rawStartTime: s.start_time || "",
    rawEndTime: s.end_time || "",
    frequency: reverseFrequencyMap[s.frequency] || "One time pickup",
    status,
    retryCount: s.retry_count || 0,
    estimatedPrice: s.estimated_price || 15,
    lastError: s.last_error || undefined,
  };
}

async function fetchSchedules(): Promise<ScheduleItem[]> {
  const response = await scheduleService.getSchedules();
  if (!response.success || !response.data) return [];
  return response.data.items.map(mapApiScheduleToItem);
}

export function useSchedules() {
  return useQuery({
    queryKey: scheduleKeys.list(),
    queryFn: fetchSchedules,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useInvalidateSchedules() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
}
