import React from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { RootStackScreenProps } from "../../navigation/types";
import CustomAppBar from "../../components/common/CustomAppBar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { useAppSelector } from "../../hooks/useAppSelector";
import { toast } from "../../hooks/toast";
import { usePickupPaystackCheckout } from "../../hooks/usePickupPaystackCheckout";
import { formatAuthPhone } from "../../utils/paymentProviders";

export function PaymentMethodScreen({
  navigation,
  route,
}: RootStackScreenProps<"PaymentMethod">) {
  const user = useAppSelector((state) => state.auth.user);
  const request = useAppSelector((state) => state.request);
  const { colors } = useTheme();
  const { startCheckout, isLoading } = usePickupPaystackCheckout();

  const {
    provider = "mtn",
    methodLabel = "Mobile Money",
    channel = "mobile_money",
  } = route.params;

  const [phoneNumber, setPhoneNumber] = React.useState(
    formatAuthPhone(user?.phone),
  );

  const totalAmount = (request.pickup_price || 0) + (request.service_price || 0);
  const isMobileMoney = channel === "mobile_money";

  const handleProceedToPay = async () => {
    if (!user?.email) {
      toast.error("A verified email is required to complete payment.");
      return;
    }

    await startCheckout({
      email: user.email,
      phone: isMobileMoney ? phoneNumber : formatAuthPhone(user.phone),
      provider,
      paymentMethodLabel: methodLabel,
      channel,
      request,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top", "left", "right", "bottom"]}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <CustomAppBar navigation={navigation} title="Payment" />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: 10, gap: 24 }}
        >
          <View className="gap-6">
            <View style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 24, padding: 24, alignItems: "center", gap: 16 }}>
              <View className="w-14 h-14 rounded-full bg-[#41A06A]/10 items-center justify-center">
                <MaterialCommunityIcons name="wallet" size={27} color="#31973D" />
              </View>

              <Text style={{ fontSize: 16, textAlign: "center", color: colors.textSub }}>
                Total to Pay
              </Text>

              <Text style={{ fontSize: 32, fontWeight: "600", color: colors.text, textAlign: "center" }}>
                GHS {totalAmount.toFixed(2)}
              </Text>

              <View style={{ width: "100%", borderTopWidth: 1, borderTopColor: colors.border }} />

              <View className="bg-[#E8F2E8] px-3 py-1 rounded-full border border-[#E2E8F0]">
                <Text className="text-[#31973D] text-[13px] font-bold">
                  {methodLabel}
                </Text>
              </View>
            </View>

            {isMobileMoney ? (
              <View className="gap-2">
                <Text style={{ fontSize: 16, color: colors.text }}>
                  Wallet Phone Number
                </Text>

                <TextInput
                  style={{
                    height: 48,
                    paddingHorizontal: 16,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 999,
                    backgroundColor: colors.card,
                    color: colors.text,
                    fontSize: 14,
                  }}
                  placeholder="055 123 4567"
                  placeholderTextColor={colors.textSub}
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />

                <Text style={{ fontSize: 12, color: colors.textSub }}>
                  Enter the mobile money number to charge. This can differ from your account phone.
                </Text>
              </View>
            ) : (
              <View style={{ flexDirection: "row", gap: 16, padding: 16, borderWidth: 1, borderColor: colors.border, borderRadius: 24, backgroundColor: colors.card }}>
                <View className="w-8 h-8 rounded-full bg-[#006B23]/10 items-center justify-center">
                  <MaterialCommunityIcons name="credit-card-outline" size={18} color="#31973D" />
                </View>
                <View className="flex-1 gap-1">
                  <Text style={{ fontSize: 16, color: colors.text }}>
                    Card payment
                  </Text>
                  <Text style={{ fontSize: 14, color: colors.textSub, lineHeight: 24 }}>
                    You will complete this payment securely in the Paystack checkout screen.
                  </Text>
                </View>
              </View>
            )}

            <View style={{ flexDirection: "row", gap: 16, padding: 16, borderWidth: 1, borderColor: colors.border, borderRadius: 24, backgroundColor: colors.card }}>
              <View className="w-8 h-8 rounded-full bg-[#006B23]/10 items-center justify-center">
                <MaterialCommunityIcons name="information-outline" size={18} color="#31973D" />
              </View>

              <View className="flex-1 gap-1">
                <Text style={{ fontSize: 16, color: colors.text }}>
                  How it works
                </Text>

                <Text style={{ fontSize: 14, color: colors.textSub, lineHeight: 24 }}>
                  Tap proceed to open secure Paystack checkout, authorize the payment, and return here automatically once confirmed.
                </Text>
              </View>
            </View>

            <Pressable
              onPress={handleProceedToPay}
              disabled={isLoading}
              className="h-12 bg-[#31973D] rounded-full items-center justify-center"
              style={{ opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-sm">Proceed to pay</Text>
              )}
            </Pressable>

            <Text style={{ fontSize: 10, textAlign: "center", textTransform: "uppercase", color: colors.textMuted }}>
              Secured by Paystack
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default PaymentMethodScreen;
