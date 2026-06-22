import React from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { RootStackScreenProps } from "../../navigation/types";
import { AppBottomNav } from "../../components";

export function PaymentVerificationScreen({
  navigation,
}: RootStackScreenProps<"PaymentVerification">) {
  const [code, setCode] = React.useState("");
  const [resendTimer, setResendTimer] = React.useState(60);
  const inputRef = React.useRef<TextInput | null>(null);

  React.useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleResend = () => {
    setCode("");
    setResendTimer(60);
  };

  const codeDigits = ["", "", "", ""].map((_, i) => code[i] || "");

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <View className="flex-1 bg-white">

        <View className="h-12 flex-row items-center justify-between px-4 bg-white">
          <Pressable onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons
              name="chevron-left"
              size={28}
              color="#1F2A33"
            />
          </Pressable>

          <Text className="text-base font-semibold text-[#1F2A33]">
            Payment Verification
          </Text>

          <View className="w-6" />
        </View>

        <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 120 }}>

          <Text className="text-2xl font-medium text-[#1F2A33] mb-4">
            Verification Code
          </Text>

          <Text className="text-base leading-6 text-[#64748A] mb-8">
            We've sent a 4-digit code to{" "}
            <Text className="text-[#1A1C1E] font-semibold">+233 55 123 4567</Text>. Please
            enter it below to authorize your{" "}
            <Text className="text-[#006B23] font-semibold">GHS 45.00</Text> payment.
          </Text>

          <View className="flex-row gap-4 mb-6">
            {codeDigits.map((digit, index) => {
              const isFilled = index < code.length;

              return (
                <Pressable
                  key={index}
                  onPress={() => inputRef.current?.focus()}
                  className="w-[52px] h-[64px] border-2 border-[#BECAB9] rounded-xl items-center justify-center bg-white shadow-sm"
                >
                  {isFilled && (
                    <View className="w-3 h-3 rounded-full bg-[#31973D]" />
                  )}
                </Pressable>
              );
            })}
          </View>

          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={(text) => {
              if (text.length <= 4 && /^\d*$/.test(text)) setCode(text);
            }}
            keyboardType="numeric"
            maxLength={4}
            className="absolute opacity-0"
          />

          <View className="items-start mb-8 gap-2">
            <Text className="text-xs font-medium text-[#1F2A33]">
              {resendTimer > 0
                ? `Resend code in ${resendTimer}s`
                : "Resend code"}
            </Text>

            <Pressable
              onPress={handleResend}
              disabled={resendTimer > 0}
              className={`px-3 py-1 rounded-full border border-[#E2E8F0] ${
                resendTimer > 0 ? "opacity-50" : "bg-white"
              }`}
            >
              <Text className="text-xs font-medium text-[#1F2A33]">
                Resend
              </Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() =>
              code.length === 4 && navigation.navigate("AuthorizePayment")
            }
            className="h-12 bg-[#31973D] rounded-full items-center justify-center"
          >
            <Text className="text-white text-sm">Verify</Text>
          </Pressable>
        </ScrollView>

        <AppBottomNav
          activeTab="home"
          paddingBottom={14}
          onHomePress={() => navigation.navigate('Home')}
          onSavedPress={() => navigation.navigate('Details', { itemId: 'saved', title: 'Saved' })}
          onSettingsPress={() => navigation.navigate('Settings')}
          onCalendarPress={() => navigation.navigate('Details', { itemId: 'calendar', title: 'Calendar' })}
        />
      </View>
    </SafeAreaView>
  );
}

export default PaymentVerificationScreen;