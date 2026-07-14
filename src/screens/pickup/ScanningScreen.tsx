import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  ImageBackground,
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
import { useAppSelector } from "../../hooks/useAppSelector";
import { useTheme } from "../../context/ThemeContext";
import { NearbyDriver } from "../../types/driver.types";
import { driverService } from "../../api/driverService";
import { customerService } from "../../api/customerService";
import { RequestTakeout } from "../../types/customer.types";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import {
  resetRequest,
  setRequest,
  setRequestDriver,
  setStatus,
} from "../../slices/request/requestSlice";
import { toast } from "../../hooks/toast";

const mapImage = require("../../../assets/RawMap.png");
const avatar = require("../../../assets/avatar.jpg");

const { width: screenW, height: screenH } = Dimensions.get("window");
const SCAN_SIZE = 330;
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
}: RootStackScreenProps<"Scanning">) {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const spinValue = React.useRef(new Animated.Value(0)).current;
  const [showModal, setShowModal] = useState(false);
  const [appBarText, setAppBarText] = useState("Scanning...");
  const customer = useAppSelector((state) => state.customer);
  const [driver, setDriver] = useState<NearbyDriver | null>(null);
  const isPremium = customer.is_premium;
  const { coords } = useCurrentLocation();
  const [modalStep, setModalStep] = useState<
    "" | "found_drivers" | "customer_requests" | "driver_accepts"
  >("");
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
      if (!coords) return;
      try {
        const res = await driverService.getNearbyDrivers({
          lat: coords.latitude,
          lng: coords.longitude,
          isPremium,
        });
        if (cancelled) return;

        const drivers = res.data.drivers;
        animation.stop();
        setAppBarText(drivers.length ? "Driver Found" : "No drivers nearby");

        if (isPremium) {
          navigation.navigate("DriversFound", { drivers });
        } else if (drivers.length > 0) {
          setDriver(drivers[0]);
          setModalStep("found_drivers");
          setShowModal(true);
        } else {
          navigation.navigate("Home");
        }
      } catch (err) {
        if (!cancelled) {
          animation.stop();
          navigation.navigate("Home");
        }
      }
    };

    scan();

    return () => {
      cancelled = true;
      animation.stop();
    };
  }, [coords]);

  const customer_requests = async () => {
    try {
      if (!coords || !driver) return;
      setModalStep("customer_requests");
      const requestTakeout: RequestTakeout = {
        pickup_location: [coords.latitude, coords.longitude],
        pickup_address: "Home",
        // bags: 1,
        driver_id: driver.id,
        distance_m: driver.distanceM,
        pickup_price: driver.cost,
        service_price: 5,
      };
      const result = await customerService.requestTakeout(requestTakeout);
      if (!result.success)
        toast.error("Failed to request takeout, please try again later");

      dispatch(
        setRequest({
          customer_id: customer.id,
          pickup_location: requestTakeout.pickup_location.toString(),
          pickup_address: requestTakeout.pickup_address,
          payment_method: "",
          bags: requestTakeout.bags,
          distance_m: requestTakeout.distance_m,
          pickup_price: requestTakeout.pickup_price,
          service_price: requestTakeout.service_price,
          collection_code: result.data.collection_code,
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
          }),
        );
        dispatch(setStatus("accepted"));
        setModalStep("driver_accepts");
      }, 3000);
    } catch (err) {
      dispatch(resetRequest());
      console.error(err);
    }
  };

  useEffect(() => {
    if (modalStep !== "driver_accepts") return;
    assignedTimerRef.current = setTimeout(() => {
      assignedTimerRef.current = null;
      setShowModal(false);
      navigation.navigate("DriverArrives");
    }, 5000);
    return () => {
      if (assignedTimerRef.current) clearTimeout(assignedTimerRef.current);
    };
  }, [modalStep, navigation]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.bg }}
      edges={["top", "left", "right"]}
    >
      <ImageBackground
        source={mapImage}
        style={{ flex: 1, width: "100%", height: "100%" }}
        resizeMode="cover"
      >
        <CustomAppBar title={appBarText} navigation={navigation} />

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
                width: 270,
                height: 270,
                borderRadius: 135,
                position: "absolute",
                borderWidth: 0.5,
                borderColor: "rgba(255,255,255,0.65)",
              }}
            />
            <View
              style={{
                width: 210,
                height: 210,
                borderRadius: 105,
                position: "absolute",
                borderWidth: 0.5,
                borderColor: "rgba(255,255,255,0.65)",
              }}
            />
            <View
              style={{
                width: 150,
                height: 150,
                borderRadius: 75,
                position: "absolute",
                borderWidth: 0.5,
                borderColor: "rgba(255,255,255,0.65)",
              }}
            />
            <View
              style={{
                width: 90,
                height: 90,
                borderRadius: 45,
                position: "absolute",
                borderWidth: 0.5,
                borderColor: "rgba(255,255,255,0.65)",
              }}
            />
            <View
              style={{
                position: "absolute",
                width: 210,
                height: 0.5,
                backgroundColor: "rgba(255,255,255,0.5)",
              }}
            />
            <View
              style={{
                position: "absolute",
                width: 0.5,
                height: 210,
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
            <MaterialIcons name="location-on" size={28} color="#38A667" />
            <View
              style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                backgroundColor: "rgba(52,168,83,0.5)",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 2,
              }}
            >
              <View
                style={{
                  width: 17,
                  height: 17,
                  borderRadius: 8.5,
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
            <Text style={{ fontSize: 22 }}>🛺</Text>
          </View>
        ))}

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
            cost={driver.cost.toFixed(2)}
            onProceed={customer_requests}
            onCancel={() => {
              navigation.pop();
              setShowModal(false);
            }}
            onAssignedCancel={() => {
              if (assignedTimerRef.current)
                clearTimeout(assignedTimerRef.current);
              setShowModal(false);
              navigation.navigate("Home");
            }}
          />
        )}
      </ImageBackground>
    </SafeAreaView>
  );
}

export default ScanningScreen;
