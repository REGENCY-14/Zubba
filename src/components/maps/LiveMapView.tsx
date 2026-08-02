import React, { useEffect, useMemo, useRef } from "react";
import { Platform, StyleSheet, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_DEFAULT, UrlTile } from "react-native-maps";

import { useTheme } from "../../context/ThemeContext";
import {
  DEFAULT_MAP_REGION,
  MAP_DARK_STYLE,
  MAP_EDGE_PADDING,
  OSM_TILE_URL,
  regionForCoord,
  regionForCoords,
  type MapCoord,
} from "./mapUtils";
import { useOsmTiles } from "../../hooks/useRoutePolyline";

type Props = {
  pickupLocation?: MapCoord | null;
  /** @deprecated use pickupLocation */
  userLocation?: MapCoord | null;
  driverLocation?: MapCoord | null;
  routeCoordinates?: MapCoord[];
  centerOn?: MapCoord | null;
  fitToLocations?: MapCoord[];
  style?: object;
  children?: React.ReactNode;
};

export function LiveMapView({
  pickupLocation,
  userLocation,
  driverLocation,
  routeCoordinates = [],
  centerOn,
  fitToLocations,
  style,
  children,
}: Props) {
  const { isDark } = useTheme();
  const useOsm = useOsmTiles();
  const mapRef = useRef<MapView>(null);
  const pickup = pickupLocation ?? userLocation ?? null;

  const mapRegion = useMemo(() => {
    if (centerOn) return regionForCoord(centerOn);

    const points = fitToLocations?.filter(Boolean) as MapCoord[] | undefined;
    if (points?.length) {
      if (points.length === 1) return regionForCoord(points[0]);
      return regionForCoords(points);
    }

    if (pickup) return regionForCoord(pickup);
    if (driverLocation) return regionForCoord(driverLocation);
    return DEFAULT_MAP_REGION;
  }, [
    centerOn?.latitude,
    centerOn?.longitude,
    driverLocation?.latitude,
    driverLocation?.longitude,
    fitToLocations?.[0]?.latitude,
    fitToLocations?.[0]?.longitude,
    fitToLocations?.[1]?.latitude,
    fitToLocations?.[1]?.longitude,
    fitToLocations?.length,
    pickup?.latitude,
    pickup?.longitude,
  ]);

  useEffect(() => {
    if (!centerOn || !mapRef.current) return;
    mapRef.current.animateToRegion(regionForCoord(centerOn), 600);
  }, [centerOn?.latitude, centerOn?.longitude]);

  useEffect(() => {
    const points = fitToLocations?.filter(Boolean) as MapCoord[] | undefined;
    if (!points?.length || !mapRef.current) return;

    if (points.length === 1) {
      mapRef.current.animateToRegion(regionForCoord(points[0]), 600);
      return;
    }

    mapRef.current.fitToCoordinates(points, {
      edgePadding: MAP_EDGE_PADDING,
      animated: true,
    });
  }, [fitToLocations?.[0]?.latitude, fitToLocations?.[0]?.longitude, fitToLocations?.[1]?.latitude, fitToLocations?.[1]?.longitude, fitToLocations?.length]);

  return (
    <View style={[styles.container, style]}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_DEFAULT}
        initialRegion={mapRegion}
        region={mapRegion}
        customMapStyle={isDark && !useOsm ? MAP_DARK_STYLE : undefined}
        userInterfaceStyle={isDark ? "dark" : "light"}
        showsUserLocation={false}
        showsMyLocationButton={false}
        rotateEnabled={false}
        scrollEnabled
        zoomEnabled
        pitchEnabled={false}
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

        {pickup && (
          <Marker coordinate={pickup} title="Pickup" pinColor="#31973D" />
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
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(10, 20, 30, 0.25)",
  },
});
