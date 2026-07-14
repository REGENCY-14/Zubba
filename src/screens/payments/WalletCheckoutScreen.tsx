import React from "react";
import { Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackScreenProps } from "../../navigation/types";
import { AppBottomNav } from "../../components";
import { useTheme } from "../../context/ThemeContext";
import { ScrollView } from "react-native";

export function WalletCheckoutScreen({
  navigation,
}: RootStackScreenProps<"WalletCheckout">) {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.bg }}
      edges={["top", "left", "right"]}
    >
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        {/* Header — top of the static drawer */}
        <View
          className="border-t-0 rounded-bl-[32px] rounded-br-[32px] pb-6"
          style={{
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View className="h-12 flex-row items-center justify-between px-4">
            <Pressable
              className="w-6 h-6 items-center justify-center"
              onPress={() => navigation.goBack()}
            >
              <Text
                style={{ fontSize: 28, color: colors.text, lineHeight: 30 }}
              >
                ‹
              </Text>
            </Pressable>
            <Text
              style={{ fontSize: 16, fontWeight: "600", color: colors.text }}
            >
              Payment
            </Text>
            <View className="w-6 h-6" />
          </View>

          <View className="items-center gap-[10px] relative">
            <View className="flex-row items-center gap-[6px] rounded-full px-2 py-1">
              <View className="rounded-full px-3 py-[6px] bg-[#E2E8F0]">
                <Text className="text-[13px] text-[#31973D] leading-5">
                  Total to pay
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "bold",
                  letterSpacing: 0.5,
                  color: colors.text,
                }}
              >
                GHS
              </Text>
            </View>

            <Text
              style={{
                fontSize: 48,
                fontWeight: "bold",
                color: colors.text,
                lineHeight: 56,
                letterSpacing: -1.2,
              }}
            >
              GHS 45.00
            </Text>

            <View className="flex-row absolute -bottom-[40px] items-center gap-1 bg-[#31973D] rounded-full px-3 py-1">
              <MaterialCommunityIcons
                name="trending-up"
                size={12}
                color="#FFFFFF"
              />
              <Text className="text-xs font-bold text-white leading-4">
                2X Eco-Points
              </Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: -10, flex: 1 }}>
          <View className="flex-row items-center px-6 pt-10 pb-6 gap-[10px]">
            <Pressable
              className="w-8 h-8 bg-[#FFE2E2] rounded-xl items-center justify-center"
              onPress={() => navigation.navigate("Home")}
            >
              <MaterialCommunityIcons name="close" size={16} color="#EF4444" />
            </Pressable>
            <Pressable
              className="flex-1 h-10 bg-[#31973D] rounded-full items-center justify-center"
              onPress={() => navigation.navigate("PaymentSuccess")}
            >
              <Text className="text-sm text-white leading-5">Pay</Text>
            </Pressable>
          </View>

          <View
            className="flex-1 rounded-t-[32px]"
            style={{
              backgroundColor: colors.card,
              paddingHorizontal: 12,
              paddingTop: 16,
              paddingBottom: 10,
              gap: 12,
            }}
          >
            <ScrollView
              className="flex-1"
              contentContainerStyle={{
                padding: 2,
                gap: 24,
              }}
              showsHorizontalScrollIndicator={false}
            >
              <View
                className="rounded-3xl px-4"
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                }}
              >
                <View className="flex-row justify-between items-center py-[14px]">
                  <Text
                    style={{
                      fontSize: 16,
                      color: colors.textSub,
                      lineHeight: 24,
                    }}
                  >
                    Estimated Cost
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: colors.text,
                      fontWeight: "bold",
                      lineHeight: 24,
                    }}
                  >
                    GHS 45.00
                  </Text>
                </View>
                <View className="flex-row justify-between items-center py-[14px]">
                  <Text
                    style={{
                      fontSize: 16,
                      color: colors.textSub,
                      lineHeight: 24,
                    }}
                  >
                    Pickup - Organic Waste
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: colors.text,
                      fontWeight: "bold",
                      lineHeight: 24,
                    }}
                  >
                    GHS 35.00
                  </Text>
                </View>
                <View className="flex-row justify-between items-center py-[14px]">
                  <Text
                    style={{
                      fontSize: 16,
                      color: colors.textSub,
                      lineHeight: 24,
                    }}
                  >
                    Service Fee
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: colors.text,
                      fontWeight: "bold",
                      lineHeight: 24,
                    }}
                  >
                    GHS 10.00
                  </Text>
                </View>
              </View>

              <View
                className="rounded-3xl p-4 gap-4"
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                }}
              >
                <View
                  className="rounded-3xl p-5 flex-row justify-between items-center"
                  style={{
                    borderWidth: 1,
                    borderColor: colors.border,
                    backgroundColor: colors.card,
                  }}
                >
                  <View className="gap-1">
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "500",
                        color: colors.text,
                        lineHeight: 24,
                      }}
                    >
                      Zubba Wallet Balance
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "500",
                        color: colors.textSub,
                        lineHeight: 24,
                      }}
                    >
                      GHS 124.50
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-base font-bold text-[#31973D] leading-6">
                      READY
                    </Text>
                    <View className="w-2 h-2 rounded-full bg-[#31973D]" />
                  </View>
                </View>

                <View
                  className="rounded-3xl p-5 gap-3"
                  style={{
                    borderWidth: 1,
                    borderColor: colors.border,
                    backgroundColor: colors.card,
                  }}
                >
                  <View className="flex-row justify-between items-center">
                    <Text
                      style={{
                        fontSize: 16,
                        color: colors.textSub,
                        lineHeight: 24,
                      }}
                    >
                      Base Points
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        color: colors.text,
                        lineHeight: 24,
                      }}
                    >
                      45 XP
                    </Text>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center gap-1">
                      <Text
                        style={{
                          fontSize: 16,
                          color: colors.textSub,
                          lineHeight: 24,
                        }}
                      >
                        Premium Multiplier
                      </Text>
                      <MaterialCommunityIcons
                        name="lightning-bolt"
                        size={10}
                        color={colors.text}
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: 16,
                        color: colors.text,
                        lineHeight: 24,
                      }}
                    >
                      x 2
                    </Text>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <Text
                      style={{
                        fontSize: 16,
                        color: colors.text,
                        lineHeight: 24,
                      }}
                    >
                      Total Reward
                    </Text>
                    <Text className="text-base text-[#31973D] leading-6">
                      90 Eco-Points
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default WalletCheckoutScreen;
