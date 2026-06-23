import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackScreenProps } from "../../navigation/types";
import { AppBottomNav } from "../../components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomAppBar from "../../components/common/CustomAppBar";

const avatar = require("../../../assets/avatar.jpg");

export function DriverArrivesScreen({
  navigation,
}: RootStackScreenProps<"DriverArrives">) {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <View className="flex-1 bg-[#F9F9F9]">
        <CustomAppBar title="Driver Arrives" navigation={navigation} />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: 120, gap: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full h-[224px] gap-6 border border-[#E2E8F0] rounded-3xl bg-white p-6 items-center justify-center">
            <View>
              <View className="w-16 h-16 rounded-xl bg-[#F4F4F5] items-center justify-center">
                <View className="w-[54px] h-[54px] rounded-full border-2 border-[#90FA96] overflow-hidden">
                  <Image
                    source={avatar}
                    style={{ width: 54, height: 54 }}
                    resizeMode="cover"
                  />
                </View>
              </View>
            </View>

            <View className="gap-2 items-center">
              <Text className="mt-3 text-base font-bold text-[#1F2A33] uppercase">
                MARCUS CHEN
              </Text>
              <View className="flex-row items-center">
                <MaterialCommunityIcons name="star" size={14} color="#0D631B" />
                <Text className="text-sm text-[#0D631B] ml-1">
                  4.9 • ZB-0248
                </Text>
              </View>
              <View className="flex-row items-center gap-6">
                <View className="flex-row items-center gap-2">
                  <MaterialCommunityIcons
                    name="phone-outline"
                    size={16}
                    color="#1F2A33"
                  />
                  <Text className="ml-1 text-[#1F2A33] text-sm">Call</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <MaterialCommunityIcons
                    name="message-outline"
                    size={16}
                    color="#1F2A33"
                  />
                  <Text className="ml-1 text-[#1F2A33] text-sm">Message</Text>
                </View>
              </View>
            </View>
          </View>

          <View className="bg-[#31973D] rounded-3xl p-6 items-center gap-4">
            <Text className="text-[10px] text-white uppercase tracking-widest">
              COLLECTION CODE
            </Text>

            <View className="flex-row gap-2 w-full justify-center">
              {["8", "2", "4", "9"].map((d, i) => (
                <View
                  key={i}
                  className="w-[56px] h-[56px] pb-1 bg-white/20 items-center justify-center rounded-xl"
                >
                  <Text
                    className="text-white font-bold"
                    style={{ fontSize: 36 }}
                  >
                    {d}
                  </Text>
                </View>
              ))}
            </View>

            <Text className="text-white text-xs text-center opacity-90">
              Show this to Marcus to verify
            </Text>
          </View>

          <View className="bg-white border border-[#E2E8F0] rounded-3xl p-4 flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-sm font-semibold text-[#1F2A33]">
                Confirm Collection
              </Text>
              <Text className="text-xs text-[#64748A] mt-1">
                Please verify the materials are loaded
              </Text>
            </View>
            <View className="flex-row items-center bg-[#31973D]/10 px-3 py-1 rounded-full border border-[#E2E8F0]">
              <View className="w-2 h-2 rounded-full bg-[#2E7D32] mr-2" />
              <Text className="text-[13px] text-[#31973D]">Driver Ready</Text>
            </View>
          </View>

          <View className="gap-4">
            <Pressable
              onPress={() => navigation.navigate("Payment")}
              className="h-12 bg-[#31973D] rounded-full items-center justify-center"
            >
              <Text className="text-white text-sm">Proceed to payment</Text>
            </Pressable>

            <Pressable
              onPress={() =>
                navigation.navigate("Details", {
                  itemId: "issue",
                  title: "Issue",
                })
              }
              className="h-12 items-center justify-center rounded-full"
            >
              <Text className="text-[#171D14] text-sm">Report an Issue</Text>
            </Pressable>
          </View>
        </ScrollView>

        <AppBottomNav
          activeTab="home"
          paddingBottom={14}
          onHomePress={() => navigation.navigate('Home')}
          onSavedPress={() => navigation.navigate('Details', { itemId: 'saved', title: 'Saved' })}
          onSettingsPress={() => navigation.navigate('Settings')}
          onCalendarPress={() => navigation.navigate('Details', { itemId: 'calendar', title: 'Calendar' })}
        />
      </View>
    </SafeAreaView>
  );
}

export default DriverArrivesScreen;
