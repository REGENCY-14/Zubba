export interface RequestTakeout{
    pickup_location: [number, number];
    pickup_address: string;
    driver_id?: string | null | undefined;
    distance_m?: number | undefined;
    pickup_price?: number | undefined;
    service_price?: number | undefined;
    bags?: number;
}