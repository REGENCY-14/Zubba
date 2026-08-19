import React, { useState } from "react";
import { Dimensions, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";
import { APP_DARK } from "../../constants/appDarkTheme";
import CustomAppBar from "../../components/common/CustomAppBar";
import { scale, verticalScale, moderateScale } from "../../utils/scale";
import { walletService } from "../../api/walletService";
import { handleApiError } from "../../utils/handleApiError";
import { useAppSelector } from "../../hooks/useAppSelector";
import { formatAuthPhone } from "../../utils/paymentProviders";
import { toast } from "../../hooks/toast";

const QUICK_AMOUNTS = [10, 20, 50, 100, 200];

export function WithdrawScreen({
  navigation,
  route,
}: RootStackScreenProps<"Withdraw">) {
  const { colors, isDark } = useTheme();
  const user = useAppSelector((state) => state.auth.user);

  const { provider = "mtn", methodLabel = "Mobile Money" } = route.params ?? {};

  const [phone, setPhone] = useState(formatAuthPhone(user?.phone) || "055 123 4567");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("GHS 50.00");
  const [loading, setLoading] = useState(false);

  const parseAmount = () => {
    if (selectedAmount) return selectedAmount;
    const numeric = Number(customAmount.replace(/[^\d.]/g, ""));
    return numeric || 0;
  };

  const handleWithdraw = async () => {
    const amount = parseAmount();
    if (amount <= 0 || loading) return;
    setLoading(true);
    try {
      const res = await walletService.withdraw({
        amount,
        phone: phone.replace(/\s/g, ""),
        provider,
        name: `${user?.firstname ?? ""} ${user?.lastname ?? ""}`.trim() || "Zubba User",
      });
      if (res.success) {
        toast.success(
          `Withdrawal initiated${res.data.reference ? `\nRef: ${res.data.reference}` : ""}`,
        );
        navigation.navigate("ZubbaWallet", { debited: true });
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChip = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount(`GHS ${amount}.00`);
  };

  const handleAmountChange = (text: string) => {
    setCustomAmount(text);
    setSelectedAmount(null);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.bg }}
      edges={["top", "left", "right", "bottom"]}
    >
      <CustomAppBar title="Withdraw Funds" navigation={navigation} />

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
            minHeight: Dimensions.get("window").height - 175,
            backgroundColor: isDark ? colors.surface : colors.bg,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: moderateScale(24),
            padding: moderateScale(16),
            gap: moderateScale(16),
          }}
        >
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: scale(8),
                marginBottom: moderateScale(16),
                backgroundColor: colors.surface,
                borderRadius: moderateScale(16),
                padding: moderateScale(12),
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: moderateScale(11), color: colors.textMuted, textTransform: "uppercase", letterSpacing: 0.4 }}>
                  From
                </Text>
                <Text style={{ fontSize: moderateScale(14), fontWeight: "600", color: colors.text }}>
                  Zubba Wallet
                </Text>
              </View>
              <MaterialCommunityIcons name="arrow-right" size={moderateScale(18)} color={colors.textSub} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: moderateScale(11), color: colors.textMuted, textTransform: "uppercase", letterSpacing: 0.4 }}>
                  To
                </Text>
                <Text style={{ fontSize: moderateScale(14), fontWeight: "600", color: colors.text }}>
                  {methodLabel}
                </Text>
              </View>
            </View>

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
                Recipient Mobile Money Number
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
                Funds will be sent to this {methodLabel} number
              </Text>
            </View>

            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: colors.borderLight,
                paddingTop: verticalScale(8),
                gap: moderateScale(8),
                marginTop: verticalScale(8),
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
                Amount to withdraw
              </Text>

              <TextInput
                value={customAmount}
                onChangeText={handleAmountChange}
                keyboardType="numeric"
                placeholder="GHS 0.00"
                placeholderTextColor={isDark ? APP_DARK.textMuted : "#ACB5BB"}
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
                          ? isDark
                            ? APP_DARK.buttonPrimaryBg
                            : "#31973D"
                          : isDark
                            ? APP_DARK.statusSuccessBg
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
                backgroundColor: isDark ? APP_DARK.buttonPrimaryBg : "#31973D",
                borderRadius: 9999,
                alignItems: "center",
                justifyContent: "center",
                opacity: loading ? 0.6 : 1,
              }}
              onPress={handleWithdraw}
              disabled={loading}
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
                  Withdraw
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

export default WithdrawScreen;
