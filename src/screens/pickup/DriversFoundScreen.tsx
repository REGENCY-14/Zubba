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
import { scale, verticalScale, moderateScale } from "../../utils/scale";
import { LiveMapView } from "../../components/maps/LiveMapView";
import { useCurrentLocation } from "../../hooks/useCurrentLocation";
import { useRoutePolyline } from "../../hooks/useRoutePolyline";
import { interpolateCoord } from "../../components/maps/mapUtils";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { customerService } from "../../api/customerService";
import { requestService } from "../../api/requestService";
import { setRequest, setRequestDriver, setStatus } from "../../slices/request/requestSlice";
import { getDriverCoord } from "../../utils/pickupLocation";

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
      style={{ backgroundColor: isDark ? colors.card : colors.bg, borderWidth: 1, borderColor: selected ? "#31973D" : colors.border }}
    >
      <View className="flex-row gap-4 items-center">
        <View className="w-16 h-16 rounded-xl bg-[#F4F4F5] items-center justify-center flex-shrink-0">
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
          <View className="absolute -bottom-0.5 -right-0.5 w-[22px] h-[22px] rounded-full bg-[#006B23] border-2 border-white items-center justify-center">
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
              <View className="bg-[#FFE088] rounded-2xl px-1.5 py-0.5 border border-[#D4AF37]">
                <Text className="text-[10px] text-[#574500] tracking-[0.48px]">
                  Premium
                </Text>
              </View>
            )}
          </View>

          <View className="flex-row items-center gap-1">
            <MaterialCommunityIcons name="star" size={11} color="#735C00" />
            <Text
              style={{color: colors.text}}
              className="text-xs font-bold">
              {driver.rating}
            </Text>
            <Text
              style={{color: colors.text}}
              className="text-xs font-extrabold text-[#BECAB9]"> · </Text>
            <Text className="text-sm font-bold text-[#0D631B] uppercase">
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
        <View  className="bg-[rgba(0,107,35,0.05)] rounded-lg px-2 py-0.5">
          <Text className="text-xs font-bold text-[#006B23] tracking-[0.48px]">
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
  const { coords: gpsCoords } = useCurrentLocation();
  const pickupCoords = route.params?.pickupLocation ?? gpsCoords;
  const pickupAddress = route.params?.pickupAddress ?? "Selected location";
  const { isDark, colors } = useTheme()
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [modalStep, setModalStep] = useState<"found_drivers" | "customer_requests" | "driver_accepts" | "on_the_way">("found_drivers");
  const [showModal, setShowModal] = useState(false);
  const [simProgress, setSimProgress] = useState(0);
  const [driverStart, setDriverStart] = useState<{ latitude: number; longitude: number } | null>(null);
  const assignedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navHeight = 52 + Math.max(insets.bottom, 14) + 20;
  const activeDriver = previewIndex != null ? drivers[previewIndex] : null;
  const previewDriverCoord = getDriverCoord(activeDriver);
  const isPreviewing = previewIndex != null && !showModal;

  const handleDriverPress = (index: number) => {
    if (previewIndex === index) {
      submitRequest();
      return;
    }
    setPreviewIndex(index);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalStep("found_drivers");
  };

  useEffect(() => {
    return () => {
      if (assignedTimerRef.current) clearTimeout(assignedTimerRef.current);
    };
  }, []);

  const driverLocation =
    pickupCoords && driverStart
      ? interpolateCoord(driverStart, pickupCoords, simProgress)
      : driverStart ?? previewDriverCoord;
  const showPreviewRoute = isPreviewing && previewDriverCoord != null;
  const showEnRouteRoute = modalStep === "on_the_way";
  const routeCoords = useRoutePolyline(
    showPreviewRoute || showEnRouteRoute ? previewDriverCoord ?? driverLocation : null,
    pickupCoords,
  );
  const mapFitLocations = useMemo(() => {
    if (!pickupCoords) return undefined;
    if (showPreviewRoute && previewDriverCoord) return [pickupCoords, previewDriverCoord];
    if (showEnRouteRoute && driverLocation) return [pickupCoords, driverLocation];
    return undefined;
  }, [pickupCoords, previewDriverCoord, driverLocation, showPreviewRoute, showEnRouteRoute, previewIndex]);
  const distanceLabel = activeDriver
    ? `${((activeDriver.distanceM / 1000) * (1 - simProgress)).toFixed(1)} km`
    : "—";
  const etaLabel = activeDriver
    ? `${Math.max(1, Math.ceil((activeDriver.etaMinutes || 5) * (1 - simProgress)))} mins`
    : "—";

  const submitRequest = async () => {
    if (!pickupCoords || !activeDriver) return;
    setModalStep("customer_requests");
    setShowModal(true);
    try {
      const result = await customerService.requestTakeout({
        pickup_location: [pickupCoords.latitude, pickupCoords.longitude],
        pickup_address: pickupAddress,
        bags: 1,
        driver_id: activeDriver.id,
        distance_m: activeDriver.distanceM,
        pickup_price: activeDriver.cost,
        service_price: 5,
      });
      const requestResult = result.data.request;
      dispatch(
        setRequest({
          id: requestResult.id,
          customer_id: customer.id,
          pickup_location: [pickupCoords.latitude, pickupCoords.longitude].toString(),
          pickup_address: pickupAddress,
          payment_method: "",
          bags: 1,
          distance_m: activeDriver.distanceM,
          pickup_price: activeDriver.cost,
          service_price: 5,
          collection_code: requestResult.collection_code,
          scheduleRequest: false,
          status: "pending",
        }),
      );
      setTimeout(() => {
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
        dispatch(setStatus("accepted"));
        requestService.updateRequestStatus(requestResult.id, "accepted");
        setModalStep("driver_accepts");
        setTimeout(() => {
          dispatch(setStatus("en_route"));
          requestService.updateRequestStatus(requestResult.id, "en_route");
          const startCoord = getDriverCoord(activeDriver);
          setDriverStart(
            startCoord ?? {
              latitude: pickupCoords.latitude + 0.01,
              longitude: pickupCoords.longitude + 0.01,
            },
          );
          setModalStep("on_the_way");
          const started = Date.now();
          const interval = setInterval(() => {
            const progress = Math.min(1, (Date.now() - started) / 10000);
            setSimProgress(progress);
            if (progress >= 1) clearInterval(interval);
          }, 500);
          assignedTimerRef.current = setTimeout(() => {
            requestService.updateRequestStatus(requestResult.id, "arrived");
            navigation.replace("DriverArrives");
          }, 10000);
        }, 2000);
      }, 3000);
    } catch {
      closeModal();
    }
  };

  return (
    <SafeAreaView style={{backgroundColor: colors.bg}} className="flex-1" edges={["top", "left", "right", "bottom"]}>
      <LiveMapView
        pickupLocation={pickupCoords}
        centerOn={pickupCoords}
        driverLocation={
          showPreviewRoute || showEnRouteRoute ? previewDriverCoord ?? driverLocation : null
        }
        routeCoordinates={
          (showPreviewRoute || showEnRouteRoute) && routeCoords.length > 1 ? routeCoords : []
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
              color="#1F2A33"
            />
          </Pressable>
          <Text style={{color: colors.textSub}} className="text-base font-bold text-[#1F2A33]">
            Drivers found
          </Text>
          <View className="w-7" />
        </View>

        <View style={{ flex: 1 }} />

        {!showModal && (
          <Animated.View
            style={{
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
            }}
          >
            <View style={{backgroundColor: colors.bg}} className="w-10 h-1 rounded-full self-center" />

            <View style={{borderColor: colors.border}} className="gap-6 py-6 rounded-2xl border">
              <View className="flex-row justify-between items-center px-6">
                <Text style={{color: colors.text}} className="text-lg font-bold">
                  Nearby Drivers
                </Text>
                <View style={{borderColor: colors.border}} className="flex-row items-center gap-2 bg-[#006B23]/10 border rounded-2xl px-3 py-1.5">
                  <View className="w-2 h-2 rounded-full bg-[#31973D]" />
                  <Text className="text-[13px] font-bold text-[#31973D]">
                    Live view
                  </Text>
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
                  color="#EF4444"
                />
                <Text className="text-sm font-bold text-[#EF4444]">
                  Cancel pickup
                </Text>
              </Pressable>
            </View>
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
            distanceLabel={distanceLabel}
            etaLabel={etaLabel}
            onProceed={() => setModalStep("customer_requests")}
            onCancel={closeModal}
            onAssignedCancel={closeModal}
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