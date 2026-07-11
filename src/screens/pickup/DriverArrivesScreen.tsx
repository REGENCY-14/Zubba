import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackScreenProps } from "../../navigation/types";
import { AppBottomNav } from "../../components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomAppBar from "../../components/common/CustomAppBar";
import { useTheme } from "../../context/ThemeContext";
import PaymentMethodDrawer from "../../components/payment/PaymentDrawer";

const avatar = require("../../../assets/avatar.jpg");

export function DriverArrivesScreen({
  navigation,
}: RootStackScreenProps<"DriverArrives">) {
  const { colors } = useTheme();
  const [showPaymentDrawer, setShowPaymentDrawer] = React.useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top", "left", "right"]}>
      <View style={{ flex: 1, backgroundColor: colors.surface }}>
        <CustomAppBar title="Driver Arrives" navigation={navigation} />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 120, gap: 16 }}
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
                MARCUS CHEN
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name="star" size={14} color="#0D631B" />
                <Text style={{ fontSize: 14, color: '#0D631B', marginLeft: 4 }}>
                  4.9 • ZB-0248
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

          <View style={{ backgroundColor: '#31973D', borderRadius: 24, padding: 24, alignItems: 'center', gap: 16 }}>
            <Text style={{ fontSize: 10, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 4 }}>
              COLLECTION CODE
            </Text>

            <View style={{ flexDirection: 'row', gap: 8, width: '100%', justifyContent: 'center' }}>
              {["8", "2", "4", "9"].map((d, i) => (
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
              Show this to Marcus to verify
            </Text>
          </View>

          <View style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 24, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>
                Confirm Collection
              </Text>
              <Text style={{ fontSize: 12, color: colors.textSub, marginTop: 4 }}>
                Please verify the materials are loaded
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(49,151,61,0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, borderWidth: 1, borderColor: colors.border }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#2E7D32', marginRight: 8 }} />
              <Text style={{ fontSize: 13, color: '#31973D' }}>Driver Ready</Text>
            </View>
          </View>

          <View style={{ gap: 16 }}>
            <Pressable
              onPress={() => setShowPaymentDrawer(true)}
              style={{ height: 48, backgroundColor: '#31973D', borderRadius: 999, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 14 }}>Proceed to payment</Text>
            </Pressable>

            <Pressable
              onPress={() =>
                navigation.navigate("Details", {
                  itemId: "issue",
                  title: "Issue",
                })
              }
              style={{ height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 999 }}
            >
              <Text style={{ color: colors.text, fontSize: 14 }}>Report an Issue</Text>
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
    </SafeAreaView>
  );
}

export default DriverArrivesScreen;
