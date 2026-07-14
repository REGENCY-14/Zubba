import React from "react";
import { Image, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { RootStackScreenProps } from "../../navigation/types";
import { AppBottomNav } from "../../components";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useTheme } from "../../context/ThemeContext";
import PaymentMethodDrawer from "../../components/payment/PaymentDrawer";

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
  const request = useAppSelector((state) => state.request)
  const [showPaymentDrawer, setShowPaymentDrawer] = React.useState(false);

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
          <View style={{ width: '100%', gap: 12, borderWidth: 1, borderColor: colors.border, borderRadius: 24, backgroundColor: colors.card, padding: 24, alignItems: 'center', justifyContent: 'center' }}>
            <View>
              <View style={{ width: 54, height: 54, borderRadius: 12, overflow: 'hidden' }}>
                <Image
                  source={avatar}
                  style={{ width: 54, height: 54 }}
                  resizeMode="cover"
                />
              </View>
            </View>

            <View style={{ gap: 8, alignItems: 'center' }}>
              <Text style={{ marginTop: 12, fontSize: 14, fontWeight: 'bold', color: colors.text, textTransform: 'uppercase' }}>
                {request.driver.name}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name="star" size={14} color="#0D631B" />
                <Text style={{ fontSize: 14, color: '#0D631B', marginLeft: 4 }}>
                  {request.driver.rating <= 0 ? "First Request" : request.driver.rating} • {request.driver.code}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 24 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <MaterialCommunityIcons
                    name="phone-outline"
                    size={16}
                    color={colors.textMuted}
                  />
                  <Text style={{ marginLeft: 4, color: colors.textMuted, fontSize: 14 }}>Call</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <MaterialCommunityIcons
                    name="message-outline"
                    size={16}
                    color={colors.textMuted}
                  />
                  <Text style={{ marginLeft: 4, color: colors.textMuted, fontSize: 14 }}>Message</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Collection code */}
          <View style={{ backgroundColor: "#31973D", borderRadius: 24, padding: 24, alignItems: "center", gap: 16 }}>
            <Text style={{ fontFamily: "Poppins", fontWeight: "400", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#FFFFFF", opacity: 0.8 }}>
              COLLECTION CODE
            </Text>

            <View style={{ flexDirection: 'row', gap: 8, width: '100%', justifyContent: 'center' }}>
              {request.collection_code.toString().split("").map((d, i) => (
                <View
                  key={i}
                  style={{ width: 56, height: 56, paddingBottom: 4, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', borderRadius: 12 }}
                >
                  <Text
                    style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 36 }}
                  >
                    {d}
                  </Text>
                </View>
              ))}
            </View>

            <Text style={{ color: '#FFFFFF', fontSize: 12, textAlign: 'center', opacity: 0.9 }}>
              Show this to {request.driver.name} to verify
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
              onPress={() => setShowPaymentDrawer(true)}
              style={{ height: 48, backgroundColor: '#31973D', borderRadius: 999, alignItems: 'center', justifyContent: 'center' }}
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
          navigation={navigation}
        />

        <PaymentMethodDrawer
          visible={showPaymentDrawer}
          onClose={() => setShowPaymentDrawer(false)}
          onContinue={(method) => {
            setShowPaymentDrawer(false);
            if (method === "wallet") {
              navigation.navigate("WalletCheckout");
            } else {
              navigation.navigate("PaymentMethod");
            }
          }}
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
