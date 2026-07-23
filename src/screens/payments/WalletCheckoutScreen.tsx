import React, { useState } from "react";
import { Pressable, Text, View, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";
import { ScrollView } from "react-native";
import CustomAppBar from "../../components/common/CustomAppBar";
import { useAppSelector } from "../../hooks/useAppSelector";
import { walletService } from "../../api/walletService";
import { markRequestPaid } from "../../slices/request/requestSlice";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { handleApiError } from "../../utils/handleApiError";

export function WalletCheckoutScreen({
  navigation,
}: RootStackScreenProps<"WalletCheckout">) {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const request = useAppSelector((state) => state.request);
  const [loading, setLoading] = useState(false);
  const total = (request.pickup_price || 0) + (request.service_price || 0);

  const handlePay = async () => {
    if (!request.id || loading) return;
    setLoading(true);
    try {
      await walletService.payForRequest(request.id);
      dispatch(markRequestPaid());
      navigation.navigate("PaymentSuccess", { phone: "" });
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

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
          <CustomAppBar title="Payment" navigation={navigation}/>

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
              GHS {total.toFixed(2)}
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
              style={{ opacity: loading ? 0.6 : 1 }}
              disabled={loading}
              onPress={handlePay}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-sm text-white leading-5">Pay</Text>
              )}
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
                    GHS {total.toFixed(2)}
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
