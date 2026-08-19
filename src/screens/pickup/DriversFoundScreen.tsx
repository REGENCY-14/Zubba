import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { AppBottomNav } from "../../components";
import type { RootStackScreenProps } from "../../navigation/types";
import PickupRequestModal from "../../components/ui/modals/PickupRequestModal";
import { useEffect, useMemo, useRef, useState } from "react";
import { NearbyDriver } from "../../types/driver.types";
import { useTheme } from "../../context/ThemeContext";
import { APP_DARK } from "../../constants/appDarkTheme";
import { scale, verticalScale, moderateScale } from "../../utils/scale";
import { LiveMapView, type DriverMapMarker } from "../../components/maps/LiveMapView";
import { useCurrentLocation } from "../../hooks/useCurrentLocation";
import { useRoutePolyline } from "../../hooks/useRoutePolyline";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { customerService } from "../../api/customerService";
import { requestService } from "../../api/requestService";
import { resetRequest, setRequest, setRequestDriver, setStatus } from "../../slices/request/requestSlice";
import { getDriverCoord } from "../../utils/pickupLocation";
import { toast } from "../../hooks/toast";
import { handleApiError } from "../../utils/handleApiError";

const TRACKING_POLL_MS = 4000;

const fallbackAvatar = require("../../../assets/avatar.jpg");

function DriverCard({
  driver,
  selected,
  onPress,
}: {
  driver: NearbyDriver;
  selected: boolean;
  onPress: () => void;
}) {
  const distanceLabel = `${(driver.distanceM / 1000).toFixed(1)}km away`;
  const etaLabel = `${driver.etaMinutes} min${driver.etaMinutes !== 1 ? "s" : ""}`;
  const { colors, isDark } = useTheme()

  return (
    <Pressable
      onPress={onPress}
      className="w-[248px] rounded-3xl p-4 gap-4"
      style={{ backgroundColor: isDark ? colors.card : colors.bg, borderWidth: 1, borderColor: selected ? (isDark ? APP_DARK.accentGreen : "#31973D") : colors.border }}
    >
      <View className="flex-row gap-4 items-center">
        <View style={{ backgroundColor: isDark ? APP_DARK.card : "#F4F4F5" }} className="w-16 h-16 rounded-xl items-center justify-center flex-shrink-0">
          <View className="w-[54px] h-[54px] rounded-full border-2 border-[#90FA96] overflow-hidden items-center justify-center bg-[#C7E0C9]">
            <Image
              source={
                driver.profilePicture
                  ? { uri: driver.profilePicture }
                  : fallbackAvatar
              }
              style={{ width: moderateScale(54), height: moderateScale(54) }}
              resizeMode="cover"
            />
          </View>
          <View
            className="absolute -bottom-0.5 -right-0.5 w-[22px] h-[22px] rounded-full bg-[#006B23] border-2 items-center justify-center"
            style={{ borderColor: isDark ? APP_DARK.card : "#F4F4F5" }}
          >
            <MaterialCommunityIcons
              name="check-decagram"
              size={13}
              color="#FFFFFF"
            />
          </View>
        </View>

        <View className="flex-1 gap-1">
          <View className="flex-row items-center gap-1.5 flex-wrap">
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{color: colors.text}}
              className="text-sm font-bold shrink"
            >
              {driver.name}
            </Text>
            {driver.isPremium && (
              <View style={{ backgroundColor: isDark ? APP_DARK.premiumButtonBg : "#FFE088" }} className="rounded-2xl px-1.5 py-0.5 border border-[#D4AF37]">
                <Text style={{ color: isDark ? APP_DARK.premiumLabelText : "#574500" }} className="text-[10px] tracking-[0.48px]">
                  Premium
                </Text>
              </View>
            )}
          </View>

          <View className="flex-row items-center gap-1">
            <MaterialCommunityIcons name="star" size={11} color={isDark ? APP_DARK.premiumLabelText : "#735C00"} />
            <Text
              style={{color: colors.text}}
              className="text-xs font-bold">
              {driver.rating}
            </Text>
            <Text
              style={{color: colors.text}}
              className="text-xs font-extrabold text-[#BECAB9]"> · </Text>
            <Text style={{ color: isDark ? APP_DARK.statusSuccessText : "#0D631B" }} className="text-sm font-bold uppercase">
              {driver.code ?? "—"}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{borderColor: colors.border}}
        className="flex-row justify-between items-center pt-3 border-t border-t-[#F1F5F9]">
        <View className="flex-row items-center gap-2">
          <MaterialCommunityIcons
            name="map-marker-radius-outline"
            size={16}
            color="#006B23"
          />
          <Text
              style={{color: colors.text}}
              className="text-sm font-bold tracking-[0.28px]">
            {distanceLabel}
          </Text>
        </View>
        <View style={{ backgroundColor: isDark ? APP_DARK.statusSuccessBg : "rgba(0,107,35,0.05)" }} className="rounded-lg px-2 py-0.5">
          <Text style={{ color: isDark ? APP_DARK.accentGreen : "#006B23" }} className="text-xs font-bold tracking-[0.48px]">
            {etaLabel}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export function DriversFoundScreen({
  navigation,
  route,
}: RootStackScreenProps<"DriversFound">) {
  const drivers: NearbyDriver[] = route.params?.drivers ?? [];
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const customer = useAppSelector((state) => state.customer);
  const request = useAppSelector((state) => state.request);
  const { coords: gpsCoords } = useCurrentLocation();
  const pickupCoords = route.params?.pickupLocation ?? gpsCoords;
  const pickupAddress = route.params?.pickupAddress ?? "Selected location";
  const { isDark, colors } = useTheme()
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [modalStep, setModalStep] = useState<"found_drivers" | "customer_requests" | "driver_accepts" | "on_the_way">("found_drivers");
  const [showModal, setShowModal] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const collapseAnim = useRef(new Animated.Value(0)).current;
  const arrivedHandledRef = useRef(false);
  const customerCancelledRef = useRef(false);

  const navHeight = 52 + Math.max(insets.bottom, 14) + 20;
  const activeDriver = previewIndex != null ? drivers[previewIndex] : null;
  const previewDriverCoord = getDriverCoord(activeDriver);
  const isPreviewing = previewIndex != null && !showModal;

  const setCollapsed_ = (next: boolean) => {
    setCollapsed(next);
    Animated.spring(collapseAnim, {
      toValue: next ? 1 : 0,
      useNativeDriver: true,
      friction: 9,
      tension: 80,
    }).start();
  };
  const toggleCollapsed = () => setCollapsed_(!collapsed);

  const handleDriverPress = (index: number) => {
    if (previewIndex === index) {
      submitRequest();
      return;
    }
    setPreviewIndex(index);
  };

  const handleMarkerPress = (id: string) => {
    const index = drivers.findIndex((d) => d.id === id);
    if (index < 0) return;
    if (collapsed) setCollapsed_(false);
    handleDriverPress(index);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalStep("found_drivers");
  };

  const showPreviewRoute = isPreviewing && previewDriverCoord != null;

  // Fetch the route once from a fixed origin (the selected driver's actual
  // reported position) rather than a constantly-moving interpolated
  // position, so we get one stable, real road-following polyline to draw.
  const routeInfo = useRoutePolyline(showPreviewRoute ? previewDriverCoord : null, pickupCoords);

  const mapFitLocations = useMemo(() => {
    if (!pickupCoords) return undefined;
    if (showPreviewRoute && previewDriverCoord) return [pickupCoords, previewDriverCoord];
    return undefined;
  }, [pickupCoords, previewDriverCoord, showPreviewRoute]);

  // Every candidate driver plotted on the map while the rider is still
  // choosing -- tapping one previews/selects it, same as tapping its card.
  const driverMapMarkers: DriverMapMarker[] | undefined = useMemo(() => {
    return drivers.reduce<DriverMapMarker[]>((acc, d, i) => {
      const coord = getDriverCoord(d);
      if (coord) {
        acc.push({
          id: d.id,
          coordinate: coord,
          avatarUrl: d.profilePicture,
          name: d.name,
          selected: previewIndex === i,
        });
      }
      return acc;
    }, []);
  }, [drivers, previewIndex]);

  const submitRequest = async () => {
    if (!pickupCoords || !activeDriver) return;
    setModalStep("customer_requests");
    setShowModal(true);
    try {
      // Only the distance-based pickup price is known right now. The
      // service price depends on bag count, which the driver only logs
      // after arriving -- it isn't sent here, and the backend forces it
      // to 0 at creation regardless.
      const result = await customerService.requestTakeout({
        pickup_location: [pickupCoords.latitude, pickupCoords.longitude],
        pickup_address: pickupAddress,
        driver_id: activeDriver.id,
        distance_m: activeDriver.distanceM,
      });
      const requestResult = result.data.request;
      dispatch(
        setRequest({
          id: requestResult.id,
          customer_id: customer.id,
          pickup_location: [pickupCoords.latitude, pickupCoords.longitude].toString(),
          pickup_address: pickupAddress,
          payment_method: "",
          bags: Number(requestResult.bags ?? 0),
          distance_m: activeDriver.distanceM,
          pickup_price: Number(requestResult.pickup_price ?? activeDriver.cost),
          service_price: Number(requestResult.service_price ?? 0),
          collection_code: requestResult.collection_code,
          scheduleRequest: false,
          status: "pending",
        }),
      );
      dispatch(
        setRequestDriver({
          driver_id: activeDriver.id,
          name: activeDriver.name,
          avatar: activeDriver.profilePicture ?? "",
          code: activeDriver.code ?? "N/A",
          rating: activeDriver.rating,
          phone: requestResult.driver?.phone ?? null,
        }),
      );
      // The driver's real acceptance/progress is picked up by the tracking
      // poll below (driven by requestId once it's set on `request.id`) --
      // not simulated here.
    } catch {
      closeModal();
    }
  };

  // Polls the request's real status (set by the driver app) instead of
  // faking accepted/en_route/arrived with timers.
  useEffect(() => {
    if (!request.id || !showModal) return;

    let cancelled = false;

    const poll = async () => {
      try {
        const res = await customerService.getRequestTracking(request.id);
        if (cancelled || !res.success) return;
        const { status } = res.data as { status: string };

        if (status === "accepted" && modalStep !== "driver_accepts") {
          dispatch(setStatus("accepted"));
          setModalStep("driver_accepts");
        } else if (status === "en_route") {
          dispatch(setStatus("en_route"));
          setShowModal(false);
          navigation.replace("LiveTracking", { requestId: request.id });
        } else if (status === "arrived" && !arrivedHandledRef.current) {
          arrivedHandledRef.current = true;
          dispatch(setStatus("arrived"));
          setShowModal(false);
          navigation.replace("DriverArrives");
        } else if (status === "cancelled" && !customerCancelledRef.current) {
          toast.error("No drivers are currently available. Please try again shortly.");
          dispatch(resetRequest());
          closeModal();
        }
      } catch {
        // transient polling error — retry next tick
      }
    };

    poll();
    const interval = setInterval(poll, TRACKING_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [request.id, showModal, modalStep]);

  const cancelRequest = async () => {
    customerCancelledRef.current = true;
    try {
      await requestService.updateRequestStatus(request.id, "cancelled");
    } catch (err) {
      handleApiError(err);
    }
    dispatch(resetRequest());
    closeModal();
  };

  return (
    <SafeAreaView style={{backgroundColor: colors.bg}} className="flex-1" edges={["top", "left", "right", "bottom"]}>
      <LiveMapView
        pickupLocation={pickupCoords}
        centerOn={pickupCoords}
        driverLocation={null}
        driverMarkers={driverMapMarkers}
        onDriverMarkerPress={handleMarkerPress}
        routeCoordinates={
          showPreviewRoute && routeInfo.coordinates.length > 1 ? routeInfo.coordinates : []
        }
        fitToLocations={mapFitLocations}
        style={{ flex: 1 }}
      >
        <View style={{backgroundColor: colors.bg, borderColor: colors.border}} className="h-12 flex-row items-center justify-between px-4 border-b">
          <Pressable
            className="w-7 h-7 items-center justify-center"
            onPress={() => navigation.navigate("Home")}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={24}
              color={isDark ? colors.text : "#1F2A33"}
            />
          </Pressable>
          <Text style={{color: colors.textSub}} className="text-base font-bold">
            Drivers found
          </Text>
          <View className="w-7" />
        </View>

        <View style={{ flex: 1 }} />

        {!showModal && (
          <Animated.View
            style={{
              pointerEvents: collapsed ? "none" : "auto",
              position: "absolute",
              left: 0,
              right: 0,
              bottom: navHeight,
              borderRadius: moderateScale(22),
              padding: moderateScale(16),
              marginHorizontal: scale(8),
              backgroundColor: colors.surface,
              paddingTop: verticalScale(12),
              gap: moderateScale(16),
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 20,
              shadowOffset: { width: 0, height: -4 },
              elevation: 12,
              opacity: collapseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
              transform: [
                {
                  translateY: collapseAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 24] }),
                },
              ],
            }}
          >
            <Pressable onPress={toggleCollapsed} className="items-center">
              <View style={{backgroundColor: colors.bg}} className="w-10 h-1 rounded-full" />
            </Pressable>

            <View style={{borderColor: colors.border}} className="gap-6 py-6 rounded-2xl border">
              <View className="flex-row justify-between items-center px-6">
                <Text style={{color: colors.text}} className="text-lg font-bold">
                  Nearby Drivers
                </Text>
                <View className="flex-row items-center gap-2">
                  <View style={{borderColor: colors.border, backgroundColor: isDark ? APP_DARK.statusSuccessBg : "rgba(0,107,35,0.1)"}} className="flex-row items-center gap-2 border rounded-2xl px-3 py-1.5">
                    <View style={{ backgroundColor: isDark ? APP_DARK.accentGreen : "#31973D" }} className="w-2 h-2 rounded-full" />
                    <Text style={{ color: isDark ? APP_DARK.accentGreen : "#31973D" }} className="text-[13px] font-bold">
                      Live view
                    </Text>
                  </View>
                  <Pressable
                    onPress={toggleCollapsed}
                    style={{borderColor: colors.border}}
                    className="w-8 h-8 rounded-full border items-center justify-center"
                  >
                    <MaterialCommunityIcons name="chevron-down" size={18} color={colors.textSub} />
                  </Pressable>
                </View>
              </View>

              {drivers.length === 0 ? (
                <View className="items-center px-6 py-4">
                  <Text style={{color: colors.textSub}} className="text-sm">
                    No drivers found nearby right now.
                  </Text>
                </View>
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: scale(24), gap: scale(12) }}
                >
                  {drivers.map((driver, i) => (
                    <DriverCard
                      key={driver.id}
                      driver={driver}
                      selected={previewIndex === i}
                      onPress={() => handleDriverPress(i)}
                    />
                  ))}
                </ScrollView>
              )}
            </View>

            <View className="gap-3">
              <Text style={{ color: colors.textSub, textAlign: "center", fontSize: 13 }}>
                {previewIndex == null
                  ? "Tap a driver to preview route on the map"
                  : "Tap the selected driver again to confirm and request pickup"}
              </Text>
              <Pressable
                style={{borderColor: colors.border, backgroundColor: colors.bg}}
                className="h-12 rounded-full border flex-row items-center justify-center gap-2"
                onPress={() => navigation.navigate("Home")}
              >
                <MaterialCommunityIcons
                  name="close-circle"
                  size={16}
                  color={isDark ? APP_DARK.statusErrorText : "#EF4444"}
                />
                <Text style={{ color: isDark ? APP_DARK.statusErrorText : "#EF4444" }} className="text-sm font-bold">
                  Cancel pickup
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        )}

        {!showModal && (
          <Animated.View
            style={{
              pointerEvents: collapsed ? "auto" : "none",
              position: "absolute",
              right: scale(16),
              bottom: navHeight,
              width: moderateScale(52),
              height: moderateScale(52),
              borderRadius: moderateScale(26),
              backgroundColor: colors.surface,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOpacity: 0.15,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 4 },
              elevation: 12,
              opacity: collapseAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
              transform: [
                {
                  scale: collapseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }),
                },
              ],
            }}
          >
            <Pressable
              onPress={toggleCollapsed}
              className="w-full h-full items-center justify-center"
            >
              <MaterialCommunityIcons name="chevron-up" size={22} color={isDark ? APP_DARK.accentGreen : "#31973D"} />
              {drivers.length > 0 && (
                <View
                  style={{
                    position: "absolute",
                    top: -2,
                    right: -2,
                    minWidth: moderateScale(18),
                    height: moderateScale(18),
                    borderRadius: moderateScale(9),
                    backgroundColor: isDark ? APP_DARK.accentGreen : "#31973D",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingHorizontal: 3,
                  }}
                >
                  <Text style={{ color: "#FFFFFF", fontSize: moderateScale(10), fontWeight: "700" }}>
                    {drivers.length}
                  </Text>
                </View>
              )}
            </Pressable>
          </Animated.View>
        )}

        {showModal && modalStep !== "found_drivers" && activeDriver && (
          <PickupRequestModal
            visible={showModal}
            step={modalStep}
            avatar={fallbackAvatar}
            avatarUrl={activeDriver.profilePicture}
            isPremium={activeDriver.isPremium}
            name={activeDriver.name}
            rating={activeDriver.rating}
            code={activeDriver.code ?? "—"}
            cost={activeDriver.cost.toFixed(2)}
            onProceed={() => setModalStep("customer_requests")}
            onCancel={cancelRequest}
            onAssignedCancel={cancelRequest}
            animationType="none"
          />
        )}

        <AppBottomNav
          activeTab="home"
          paddingBottom={14}
          bottomOffset={8}
          navigation={navigation}
        />
      </LiveMapView>
    </SafeAreaView>
  );
}

export default DriversFoundScreen;