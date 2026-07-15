import {
  Animated,
  Image,
  ImageBackground,
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
import { useEffect, useRef, useState } from "react";
import { NearbyDriver } from "../../types/driver.types";
import { useTheme } from "../../context/ThemeContext";

const mapImage = require("../../../assets/RawMap.png");
const mapDarkImage = require("../../../assets/RawMapDark1.png");
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
  const etaLabel = `${driver.etaMinutes} mins`;
  const { colors, isDark } = useTheme()

  return (
    <Pressable
      onPress={onPress}
      className="w-[248px] rounded-3xl p-4 gap-4 bg-white"
      style={{ borderWidth: 1, borderColor: selected ? "#31973D" : "#E2E8F0" }}
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
              style={{ width: 54, height: 54 }}
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
              className="text-sm font-bold text-[#1A1C1E] shrink"
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
            <Text className="text-xs font-bold text-[#1A1C1E]">
              {driver.rating}
            </Text>
            <Text className="text-xs font-extrabold text-[#BECAB9]"> · </Text>
            <Text className="text-sm font-bold text-[#0D631B] uppercase">
              {driver.code ?? "—"}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row justify-between items-center pt-3 border-t border-t-[#F1F5F9]">
        <View className="flex-row items-center gap-2">
          <MaterialCommunityIcons
            name="map-marker-radius-outline"
            size={16}
            color="#006B23"
          />
          <Text className="text-sm font-bold text-[#1A1C1E] tracking-[0.28px]">
            {distanceLabel}
          </Text>
        </View>
        <View className="bg-[rgba(0,107,35,0.05)] rounded-lg px-2 py-0.5">
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
  const { isDark, colors } = useTheme()
  const [selectedDriver, setSelectedDriver] = useState(0);
  const [modalStep, setModalStep] = useState<"found_drivers" | "customer_requests" | "driver_accepts">("found_drivers");
  const [showModal, setShowModal] = useState(false);
  const assignedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navHeight = 52 + Math.max(insets.bottom, 14) + 20;
  const activeDriver = drivers[selectedDriver];

  const closeModal = () => {
    setShowModal(false);
    setModalStep("found_drivers");
  };

  useEffect(() => {
    if (modalStep !== "driver_accepts") return;
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

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <ImageBackground
        source={isDark ? mapDarkImage : mapImage}
        style={{ flex: 1 }}
        resizeMode="cover"
        imageStyle={{ opacity: 0.8 }}
      >
        <View className="h-12 bg-white flex-row items-center justify-between px-4 border-b border-b-[#E2E8F0]">
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
          <Text className="text-base font-bold text-[#1F2A33]">
            Drivers found
          </Text>
          <View className="w-7" />
        </View>

        <View style={{ flex: 1 }}>
          <View
            className="absolute items-center gap-1"
            style={{ left: "13%", top: "12%" }}
          >
            <Text className="text-sm font-bold text-[#1F2A33]">5mins</Text>
            <MaterialCommunityIcons
              name="map-marker"
              size={32}
              color="#31973D"
            />
          </View>

          <View
            className="absolute w-[34px] h-[34px] rounded-full items-center justify-center bg-[rgba(49,151,61,0.25)]"
            style={{ left: "14%", top: "42%" }}
          >
            <View className="w-[17px] h-[17px] rounded-full bg-[#31973D] border-2 border-white" />
          </View>

          <View
            style={{
              position: "absolute",
              left: "18%",
              top: "48%",
              width: 160,
              borderTopWidth: 2,
              borderColor: "#31973D",
              borderStyle: "dashed",
              transform: [{ rotate: "18deg" }],
            }}
          />
          <View
            style={{
              position: "absolute",
              left: "52%",
              top: "46%",
              width: 110,
              borderTopWidth: 2,
              borderColor: "#31973D",
              borderStyle: "dashed",
              transform: [{ rotate: "-20deg" }],
            }}
          />

          <View className="absolute" style={{ right: "8%", top: "52%" }}>
            <Text style={{ fontSize: 30 }}>🛺</Text>
          </View>
        </View>

        {!showModal && (
          <Animated.View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: navHeight,
              borderRadius: 22,
              padding: 16,
              marginHorizontal: 8,
              backgroundColor: "#FFFFFF",
              paddingTop: 12,
              gap: 16,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 20,
              shadowOffset: { width: 0, height: -4 },
              elevation: 12,
            }}
          >
            <View className="w-10 h-1 rounded-full bg-[#E2E8F0] self-center" />

            <View className="gap-6 py-6 rounded-2xl border border-[#E2E8F0]">
              <View className="flex-row justify-between items-center px-6">
                <Text className="text-lg font-bold text-[#1F2A33]">
                  Nearby Drivers
                </Text>
                <View className="flex-row items-center gap-2 bg-[#006B23]/10 border border-[#E2E8F0] rounded-2xl px-3 py-1.5">
                  <View className="w-2 h-2 rounded-full bg-[#31973D]" />
                  <Text className="text-[13px] font-bold text-[#31973D]">
                    Live view
                  </Text>
                </View>
              </View>

              {drivers.length === 0 ? (
                <View className="items-center px-6 py-4">
                  <Text className="text-sm text-[#64748A]">
                    No drivers found nearby right now.
                  </Text>
                </View>
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
                >
                  {drivers.map((driver, i) => (
                    <DriverCard
                      key={driver.id}
                      driver={driver}
                      selected={selectedDriver === i}
                      onPress={() => setSelectedDriver(i)}
                    />
                  ))}
                </ScrollView>
              )}
            </View>

            <View className="gap-3">
              <Pressable
                className="h-12 rounded-full items-center justify-center"
                style={{
                  backgroundColor: activeDriver ? "#31973D" : "#9CA3AF",
                }}
                disabled={!activeDriver}
                onPress={() => {
                  setModalStep("customer_requests");
                  setShowModal(true);
                }}
              >
                <Text className="text-sm font-bold text-white">
                  Proceed to request
                </Text>
              </Pressable>
              <Pressable
                className="h-12 rounded-full border border-[#E2E8F0] flex-row items-center justify-center gap-2 bg-white"
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
      </ImageBackground>
    </SafeAreaView>
  );
}

export default DriversFoundScreen;
