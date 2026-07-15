import { useMemo, useState, useEffect } from "react";
import {
  KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, View,
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
import { useTheme } from "../../context/ThemeContext";
import { handleApiError } from "../../utils/handleApiError";

export function VerifyOtpScreen({ route, navigation }: RootStackScreenProps<"Verify">) {
  const phone = route.params?.phone ?? "";
  const email = route.params?.email ?? "";
  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useResendOtp();
  const dispatch = useAppDispatch();
  const { colors } = useTheme();

  const contact = email || phone;
  const deliveryLabel = email ? "email" : "SMS";

  const [codeDigits, setCodeDigits] = useState(["", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [showResendModal, setShowResendModal] = useState(false);

  useEffect(() => {
    if (resendTimer === 0) { setCanResend(true); return; }
    const interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const isValid = useMemo(() => codeDigits.every((d) => d.length === 1), [codeDigits]);

  const handleVerify = async (otp: string) => {
    try {
      const res = await verifyOtpMutation.mutateAsync({
        authKey: email ? "email" : "phone",
        authValue: contact,
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
        navigation.replace("NewUserOnboarding", { ...(email ? { email: contact } : { phone: contact }) });
      } else {
        navigation.replace("ExistingUserNotification", { ...(email ? { email: contact } : { phone: contact }) });
      }
    } catch (err) {
      handleApiError(err)
      setCodeDigits(["", "", "", ""]);
    }
  };

  const handleResend = async () => {
    try {
      await resendOtpMutation.mutateAsync({ authKey: email ? "email" : "phone", authValue: contact, purpose: "email_verification" });
      setShowResendModal(false);
      setCodeDigits(["", "", "", ""]);
      setResendTimer(60);
      setCanResend(false);
    } catch (err) {
      handleApiError(err)
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1, padding: 20 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {email ? (
            <View style={{ gap: 8, marginBottom: 12 }}>
              <Text style={{ fontSize: 18, color: colors.text }}>Enter the 4-digits code sent to you at:</Text>
              <Text style={{ fontSize: 16, color: colors.text }}>{contact}</Text>
            </View>
          ) : (
            <View style={{ gap: 4 }}>
              <Text style={{ fontSize: 18, color: colors.text }}>
                Enter the 4-digits code sent via {deliveryLabel} at {contact}
              </Text>
              <Pressable onPress={() => navigation.navigate("SignUp")}>
                <Text style={{ fontSize: 13, textDecorationLine: "underline", color: colors.text }}>changed my mobile number?</Text>
              </Pressable>
            </View>
          )}

          <View style={{ marginTop: 20 }}>
            <OTPInput value={codeDigits} onChange={setCodeDigits} length={4} onComplete={handleVerify} />
          </View>

          {email && (
            <Text style={{ fontSize: 12, textDecorationLine: "underline", color: colors.text, marginTop: 16 }}>
              Tip: Be sure to check your inbox and spam folders
            </Text>
          )}

          <Pressable
            disabled={!isValid}
            style={{ height: 48, borderRadius: 9999, alignItems: "center", justifyContent: "center", marginTop: 20, backgroundColor: isValid ? "#34A853" : "rgba(52,168,83,0.5)" }}
            onPress={() => handleVerify(codeDigits.join(""))}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 14 }}>Verify</Text>
          </Pressable>

          <Text style={{ fontSize: 12, color: colors.text, marginTop: 8 }}>
            {canResend ? `You can resend OTP now via ${deliveryLabel}` : `Resend OTP in ${resendTimer}s via ${deliveryLabel}`}
          </Text>

          <View style={{ gap: 8, marginTop: 12 }}>
            <Pressable
              disabled={!canResend}
              onPress={() => setShowResendModal(true)}
              style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 9999, paddingHorizontal: 28, paddingVertical: 8, alignSelf: "flex-start", opacity: canResend ? 1 : 0.4 }}
            >
              <Text style={{ fontSize: 12, fontWeight: "500", color: colors.text }}>Resend</Text>
            </Pressable>

            <Pressable style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 9999, paddingHorizontal: 28, paddingVertical: 8, alignSelf: "flex-start" }}>
              <Text style={{ fontSize: 12, fontWeight: "500", color: colors.text }}>
                {email ? "Send code to another email" : "Send code via WhatsApp"}
              </Text>
            </Pressable>
          </View>

          <Modal visible={showResendModal} transparent animationType="fade">
            <View style={{ flex: 1, backgroundColor: "rgba(31,42,51,0.3)", justifyContent: "flex-end", alignItems: "center" }}>
              <View style={{ width: "94%", backgroundColor: colors.card, borderRadius: 16, padding: 24, marginBottom: 40, alignItems: "center" }}>
                <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "500", marginBottom: 12, color: colors.text }}>
                  Resend code to: {contact}
                </Text>

                <View style={{ width: "100%", gap: 12 }}>
                  <Pressable
                    onPress={handleResend}
                    style={{ height: 48, backgroundColor: "#31973D", borderRadius: 9999, alignItems: "center", justifyContent: "center" }}
                  >
                    <Text style={{ color: "#FFFFFF", fontSize: 14 }}>Resend</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setShowResendModal(false)}
                    style={{ height: 48, borderWidth: 1, borderColor: colors.border, borderRadius: 9999, alignItems: "center", justifyContent: "center" }}
                  >
                    <Text style={{ color: colors.text, fontSize: 14 }}>Cancel</Text>
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
