import { useState, useMemo } from "react";
import {
  Pressable,
  Text,
  View,
  Modal,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { RootStackScreenProps } from "../../navigation/types";
import { OTPInput } from "../../components/common/OTPInput";
import { useResendOtp, useVerifyOtp } from "../../slices/auth/auth.hooks";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { setCredentials } from "../../slices/auth/authSlice";
import { customerService } from "../../api/customerService";
import { setCustomer } from "../../slices/customer/customerSlice";
import { authStorage } from "../../utils/authStorage";

export function FindAccountOtpScreen({
  route,
  navigation,
}: RootStackScreenProps<"FindAccountOtp">) {
  const phone = route.params?.phone || "";
  const dispatch = useAppDispatch();

  const [codeDigits, setCodeDigits] = useState(["", "", "", ""]);
  const [showResendModal, setShowResendModal] = useState(false);

  const resendOtpMutation = useResendOtp();
  const verifyOtpMutation = useVerifyOtp();
  const isResending = resendOtpMutation.isPending;

  const isCodeComplete = useMemo(
    () => codeDigits.every((d) => d !== ""),
    [codeDigits],
  );

  const handleVerify = async (otp: string) => {
    if (otp.length !== 4) return;

    try {
      const result = await verifyOtpMutation.mutateAsync({
        authKey: "phone",
        authValue: phone,
        purpose: "login",
        otp: otp,
      });
      if (!result.success)
        Alert.alert("OTP incorrect, please verify and try again.");
      const { user, accessToken, refreshToken } = result.data;
      dispatch(setCredentials({ user, accessToken, refreshToken }));
      await authStorage.save({ user, accessToken, refreshToken });

      const customerResponse = await customerService.getCustomerById(user.id);

      if (!customerResponse.success)
        Alert.alert(
          "Could not find your account, please verify and try again.",
        );
      const customer = customerResponse.data.customer;
      dispatch(setCustomer(customer));
      navigation.replace("ExistingUserNotification", {
        phone,
      });
    } catch {
      Alert.alert("OTP incorrect, please verify and try again.");
    }
  };

  const handleResend = async () => {
    if (isResending) return;

    try {
      await resendOtpMutation.mutateAsync({
        authKey: "phone",
        authValue: phone,
        purpose: "login",
      });

      setShowResendModal(false);
      setCodeDigits(["", "", "", ""]);
    } catch (err) {
      Alert.alert("Failed to resend otp, please try again later");
      console.log("Resend OTP failed:", err);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-5 pb-6">
          <Text className="text-[18px] font-bold text-[#1F2A33] mb-8">
            Enter the 4-digits code sent via SMS at {phone}
          </Text>

          <View className="mb-6">
            <OTPInput
              value={codeDigits}
              onChange={setCodeDigits}
              length={4}
              onComplete={handleVerify}
            />
          </View>

          <Pressable className="mb-6">
            <Text className="text-[13px] underline text-[#1F2A33]">
              changed my mobile number?
            </Text>
          </Pressable>

          <Pressable
            disabled={!isCodeComplete}
            onPress={() => handleVerify(codeDigits.join(""))}
            className={[
              "h-12 rounded-xl items-center justify-center mb-4",
              isCodeComplete ? "bg-[#34A853]" : "bg-[#34A85380]",
            ].join(" ")}
          >
            <Text className="text-white text-sm">Verify</Text>
          </Pressable>

          <Pressable
            disabled={isResending}
            onPress={() => setShowResendModal(true)}
            className="w-[99px] h-8 border border-[#E2E8F0] rounded-full items-center justify-center"
          >
            <Text className="text-xs font-medium text-[#1F2A33]">
              Resend code
            </Text>
          </Pressable>

          <Pressable
            disabled={isResending}
            className="mt-2 w-[178px] h-8 border border-[#E2E8F0] rounded-full items-center justify-center"
          >
            <Text className="text-xs font-medium text-[#1F2A33]">
              Resend code via WhatsApp
            </Text>
          </Pressable>
        </View>

        <Modal
          visible={showResendModal}
          transparent
          animationType="fade"
          onRequestClose={() => {
            if (!isResending) {
              setShowResendModal(false);
            }
          }}
        >
          <View className="flex-1 bg-[#1F2A334D] justify-end items-center">
            <View className="w-[94%] bg-white rounded-2xl p-6 mb-10 items-center">
              <Text className="text-center text-[18px] font-medium mb-3">
                Resend code to: {phone}
              </Text>

              <View className="w-full gap-3">
                <Pressable
                  disabled={isResending}
                  onPress={handleResend}
                  className={`h-12 bg-[#31973D] rounded-xl items-center justify-center ${isResending && "opacity-50"}`}
                >
                  {isResending ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text className="text-white text-sm">Resend</Text>
                  )}
                </Pressable>

                <Pressable
                  disabled={isResending}
                  onPress={() => setShowResendModal(false)}
                  className="h-12 border border-[#E2E8F0] rounded-xl items-center justify-center"
                >
                  <Text className="text-[#1F2A33] text-sm">Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}
