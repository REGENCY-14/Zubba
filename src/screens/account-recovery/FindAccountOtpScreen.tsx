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
import { useResendOtp, useVerifyOtp } from "../../slices/auth/auth.hooks";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { setCredentials } from "../../slices/auth/authSlice";
import { customerService } from "../../api/customerService";
import { setCustomer } from "../../slices/customer/customerSlice";
import { saveAuthSession } from "../../utils/resolveInitialRoute";
import { syncPushNotifications } from "../../services/pushNotifications";
import { useTheme } from "../../context/ThemeContext";
import { handleApiError } from "../../utils/handleApiError";

export function FindAccountOtpScreen({
  route,
  navigation,
}: RootStackScreenProps<"FindAccountOtp">) {
  const phone = route.params?.phone || "";
  const dispatch = useAppDispatch();
  const { colors } = useTheme();

  const [codeDigits, setCodeDigits] = useState(["", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const resendOtpMutation = useResendOtp();
  const verifyOtpMutation = useVerifyOtp();
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
        authKey: "phone",
        authValue: phone,
        purpose: "login",
        otp,
      });

      const { user, accessToken, refreshToken } = result.data;
      dispatch(setCredentials({ user, accessToken, refreshToken }));
      await saveAuthSession({ userId: user.id, accessToken, refreshToken });

      const customerResponse = await customerService.getCustomerById(user.id);
      if (customerResponse.success) {
        dispatch(setCustomer(customerResponse.data.customer));
      }

      syncPushNotifications().catch(() => {});
      navigation.replace("ExistingUserNotification", { phone });
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
        authKey: "phone",
        authValue: phone,
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
          <View style={{ gap: 4 }}>
            <Text style={{ fontSize: 18, color: colors.text }}>
              Enter the 4-digits code sent via SMS at {phone}
            </Text>
            <Pressable onPress={() => navigation.navigate("SignUp")}>
              <Text style={{ fontSize: 13, textDecorationLine: "underline", color: colors.text }}>
                changed my mobile number?
              </Text>
            </Pressable>
          </View>

          <View style={{ marginTop: 20 }} pointerEvents={verifyOtpMutation.isPending ? "none" : "auto"}>
            <OTPInput
              value={codeDigits}
              onChange={setCodeDigits}
              length={4}
              onComplete={handleVerify}
            />
          </View>

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
            {canResend ? "You can resend OTP now via SMS" : `Resend OTP in ${resendTimer}s via SMS`}
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
                Send code via WhatsApp
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
