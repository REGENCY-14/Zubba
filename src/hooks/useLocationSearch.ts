import { useEffect, useState } from "react";

import type { LocationSearchResult } from "../types/location.types";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const MIN_QUERY_LENGTH = 3;
const DEBOUNCE_MS = 400;

export function useLocationSearch(query: string, enabled: boolean) {
  const [results, setResults] = useState<LocationSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || query.trim().length < MIN_QUERY_LENGTH) {
      setResults([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          q: query.trim(),
          format: "json",
          addressdetails: "1",
          limit: "8",
          countrycodes: "gh",
        });
        const res = await fetch(`${NOMINATIM_URL}?${params}`, {
          headers: { "User-Agent": "Zubba/1.0" },
        });
        if (!res.ok) throw new Error("Search failed");
        const json = (await res.json()) as Array<{
          place_id: number;
          display_name: string;
          lat: string;
          lon: string;
        }>;
        if (cancelled) return;
        setResults(
          json.map((item) => ({
            id: String(item.place_id),
            label: item.display_name,
            latitude: Number(item.lat),
            longitude: Number(item.lon),
          })),
        );
      } catch {
        if (!cancelled) {
          setResults([]);
          setError("Could not search locations");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, enabled]);

  return { results, isLoading, error };
}
