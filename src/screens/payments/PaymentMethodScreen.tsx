import React from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { RootStackScreenProps } from "../../navigation/types";
import { AppBottomNav } from "../../components";
import CustomAppBar from "../../components/common/CustomAppBar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { useAppSelector } from "../../hooks/useAppSelector";

export function PaymentMethodScreen({
  navigation,
  route,
}: RootStackScreenProps<"PaymentMethod">) {
  const { method } = route.params;
  const [phoneNumber, setPhoneNumber] = React.useState("055 123 4567");
  const { colors } = useTheme();
  const isPremium = useAppSelector((state) => state.customer.is_premium);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top", "left", "right"]}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <CustomAppBar navigation={navigation} title="Payment" />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: 120, gap: 24 }}
        >

          <View className="gap-6">

            <View style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 24, padding: 24, alignItems: "center", gap: 16 }}>

              <View className="w-14 h-14 rounded-full bg-[#41A06A]/10 items-center justify-center">
                <MaterialCommunityIcons
                  name="wallet"
                  size={27}
                  color="#31973D"
                />
              </View>

              <Text style={{ fontSize: 16, textAlign: "center", color: colors.textSub }}>
                Total to Pay
              </Text>

              <Text style={{ fontSize: 32, fontWeight: "600", color: colors.text, textAlign: "center" }}>
                GHS 45.00
              </Text>

              <View style={{ width: "100%", borderTopWidth: 1, borderTopColor: colors.border }} />

              <View className="bg-[#E8F2E8] px-3 py-1 rounded-full border border-[#E2E8F0]">
                <Text className="text-[#31973D] text-[13px] font-bold">
                  Includes all fees
                </Text>
              </View>
            </View>

            <View className="gap-2">

              <Text style={{ fontSize: 16, color: colors.text }}>
                {method} Number
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
                Enter your mobile money number
              </Text>
            </View>

            <Pressable
              onPress={() => navigation.navigate("PaymentVerification", { method, phone: phoneNumber })}
              className="h-12 bg-[#31973D] rounded-full items-center justify-center"
            >
              <Text className="text-white text-sm">
                Proceed to verify
              </Text>
            </Pressable>

            <Text style={{ fontSize: 10, textAlign: "center", textTransform: "uppercase", color: colors.textMuted }}>
              Secured by Zubba Pay Architecture
            </Text>
          </View>
        </ScrollView>

        <AppBottomNav
          activeTab="home"
          paddingBottom={14}
          bottomOffset={8}
          showCalendar={isPremium}
          onHomePress={() => navigation.navigate('Home')}
          onSavedPress={() => navigation.navigate('Pickups')}
          onSettingsPress={() => navigation.navigate('Settings')}
          onCalendarPress={isPremium ? () => navigation.navigate('Schedule') : undefined}
        />
      </View>
    </SafeAreaView>
  );
}

export default PaymentMethodScreen;
