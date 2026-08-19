import React from "react";
import { Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import type { RootStackScreenProps } from "../../navigation/types";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useTheme } from "../../context/ThemeContext";
import type { ThemeColors } from "../../context/ThemeContext";
import { APP_DARK } from "../../constants/appDarkTheme";
import { scale, verticalScale, moderateScale } from "../../utils/scale";
import {
  getMethodLabel,
  isWalletMethod,
  mapMethodToChannel,
  mapMethodToProvider,
  type PaymentMethodId,
} from "../../utils/paymentProviders";

type RowProps = {
  selected: boolean;
  onPress: () => void;
  badge: React.ReactNode;
  label: string;
  last?: boolean;
  colors: ThemeColors;
  isDark: boolean;
};

function PaymentRow({ selected, onPress, badge, label, last, colors, isDark }: RowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: moderateScale(16), borderBottomWidth: last ? 0 : 1, borderBottomColor: colors.border }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: scale(16) }}>
        {badge}
        <Text style={{ fontFamily: "Poppins", fontWeight: "400", fontSize: moderateScale(14), lineHeight: moderateScale(24), color: colors.text }}>
          {label}
        </Text>
      </View>

      {selected ? (
        <View style={{ width: moderateScale(22), height: moderateScale(22), borderRadius: moderateScale(11), backgroundColor: isDark ? APP_DARK.accentGreen : "#31973D", alignItems: "center", justifyContent: "center" }}>
          <MaterialCommunityIcons name="check" size={moderateScale(13)} color="#FFFFFF" />
        </View>
      ) : (
        <View style={{ width: moderateScale(20), height: moderateScale(20), borderRadius: moderateScale(10), backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }} />
      )}
    </Pressable>
  );
}

function MobileMoneyBadge() {
  const { isDark } = useTheme();
  return (
    <View
      style={{
        width: scale(42),
        height: verticalScale(26),
        backgroundColor: "#FFCC00",
        borderRadius: moderateScale(8),
        alignItems: "center",
        justifyContent: "center",
        borderWidth: isDark ? 1 : 0,
        borderColor: APP_DARK.border,
      }}
    >
      <Text style={{ fontFamily: "Poppins", fontWeight: "600", fontSize: moderateScale(12), color: "#000000" }}>MOMO</Text>
    </View>
  );
}

function CardBadge() {
  const { isDark } = useTheme();
  return (
    <View style={{ width: scale(42), height: verticalScale(26), backgroundColor: isDark ? APP_DARK.statusSuccessBg : "#E8F2E8", borderRadius: moderateScale(8), alignItems: "center", justifyContent: "center" }}>
      <MaterialCommunityIcons name="credit-card-outline" size={moderateScale(16)} color={isDark ? APP_DARK.statusSuccessText : "#31973D"} />
    </View>
  );
}

function WalletBadge() {
  const { isDark } = useTheme();
  return (
    <View style={{ width: scale(42), height: verticalScale(26), backgroundColor: isDark ? APP_DARK.accentGreen : "#31973D", borderRadius: moderateScale(8), alignItems: "center", justifyContent: "center" }}>
      <MaterialCommunityIcons name="wallet" size={moderateScale(14)} color="#FFFFFF" />
    </View>
  );
}

export function PaymentScreen({ navigation }: RootStackScreenProps<"Payment">) {
  const isPremium = useAppSelector((state) => state.customer.is_premium);
  const { colors, isDark } = useTheme();
  const [selectedMethod, setSelectedMethod] = React.useState<PaymentMethodId>(isPremium ? "wallet" : "mobile_money");

  const rows: { id: PaymentMethodId; badge: React.ReactNode; label: string }[] = [
    ...(isPremium ? [{ id: "wallet" as PaymentMethodId, badge: <WalletBadge />, label: getMethodLabel("wallet") }] : []),
    { id: "mobile_money", badge: <MobileMoneyBadge />, label: getMethodLabel("mobile_money") },
    { id: "card", badge: <CardBadge />, label: getMethodLabel("card") },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "transparent" }}>
      <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.65)" }} onPress={() => navigation.goBack()} />

      <View style={{ backgroundColor: colors.card, borderTopLeftRadius: moderateScale(32), borderTopRightRadius: moderateScale(32) }}>
        <SafeAreaView edges={["bottom"]} style={{ backgroundColor: "transparent" }}>
          <View style={{ paddingTop: verticalScale(16), paddingBottom: verticalScale(24), gap: moderateScale(16) }}>

            <View style={{ alignItems: "center" }}>
              <View style={{ width: scale(152), height: verticalScale(3), backgroundColor: colors.textMuted, borderRadius: moderateScale(20) }} />
            </View>

            <View style={{ paddingHorizontal: scale(24) }}>
              <Text style={{ fontFamily: "Poppins", fontWeight: "500", fontSize: moderateScale(16), lineHeight: moderateScale(28), letterSpacing: -0.48, color: colors.text }}>
                Select a payment method
              </Text>
            </View>

            <View style={{ paddingHorizontal: scale(20) }}>
              {rows.map((row, i) => (
                <PaymentRow
                  key={row.id}
                  selected={selectedMethod === row.id}
                  onPress={() => setSelectedMethod(row.id)}
                  badge={row.badge}
                  label={row.label}
                  last={i === rows.length - 1}
                  colors={colors}
                  isDark={isDark}
                />
              ))}
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: scale(24), gap: scale(10) }}>
              <Pressable
                onPress={() => navigation.goBack()}
                style={{ width: moderateScale(32), height: moderateScale(32), borderRadius: moderateScale(12), backgroundColor: isDark ? APP_DARK.statusErrorBg : "#FFE2E2", alignItems: "center", justifyContent: "center" }}
              >
                <MaterialCommunityIcons name="close" size={moderateScale(16)} color={isDark ? APP_DARK.statusErrorText : "#EF4444"} />
              </Pressable>

              <Pressable
                onPress={() => {
                  if (isWalletMethod(selectedMethod)) {
                    navigation.navigate("WalletCheckout");
                    return;
                  }

                  navigation.navigate("PaymentMethod", {
                    provider: mapMethodToProvider(selectedMethod),
                    methodLabel: getMethodLabel(selectedMethod),
                    channel: mapMethodToChannel(selectedMethod),
                  });
                }}
                style={{ flex: 1, height: verticalScale(40), backgroundColor: isDark ? APP_DARK.buttonPrimaryBg : "#31973D", borderRadius: 999, alignItems: "center", justifyContent: "center" }}
              >
                <Text style={{ fontFamily: "Poppins", fontWeight: "400", fontSize: moderateScale(14), lineHeight: moderateScale(20), color: "#FFFFFF" }}>
                  Continue
                </Text>
              </Pressable>
            </View>

          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}

export default PaymentScreen;
