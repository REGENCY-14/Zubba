export interface RequestTakeout{
    pickup_location: [number, number];
    pickup_address: string;
    customer_id: string;
    mass_kg?: string | null | undefined;
    status?: "pending" | "accepted" | "en_route" | "arrived" | "completed" | "cancelled" | undefined;
    driver_id?: string | null | undefined;
    distance_m?: number | undefined;
    pickup_price?: number | undefined;
    service_price?: number | undefined;
}