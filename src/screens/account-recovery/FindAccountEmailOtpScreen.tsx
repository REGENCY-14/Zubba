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
import { useVerifyOtp, useResendOtp } from "../../slices/auth/auth.hooks";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { setCredentials } from "../../slices/auth/authSlice";
import { authStorage } from "../../utils/authStorage";
import { customerService } from "../../api/customerService";
import { setCustomer } from "../../slices/customer/customerSlice";

export function FindAccountEmailOtpScreen({
  route,
  navigation,
}: RootStackScreenProps<"FindAccountEmailOtp">) {
  const email = route.params?.email || "";

  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useResendOtp();
  const dispatch = useAppDispatch();

  const [codeDigits, setCodeDigits] = useState(["", "", "", ""]);
  const [showResendModal, setShowResendModal] = useState(false);

  const isCodeComplete = useMemo(
    () => codeDigits.every((d) => d !== ""),
    [codeDigits],
  );

  const isResending = resendOtpMutation.isPending;

  const handleVerify = async (otp: string) => {
    try {
      const result = await verifyOtpMutation.mutateAsync({
        authKey: "email",
        authValue: email,
        otp,
        purpose: "login",
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
        email,
      });
    } catch (err) {
      console.log("OTP verify failed:", err);
      setCodeDigits(["", "", "", ""]);
    }
  };

  const handleResend = async () => {
    if (isResending) return;

    try {
      await resendOtpMutation.mutateAsync({
        authKey: "email",
        authValue: email,
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
          <Text className="text-[15px] text-[#1F2A33] mb-2">
            Enter the 4-digits code sent to you at: {email}
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
              changed my email address?
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
            className="self-start px-5 h-8 border border-[#E2E8F0] rounded-full items-center justify-center"
          >
            <Text className="text-xs font-medium text-[#1F2A33]">
              Resend code
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
                Resend code to: {email}
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
