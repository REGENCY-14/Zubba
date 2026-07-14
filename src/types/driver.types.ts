export interface NearbyDriver {
  id: string;
  name: string;
  code: string | null;
  profilePicture: string | null;
  rating: number;
  isPremium: boolean;
  ratingCount: number;
  distanceM: number;
  etaMinutes: number;
  cost: number;
}

export interface NearbyDriversParams {
  lat: number;
  lng: number;
  radius?: number;
  isPremium?: boolean;
}