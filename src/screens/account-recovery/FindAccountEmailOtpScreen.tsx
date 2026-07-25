import { useState, useMemo } from "react";
import {
  Pressable,
  Text,
  View,
  Modal,
  ScrollView,
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
import { useTheme } from "../../context/ThemeContext";
import { toast } from "../../hooks/toast";
import { handleApiError } from "../../utils/handleApiError";
import { scale, verticalScale, moderateScale } from "../../utils/scale";

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
  const { colors } = useTheme();

  const handleVerify = async (otp: string) => {
    try {
      const result = await verifyOtpMutation.mutateAsync({
        authKey: "email",
        authValue: email,
        otp,
        purpose: "login",
      });
      if (!result.success)
        toast.error("OTP incorrect, please verify and try again.");
      const { user, accessToken, refreshToken } = result.data;
      dispatch(setCredentials({ user, accessToken, refreshToken }));
      await authStorage.save({ user, accessToken, refreshToken });

      const customerResponse = await customerService.getCustomerById(user.id);

      if (!customerResponse.success)
        toast.error(
          "Could not find your account, please verify and try again.",
        );
      const customer = customerResponse.data.customer;
      dispatch(setCustomer(customer));
      navigation.replace("ExistingUserNotification", {
        email,
      });
    } catch (err: any) {
      handleApiError(err)
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
      toast.error("Failed to resend otp, please try again later");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-5 pb-6">
          <Text style={{ fontSize: moderateScale(15), color: colors.text, marginBottom: verticalScale(8) }}>
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
            <Text style={{ fontSize: moderateScale(13), textDecorationLine: 'underline', color: colors.text }}>
              changed my email address?
            </Text>
          </Pressable>

          <Pressable
            disabled={!isCodeComplete}
            onPress={() => handleVerify(codeDigits.join(""))}
            className={[
              "h-12 rounded-full items-center justify-center mb-4",
              isCodeComplete ? "bg-[#34A853]" : "bg-[#34A85380]",
            ].join(" ")}
          >
            <Text className="text-white text-sm">Verify</Text>
          </Pressable>

          <Pressable
            disabled={isResending}
            onPress={() => setShowResendModal(true)}
            style={{ alignSelf: 'flex-start', paddingHorizontal: scale(20), height: verticalScale(32), borderWidth: 1, borderColor: colors.border, borderRadius: 9999, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ fontSize: moderateScale(12), fontWeight: '500', color: colors.text }}>
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
            <View style={{ width: '94%', backgroundColor: colors.card, borderRadius: moderateScale(16), padding: moderateScale(24), marginBottom: verticalScale(40), alignItems: 'center' }}>
              <Text style={{ textAlign: 'center', fontSize: moderateScale(18), fontWeight: '500', marginBottom: verticalScale(12), color: colors.text }}>
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
                  style={{ height: verticalScale(48), borderWidth: 1, borderColor: colors.border, borderRadius: moderateScale(12), alignItems: 'center', justifyContent: 'center' }}
                >
                  <Text style={{ color: colors.text, fontSize: moderateScale(14) }}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}
