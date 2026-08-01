import React from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { RootStackScreenProps } from "../../navigation/types";
import { AppBottomNav } from "../../components";
import CustomAppBar from "../../components/common/CustomAppBar";
import { useTheme } from "../../context/ThemeContext";
import { useAppSelector } from "../../hooks/useAppSelector";
import { scale, verticalScale, moderateScale } from "../../utils/scale";

export function AuthorizePaymentScreen({
  navigation,
  route,
}: RootStackScreenProps<"AuthorizePayment">) {
  const { phone } = route.params;
  const { colors } = useTheme();
  const [pin, setPin] = React.useState("");
  const inputRef = React.useRef<TextInput | null>(null);
  const request = useAppSelector((state) => state.request)

  const digits = Array.from({ length: 4 }).map((_, i) => pin[i] || "");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <CustomAppBar navigation={navigation} title="Payment Verification" />

        <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: scale(24), paddingTop: verticalScale(24), paddingBottom: verticalScale(10), gap: verticalScale(24) }}>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <View className="w-8 h-8 rounded-lg bg-[#31973D] items-center justify-center">
                <MaterialCommunityIcons name="shield-account-outline" size={moderateScale(16)} color="#fff" />
              </View>
              <Text style={{ fontSize: moderateScale(16), color: colors.text }}>Enter PIN</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(8), paddingHorizontal: scale(12), paddingVertical: verticalScale(4), borderRadius: 999, backgroundColor: colors.iconBg }}>
              <View className="w-2 h-2 rounded-full bg-[#006B23]" />
              <Text style={{ fontSize: moderateScale(12), fontWeight: '600', color: colors.text }}>
                {request.payment_method}
              </Text>
            </View>
          </View>

          <Text style={{ fontSize: moderateScale(16), color: colors.textSub, lineHeight: moderateScale(24) }}>
            Enter your 4-digit PIN to authorize the payment of{" "}
            <Text style={{ fontWeight: '700', color: colors.text }}>GHS {request.pickup_price + request.service_price}</Text> to{" "}
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
                      width: moderateScale(active ? 56 : 52),
                      height: moderateScale(active ? 68 : 64),
                      borderRadius: moderateScale(12),
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
              pin.length === 4 && navigation.navigate("PaymentSuccess", { phone })
            }
            className="h-12 rounded-full bg-[#31973D] flex-row items-center justify-center gap-2"
          >
            <MaterialCommunityIcons name="lock-outline" size={moderateScale(16)} color="#fff" />
            <Text className="text-white text-sm">Proceed to pay</Text>
          </Pressable>
        </ScrollView>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default AuthorizePaymentScreen;
