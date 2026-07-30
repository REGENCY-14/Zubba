import type { MapCoord } from "../components/maps/mapUtils";
import type { NearbyDriver } from "../types/driver.types";

export function getDriverCoord(driver: NearbyDriver | null | undefined): MapCoord | null {
  if (!driver || driver.latitude == null || driver.longitude == null) return null;
  return { latitude: driver.latitude, longitude: driver.longitude };
}

export function buildPickupParams(
  pickup: { latitude: number; longitude: number } | null | undefined,
  address?: string,
) {
  if (!pickup) return {};
  return {
    pickupLocation: { latitude: pickup.latitude, longitude: pickup.longitude },
    pickupAddress: address,
  };
}
