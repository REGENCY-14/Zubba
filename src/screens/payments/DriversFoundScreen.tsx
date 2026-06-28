import React from "react";
import {
  ActivityIndicator,
  Animated,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { AppBottomNav } from "../../components";
import type { RootStackScreenProps } from "../../navigation/types";

const mapImage = require("../../../assets/RawMap.png");

const NEARBY_DRIVERS = [
  { name: "Marcus Chen", initials: "MC", rating: "4.9", code: "ZB-0248", distance: "0.5km away", time: "3 mins", premium: true },
  { name: "Sarah J.", initials: "SJ", rating: "4.9", code: "ZB-1248", distance: "0.8km away", time: "5 mins", premium: false },
  { name: "Kwame B.", initials: "KB", rating: "4.8", code: "ZB-0748", distance: "1.2km away", time: "7 mins", premium: true },
];

type DriverInfo = (typeof NEARBY_DRIVERS)[number];

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
      className="w-[248px] rounded-3xl p-4 gap-4 bg-white"
      style={{ borderWidth: 1, borderColor: selected ? "#31973D" : "#E2E8F0" }}
    >
      <View className="flex-row items-start gap-4">
        <View className="w-16 h-16 rounded-xl bg-[#F1F5F9] items-center justify-center">
          <View className="w-[54px] h-[54px] rounded-full border-2 border-[#90FA96] bg-[#C7E0C9] items-center justify-center">
            <Text className="text-sm font-bold text-[#1A1C1E] font-['Inter']">
              {driver.initials}
            </Text>
          </View>
          <View className="absolute -bottom-0.5 -right-0.5 w-[22px] h-[22px] rounded-full bg-[#006B23] border-2 border-white items-center justify-center">
            <MaterialCommunityIcons name="check" size={10} color="#FFFFFF" />
          </View>
        </View>

        <View className="flex-1 gap-1">
          <View className="flex-row items-center gap-1.5 flex-wrap">
            <Text className="text-sm font-bold text-[#1A1C1E] font-['Nexa_Text-Trial']">
              {driver.name}
            </Text>
            {driver.premium && (
              <View className="bg-[#FFE088] rounded-2xl px-1.5 py-0.5">
                <Text className="text-[10px] text-[#574500] tracking-[0.48px]">
                  Premium
                </Text>
              </View>
            )}
          </View>
          <View className="flex-row items-center gap-1">
            <MaterialCommunityIcons name="star" size={11} color="#735C00" />
            <Text className="text-xs font-bold text-[#1A1C1E] tracking-[0.48px] font-['Inter']">
              {driver.rating}
            </Text>
            <Text className="text-xs font-bold text-[#BECAB9] font-['Inter']"> · </Text>
            <Text className="text-sm font-bold text-[#0D631B] uppercase font-['Nexa_Text-Trial']">
              {driver.code}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row justify-between items-center pt-3 border-t border-t-[#F1F5F9]">
        <View className="flex-row items-center gap-2">
          <MaterialCommunityIcons name="map-marker-outline" size={14} color="#006B23" />
          <Text className="text-sm font-bold text-[#1A1C1E] tracking-[0.28px] font-['Nexa_Text-Trial']">
            {driver.distance}
          </Text>
        </View>
        <View className="bg-[rgba(0,107,35,0.05)] rounded-lg px-2 py-0.5">
          <Text className="text-xs font-bold text-[#006B23] tracking-[0.48px] font-['Inter']">
            {driver.time}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export function DriversFoundScreen({
  navigation,
}: RootStackScreenProps<"DriversFound">) {
  const insets = useSafeAreaInsets();
  const [selectedDriver, setSelectedDriver] = React.useState(0);
  const [isScanning, setIsScanning] = React.useState(true);
  const [confirmed, setConfirmed] = React.useState(false);
  const panelTranslateY = React.useRef(new Animated.Value(400)).current;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsScanning(false);
      Animated.spring(panelTranslateY, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 4,
      }).start();
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (!confirmed) return;
    const timer = setTimeout(() => navigation.navigate("DriverArrives"), 5000);
    return () => clearTimeout(timer);
  }, [confirmed]);

  const navHeight = 52 + Math.max(insets.bottom, 14) + 20;

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
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="chevron-left" size={24} color="#1F2A33" />
          </Pressable>
          <Text className="text-base font-bold text-[#1F2A33] font-['Nexa_Text-Trial']">
            Drivers found
          </Text>
          <View className="w-7" />
        </View>

        <View style={{ flex: 1 }}>
          <View className="absolute items-center gap-1" style={{ left: "13%", top: "12%" }}>
            <Text className="text-sm font-bold text-[#1F2A33] font-['Nexa_Text-Trial']">
              5mins
            </Text>
            <MaterialCommunityIcons name="map-marker" size={32} color="#31973D" />
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

        {isScanning && (
          <View className="absolute inset-0 items-center justify-center gap-4 bg-white/55">
            <ActivityIndicator size="large" color="#31973D" />
            <Text className="text-sm text-[#3F4A3D] font-['Poppins']">
              Finding nearby drivers...
            </Text>
          </View>
        )}

        <Animated.View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: navHeight,
            transform: [{ translateY: panelTranslateY }],
            borderRadius: 22,
            marginHorizontal: 8,
            backgroundColor: "#FFFFFF",
            paddingTop: 12,
            paddingBottom: 16,
            gap: 16,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: -4 },
            elevation: 12,
          }}
        >
          <View className="w-10 h-1 rounded-full bg-[#E2E8F0] self-center" />

          {confirmed ? (
            <View className="px-3 gap-5">
              <View className="border border-[#E2E8F0] rounded-3xl p-6 items-center gap-6">
                <View className="w-16 h-16 rounded-xl bg-[#F1F5F9] items-center justify-center">
                  <View className="w-[54px] h-[54px] rounded-full border-2 border-[#90FA96] bg-[#C7E0C9] items-center justify-center">
                    <Text className="text-sm font-bold text-[#1A1C1E] font-['Inter']">
                      {NEARBY_DRIVERS[selectedDriver].initials}
                    </Text>
                  </View>
                  <View className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#006B23] border-2 border-white items-center justify-center">
                    <MaterialCommunityIcons name="check" size={10} color="#FFFFFF" />
                  </View>
                </View>

                <View className="items-center gap-1 self-stretch">
                  <Text className="text-base font-bold text-[#1F2A33] uppercase tracking-[1.6px] text-center font-['Nexa_Text-Trial']">
                    {NEARBY_DRIVERS[selectedDriver].name}
                  </Text>
                  <View className="flex-row items-center justify-center gap-1">
                    <MaterialCommunityIcons name="star" size={13} color="#0D631B" />
                    <Text className="text-sm font-bold text-[#0D631B] font-['Nexa_Text-Trial']">
                      {NEARBY_DRIVERS[selectedDriver].rating} • ZB-Expert
                    </Text>
                  </View>

                  <View className="flex-row gap-2 justify-center pt-6">
                    <Pressable className="flex-row items-center gap-2 bg-[#F8FAFC] rounded-full px-4 py-2">
                      <MaterialCommunityIcons name="phone-outline" size={14} color="#1F2A33" />
                      <Text className="text-sm font-bold text-[#1F2A33] font-['Nexa_Text-Trial']">
                        Call
                      </Text>
                    </Pressable>
                    <Pressable className="flex-row items-center gap-2 bg-[#F8FAFC] rounded-full px-4 py-2">
                      <MaterialCommunityIcons name="message-outline" size={14} color="#1F2A33" />
                      <Text className="text-sm font-bold text-[#1F2A33] font-['Nexa_Text-Trial']">
                        Message
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>

              <Pressable
                className="border border-[#E2E8F0] rounded-full py-3.5 flex-row items-center justify-center gap-2 bg-white"
                onPress={() => navigation.navigate("PremiumHome")}
              >
                <MaterialCommunityIcons name="close-circle" size={16} color="#EF4444" />
                <Text className="text-sm font-bold text-[#EF4444] font-['Plus_Jakarta_Sans']">
                  Cancel pickup
                </Text>
              </Pressable>
            </View>
          ) : (
            <>
              <View className="flex-row justify-between items-center px-4">
                <Text className="text-lg font-bold text-[#1F2A33] font-['Nexa_Text-Trial']">
                  Nearby Drivers
                </Text>
                <View className="flex-row items-center gap-2 bg-[rgba(0,107,35,0.1)] border border-[#E2E8F0] rounded-2xl px-3 py-1.5">
                  <View className="w-2 h-2 rounded-full bg-[#31973D]" />
                  <Text className="text-[13px] font-bold text-[#31973D] font-['Nexa_Text-Trial']">
                    Live view
                  </Text>
                </View>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
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

              <View className="gap-3 px-4">
                <Pressable
                  className="h-12 bg-[#31973D] rounded-full items-center justify-center"
                  onPress={() => setConfirmed(true)}
                >
                  <Text className="text-sm font-bold text-white font-['Plus_Jakarta_Sans']">
                    Proceed to request
                  </Text>
                </Pressable>
                <Pressable
                  className="h-12 rounded-full border border-[#E2E8F0] flex-row items-center justify-center gap-2 bg-white"
                  onPress={() => navigation.navigate("PremiumHome")}
                >
                  <MaterialCommunityIcons name="close-circle" size={16} color="#EF4444" />
                  <Text className="text-sm font-bold text-[#EF4444] font-['Plus_Jakarta_Sans']">
                    Cancel pickup
                  </Text>
                </Pressable>
              </View>
            </>
          )}
        </Animated.View>

        <AppBottomNav
          activeTab="home"
          paddingBottom={14}
          bottomOffset={8}
          onHomePress={() => navigation.navigate("PremiumHome")}
          onSavedPress={() =>
            navigation.navigate("Details", { itemId: "saved", title: "Saved" })
          }
          onSettingsPress={() => navigation.navigate("Settings")}
          onCalendarPress={() =>
            navigation.navigate("Details", { itemId: "calendar", title: "Calendar" })
          }
        />
      </ImageBackground>
    </SafeAreaView>
  );
}

export default DriversFoundScreen;