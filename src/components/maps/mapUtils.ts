export const MAP_DARK_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#1d2c4d" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8ec3b9" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a3646" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#304a7d" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0e1626" }] },
];

export const OSM_TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

export type MapCoord = { latitude: number; longitude: number };

export function parseGeoPoint(input: unknown): MapCoord | null {
  if (!input) return null;
  if (typeof input === "object" && input !== null && "latitude" in input && "longitude" in input) {
    const { latitude, longitude } = input as MapCoord;
    if (typeof latitude === "number" && typeof longitude === "number") return { latitude, longitude };
  }
  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input);
      const coords = parsed.coordinates ?? parsed;
      if (Array.isArray(coords) && coords.length >= 2) {
        return { latitude: coords[1], longitude: coords[0] };
      }
    } catch {
      return null;
    }
  }
  return null;
}

export function interpolateCoord(from: MapCoord, to: MapCoord, progress: number): MapCoord {
  const t = Math.min(1, Math.max(0, progress));
  return {
    latitude: from.latitude + (to.latitude - from.latitude) * t,
    longitude: from.longitude + (to.longitude - from.longitude) * t,
  };
}

export function formatDistance(meters: number) {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export function formatEta(seconds: number) {
  const mins = Math.max(1, Math.ceil(seconds / 60));
  return `${mins} min${mins === 1 ? "" : "s"}`;
}
