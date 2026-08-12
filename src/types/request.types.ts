export interface RequestTakeout {
  pickup_location: [number, number];
  pickup_address: string;
  driver_id?: string | null | undefined;
  distance_m?: number | undefined;
  // pickup_price is recomputed server-side from distance_m. service_price
  // and bags are only known once the driver arrives and logs the bag
  // count, so neither is sent at request time.
}

export interface GetRequestsQuery {
  limit: number;
  current_page: number;
  offset: number;
}

export type RequestStatus = "pending" | "paid" | "accepted" | "en_route" | "arrived" | "completed" | "cancelled";

export interface RequestDriverInfo {
  id: string;
  firstname: string | null;
  lastname: string | null;
  code: string | null;
  profile_picture: string | null;
  vehicle_plate: string | null;
  phone?: string | null;
  is_premium: boolean;
  rating: number;
  rating_count: number;
}

export interface RequestTransactionInfo {
  reference: string;
  payment_method: string | null;
  phone: string | null;
  provider_name: string | null;
  paid_at: string | null;
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
  transaction_reference: string | null;
  payment_date: string | null;
  created_at: string;
  accepted_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  cancel_reason: string | null;
  schedule_id: string | null;
  transaction: RequestTransactionInfo | null;
  driver: RequestDriverInfo | null;
}
