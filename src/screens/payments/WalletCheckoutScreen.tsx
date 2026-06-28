import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackScreenProps } from "../../navigation/types";
import { AppBottomNav } from "../../components";
import { useTheme } from "../../context/ThemeContext";
import CustomAppBar from "../../components/common/CustomAppBar";

export function WalletCheckoutScreen({
  navigation,
}: RootStackScreenProps<"WalletCheckout">) {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={{ backgroundColor: colors.bg }}
      className="flex-1"
      edges={["top", "left", "right"]}
    >
      <View style={{ backgroundColor: colors.surface }} className="flex-1">
        <View
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
          }}
          className="border border-t-0 rounded-b-[32px] pb-6"
        >
          <CustomAppBar
            title="Payment"
            navigation={() => navigation.goBack()}
          />

          <View className="items-center gap-2.5">
            <View className="flex-row items-center gap-1.5 rounded-full px-2 py-1 bg-white/70">
              <View
                style={{ borderColor: colors.border }}
                className="rounded-full px-3 py-1 border bg-[#006B231A]"
              >
                <Text className="text-[13px] text-[#31973D] leading-5">
                  Total to pay
                </Text>
              </View>

              <Text
                style={{ color: colors.text }}
                className="text-[10px] font-bold tracking-wide"
              >
                GHS
              </Text>
            </View>

            <Text
              style={{ color: colors.text }}
              className="text-[48px] font-bold leading-[56px] tracking-[-1.2px]"
            >
              GHS 45.00
            </Text>

            <View className="flex-row items-center gap-1 bg-[#31973D] rounded-full border-2 border-white px-3 py-1">
              <MaterialCommunityIcons
                name="trending-up"
                size={12}
                color="#fff"
              />
              <Text className="text-white text-xs font-bold">
                2X Eco-Points
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{ backgroundColor: colors.surface }}
          className="flex-row items-center px-6 py-4 gap-2.5"
        >
          <Pressable
            onPress={() => navigation.navigate("Home")}
            className="w-8 h-8 bg-red-100 rounded-xl items-center justify-center"
          >
            <MaterialCommunityIcons name="close" size={16} color="#EF4444" />
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate("PaymentSuccess")}
            className="flex-1 h-10 bg-[#31973D] rounded-full items-center justify-center"
          >
            <Text className="text-white text-sm">Pay</Text>
          </Pressable>
        </View>

        <View
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
          }}
          className="border border-b-0 rounded-t-[32px] py-4 flex-1"
        >
          <ScrollView
            className="flex-1"
            contentContainerClassName="px-3 gap-3 rounded-t-[32px]"
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
              }}
              className="border rounded-3xl px-4"
            >
              {[
                ["Estimated Cost", "GHS 45.00"],
                ["Pickup - Organic Waste", "GHS 35.00"],
                ["Service Fee", "GHS 10.00"],
              ].map(([label, value], i) => (
                <View
                  key={label}
                  style={{
                    borderBottomColor:
                      i !== 2 ? colors.borderLight : "transparent",
                  }}
                  className="flex-row justify-between items-center py-3"
                >
                  <Text style={{ color: colors.textSub }} className="text-base">
                    {label}
                  </Text>
                  <Text
                    style={{ color: colors.text }}
                    className="text-base font-bold"
                  >
                    {value}
                  </Text>
                </View>
              ))}
            </View>

            <View
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
              }}
              className="border rounded-3xl p-4 gap-4"
            >
              <View
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                }}
                className="border rounded-3xl p-5 flex-row justify-between items-center"
              >
                <View className="gap-1">
                  <Text
                    style={{ color: colors.text }}
                    className="text-base font-medium"
                  >
                    Zubba Wallet Balance
                  </Text>
                  <Text style={{ color: colors.textSub }} className="text-base">
                    GHS 124.50
                  </Text>
                </View>

                <View className="flex-row items-center gap-2">
                  <Text className="text-[#31973D] font-bold">READY</Text>
                  <View className="w-2 h-2 rounded-full bg-[#31973D]" />
                </View>
              </View>

              <View
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                }}
                className="border rounded-3xl p-5 gap-3"
              >
                <View className="flex-row justify-between">
                  <Text style={{ color: colors.textSub }} className="text-base">
                    Base Points
                  </Text>
                  <Text style={{ color: colors.text }} className="text-base">
                    45 XP
                  </Text>
                </View>

                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center gap-1">
                    <Text
                      style={{ color: colors.textSub }}
                      className="text-base"
                    >
                      Premium Multiplier
                    </Text>
                    <MaterialCommunityIcons
                      name="lightning-bolt"
                      size={10}
                      color={colors.text}
                    />
                  </View>
                  <Text style={{ color: colors.text }} className="text-base">
                    x 2
                  </Text>
                </View>

                <View className="flex-row justify-between">
                  <Text style={{ color: colors.text }} className="text-base">
                    Total Reward
                  </Text>
                  <Text className="text-[#31973D] text-base">
                    90 Eco-Points
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* <AppBottomNav
          activeTab="home"
          paddingBottom={14}
          bottomOffset={8}
          onHomePress={() => navigation.navigate("Home")}
          onSavedPress={() =>
            navigation.navigate("Details", {
              itemId: "saved",
              title: "Saved",
            })
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

export default WalletCheckoutScreen;
