import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";
import { useAppSelector } from "../../hooks/useAppSelector";

function Row({ label, value, large }: { label: string; value: string; large?: boolean }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      <Text style={{ fontFamily: "Poppins", fontWeight: "500", fontSize: 14, color: "#9CA3AF" }}>
        {label}
      </Text>
      <Text style={{ fontFamily: "Poppins", fontWeight: "700", fontSize: large ? 18 : 14, color: "#1F2937" }}>
        {value}
      </Text>
    </View>
  );
}

export function PaymentSuccessScreen({
  navigation,
  route,
}: RootStackScreenProps<"PaymentSuccess">) {
  const { method, phone } = route.params;
  const { colors } = useTheme();
  const user = useAppSelector((state) => state.auth.user);
  const accountName = user ? `${user.firstname} ${user.lastname}` : "—";

  const now = new Date();
  const date = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;
  const hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  const pickupTime = `${hours % 12 || 12}:${minutes} ${ampm}`;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top", "left", "right"]}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>

        {/* Header */}
        <View style={{ height: 48, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16 }}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
            <MaterialCommunityIcons name="chevron-left" size={28} color={colors.text} />
          </Pressable>
          <Text style={{ fontFamily: "Poppins", fontWeight: "600", fontSize: 16, color: "#1F2A33" }}>
            Payment status
          </Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Main card */}
          <View style={{ backgroundColor: "#FFFFFF", borderRadius: 24, padding: 32, gap: 24, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 30, shadowOffset: { width: 0, height: 10 }, elevation: 4 }}>

            {/* Success icon */}
            <View style={{ alignItems: "center" }}>
              <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: "#DCFCE7", alignItems: "center", justifyContent: "center" }}>
                <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: "#31973D", alignItems: "center", justifyContent: "center" }}>
                  <MaterialCommunityIcons name="check" size={36} color="#FFFFFF" strokeWidth={3} />
                </View>
              </View>
            </View>

            {/* Heading */}
            <View style={{ alignItems: "center", paddingBottom: 8 }}>
              <Text style={{ fontFamily: "Poppins", fontWeight: "800", fontSize: 20, lineHeight: 28, color: "#111827", textAlign: "center" }}>
                Transaction successful
              </Text>
            </View>

            {/* Dashed divider */}
            <View style={{ height: 1, borderTopWidth: 1, borderTopColor: "#E5E7EB", borderStyle: "dashed" }} />

            {/* Transaction rows */}
            <View style={{ gap: 20, paddingTop: 8 }}>
              <Row label="Payment method" value={method} />
              <Row label="Account number" value={phone.replace(/\s/g, "")} />
              <Row label="Account name" value={accountName} />
              <Row label="Bin bags" value="2" />
              <Row label="Amount" value="GHS 45.00" large />
              <Row label="Date" value={date} />
              <Row label="Pickup time" value={pickupTime} />
            </View>

            {/* Download receipt */}
            <View style={{ alignItems: "center", paddingTop: 16 }}>
              <Pressable>
                <Text style={{ fontFamily: "Poppins", fontWeight: "700", fontSize: 16, color: "#3B82F6" }}>
                  Download receipt
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Done button */}
          <Pressable
            onPress={() => navigation.navigate("RateRide")}
            style={{ height: 48, backgroundColor: "#31973D", borderRadius: 9999, alignItems: "center", justifyContent: "center" }}
          >
            <Text style={{ fontFamily: "Poppins", fontWeight: "400", fontSize: 14, color: "#FFFFFF" }}>
              Done
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default PaymentSuccessScreen;
