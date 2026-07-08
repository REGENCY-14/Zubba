import { useMemo, useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { RootStackScreenProps } from "../../navigation/types";
import { useResendOtp, useVerifyOtp } from "../../slices/auth/auth.hooks";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { setCredentials } from "../../slices/auth/authSlice";
import { setCustomer } from "../../slices/customer/customerSlice";
import { authStorage } from "../../utils/authStorage";
import { OTPInput } from "../../components/common/OTPInput";
import { customerService } from "../../api/customerService";

export function VerifyOtpScreen({
  route,
  navigation,
}: RootStackScreenProps<"Verify">) {
  const phone = route.params?.phone ?? "";
  const email = route.params?.email ?? "";
  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useResendOtp();
  const dispatch = useAppDispatch();

  const contact = email || phone;
  const deliveryLabel = email ? "email" : "SMS";

  const [codeDigits, setCodeDigits] = useState(["", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [showResendModal, setShowResendModal] = useState(false);

  useEffect(() => {
    if (resendTimer === 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer]);

  const isValid = useMemo(
    () => codeDigits.every((d) => d.length === 1),
    [codeDigits],
  );

  const contactValue = contact;

  const handleVerify = async (otp: string) => {
    try {
      const res = await verifyOtpMutation.mutateAsync({
        authKey: email ? "email" : "phone",
        authValue: contactValue,
        otp,
        purpose: "login",
      });

      const { user, accessToken, refreshToken } = res.data;
      dispatch(setCredentials({ user, accessToken, refreshToken }));
      await authStorage.save({ user, accessToken, refreshToken });
      
      const customerResponse = await customerService.getCustomerById(user.id)

      if(customerResponse.success){
        const customer = customerResponse.data.customer;
        dispatch(setCustomer(customer))
      }

      if (!user.email || !user.phone) {
        navigation.replace("NewUserOnboarding", {
          ...(email ? { email: contactValue } : { phone: contactValue }),
        });
      } else {
        navigation.replace("ExistingUserNotification", {
          ...(email ? { email: contactValue } : { phone: contactValue }),
        });
      }
    } catch (err) {
      console.log("OTP verify failed:", err);
      setCodeDigits(["", "", "", ""]);
    }
  };

  const handleResend = async () => {
    try {
      await resendOtpMutation.mutateAsync({
        authKey: email ? "email" : "phone",
        authValue: contactValue,
        purpose: "email_verification",
      });

      setShowResendModal(false);
      setCodeDigits(["", "", "", ""]);
      setResendTimer(60);
      setCanResend(false);
    } catch (err) {
      console.log("Resend OTP failed:", err);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 p-5"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {email ? (
            <View className="gap-2 mb-3">
              <Text className="text-[18px] text-[#1F2A33]">
                Enter the 4-digits code sent to you at:
              </Text>
              <Text className="text-base text-[#1F2A33]">{contact}</Text>
            </View>
          ) : (
            <View className="gap-1">
              <Text className="text-[18px] text-[#1F2A33]">
                Enter the 4-digits code sent via {deliveryLabel} at {contact}
              </Text>

              <Pressable onPress={() => navigation.navigate("SignUp")}>
                <Text className="text-[13px] underline text-[#1F2A33]">
                  changed my mobile number?
                </Text>
              </Pressable>
            </View>
          )}

          <View className="mt-5">
            <OTPInput
              value={codeDigits}
              onChange={setCodeDigits}
              length={4}
              onComplete={(otp) => {
                handleVerify(otp);
              }}
            />
          </View>

          {email && (
            <Text className="text-xs underline text-[#1F2A33] mt-4">
              Tip: Be sure to check your inbox and spam folders
            </Text>
          )}

          <Pressable
            disabled={!isValid}
            className={[
              "h-12 rounded-full items-center justify-center mt-5",
              isValid ? "bg-[#34A853]" : "bg-[#34A85380]",
            ].join(" ")}
            onPress={() => handleVerify(codeDigits.join(""))}
          >
            <Text className="text-white text-sm">Verify</Text>
          </Pressable>

          <Text className="text-xs text-[#1F2A33] mt-2">
            {canResend
              ? `You can resend OTP now via ${deliveryLabel}`
              : `Resend OTP in ${resendTimer}s via ${deliveryLabel}`}
          </Text>

          <View className="gap-2 mt-3">
            <Pressable
              disabled={!canResend}
              onPress={() => setShowResendModal(true)}
              className={[
                "border border-[#E2E8F0] rounded-full px-7 py-2 self-start",
                !canResend ? "opacity-40" : "",
              ].join(" ")}
            >
              <Text className="text-xs font-medium text-[#1F2A33]">Resend</Text>
            </Pressable>

            <Pressable className="border border-[#E2E8F0] rounded-full px-7 py-2 self-start">
              <Text className="text-xs font-medium text-[#1F2A33]">
                {email
                  ? "Send code to another email"
                  : "Send code via WhatsApp"}
              </Text>
            </Pressable>
          </View>

          <Modal visible={showResendModal} transparent animationType="fade">
            <View className="flex-1 bg-[#1F2A334D] justify-end items-center">
              <View className="w-[94%] bg-white rounded-2xl p-6 mb-10 items-center">
                <Text className="text-center text-[18px] font-medium mb-3">
                  Resend code to: {contact}
                </Text>

                <View className="w-full gap-3">
                  <Pressable
                    onPress={handleResend}
                    className="h-12 bg-[#31973D] rounded-full items-center justify-center"
                  >
                    <Text className="text-white text-sm">Resend</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setShowResendModal(false)}
                    className="h-12 border border-[#E2E8F0] rounded-full items-center justify-center"
                  >
                    <Text className="text-[#1F2A33] text-sm">Cancel</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
