import React, { useMemo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_DEFAULT, UrlTile } from "react-native-maps";

import { useTheme } from "../../context/ThemeContext";
import {
  MAP_DARK_STYLE,
  OSM_TILE_URL,
  type MapCoord,
} from "./mapUtils";
import { useOsmTiles } from "../../hooks/useRoutePolyline";

type Props = {
  userLocation?: MapCoord | null;
  driverLocation?: MapCoord | null;
  routeCoordinates?: MapCoord[];
  style?: object;
  children?: React.ReactNode;
};

export function LiveMapView({
  userLocation,
  driverLocation,
  routeCoordinates = [],
  style,
  children,
}: Props) {
  const { isDark } = useTheme();
  const useOsm = useOsmTiles();

  const region = useMemo(() => {
    const points = [userLocation, driverLocation].filter(Boolean) as MapCoord[];
    if (!points.length) {
      return {
        latitude: 5.6037,
        longitude: -0.187,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }
    if (points.length === 1) {
      return {
        ...points[0],
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };
    }
    const lats = points.map((p) => p.latitude);
    const lngs = points.map((p) => p.longitude);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max(0.02, (maxLat - minLat) * 1.8),
      longitudeDelta: Math.max(0.02, (maxLng - minLng) * 1.8),
    };
  }, [userLocation, driverLocation]);

  return (
    <View style={[styles.container, style]}>
      <MapView
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_DEFAULT}
        initialRegion={region}
        region={region}
        customMapStyle={isDark && !useOsm ? MAP_DARK_STYLE : undefined}
        userInterfaceStyle={isDark ? "dark" : "light"}
        showsUserLocation={false}
        showsMyLocationButton={false}
        rotateEnabled={false}
      >
        {useOsm && (
          <UrlTile
            urlTemplate={OSM_TILE_URL}
            maximumZ={19}
            flipY={Platform.OS === "ios"}
            opacity={isDark ? 0.65 : 1}
          />
        )}

        {routeCoordinates.length > 1 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#31973D"
            strokeWidth={4}
          />
        )}

        {userLocation && (
          <Marker coordinate={userLocation} title="You" pinColor="#31973D" />
        )}

        {driverLocation && (
          <Marker coordinate={driverLocation} title="Driver" pinColor="#FE8235" />
        )}
      </MapView>

      {isDark && useOsm && <View pointerEvents="none" style={styles.darkOverlay} />}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: "hidden" },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 20, 30, 0.25)",
  },
});
