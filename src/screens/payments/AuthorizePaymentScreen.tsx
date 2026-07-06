import React from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { RootStackScreenProps } from "../../navigation/types";
import { AppBottomNav } from "../../components";
import CustomAppBar from "../../components/common/CustomAppBar";
import { useTheme } from "../../context/ThemeContext";
import { useAppSelector } from "../../hooks/useAppSelector";

export function AuthorizePaymentScreen({
  navigation,
  route,
}: RootStackScreenProps<"AuthorizePayment">) {
  const { method, phone } = route.params;
  const { colors } = useTheme();
  const isPremium = useAppSelector((state) => state.customer.is_premium);
  const [pin, setPin] = React.useState("");
  const inputRef = React.useRef<TextInput | null>(null);

  const digits = Array.from({ length: 4 }).map((_, i) => pin[i] || "");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top", "left", "right"]}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <CustomAppBar navigation={navigation} title="Payment Verification" />

        <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 120, gap: 24 }}>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <View className="w-8 h-8 rounded-lg bg-[#31973D] items-center justify-center">
                <MaterialCommunityIcons name="shield-account-outline" size={16} color="#fff" />
              </View>
              <Text style={{ fontSize: 16, color: colors.text }}>Enter PIN</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, backgroundColor: colors.iconBg }}>
              <View className="w-2 h-2 rounded-full bg-[#006B23]" />
              <Text style={{ fontSize: 12, fontWeight: '600', color: colors.text }}>
                {method}
              </Text>
            </View>
          </View>

          <Text style={{ fontSize: 16, color: colors.textSub, lineHeight: 24 }}>
            Enter your 4-digit PIN to authorize the payment of{" "}
            <Text style={{ fontWeight: '700', color: colors.text }}>GHS 45.00</Text> to{" "}
            <Text style={{ fontWeight: '700', color: colors.text }}>Zubba</Text>.
          </Text>

          <View className="flex-row gap-3">
            {digits.map((d, i) => {
              const filled = i < pin.length;
              const active = i === pin.length && pin.length < 4;

              return (
                <Pressable
                  key={i}
                  onPress={() => inputRef.current?.focus()}
                  style={[
                    {
                      width: active ? 56 : 52,
                      height: active ? 68 : 64,
                      borderRadius: 12,
                      borderWidth: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: colors.surface,
                      borderColor: filled || active ? '#31973D' : colors.border,
                    },
                  ]}
                >
                  {filled && (
                    <View className="w-3 h-3 rounded-full bg-[#31973D]" />
                  )}
                </Pressable>
              );
            })}
          </View>

          <TextInput
            ref={inputRef}
            value={pin}
            onChangeText={(text) => {
              if (/^\d*$/.test(text) && text.length <= 4) setPin(text);
            }}
            keyboardType="numeric"
            maxLength={4}
            className="absolute opacity-0 w-1 h-1"
          />

          <Pressable
            onPress={() =>
              pin.length === 4 && navigation.navigate("PaymentSuccess", { method, phone })
            }
            className="h-12 rounded-full bg-[#31973D] flex-row items-center justify-center gap-2"
          >
            <MaterialCommunityIcons name="lock-outline" size={16} color="#fff" />
            <Text className="text-white text-sm">Proceed to pay</Text>
          </Pressable>
        </ScrollView>

        <AppBottomNav
          activeTab="home"
          paddingBottom={14}
          bottomOffset={8}
          showCalendar={isPremium}
          onHomePress={() => navigation.navigate('Home')}
          onSavedPress={() => navigation.navigate('Details', { itemId: 'saved', title: 'Saved' })}
          onSettingsPress={() => navigation.navigate('Settings')}
          onCalendarPress={isPremium ? () => navigation.navigate('Schedule') : undefined}
        />
      </View>
    </SafeAreaView>
  );
}

export default AuthorizePaymentScreen;
