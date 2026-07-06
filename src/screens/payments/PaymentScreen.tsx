import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import type { RootStackScreenProps } from "../../navigation/types";
import { AppBottomNav } from "../../components";
import { useAppSelector } from "../../hooks/useAppSelector";

type PaymentMethodId = "wallet" | "momo" | "telecel" | "airtel";

const METHOD_LABELS: Record<PaymentMethodId, string> = {
  wallet: "Zubba Wallet",
  momo: "MTN MoMo",
  telecel: "Telecel Cash",
  airtel: "Airtel Money",
};

type RowProps = {
  selected: boolean;
  onPress: () => void;
  badge: React.ReactNode;
  label: string;
  last?: boolean;
};

function PaymentRow({ selected, onPress, badge, label, last }: RowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: "#E2E8F0",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
        {badge}
        <Text style={{ fontFamily: "Poppins", fontWeight: "400", fontSize: 14, lineHeight: 24, color: "#1C1B1B" }}>
          {label}
        </Text>
      </View>

      {selected ? (
        <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: "#31973D", alignItems: "center", justifyContent: "center" }}>
          <MaterialCommunityIcons name="check" size={13} color="#FFFFFF" />
        </View>
      ) : (
        <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#8E7164" }} />
      )}
    </Pressable>
  );
}

function MtnBadge() {
  return (
    <View style={{ width: 42, height: 26, backgroundColor: "#FFCC00", borderRadius: 8, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontFamily: "Poppins", fontWeight: "600", fontSize: 12, color: "#000000" }}>MTN</Text>
    </View>
  );
}

function TelecelBadge() {
  return (
    <View style={{ width: 42, height: 26, backgroundColor: "#DC2626", borderRadius: 8, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontFamily: "Poppins", fontWeight: "700", fontSize: 12, color: "#FFFFFF" }}>T.cash</Text>
    </View>
  );
}

function WalletBadge() {
  return (
    <View style={{ width: 42, height: 26, backgroundColor: "#31973D", borderRadius: 8, alignItems: "center", justifyContent: "center" }}>
      <MaterialCommunityIcons name="wallet" size={14} color="#FFFFFF" />
    </View>
  );
}

const airtelTigo = require("../../../assets/airtelTigo.png");

function AirtelBadge() {
  return (
    <View style={{ width: 42, height: 26, backgroundColor: "#FFFFFF", borderRadius: 8, borderWidth: 1, borderColor: "#E2E8F0", alignItems: "center", justifyContent: "center" }}>
      <Image source={airtelTigo} style={{ width: 22, height: 14 }} resizeMode="contain" />
    </View>
  );
}

export function PaymentScreen({ navigation }: RootStackScreenProps<"Payment">) {
  const isPremium = useAppSelector((state) => state.customer.is_premium);
  const [selectedMethod, setSelectedMethod] = React.useState<PaymentMethodId>(isPremium ? "wallet" : "momo");

  const rows: { id: PaymentMethodId; badge: React.ReactNode; label: string }[] = [
    ...(isPremium ? [{ id: "wallet" as PaymentMethodId, badge: <WalletBadge />, label: "Zubba Wallet" }] : []),
    { id: "momo", badge: <MtnBadge />, label: "MTN MoMo" },
    { id: "telecel", badge: <TelecelBadge />, label: "Telecel cash" },
    { id: "airtel", badge: <AirtelBadge />, label: "Airtel money" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "transparent" }}>
      {/* Dimmed overlay — tap to dismiss */}
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.65)" }}
        onPress={() => navigation.goBack()}
      />

      {/* Bottom sheet */}
      <View style={{ backgroundColor: "#FFFFFF", borderTopLeftRadius: 32, borderTopRightRadius: 32 }}>
        <SafeAreaView edges={["bottom"]} style={{ backgroundColor: "transparent" }}>
        <View style={{ paddingTop: 16, paddingBottom: 24, gap: 16 }}>

          {/* Handle */}
          <View style={{ alignItems: "center" }}>
            <View style={{ width: 152, height: 3, backgroundColor: "#334154", borderRadius: 20 }} />
          </View>

          {/* Title */}
          <View style={{ paddingHorizontal: 24 }}>
            <Text style={{ fontFamily: "Poppins", fontWeight: "500", fontSize: 16, lineHeight: 28, letterSpacing: -0.48, color: "#000000" }}>
              Select  a payment method
            </Text>
          </View>

          {/* Payment rows */}
          <View style={{ paddingHorizontal: 20 }}>
            {rows.map((row, i) => (
              <PaymentRow
                key={row.id}
                selected={selectedMethod === row.id}
                onPress={() => setSelectedMethod(row.id)}
                badge={row.badge}
                label={row.label}
                last={i === rows.length - 1}
              />
            ))}
          </View>

          {/* Actions */}
          <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 24, gap: 10 }}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: "#FFE2E2", alignItems: "center", justifyContent: "center" }}
            >
              <MaterialCommunityIcons name="close" size={16} color="#EF4444" />
            </Pressable>

            <Pressable
              onPress={() =>
                selectedMethod === "wallet"
                  ? navigation.navigate("WalletCheckout")
                  : navigation.navigate("PaymentMethod", { method: METHOD_LABELS[selectedMethod] })
              }
              style={{ flex: 1, height: 40, backgroundColor: "#31973D", borderRadius: 999, alignItems: "center", justifyContent: "center" }}
            >
              <Text style={{ fontFamily: "Poppins", fontWeight: "400", fontSize: 14, lineHeight: 20, color: "#FFFFFF" }}>
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
