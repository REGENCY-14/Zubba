import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackScreenProps } from "../../navigation/types";
import { AppBottomNav } from "../../components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomAppBar from "../../components/common/CustomAppBar";
import { useTheme } from "../../context/ThemeContext";

const avatar = require("../../../assets/avatar.jpg");

export function DriverArrivesScreen({
  navigation,
}: RootStackScreenProps<"DriverArrives">) {
  const { colors } = useTheme();

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.bg }} edges={["top", "left", "right"]}>
      <View className="flex-1" style={{ backgroundColor: colors.surface }}>
        <CustomAppBar title="Driver Arrives" navigation={navigation} />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingTop: 0, gap: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <View
            className="w-full h-56 gap-6 border rounded-3xl items-center justify-center p-6"
            style={{ borderColor: colors.border, backgroundColor: colors.card }}
          >
            <View>
              <View
                className="w-16 h-16 rounded-xl items-center justify-center"
                style={{ backgroundColor: colors.iconBg }}
              >
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
              <Text className="mt-3 text-sm font-bold text-center uppercase" style={{ color: colors.text }}>
                MARCUS CHEN
              </Text>

              <View className="flex-row items-center">
                <MaterialCommunityIcons name="star" size={14} color="#0D631B" />
                <Text className="ml-1 text-sm text-[#0D631B]">
                  4.9 • ZB-0248
                </Text>
              </View>

              <View className="flex-row items-center gap-6">
                <View className="flex-row items-center gap-2">
                  <MaterialCommunityIcons
                    name="phone-outline"
                    size={16}
                    color={colors.text}
                  />
                  <Text className="ml-1 text-sm" style={{ color: colors.text }}>
                    Call
                  </Text>
                </View>

                <View className="flex-row items-center gap-2">
                  <MaterialCommunityIcons
                    name="message-outline"
                    size={16}
                    color={colors.text}
                  />
                  <Text className="ml-1 text-sm" style={{ color: colors.text }}>
                    Message
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View className="bg-[#31973D] rounded-3xl p-6 items-center gap-4">
            <Text className="text-[10px] text-white tracking-[4px] uppercase">
              COLLECTION CODE
            </Text>

            <View className="flex-row justify-center gap-2 w-full">
              {["8", "2", "4", "9"].map((d, i) => (
                <View
                  key={i}
                  className="w-14 h-14 items-center justify-center rounded-xl bg-white/20"
                >
                  <Text className="text-white font-bold text-4xl">
                    {d}
                  </Text>
                </View>
              ))}
            </View>

            <Text className="text-white text-xs text-center opacity-90">
              Show this to Marcus to verify
            </Text>
          </View>

          <View
            className="flex-row items-center justify-between p-4 rounded-3xl border"
            style={{ borderColor: colors.border, backgroundColor: colors.card }}
          >
            <View className="flex-1">
              <Text className="text-sm font-semibold" style={{ color: colors.text }}>
                Confirm Collection
              </Text>
              <Text className="text-xs mt-1" style={{ color: colors.textSub }}>
                Please verify the materials are loaded
              </Text>
            </View>

            <View className="flex-row items-center px-3 py-1 rounded-full bg-[#31973D]/10 border"
              style={{ borderColor: colors.border }}
            >
              <View className="w-2 h-2 rounded-full bg-[#2E7D32] mr-2" />
              <Text className="text-[#31973D] text-[13px]">
                Driver Ready
              </Text>
            </View>
          </View>

          <View className="gap-4">
            <Pressable
              onPress={() => navigation.navigate("Payment")}
              className="h-12 bg-[#31973D] rounded-full items-center justify-center"
            >
              <Text className="text-white text-sm">
                Proceed to payment
              </Text>
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
              <Text style={{ color: colors.text }} className="text-sm">
                Report an Issue
              </Text>
            </Pressable>
          </View>
        </ScrollView>

        {/* <AppBottomNav
          activeTab="home"
          paddingBottom={14}
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
        /> */}
      </View>
    </SafeAreaView>
  );
}

export default DriverArrivesScreen;