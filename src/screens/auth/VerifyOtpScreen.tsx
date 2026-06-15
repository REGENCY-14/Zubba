import { useMemo, useState, useRef, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { RootStackScreenProps } from "../../navigation/types";

export function VerifyOtpScreen({
  route,
  navigation,
}: RootStackScreenProps<"Verify">) {
  const phone = route.params?.phone ?? "";
  const email = route.params?.email ?? "";

  const contact = email || phone;
  const deliveryLabel = email ? "email" : "SMS";

  const [codeDigits, setCodeDigits] = useState(["", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [showResendModal, setShowResendModal] = useState(false);

  const inputRefs = [
    useRef<TextInput | null>(null),
    useRef<TextInput | null>(null),
    useRef<TextInput | null>(null),
    useRef<TextInput | null>(null),
  ];

  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

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

  const userExists = route.params?.userExists ?? false;
  const knownExistingContacts = ["+233241122310"];
  const contactValue = contact;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 22,
            paddingTop: 66,
            paddingBottom: 24,
          }}
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

          <View className="flex-row gap-3 mt-5">
            {[0, 1, 2, 3].map((i) => (
              <TextInput
                key={i}
                ref={inputRefs[i]}
                value={codeDigits[i]}
                keyboardType="number-pad"
                maxLength={1}
                className={[
                  "w-[44px] h-[44px] rounded-md border text-[20px] font-medium text-[#1F2A33] text-center pb-[4px]",
                  codeDigits[i]
                    ? "border-[#F47309] bg-white"
                    : "border-[#B8B8B833] bg-[#B8B8B833]",
                ].join(" ")}
                onChangeText={(ch) => {
                  if (ch.length > 1) {
                    const chars = ch.slice(0, 4).split("");
                    const newDigits = ["", "", "", ""];

                    chars.forEach((c, index) => {
                      newDigits[index] = c;
                    });

                    setCodeDigits(newDigits);

                    const isComplete = newDigits.every((d) => d !== "");

                    if (isComplete) {
                      setTimeout(() => {
                        const otp = newDigits.join("");
                        const exists =
                          userExists ||
                          knownExistingContacts.includes(contactValue);

                        const isInvalid = otp !== "1234";

                        if (isInvalid) {
                          setCodeDigits(["", "", "", ""]);
                          inputRefs[0].current?.focus();
                          return;
                        }

                        if (exists) {
                          navigation.replace(
                            "ExistingUserNotification",
                            email
                              ? { email: contactValue }
                              : { phone: contactValue },
                          );
                        } else {
                          navigation.replace(
                            "NewUserOnboarding",
                            email
                              ? { email: contactValue }
                              : { phone: contactValue },
                          );
                        }
                      }, 150);
                    }

                    inputRefs[Math.min(chars.length, 3)]?.current?.focus();
                    return;
                  }

                  if (!/^[0-9]$/.test(ch)) return;

                  const digits = [...codeDigits];
                  digits[i] = ch;
                  setCodeDigits(digits);

                  if (i < 3) {
                    inputRefs[i + 1].current?.focus();
                  }

                  const isComplete = digits.every((d) => d !== "");

                  if (isComplete) {
                    setTimeout(() => {
                      const otp = digits.join("");
                      const exists =
                        userExists ||
                        knownExistingContacts.includes(contactValue);

                      const isInvalid = otp !== "1234";

                      if (isInvalid) {
                        setCodeDigits(["", "", "", ""]);
                        inputRefs[0].current?.focus();
                        return;
                      }

                      if (exists) {
                        navigation.replace(
                          "ExistingUserNotification",
                          email
                            ? { email: contactValue }
                            : { phone: contactValue },
                        );
                      } else {
                        navigation.replace(
                          "NewUserOnboarding",
                          email
                            ? { email: contactValue }
                            : { phone: contactValue },
                        );
                      }
                    }, 150);
                  }
                }}
                onKeyPress={(e) => {
                  if (e.nativeEvent.key === "Backspace") {
                    const digits = [...codeDigits];

                    if (digits[i] === "") {
                      if (i > 0) {
                        inputRefs[i - 1].current?.focus();
                        digits[i - 1] = "";
                      }
                    } else {
                      digits[i] = "";
                    }

                    setCodeDigits(digits);
                  }
                }}
              />
            ))}
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
            onPress={() => {
              const otp = codeDigits.join("");

              const exists =
                userExists || knownExistingContacts.includes(contactValue);

              const isInvalid = otp !== "1234";

              if (isInvalid) {
                setCodeDigits(["", "", "", ""]);
                inputRefs[0].current?.focus();
                return;
              }

              if (exists) {
                navigation.replace(
                  "ExistingUserNotification",
                  email ? { email: contactValue } : { phone: contactValue },
                );
              } else {
                navigation.replace(
                  "NewUserOnboarding",
                  email ? { email: contactValue } : { phone: contactValue },
                );
              }
            }}
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
                    onPress={() => {
                      setShowResendModal(false);
                      setCodeDigits(["", "", "", ""]);
                      setResendTimer(60);
                      setCanResend(false);
                      inputRefs[0].current?.focus();
                    }}
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
