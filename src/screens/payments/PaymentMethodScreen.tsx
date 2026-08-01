import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { RootStackScreenProps } from "../../navigation/types";
import CustomAppBar from "../../components/common/CustomAppBar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { useAppSelector } from "../../hooks/useAppSelector";
import { api } from "../../api/axios";
import { handleApiError } from "../../utils/handleApiError";
import { toast } from "../../hooks/toast";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { setTransactionReference } from "../../slices/request/requestSlice";
import { scale, verticalScale, moderateScale } from "../../utils/scale";

export function PaymentMethodScreen({
  navigation,
}: RootStackScreenProps<"PaymentMethod">) {
  const dispatch = useAppDispatch();
  const [phoneNumber, setPhoneNumber] = React.useState("055 123 4567");
  const [isLoading, setIsLoading] = useState(false);
  const { colors } = useTheme();
  const request = useAppSelector((state) => state.request);
  const user = useAppSelector((state) => state.auth.user);

  const totalAmount = (request.pickup_price || 0) + (request.service_price || 0);

  const handleProceedToPay = async () => {
    const cleanedPhone = phoneNumber.replace(/\s/g, '');
    if (cleanedPhone.length < 10) {
      toast.error('Invalid Phone, Please enter a valid phone number');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/payments/mobile-money/initiate', {
        amount: totalAmount,
        email: user?.email,
        phone: cleanedPhone,
        provider: 'mtn',
        requestId: request.id,
        payment_method: 'mobile_money',
      });

      if (response.data.success) {
        const { reference } = response.data.data;
        dispatch(setTransactionReference(reference));
        navigation.navigate("PaymentVerification", { 
          phone: phoneNumber,
          reference: reference,
          amount: totalAmount,
          provider: 'mtn'
        });
      }
    } catch (error: any) {
      console.error(error)
      handleApiError(error)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <CustomAppBar navigation={navigation} title="Payment" />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: moderateScale(16), paddingBottom: verticalScale(10), gap: moderateScale(24) }}
        >
          <View className="gap-6">
            <View style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: moderateScale(24), padding: moderateScale(24), alignItems: "center", gap: moderateScale(16) }}>
              <View className="w-14 h-14 rounded-full bg-[#41A06A]/10 items-center justify-center">
                <MaterialCommunityIcons name="wallet" size={moderateScale(27)} color="#31973D" />
              </View>

              <Text style={{ fontSize: moderateScale(16), textAlign: "center", color: colors.textSub }}>
                Total to Pay
              </Text>

              <Text style={{ fontSize: moderateScale(32), fontWeight: "600", color: colors.text, textAlign: "center" }}>
                GHS {totalAmount}
              </Text>

              <View style={{ width: "100%", borderTopWidth: 1, borderTopColor: colors.border }} />

              <View className="bg-[#E8F2E8] px-3 py-1 rounded-full border border-[#E2E8F0]">
                <Text className="text-[#31973D] text-[13px] font-bold">
                  Includes all fees
                </Text>
              </View>
            </View>

            <View className="gap-2">
              <Text style={{ fontSize: moderateScale(16), color: colors.text }}>
                Wallet Phone Number
              </Text>

              <TextInput
                style={{
                  height: verticalScale(48),
                  paddingHorizontal: scale(16),
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 999,
                  backgroundColor: colors.card,
                  color: colors.text,
                  fontSize: moderateScale(14),
                }}
                placeholder="055 123 4567"
                placeholderTextColor={colors.textSub}
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />

              <Text style={{ fontSize: moderateScale(12), color: colors.textSub }}>
                Enter your mobile money number
              </Text>
            </View>

            <View style={{ flexDirection: "row", gap: scale(16), padding: moderateScale(16), borderWidth: 1, borderColor: colors.border, borderRadius: moderateScale(24), backgroundColor: colors.card }}>
              <View className="w-8 h-8 rounded-full bg-[#006B23]/10 items-center justify-center">
                <MaterialCommunityIcons name="information-outline" size={moderateScale(18)} color="#31973D" />
              </View>

              <View className="flex-1 gap-1">
                <Text style={{ fontSize: moderateScale(16), color: colors.text }}>
                  How it works
                </Text>

                <Text style={{ fontSize: moderateScale(14), color: colors.textSub, lineHeight: moderateScale(24) }}>
                  You will receive a secure payment prompt on your mobile phone.
                  Enter your Mobile Money PIN to authorize the transaction instantly.
                </Text>
              </View>
            </View>

            <Pressable
              onPress={handleProceedToPay}
              disabled={isLoading}
              className="h-12 bg-[#31973D] rounded-full items-center justify-center"
              style={{ opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-sm">Proceed to verify</Text>
              )}
            </Pressable>

            <Text style={{ fontSize: moderateScale(10), textAlign: "center", textTransform: "uppercase", color: colors.textMuted }}>
              Secured by Zubba Pay Architecture
            </Text>
          </View>
        </ScrollView>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default PaymentMethodScreen;