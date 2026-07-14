export interface RequestState {
  customer_id: string;
  driver: DriverRequest;
  pickup_location: string;
  pickup_address: string;
  status: string;  
  payment_method: string;
  bags: number;
  distance_m: number;
  pickup_price: number;
  service_price: number;
  scheduleRequest: boolean;
}

export interface DriverRequest{
    driver_id: string
    name: string
    avatar: string
    code: string
    rating: number
}