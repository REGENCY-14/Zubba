import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";

export function PaymentSuccessScreen({
  navigation,
}: RootStackScreenProps<"PaymentSuccess">) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top", "left", "right"]}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>

        <View style={{ height: 48, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, backgroundColor: colors.bg }}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={{ width: 24, height: 24, alignItems: "center", justifyContent: "center" }}
          >
            <Text style={{ fontSize: 28, color: colors.text }}>‹</Text>
          </Pressable>

          <Text style={{ fontSize: 16, fontWeight: "600", color: colors.text }}>
            Success
          </Text>

          <View style={{ width: 24, height: 24 }} />
        </View>

        <View style={{ flex: 1, alignItems: "center", gap: 24, paddingTop: 112 }}>
          <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: "#16A34A", alignItems: "center", justifyContent: "center" }}>
            <MaterialCommunityIcons name="check" size={40} color="#fff" />
          </View>

          <Text style={{ fontSize: 24, fontWeight: "700", color: colors.text, textAlign: "center", lineHeight: 32 }}>
            Your transaction is{"\n"}successful
          </Text>
        </View>

        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.40)" }} pointerEvents="none" />

        <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: colors.card, borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingTop: 16, paddingBottom: 24, gap: 16 }}>

          <View style={{ width: 144, height: 3, backgroundColor: colors.border, borderRadius: 999, alignSelf: "center" }} />

          <Text style={{ paddingHorizontal: 24, fontSize: 16, fontWeight: "500", color: colors.text }}>
            Select a transfer method
          </Text>

          <View style={{ paddingHorizontal: 20 }}>
            <View style={{ backgroundColor: colors.card, borderRadius: 24, padding: 24, gap: 16 }}>

              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 16 }}>
                <Text style={{ color: colors.textSub, fontSize: 16 }}>Transaction ID</Text>
                <Text style={{ color: colors.text, fontWeight: "500" }}>ZB-9928374</Text>
              </View>

              <View style={{ gap: 8 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ color: colors.textSub }}>Bin Bags</Text>
                  <Text style={{ color: colors.text, fontWeight: "500" }}>2 Bags</Text>
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ color: colors.textSub }}>Pickup time</Text>
                  <Text style={{ color: colors.text, fontWeight: "500" }}>Today, 10:30 AM</Text>
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ color: colors.textSub }}>Payment Method</Text>
                  <Text style={{ color: colors.text, fontWeight: "500" }}>MTN MoMo</Text>
                </View>
              </View>

              <View style={{ borderTopWidth: 1, borderTopColor: colors.border, borderStyle: "dashed", paddingTop: 16, flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ color: colors.textSub }}>Amount Paid</Text>

                <View style={{ alignItems: "flex-end" }}>
                  <Text style={{ color: colors.text, fontWeight: "500" }}>GHS</Text>
                  <Text style={{ color: colors.text, fontWeight: "500" }}>45.00</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={{ paddingHorizontal: 24, gap: 8 }}>
            <Pressable
              onPress={() => navigation.navigate("RateRide")}
              style={{ height: 48, backgroundColor: "#31973D", borderRadius: 999, alignItems: "center", justifyContent: "center" }}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 14 }}>Continue</Text>
            </Pressable>

            <Pressable style={{ height: 48, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 999, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: colors.text }}>Download Transaction</Text>
            </Pressable>

            <Pressable style={{ height: 48, backgroundColor: colors.card, borderRadius: 999, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: colors.text, fontWeight: "600" }}>
                Report Issue
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default PaymentSuccessScreen;
