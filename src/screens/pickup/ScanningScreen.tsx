import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import type { RootStackScreenProps } from "../../navigation/types";
import { AppBottomNav } from "../../components";
import PickupRequestModal from "../../components/ui/modals/PickupRequestModal";
import CustomAppBar from "../../components/common/CustomAppBar";

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
  const spinValue = React.useRef(new Animated.Value(0)).current;
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [appBarText, setAppBarText] = useState("Scanning...");
  const [isPremium] = useState(false);
  const [modalStep, setModalStep] = useState<"request" | "assigned">("request");
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

    const apiTimer = setTimeout(() => {
      setIsLoading(false);
      animation.stop();
      setAppBarText("Driver Found");
      if (isPremium) {
        navigation.navigate("DriversFound");
      } else {
        setShowModal(true);
        setModalStep("request");
      }
    }, 3000);

    return () => {
      clearTimeout(apiTimer);
      animation.stop();
    };
  }, []);

  useEffect(() => {
    if (modalStep !== "assigned") return;

    assignedTimerRef.current = setTimeout(() => {
      assignedTimerRef.current = null;
      setShowModal(false);
      navigation.navigate("DriverArrives");
    }, 5000);

    return () => {
      if (assignedTimerRef.current) {
        clearTimeout(assignedTimerRef.current);
        assignedTimerRef.current = null;
      }
    };
  }, [modalStep, navigation]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <ImageBackground
        source={mapImage}
        className="flex-1 w-full h-full"
        resizeMode="cover"
      >
        <CustomAppBar
          title={appBarText}
          navigation={navigation}
        />

        <View
          style={{
            position: "absolute",
            width: SCAN_SIZE,
            height: SCAN_SIZE,
            top: SCAN_TOP,
            left: SCAN_LEFT,
          }}
          className="items-center justify-center"
        >
          <View
            style={{
              width: SCAN_SIZE,
              height: SCAN_SIZE,
              borderRadius: SCAN_SIZE / 2,
            }}
            className="absolute bg-[#34A853]/[0.12] items-center justify-center"
          >
            <View
              style={{ width: 270, height: 270, borderRadius: 135 }}
              className="absolute border-[0.5px] border-white/65"
            />
            <View
              style={{ width: 210, height: 210, borderRadius: 105 }}
              className="absolute border-[0.5px] border-white/65"
            />
            <View
              style={{ width: 150, height: 150, borderRadius: 75 }}
              className="absolute border-[0.5px] border-white/65"
            />
            <View
              style={{ width: 90, height: 90, borderRadius: 45 }}
              className="absolute border-[0.5px] border-white/65"
            />
            <View className="absolute w-[210px] h-[0.5px] bg-white/50" />
            <View className="absolute w-[0.5px] h-[210px] bg-white/50" />
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

          <View className="absolute items-center">
            <MaterialIcons name="location-on" size={28} color="#38A667" />
            <View className="w-[34px] h-[34px] rounded-full bg-[#34A853]/50 items-center justify-center mt-0.5">
              <View className="w-[17px] h-[17px] rounded-full bg-[#31973D]" />
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
            <Text className="text-[22px]">🛺</Text>
          </View>
        ))}

        <AppBottomNav
          activeTab="home"
          onHomePress={() => navigation.navigate("LocationSharing")}
          onSavedPress={() =>
            navigation.navigate("Details", { itemId: "save", title: "Saved" })
          }
          onSettingsPress={() => navigation.navigate("Settings")}
        />
        <PickupRequestModal
          visible={showModal}
          step={modalStep}
          avatar={avatar}
          onProceed={() => setModalStep("assigned")}
          onCancel={() => setShowModal(false)}
          onAssignedCancel={() => {
            if (assignedTimerRef.current) {
              clearTimeout(assignedTimerRef.current);
              assignedTimerRef.current = null;
            }
            setShowModal(false);
            navigation.navigate("LocationSharing");
          }}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}

export default ScanningScreen;
