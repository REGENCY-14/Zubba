import React, { useState } from "react";
import { Dimensions, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";
import CustomAppBar from "../../components/common/CustomAppBar";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useWalletPaystackCheckout } from "../../hooks/useWalletPaystackCheckout";
import { formatAuthPhone } from "../../utils/paymentProviders";
import { toast } from "../../hooks/toast";
import { scale, verticalScale, moderateScale } from "../../utils/scale";

const QUICK_AMOUNTS = [10, 20, 50, 100, 200];

export function CreditAccountScreen({
  navigation,
  route,
}: RootStackScreenProps<"CreditAccount">) {
  const { colors, isDark } = useTheme();
  const user = useAppSelector((state) => state.auth.user);
  const { startDeposit, isLoading } = useWalletPaystackCheckout();

  const {
    provider = "mtn",
    methodLabel = "Mobile Money",
    channel = "mobile_money",
  } = route.params ?? {};

  const [phone, setPhone] = useState(formatAuthPhone(user?.phone) || "055 123 4567");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("GHS 50.00");

  const parseAmount = () => {
    if (selectedAmount) return selectedAmount;
    const numeric = Number(customAmount.replace(/[^\d.]/g, ""));
    return numeric || 0;
  };

  const handleTopUp = async () => {
    const amount = parseAmount();
    if (amount <= 0 || isLoading) return;

    if (!user?.email) {
      toast.error("A verified email is required to complete payment.");
      return;
    }

    await startDeposit({
      email: user.email,
      phone: channel === "mobile_money" ? phone : formatAuthPhone(user.phone),
      amount,
      provider,
      paymentMethodLabel: methodLabel,
      channel,
    });
  };

  const handleAmountChip = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount(`GHS ${amount}.00`);
  };

  const handleAmountChange = (text: string) => {
    setCustomAmount(text);
    setSelectedAmount(null);
  };

  const loading = isLoading;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.bg }}
      edges={["top", "left", "right", "bottom"]}
    >
      <CustomAppBar title="Credit Account" navigation={navigation} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, padding: moderateScale(12) }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          className="flex justify-between"
          style={{
            minHeight: Dimensions.get("window").height - 120,
            backgroundColor: isDark ? colors.surface : colors.bg,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: moderateScale(24),
            padding: moderateScale(16),
            gap: moderateScale(16),
          }}
        >
          <View>
            <View style={{ marginBottom: moderateScale(12) }}>
              <Text style={{ fontSize: moderateScale(14), color: colors.textSub }}>
                Payment method: {methodLabel}
              </Text>
            </View>

            {channel === "mobile_money" ? (
              <View style={{ gap: moderateScale(8) }}>
                <Text
                  style={{
                    fontSize: moderateScale(14),
                    fontWeight: "400",
                    letterSpacing: 0.15,
                    color: colors.text,
                    lineHeight: moderateScale(22),
                  }}
                >
                  Wallet Phone Number
                </Text>

                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  placeholder="055 123 4567"
                  placeholderTextColor={colors.textSub}
                  style={{
                    height: verticalScale(48),
                    borderWidth: 1,
                    borderColor: colors.border,
                    backgroundColor: colors.bg,
                    borderRadius: 9999,
                    paddingHorizontal: scale(12),
                    fontSize: moderateScale(16),
                    color: colors.text,
                  }}
                />

                <Text
                  style={{
                    fontSize: moderateScale(12),
                    fontWeight: "400",
                    color: colors.textMuted,
                    lineHeight: moderateScale(16),
                  }}
                >
                  Enter your mobile money number
                </Text>
              </View>
            ) : null}

            <View
              style={{
                borderTopWidth: channel === "mobile_money" ? 1 : 0,
                borderTopColor: colors.borderLight,
                paddingTop: verticalScale(8),
                gap: moderateScale(8),
                marginTop: channel === "mobile_money" ? verticalScale(8) : 0,
              }}
            >
              <Text
                style={{
                  fontSize: moderateScale(14),
                  fontWeight: "400",
                  letterSpacing: 0.15,
                  color: colors.text,
                  lineHeight: moderateScale(22),
                }}
              >
                Amount to top up
              </Text>

              <TextInput
                value={customAmount}
                onChangeText={handleAmountChange}
                keyboardType="numeric"
                placeholder="GHS 0.00"
                placeholderTextColor="#ACB5BB"
                style={{
                  height: verticalScale(48),
                  borderWidth: 1,
                  backgroundColor: colors.bg,
                  borderColor: colors.border,
                  borderRadius: 9999,
                  paddingHorizontal: scale(12),
                  fontSize: moderateScale(16),
                  color: colors.text,
                }}
              />

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: verticalScale(8), gap: scale(8) }}
              >
                {QUICK_AMOUNTS.map((amount) => {
                  const isSelected = selectedAmount === amount;
                  return (
                    <Pressable
                      key={amount}
                      onPress={() => handleAmountChip(amount)}
                      style={{
                        paddingHorizontal: scale(24),
                        paddingVertical: verticalScale(9),
                        borderRadius: 9999,
                        backgroundColor: isSelected
                          ? "#31973D"
                          : "rgba(0, 107, 35, 0.1)",
                        borderWidth: isSelected ? 0 : 1,
                        borderColor: colors.border,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: moderateScale(16),
                          fontWeight: "400",
                          lineHeight: moderateScale(24),
                          color: isSelected ? colors.bg : colors.textMuted,
                        }}
                      >
                        GHS {amount}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          </View>

          <View style={{ paddingVertical: verticalScale(12) }}>
            <Pressable
              style={{
                height: verticalScale(48),
                backgroundColor: "#31973D",
                borderRadius: 9999,
                alignItems: "center",
                justifyContent: "center",
                opacity: loading ? 0.6 : 1,
              }}
              disabled={loading}
              onPress={handleTopUp}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text
                  style={{
                    fontSize: moderateScale(14),
                    fontWeight: "400",
                    color: "#FFFFFF",
                    lineHeight: moderateScale(20),
                  }}
                >
                  Top up
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default CreditAccountScreen;
