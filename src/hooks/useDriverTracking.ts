import { useCallback, useEffect, useState } from "react";

import { customerService } from "../api/customerService";
import {
  formatDistance,
  formatEta,
  parseGeoPoint,
  type MapCoord,
} from "../components/maps/mapUtils";

export type TrackingData = {
  status: string;
  pickup_location: MapCoord | null;
  driver_location: MapCoord | null;
  distance_remaining_m: number;
  eta_seconds: number;
  driver?: {
    id: string;
    name: string;
    profile_picture?: string | null;
    code?: string | null;
    rating?: number;
  } | null;
};

export function useDriverTracking(requestId?: string) {
  const [tracking, setTracking] = useState<TrackingData | null>(null);

  const fetchTracking = useCallback(async () => {
    if (!requestId) return;
    try {
      const res = await customerService.getRequestTracking(requestId);
      if (res.success) {
        const data = res.data as TrackingData;
        setTracking({
          ...data,
          pickup_location: parseGeoPoint(data.pickup_location),
          driver_location: parseGeoPoint(data.driver_location),
        });
      }
    } catch {
      // polling errors are non-fatal
    }
  }, [requestId]);

  useEffect(() => {
    if (!requestId) return;
    fetchTracking();
    const id = setInterval(fetchTracking, 4000);
    return () => clearInterval(id);
  }, [fetchTracking, requestId]);

  const driverLocation = tracking?.driver_location ?? null;

  return {
    tracking,
    userLocation: tracking?.pickup_location ?? null,
    driverLocation,
    distanceLabel: formatDistance(tracking?.distance_remaining_m ?? 0),
    etaLabel: formatEta(tracking?.eta_seconds ?? 0),
    refresh: fetchTracking,
  };
}
