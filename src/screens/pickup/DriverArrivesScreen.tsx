import React from "react";
import { Image, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { RootStackScreenProps } from "../../navigation/types";
import { AppBottomNav } from "../../components";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useTheme } from "../../context/ThemeContext";

const avatar = require("../../../assets/avatar.jpg");
const airtelTigo = require("../../../assets/airtelTigo.png");

type PaymentMethodId = "wallet" | "momo" | "telecel" | "airtel";

const METHOD_LABELS: Record<PaymentMethodId, string> = {
  wallet: "Zubba Wallet",
  momo: "MTN MoMo",
  telecel: "Telecel Cash",
  airtel: "Airtel Money",
};

function PaymentRow({
  selected, onPress, badge, label, last, colors,
}: {
  selected: boolean; onPress: () => void; badge: React.ReactNode; label: string; last?: boolean;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderBottomWidth: last ? 0 : 1, borderBottomColor: colors.border }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
        {badge}
        <Text style={{ fontFamily: "Poppins", fontWeight: "400", fontSize: 14, lineHeight: 24, color: colors.text }}>{label}</Text>
      </View>
      {selected ? (
        <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: "#31973D", alignItems: "center", justifyContent: "center" }}>
          <MaterialCommunityIcons name="check" size={13} color="#FFFFFF" />
        </View>
      ) : (
        <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }} />
      )}
    </Pressable>
  );
}

export function DriverArrivesScreen({ navigation }: RootStackScreenProps<"DriverArrives">) {
  const isPremium = useAppSelector((state) => state.customer.is_premium);
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [showPayment, setShowPayment] = React.useState(false);
  const [selectedMethod, setSelectedMethod] = React.useState<PaymentMethodId>(isPremium ? "wallet" : "momo");

  const rows: { id: PaymentMethodId; badge: React.ReactNode; label: string }[] = [
    ...(isPremium ? [{ id: "wallet" as PaymentMethodId, badge: <View style={{ width: 42, height: 26, backgroundColor: "#31973D", borderRadius: 8, alignItems: "center", justifyContent: "center" }}><MaterialCommunityIcons name="wallet" size={14} color="#FFFFFF" /></View>, label: "Zubba Wallet" }] : []),
    { id: "momo", badge: <View style={{ width: 42, height: 26, backgroundColor: "#FFCC00", borderRadius: 8, alignItems: "center", justifyContent: "center" }}><Text style={{ fontFamily: "Poppins", fontWeight: "600", fontSize: 12, color: "#000000" }}>MTN</Text></View>, label: "MTN MoMo" },
    { id: "telecel", badge: <View style={{ width: 42, height: 26, backgroundColor: "#DC2626", borderRadius: 8, alignItems: "center", justifyContent: "center" }}><Text style={{ fontFamily: "Poppins", fontWeight: "700", fontSize: 12, color: "#FFFFFF" }}>T.cash</Text></View>, label: "Telecel cash" },
    { id: "airtel", badge: <View style={{ width: 42, height: 26, backgroundColor: colors.card, borderRadius: 8, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" }}><Image source={airtelTigo} style={{ width: 22, height: 14 }} resizeMode="contain" /></View>, label: "Airtel money" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top", "left", "right"]}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>

        <View style={{ height: 48, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16 }}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
            <MaterialCommunityIcons name="chevron-left" size={24} color={colors.text} />
          </Pressable>
          <Text style={{ fontFamily: "Poppins", fontWeight: "600", fontSize: 16, lineHeight: 24, color: colors.text }}>
            Driver arrives
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 16, gap: 16, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Driver card */}
          <View style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 24, gap: 16 }}>
            <View style={{ alignItems: "center", gap: 12 }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, overflow: "hidden" }}>
                <Image source={avatar} style={{ width: 40, height: 40 }} resizeMode="cover" />
              </View>
              <Text style={{ fontFamily: "Poppins", fontWeight: "700", fontSize: 16, lineHeight: 24, letterSpacing: 1.6, textTransform: "uppercase", color: colors.text }}>
                MARCUS CHEN
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <MaterialCommunityIcons name="star" size={12} color="#0D631B" />
                <Text style={{ fontFamily: "Poppins", fontWeight: "700", fontSize: 14, lineHeight: 20, color: "#0D631B" }}>
                  4.9 • ZB-Expert
                </Text>
              </View>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Pressable style={{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: colors.surface, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 9999 }}>
                  <MaterialCommunityIcons name="phone-outline" size={12} color={colors.text} />
                  <Text style={{ fontFamily: "Poppins", fontWeight: "400", fontSize: 14, lineHeight: 20, color: colors.text }}>Call</Text>
                </Pressable>
                <Pressable style={{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: colors.surface, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 9999 }}>
                  <MaterialCommunityIcons name="message-outline" size={12} color={colors.text} />
                  <Text style={{ fontFamily: "Poppins", fontWeight: "400", fontSize: 14, lineHeight: 20, color: colors.text }}>Message</Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Collection code */}
          <View style={{ backgroundColor: "#31973D", borderRadius: 24, padding: 24, alignItems: "center", gap: 16 }}>
            <Text style={{ fontFamily: "Poppins", fontWeight: "400", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#FFFFFF", opacity: 0.8 }}>
              COLLECTION CODE
            </Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {["8", "2", "4", "9"].map((d, i) => (
                <View key={i} style={{ width: 47, height: 56, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 12, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontFamily: "Poppins", fontWeight: "900", fontSize: 36, lineHeight: 40, color: "#FFFFFF" }}>{d}</Text>
                </View>
              ))}
            </View>
            <Text style={{ fontFamily: "Poppins", fontWeight: "500", fontSize: 12, lineHeight: 16, color: "#FFFFFF", opacity: 0.9, textAlign: "center" }}>
              Show this to Marcus to verify
            </Text>
          </View>

          {/* Confirm collection */}
          <View style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 24, padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={{ fontFamily: "Poppins", fontWeight: "600", fontSize: 14, lineHeight: 20, color: colors.text }}>Confirm Collection</Text>
              <Text style={{ fontFamily: "Poppins", fontWeight: "400", fontSize: 12, lineHeight: 16, color: colors.textSub }}>Please verify the materials are loaded</Text>
            </View>
            <Pressable style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(0,107,35,0.1)", borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, gap: 6 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2E7D32" }} />
              <Text style={{ fontFamily: "Poppins", fontWeight: "400", fontSize: 13, color: "#31973D" }}>Driver Ready</Text>
            </Pressable>
          </View>

          {/* Buttons */}
          <View style={{ gap: 0 }}>
            <Pressable
              onPress={() => setShowPayment(true)}
              style={{ height: 48, backgroundColor: "#31973D", borderRadius: 999, alignItems: "center", justifyContent: "center" }}
            >
              <Text style={{ fontFamily: "Poppins", fontWeight: "400", fontSize: 14, lineHeight: 20, color: "#FFFFFF" }}>
                Proceed to payment
              </Text>
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate("Details", { itemId: "issue", title: "Issue" })}
              style={{ height: 48, alignItems: "center", justifyContent: "center", borderRadius: 999 }}
            >
              <Text style={{ fontFamily: "Poppins", fontWeight: "400", fontSize: 14, lineHeight: 20, color: colors.textSub, textAlign: "center" }}>
                Report an Issue
              </Text>
            </Pressable>
          </View>
        </ScrollView>

        <AppBottomNav
          activeTab="home"
          paddingBottom={14}
          showCalendar={isPremium}
          onHomePress={() => navigation.navigate("Home")}
          onSavedPress={() => navigation.navigate("Pickups")}
          onSettingsPress={() => navigation.navigate("Settings")}
          onCalendarPress={isPremium ? () => navigation.navigate("Schedule") : undefined}
        />
      </View>

      {/* Payment bottom sheet modal */}
      <Modal
        visible={showPayment}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPayment(false)}
        statusBarTranslucent
      >
        <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.65)" }}>
          <Pressable style={{ flex: 1 }} onPress={() => setShowPayment(false)} />

          <View style={{ backgroundColor: colors.card, borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingBottom: insets.bottom + 24, paddingTop: 16, gap: 16 }}>

            <View style={{ alignItems: "center" }}>
              <View style={{ width: 152, height: 3, backgroundColor: colors.textMuted, borderRadius: 20 }} />
            </View>

            <View style={{ paddingHorizontal: 24 }}>
              <Text style={{ fontFamily: "Poppins", fontWeight: "500", fontSize: 16, lineHeight: 28, letterSpacing: -0.48, color: colors.text }}>
                Select a payment method
              </Text>
            </View>

            <View style={{ paddingHorizontal: 20 }}>
              {rows.map((row, i) => (
                <PaymentRow
                  key={row.id}
                  selected={selectedMethod === row.id}
                  onPress={() => setSelectedMethod(row.id)}
                  badge={row.badge}
                  label={row.label}
                  last={i === rows.length - 1}
                  colors={colors}
                />
              ))}
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 24, gap: 10 }}>
              <Pressable
                onPress={() => setShowPayment(false)}
                style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: "#FFE2E2", alignItems: "center", justifyContent: "center" }}
              >
                <MaterialCommunityIcons name="close" size={16} color="#EF4444" />
              </Pressable>
              <Pressable
                onPress={() => {
                  setShowPayment(false);
                  selectedMethod === "wallet"
                    ? navigation.navigate("WalletCheckout")
                    : navigation.navigate("PaymentMethod", { method: METHOD_LABELS[selectedMethod] });
                }}
                style={{ flex: 1, height: 40, backgroundColor: "#31973D", borderRadius: 999, alignItems: "center", justifyContent: "center" }}
              >
                <Text style={{ fontFamily: "Poppins", fontWeight: "400", fontSize: 14, lineHeight: 20, color: "#FFFFFF" }}>
                  Continue
                </Text>
              </Pressable>
            </View>

          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default DriverArrivesScreen;
