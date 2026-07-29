import { useEffect, useState } from "react";
import { Platform } from "react-native";
import type { MapCoord } from "./mapUtils";

export function useRoutePolyline(from: MapCoord | null, to: MapCoord | null) {
  const [coordinates, setCoordinates] = useState<MapCoord[]>([]);

  useEffect(() => {
    if (!from || !to) {
      setCoordinates([]);
      return;
    }

    let cancelled = false;

    const fetchRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${from.longitude},${from.latitude};${to.longitude},${to.latitude}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const json = await res.json();
        const coords: MapCoord[] =
          json?.routes?.[0]?.geometry?.coordinates?.map(([lng, lat]: [number, number]) => ({
            latitude: lat,
            longitude: lng,
          })) ?? [];

        if (!cancelled) {
          setCoordinates(coords.length ? coords : [from, to]);
        }
      } catch {
        if (!cancelled) setCoordinates([from, to]);
      }
    };

    fetchRoute();
    return () => {
      cancelled = true;
    };
  }, [from?.latitude, from?.longitude, to?.latitude, to?.longitude]);

  return coordinates;
}

export function useOsmTiles() {
  return Platform.OS === "android";
}
