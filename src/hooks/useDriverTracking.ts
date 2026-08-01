import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { customerService } from "../api/customerService";
import {
  formatDistance,
  formatEta,
  interpolateCoord,
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

export function useDriverTracking(requestId?: string, simulate = false) {
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [simProgress, setSimProgress] = useState(0);
  const startDriverRef = useRef<MapCoord | null>(null);

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
        if (!startDriverRef.current && data.driver_location) {
          startDriverRef.current = parseGeoPoint(data.driver_location);
        }
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

  useEffect(() => {
    if (!simulate) return;
    const started = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - started;
      setSimProgress(Math.min(1, elapsed / 10000));
    }, 500);
    return () => clearInterval(timer);
  }, [simulate]);

  const driverLocation = useMemo(() => {
    if (!tracking?.pickup_location) return tracking?.driver_location ?? null;
    const start = startDriverRef.current ?? tracking.driver_location;
    if (!start) return null;
    if (!simulate || simProgress >= 1) return tracking.pickup_location;
    return interpolateCoord(start, tracking.pickup_location, simProgress);
  }, [tracking, simulate, simProgress]);

  const distanceRemainingM = useMemo(() => {
    if (!tracking?.pickup_location || !driverLocation) {
      return tracking?.distance_remaining_m ?? 0;
    }
    return Math.max(0, Math.round((tracking.distance_remaining_m ?? 0) * (1 - simProgress)));
  }, [tracking, driverLocation, simProgress]);

  const etaSeconds = useMemo(() => {
    return Math.max(30, Math.round((tracking?.eta_seconds ?? 300) * (1 - simProgress)));
  }, [tracking, simProgress]);

  return {
    tracking,
    userLocation: tracking?.pickup_location ?? null,
    driverLocation,
    distanceLabel: formatDistance(distanceRemainingM),
    etaLabel: formatEta(etaSeconds),
    simProgress,
    refresh: fetchTracking,
  };
}
