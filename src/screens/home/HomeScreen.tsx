import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { RootStackScreenProps } from "../../navigation/types";
import { AppBottomNav } from "../../components";
import RoundedButton from "../../components/common/RoundedButton";
import { useAppSelector } from "../../hooks/useAppSelector";

const mapImage = require("../../../assets/RawMap.png");
const premium = require("../../../assets/premium.png");
const tricycle = require("../../../assets/picktricycle.png");

export function HomeScreen({ navigation }: RootStackScreenProps<"Home">) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activePill, setActivePill] = useState(0);
  const customer = useAppSelector((state) => state.customer);

  const changeActivePill = (value: number) => {
    if(customer.is_premium){
      setActivePill(0)
    }else{
      setActivePill(value)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <ImageBackground source={mapImage} className="flex-1 w-full h-full p-10">
        <View className="absolute w-full top-0 left-0 right-0 h-12 bg-white flex-row items-center justify-between px-4 z-10">
          <Pressable className="w-8 h-8 items-center justify-center">
            <MaterialCommunityIcons name="menu" size={20} color="#0F1621" />
          </Pressable>

          <Pressable className="w-10 h-10 p-1 border border-black/10 bg-gray-100 rounded-md items-center justify-center">
            <MaterialCommunityIcons
              name="bell-outline"
              size={20}
              color="#0F1621"
            />
          </Pressable>
        </View>

        <View className="absolute top-[58px] left-2.5 right-2.5 space-y-6">
          {!customer.is_premium ? (
            <View className="bg-white border-black/10 border-[1px] rounded-2xl p-2 gap-2">
              <View className="h-[54px] bg-gray-100 p-2 rounded-full flex flex-row gap-2 justify-between">
                <Pressable onPress={() => {changeActivePill(0)}} className={`rounded-full flex-1 items-center justify-center border-black/10 px-3 py-2 ${activePill === 0 ? "bg-white border-[1px]" : ""}`}>
                  <Text className="text-md font-semibold">Pickup Location</Text>
                </Pressable>
                <Pressable onPress={() => {changeActivePill(1)}} className={`rounded-full flex-1 items-center justify-center border-black/10 px-3 py-2 ${activePill === 1 ? "bg-white border-[1px]" : ""}`}>
                  <Text className="text-md font-semibold">Find Driver</Text>
                </Pressable>
              </View>
              <View className="h-[54px] bg-white rounded-full border border-black/10 px-3 flex-row items-center gap-2">
                <Pressable
                  onPress={() =>
                    navigation.navigate("Details", {
                      itemId: "search",
                      title: "Search",
                    })
                  }
                >
                  <MaterialCommunityIcons
                    name="magnify"
                    size={24}
                    color="#000"
                  />
                </Pressable>
                <TextInput
                  className="flex-1 text-[14px] text-[#333333] p-0 outline-none"
                  placeholder="Where is your waste?"
                  placeholderTextColor="#999999"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <Pressable
                    onPress={() => setSearchQuery("")}
                    className="w-8 h-8 items-center justify-center"
                  >
                    <MaterialCommunityIcons
                      name="close-circle"
                      size={22}
                      color="#EF4444"
                    />
                  </Pressable>
                )}
              </View>
            </View>
          ) : (
            <View className="h-[54px] bg-white rounded-full border border-black/10 px-3 flex-row items-center gap-2">
              <Pressable
                onPress={() =>
                  navigation.navigate("Details", {
                    itemId: "search",
                    title: "Search",
                  })
                }
              >
                <MaterialCommunityIcons name="magnify" size={24} color="#000" />
              </Pressable>
              <TextInput
                className="flex-1 text-[14px] text-[#333333] p-0 outline-none"
                placeholder="Where is your waste?"
                placeholderTextColor="#999999"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <Pressable
                  onPress={() => setSearchQuery("")}
                  className="w-8 h-8 items-center justify-center"
                >
                  <MaterialCommunityIcons
                    name="close-circle"
                    size={22}
                    color="#EF4444"
                  />
                </Pressable>
              )}
            </View>
          )}

          <View className="flex-row gap-5 px-4">
            <View
              className="flex-1 bg-white border border-[#E2E8F0] p-3"
              style={{ borderRadius: 24 }}
            >
              <View className="flex-row justify-between items-center">
                <Image
                  source={require("../../../assets/recycle.png")}
                  className="w-[21px] h-[21px]"
                  resizeMode="contain"
                />
                <Text className="text-[#31973D] text-xs font-semibold uppercase">
                  ACTIVE
                </Text>
              </View>
              <Text className="text-xl font-bold text-[#1F2A33] mt-2">
                {customer.mass_recycled}kg
              </Text>
              <Text className="text-sm text-[#6F7A6C] mt-1">
                Recycled this month
              </Text>
            </View>

            <View
              className="flex-1 bg-white border border-[#E2E8F0] p-3"
              style={{ borderRadius: 24 }}
            >
              <View className="flex-row justify-between items-center">
                <Image
                  source={require("../../../assets/points.png")}
                  className="w-[18px] h-[18px]"
                  resizeMode="contain"
                />
                <Text className="text-[#735C00] text-xs font-semibold uppercase">
                  POINTS
                </Text>
              </View>
              <Text className="text-xl font-bold text-[#1F2A33] mt-2">
                {customer.points}
              </Text>
              <Text className="text-sm text-[#6F7A6C] mt-1">
                Eco Credits earned
              </Text>
            </View>
          </View>
        </View>

        <View className="absolute bottom-[102px] left-2 right-2 p-4">
          <View className="space-y-3">
            <View className="flex-row gap-2 items-center bg-white border border-[#E2E8F0] rounded-full p-3">
              <View className="w-10 h-10 bg-[#419E6A1A] rounded-full items-center justify-center">
                <Image
                  source={tricycle}
                  style={{ width: 30, height: 30, transform: [{ scaleX: -1 }] }}
                  resizeMode="contain"
                />
              </View>

              <View className="flex-1">
                <Text className="text-sm font-semibold text-[#1F2A33]">
                  Find nearby tricycles
                </Text>
                <Text className="text-xs text-[#6F7A6C]">Instant pickup</Text>
              </View>

              <RoundedButton
                title="Request now"
                variant="primary"
                onPress={() => navigation.navigate("Scanning")}
              ></RoundedButton>
            </View>

            <View className="flex-row gap-2 items-center bg-white border border-[#FFE088] rounded-full p-3">
              <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                <Image
                  source={premium}
                  style={{ width: 20, height: 20, transform: [{ scaleX: -1 }] }}
                  resizeMode="contain"
                />
              </View>

              <View className="flex-1">
                <Text className="text-sm font-semibold text-[#1F2A33]">
                  Plan future pickup
                </Text>
                <Text className="text-xs text-[#6F7A6C]">Future service</Text>
              </View>

              {customer.is_premium ? (
                <RoundedButton
                  title="Plan for later"
                  variant="premium"
                  onPress={() => navigation.navigate("Scanning")}
                ></RoundedButton>
              ) : (
                <RoundedButton
                  title="Premium Tier"
                  variant="premium"
                  onPress={() => {}}
                ></RoundedButton>
              )}
            </View>

            {!customer.is_premium && (
              <View className="text-sm text-[#574500] flex-row items-center justify-center gap-1">
                <MaterialCommunityIcons name="lock" size={16} color="#574500" />
                <Text className="text-[#574500] italic">
                  Upgrade to Gold for scheduled pickups
                </Text>
              </View>
            )}
          </View>
        </View>

        <AppBottomNav
          activeTab="home"
          paddingBottom={0}
          onHomePress={() => navigation.navigate("Home")}
          onSavedPress={() =>
            navigation.navigate("Details", { itemId: "save", title: "Saved" })
          }
          onSettingsPress={() => navigation.navigate("Settings")}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}
