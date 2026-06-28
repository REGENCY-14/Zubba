import {
  ActivityIndicator,
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

const mapImage = require("../../../assets/RawMap.png");
const avatar = require("../../../assets/avatar.jpg");

const NEARBY_DRIVERS = [
  {
    name: "Marcus Chen",
    initials: "MC",
    rating: 4.9,
    code: "ZB-0248",
    distance: "0.5km away",
    time: "3 mins",
    cost: "20.00",
    isPremium: true,
  },
  {
    name: "Sarah J.",
    initials: "SJ",
    rating: 4.9,
    code: "ZB-1248",
    distance: "0.8km away",
    time: "5 mins",
    cost: "25.00",
    isPremium: true,
  },
  {
    name: "Kwame B.",
    initials: "KB",
    rating: 4.8,
    code: "ZB-0748",
    distance: "1.2km away",
    time: "7 mins",
    cost: "27.00",
    isPremium: false,
  },
];

type DriverInfo = (typeof NEARBY_DRIVERS)[number];


export function DriversFoundScreen({
  navigation,
}: RootStackScreenProps<"DriversFound">) {
  const insets = useSafeAreaInsets();
  const [selectedDriver, setSelectedDriver] = useState(0);
  const [modalStep, setModalStep] = useState<"" | "request" | "assigned">("");
  const [showModal, setShowModal] = useState(false);
  const assignedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navHeight = 52 + Math.max(insets.bottom, 14) + 20;

  const closeModal = () => {
    setModalStep("");
    setShowModal(false);
  };

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

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <ImageBackground
        source={mapImage}
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

            <>
              <View className="gap-6 py-6 rounded-2xl border-[1px] border-[#E2E8F0]">
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

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
                >
                  {NEARBY_DRIVERS.map((driver, i) => (
                    <DriverCard
                      key={driver.code}
                      driver={driver}
                      selected={selectedDriver === i}
                      onPress={() => setSelectedDriver(i)}
                    />
                  ))}
                </ScrollView>
              </View>

              <View className="gap-3">
                <Pressable
                  className="h-12 bg-[#31973D] rounded-full items-center justify-center"
                  onPress={() => {
                    setModalStep("request");
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
            </>
          </Animated.View>
        )}

        {showModal && modalStep != "" && (
          <PickupRequestModal
            visible={showModal}
            step={modalStep}
            avatar={avatar}
            name={NEARBY_DRIVERS[selectedDriver].name}
            isPremium={NEARBY_DRIVERS[selectedDriver].isPremium}
            rating={NEARBY_DRIVERS[selectedDriver].rating}
            code={NEARBY_DRIVERS[selectedDriver].code}
            cost={NEARBY_DRIVERS[selectedDriver].cost}
            onProceed={() => setModalStep("assigned")}
            onCancel={closeModal}
            onAssignedCancel={closeModal}
            animationType="none"
          />
        )}

        <AppBottomNav
          activeTab="home"
          paddingBottom={14}
          bottomOffset={8}
          onHomePress={() => navigation.navigate("Home")}
          onSavedPress={() =>
            navigation.navigate("Details", { itemId: "saved", title: "Saved" })
          }
          onSettingsPress={() => navigation.navigate("Settings")}
          onCalendarPress={() =>
            navigation.navigate("Details", {
              itemId: "calendar",
              title: "Calendar",
            })
          }
        />
      </ImageBackground>
    </SafeAreaView>
  );
}

export default DriversFoundScreen;



function DriverCard({
  driver,
  selected,
  onPress,
}: {
  driver: DriverInfo;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="rounded-3xl p-4 gap-4 bg-white"
      style={{ borderWidth: 1, borderColor: selected ? "#31973D" : "#E2E8F0" }}
    >
      <View className="flex-row items-start gap-4">
        <View
          className="w-16 h-16 rounded-xl bg-[#F4F4F5] items-center justify-center"
          style={{
            boxShadow: [
              {
                offsetX: 0,
                offsetY: 0,
                blurRadius: 0,
                spreadDistance: 2,
                color: "#FAFAFA",
              },
            ],
          }}
        >
          <View className="w-[54px] h-[54px] rounded-full border-2 border-[#90FA96] overflow-hidden items-center justify-center bg-[#C7E0C9]">
            {avatar ? (
              <Image
                source={avatar}
                style={{ width: 54, height: 54 }}
                resizeMode="cover"
              />
            ) : (
              <Text className="text-sm font-bold text-[#1A1C1E]">
                {driver.initials}
              </Text>
            )}
          </View>
          <View className="absolute -bottom-0.5 -right-0.5 w-[22px] h-[22px] rounded-full bg-[#006B23] border-2 border-white items-center justify-center">
            <MaterialCommunityIcons
              name="check-decagram"
              size={13}
              color="#FFFFFF"
            />
          </View>
        </View>

        <View className="flex-1 gap-1 justify-center h-full">
          <View className="flex-row items-center gap-1.5 flex-wrap">
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              className="text-sm font-bold text-[#1A1C1E] max-w-[130px]"
            >
              {driver.name}
            </Text>
            {driver.isPremium && (
              <View className="bg-[#FFE088] rounded-2xl px-1.5 py-0.5 border-[1px] border-[#D4AF37]">
                <Text className="text-[10px] text-[#574500] tracking-[0.48px]">
                  Premium
                </Text>
              </View>
            )}
          </View>
          <View className="flex-row items-center gap-1">
            <MaterialCommunityIcons name="star" size={11} color="#735C00" />
            <Text className="text-xs font-bold text-[#1A1C1E] tracking-[0.48px]">
              {driver.rating}
            </Text>
            <Text className="text-xs font-extrabold text-[#BECAB9]"> · </Text>
            <Text className="text-sm font-bold text-[#0D631B] uppercase">
              {driver.code}
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
            {driver.distance}
          </Text>
        </View>
        <View className="bg-[rgba(0,107,35,0.05)] rounded-lg px-2 py-0.5">
          <Text className="text-xs font-bold text-[#006B23] tracking-[0.48px]">
            {driver.time}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}