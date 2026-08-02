import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import type { RootStackScreenProps } from "../../navigation/types";
import { useCurrentLocation } from "../../hooks/useCurrentLocation";
import { AppBottomNav } from "../../components";
import PickupRequestModal from "../../components/ui/modals/PickupRequestModal";
import CustomAppBar from "../../components/common/CustomAppBar";
import { LiveMapView } from "../../components/maps/LiveMapView";
import { useRoutePolyline } from "../../hooks/useRoutePolyline";
import { interpolateCoord } from "../../components/maps/mapUtils";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useTheme } from "../../context/ThemeContext";
import { NearbyDriver } from "../../types/driver.types";
import { driverService } from "../../api/driverService";
import { customerService } from "../../api/customerService";
import { RequestTakeout } from "../../types/request.types";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import {
  resetRequest,
  setRequest,
  setRequestDriver,
  setStatus,
} from "../../slices/request/requestSlice";
import { toast } from "../../hooks/toast";
import { requestService } from "../../api/requestService";
import { handleApiError } from "../../utils/handleApiError";
import { moderateScale } from "../../utils/scale";
import { buildPickupParams, getDriverCoord } from "../../utils/pickupLocation";

const avatar = require("../../../assets/avatar.jpg");
const { width: screenW, height: screenH } = Dimensions.get("window");
const SCAN_SIZE = moderateScale(330);
const SCAN_LEFT = (screenW - SCAN_SIZE) / 2;
const SCAN_TOP = screenH * 0.14;

const TRICYCLES: { top: number; left: number; rotate: string }[] = [
  { top: SCAN_TOP - 40, left: screenW * 0.41, rotate: "-42deg" },
  { top: SCAN_TOP + 15, left: screenW * 0.82, rotate: "42deg" },
  { top: SCAN_TOP + 65, left: 18, rotate: "53deg" },
  { top: SCAN_TOP + 115, left: screenW * 0.56, rotate: "41deg" },
  { top: SCAN_TOP + 148, left: screenW * 0.27, rotate: "44deg" },
];

export function ScanningScreen({
  navigation,
  route,
}: RootStackScreenProps<"Scanning">) {
  const dispatch = useAppDispatch();
  const request = useAppSelector((state) => state.request);
  const spinValue = React.useRef(new Animated.Value(0)).current;
  const [showModal, setShowModal] = useState(false);
  const [appBarText, setAppBarText] = useState("Scanning...");
  const [scanComplete, setScanComplete] = useState(false);
  const customer = useAppSelector((state) => state.customer);
  const [driver, setDriver] = useState<NearbyDriver | null>(null);
  const [driverPhone, setDriverPhone] = React.useState<string | null>(null);
  const isPremium = customer.is_premium;
  const { coords: gpsCoords } = useCurrentLocation();
  const pickupCoords = route.params?.pickupLocation ?? gpsCoords;
  const pickupAddress = route.params?.pickupAddress ?? "Selected location";
  const { colors, isDark } = useTheme();
  const [modalStep, setModalStep] = useState<
    "" | "found_drivers" | "customer_requests" | "driver_accepts" | "on_the_way"
  >("");
  const [simProgress, setSimProgress] = useState(0);
  const [driverStart, setDriverStart] = useState<{ latitude: number; longitude: number } | null>(null);
  const assignedTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }),
    );
    animation.start();

    let cancelled = false;

    const scan = async () => {
      if (!pickupCoords) return;
      try {
        const res = await driverService.getNearbyDrivers({
          lat: pickupCoords.latitude,
          lng: pickupCoords.longitude,
          isPremium,
        });
        if (cancelled) return;

        const drivers = res.data.drivers;
        animation.stop();
        setScanComplete(true);
        setAppBarText(drivers.length ? "Driver Found" : "No drivers nearby");

        if (isPremium) {
          navigation.replace("DriversFound", {
            drivers,
            ...buildPickupParams(pickupCoords, pickupAddress),
          });
        } else if (drivers.length > 0) {
          setDriver(drivers[0]);
          setModalStep("found_drivers");
          setShowModal(true);
        } else {
          toast.error(
            "No drivers found within you vicinity.\nPlease try again later.",
          );
          navigation.replace("Home");
        }
      } catch (err: any) {
        if (!cancelled) {
          animation.stop();
          handleApiError(err);
          navigation.replace("Home");
        }
      }
    };

    scan();

    return () => {
      cancelled = true;
      animation.stop();
    };
  }, [pickupCoords, isPremium, navigation, pickupAddress]);

  const customer_requests = async () => {
    try {
      if (!pickupCoords || !driver) return;
      setModalStep("customer_requests");
      const requestTakeout: RequestTakeout = {
        pickup_location: [pickupCoords.latitude, pickupCoords.longitude],
        pickup_address: pickupAddress,
        bags: 1,
        driver_id: driver.id,
        distance_m: driver.distanceM,
        pickup_price: driver.cost,
        service_price: 5,
      };
      const result = await customerService.requestTakeout(requestTakeout);
      const requestResult = result.data.request;
      const assignedDriverPhone = requestResult.driver?.phone ?? null;
      setDriverPhone(assignedDriverPhone);
      if (!result.success) {
        toast.error("Failed to request takeout, please try again later");
      }

      dispatch(
        setRequest({
          id: requestResult.id,
          customer_id: customer.id,
          pickup_location: requestTakeout.pickup_location.toString(),
          pickup_address: requestTakeout.pickup_address,
          payment_method: "",
          bags: requestTakeout.bags ?? 0,
          distance_m: requestTakeout.distance_m,
          pickup_price: requestTakeout.pickup_price,
          service_price: requestTakeout.service_price,
          collection_code: requestResult.collection_code,
          scheduleRequest: false,
          status: "pending",
        }),
      );
      // have web socket confirm if driver accepts
      setTimeout(() => {
        dispatch(
          setRequestDriver({
            driver_id: driver.id,
            name: driver.name,
            avatar: driver.profilePicture ?? "",
            code: driver.code ?? "N/A",
            rating: driver.rating,
            phone: assignedDriverPhone,
          }),
        );
        dispatch(setStatus("accepted"));
        requestService.updateRequestStatus(requestResult.id, "accepted");
        setModalStep("driver_accepts");
        setTimeout(() => {
          dispatch(setStatus("en_route"));
          requestService.updateRequestStatus(requestResult.id, "en_route");
          if (pickupCoords) {
            const driverCoord = getDriverCoord(driver);
            setDriverStart(
              driverCoord ?? {
                latitude: pickupCoords.latitude + 0.01,
                longitude: pickupCoords.longitude + 0.01,
              },
            );
          }
          setModalStep("on_the_way");
          const started = Date.now();
          const interval = setInterval(() => {
            const progress = Math.min(1, (Date.now() - started) / 10000);
            setSimProgress(progress);
            if (progress >= 1) clearInterval(interval);
          }, 500);
          assignedTimerRef.current = setTimeout(() => {
            assignedTimerRef.current = null;
            requestService.updateRequestStatus(request.id || requestResult.id, "arrived");
            setShowModal(false);
            navigation.replace("DriverArrives");
          }, 10000);
        }, 2000);
      }, 3000);
    } catch (err) {
      dispatch(resetRequest());
      console.error(err);
    }
  };

  const cancelRequest = async () => {
    await requestService.updateRequestStatus(request.id, "cancelled");
    navigation.pop();
    setShowModal(false);
  };

  useEffect(() => {
    return () => {
      if (assignedTimerRef.current) clearTimeout(assignedTimerRef.current);
    };
  }, []);

  const previewDriverCoord = getDriverCoord(driver);
  const driverLocation =
    pickupCoords && driverStart
      ? interpolateCoord(driverStart, pickupCoords, simProgress)
      : driverStart ?? previewDriverCoord;

  const showPreviewRoute = scanComplete && driver && modalStep === "found_drivers";
  const showEnRouteRoute = modalStep === "on_the_way";
  const routeCoords = useRoutePolyline(
    showEnRouteRoute || showPreviewRoute ? driverLocation : null,
    pickupCoords,
  );

  const mapFitLocations =
    showPreviewRoute && pickupCoords && previewDriverCoord
      ? [pickupCoords, previewDriverCoord]
      : showEnRouteRoute && pickupCoords && driverLocation
        ? [pickupCoords, driverLocation]
        : undefined;
  const distanceLabel = driver ? `${(driver.distanceM / 1000 * (1 - simProgress)).toFixed(1)} km` : "—";
  const etaLabel = driver ? `${Math.max(1, Math.ceil((driver.etaMinutes || 5) * (1 - simProgress)))} mins` : "—";
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.bg }}
      edges={["top", "left", "right", "bottom"]}
    >
      <LiveMapView
        pickupLocation={pickupCoords}
        // Lock interactions while no driver is selected; keep map centered on user's pickup
        locked={!(request?.driver?.driver_id)}
        showCenteredUserMarker={true}
        centerOn={!(request?.driver?.driver_id) ? pickupCoords : pickupCoords}
        driverLocation={
          showPreviewRoute || showEnRouteRoute ? driverLocation ?? previewDriverCoord : null
        }
        routeCoordinates={
          (showPreviewRoute || showEnRouteRoute) && routeCoords.length > 1 ? routeCoords : []
        }
        fitToLocations={mapFitLocations}
      >
        <CustomAppBar title={appBarText} navigation={navigation} />
        {!scanComplete && (
        <>
        <View
          style={{
            position: "absolute",
            width: SCAN_SIZE,
            height: SCAN_SIZE,
            top: SCAN_TOP,
            left: SCAN_LEFT,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: SCAN_SIZE,
              height: SCAN_SIZE,
              borderRadius: SCAN_SIZE / 2,
              position: "absolute",
              backgroundColor: "rgba(52,168,83,0.12)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: moderateScale(270),
                height: moderateScale(270),
                borderRadius: moderateScale(135),
                position: "absolute",
                borderWidth: 0.5,
                borderColor: "rgba(255,255,255,0.65)",
              }}
            />
            <View
              style={{
                width: moderateScale(210),
                height: moderateScale(210),
                borderRadius: moderateScale(105),
                position: "absolute",
                borderWidth: 0.5,
                borderColor: "rgba(255,255,255,0.65)",
              }}
            />
            <View
              style={{
                width: moderateScale(150),
                height: moderateScale(150),
                borderRadius: moderateScale(75),
                position: "absolute",
                borderWidth: 0.5,
                borderColor: "rgba(255,255,255,0.65)",
              }}
            />
            <View
              style={{
                width: moderateScale(90),
                height: moderateScale(90),
                borderRadius: moderateScale(45),
                position: "absolute",
                borderWidth: 0.5,
                borderColor: "rgba(255,255,255,0.65)",
              }}
            />
            <View
              style={{
                position: "absolute",
                width: moderateScale(210),
                height: 0.5,
                backgroundColor: "rgba(255,255,255,0.5)",
              }}
            />
            <View
              style={{
                position: "absolute",
                width: 0.5,
                height: moderateScale(210),
                backgroundColor: "rgba(255,255,255,0.5)",
              }}
            />
          </View>

          <Animated.View
            style={[
              {
                position: "absolute",
                width: SCAN_SIZE,
                height: SCAN_SIZE,
                borderRadius: SCAN_SIZE / 2,
                borderWidth: 2,
                borderTopColor: "rgba(52,168,83,0.75)",
                borderRightColor: "transparent",
                borderBottomColor: "transparent",
                borderLeftColor: "transparent",
                transform: [{ rotate: spin }],
              },
            ]}
          />

          <View style={{ position: "absolute", alignItems: "center" }}>
            <MaterialIcons name="location-on" size={moderateScale(28)} color="#38A667" />
            <View
              style={{
                width: moderateScale(34),
                height: moderateScale(34),
                borderRadius: moderateScale(17),
                backgroundColor: "rgba(52,168,83,0.5)",
                alignItems: "center",
                justifyContent: "center",
                marginTop: moderateScale(2),
              }}
            >
              <View
                style={{
                  width: moderateScale(17),
                  height: moderateScale(17),
                  borderRadius: moderateScale(8.5),
                  backgroundColor: "#31973D",
                }}
              />
            </View>
          </View>
        </View>

        {TRICYCLES.map((t, i) => (
          <View
            key={i}
            style={{
              position: "absolute",
              top: t.top,
              left: t.left,
              transform: [{ rotate: t.rotate }],
            }}
          >
            <Text style={{ fontSize: moderateScale(22) }}>🛺</Text>
          </View>
        ))}
        </>
        )}

        <AppBottomNav activeTab="home" navigation={navigation} />
        {driver && (
          <PickupRequestModal
            visible={showModal}
            step={modalStep}
            avatar={require("../../../assets/avatar.jpg")}
            avatarUrl={driver.profilePicture}
            name={driver.name}
            rating={driver.rating}
            code={driver.code ?? "—"}
            phone={driverPhone ?? undefined}
            cost={driver.cost.toFixed(2)}
            distanceLabel={distanceLabel}
            etaLabel={etaLabel}
            onProceed={customer_requests}
            onCancel={cancelRequest}
            onAssignedCancel={() => {
              if (assignedTimerRef.current)
                clearTimeout(assignedTimerRef.current);
              setShowModal(false);
              navigation.replace("Home");
            }}
          />
        )}
      </LiveMapView>
    </SafeAreaView>
  );
}

export default ScanningScreen;
