export interface RequestTakeout {
  pickup_location: [number, number];
  pickup_address: string;
  driver_id?: string | null | undefined;
  distance_m?: number | undefined;
  pickup_price?: number | undefined;
  service_price?: number | undefined;

  bags?: number;
}

export interface GetRequestsQuery {
  limit: number;
  current_page: number;
  offset: number;
}

export type RequestStatus = "pending" | "accepted" | "en_route" | "arrived" | "completed" | "cancelled";

export interface RequestDriverInfo {
  id: string;
  firstname: string | null;
  lastname: string | null;
  code: string | null;
  profile_picture: string | null;
  vehicle_plate: string | null;
  is_premium: boolean;
  rating: number;
  rating_count: number;
}

export interface CustomerRequestItem {
  id: string;
  customer_id: string;
  driver_id: string | null;
  pickup_location: string;
  pickup_address: string;
  status: RequestStatus;
  payment_method: string | null;
  bags: string | null;
  distance_m: number;
  pickup_price: string;
  service_price: string;
  collection_code: number;
  created_at: string;
  accepted_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  cancel_reason: string | null;
  schedule_id: string | null;
  driver: RequestDriverInfo | null;
}
