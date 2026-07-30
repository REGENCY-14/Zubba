import { useMemo, useState, useEffect, useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { RootStackScreenProps } from "../../navigation/types";
import { OTPInput } from "../../components/common/OTPInput";
import { useVerifyOtp, useResendOtp } from "../../slices/auth/auth.hooks";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { setCredentials } from "../../slices/auth/authSlice";
import { saveAuthSession } from "../../utils/resolveInitialRoute";
import { syncPushNotifications } from "../../services/pushNotifications";
import { customerService } from "../../api/customerService";
import { setCustomer } from "../../slices/customer/customerSlice";
import { useTheme } from "../../context/ThemeContext";
import { handleApiError } from "../../utils/handleApiError";

export function FindAccountEmailOtpScreen({
  route,
  navigation,
}: RootStackScreenProps<"FindAccountEmailOtp">) {
  const email = route.params?.email || "";

  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useResendOtp();
  const dispatch = useAppDispatch();
  const { colors } = useTheme();

  const [codeDigits, setCodeDigits] = useState(["", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const isVerifyingRef = useRef(false);

  useEffect(() => {
    if (resendTimer === 0) { setCanResend(true); return; }
    const interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const isValid = useMemo(() => codeDigits.every((d) => d.length === 1), [codeDigits]);

  const handleVerify = async (otp: string) => {
    if (isVerifyingRef.current || verifyOtpMutation.isPending) return;
    isVerifyingRef.current = true;

    try {
      const result = await verifyOtpMutation.mutateAsync({
        authKey: "email",
        authValue: email,
        otp,
        purpose: "login",
      });

      const { user, accessToken, refreshToken } = result.data;
      dispatch(setCredentials({ user, accessToken, refreshToken }));
      await saveAuthSession({ userId: user.id, accessToken, refreshToken });

      const customerResponse = await customerService.getCustomerById(user.id);
      if (customerResponse.success) {
        dispatch(setCustomer(customerResponse.data.customer));
      }

      syncPushNotifications().catch(() => {});
      navigation.replace("ExistingUserNotification", { email });
    } catch (err) {
      handleApiError(err);
      setCodeDigits(["", "", "", ""]);
    } finally {
      isVerifyingRef.current = false;
    }
  };

  const handleResend = async () => {
    if (!canResend || resendOtpMutation.isPending) return;

    try {
      await resendOtpMutation.mutateAsync({
        authKey: "email",
        authValue: email,
        purpose: "login",
      });
      setCodeDigits(["", "", "", ""]);
      setResendTimer(60);
      setCanResend(false);
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1, padding: 20 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={{ gap: 8, marginBottom: 12 }}>
            <Text style={{ fontSize: 18, color: colors.text }}>Enter the 4-digits code sent to you at:</Text>
            <Text style={{ fontSize: 16, color: colors.text }}>{email}</Text>
          </View>

          <View style={{ marginTop: 20 }} pointerEvents={verifyOtpMutation.isPending ? "none" : "auto"}>
            <OTPInput
              value={codeDigits}
              onChange={setCodeDigits}
              length={4}
              onComplete={handleVerify}
            />
          </View>

          <Text style={{ fontSize: 12, textDecorationLine: "underline", color: colors.text, marginTop: 16 }}>
            Tip: Be sure to check your inbox and spam folders
          </Text>

          <Pressable
            disabled={!isValid || verifyOtpMutation.isPending}
            style={{
              height: 48,
              borderRadius: 9999,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 20,
              backgroundColor: isValid && !verifyOtpMutation.isPending ? "#34A853" : "rgba(52,168,83,0.5)",
            }}
            onPress={() => handleVerify(codeDigits.join(""))}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 14 }}>Verify</Text>
          </Pressable>

          <Text style={{ fontSize: 12, color: colors.text, marginTop: 8 }}>
            {canResend ? "You can resend OTP now via email" : `Resend OTP in ${resendTimer}s via email`}
          </Text>

          <View style={{ gap: 8, marginTop: 12 }}>
            <Pressable
              disabled={!canResend || resendOtpMutation.isPending}
              onPress={handleResend}
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 9999,
                paddingHorizontal: 28,
                paddingVertical: 8,
                alignSelf: "flex-start",
                opacity: canResend && !resendOtpMutation.isPending ? 1 : 0.4,
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: "500", color: colors.text }}>Resend</Text>
            </Pressable>

            <Pressable
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 9999,
                paddingHorizontal: 28,
                paddingVertical: 8,
                alignSelf: "flex-start",
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: "500", color: colors.text }}>
                Send code to another email
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
