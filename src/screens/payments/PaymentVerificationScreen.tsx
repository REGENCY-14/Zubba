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
import { useTheme } from "../../context/ThemeContext";

export function PaymentVerificationScreen({
  navigation,
}: RootStackScreenProps<"PaymentVerification">) {
  const { colors } = useTheme();
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top", "left", "right"]}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>

        <View style={{ height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, backgroundColor: colors.bg }}>
          <Pressable onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons
              name="chevron-left"
              size={28}
              color={colors.text}
            />
          </Pressable>

          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
            Payment Verification
          </Text>

          <View className="w-6" />
        </View>

        <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 120 }}>

          <Text style={{ fontSize: 24, fontWeight: '500', color: colors.text, marginBottom: 16 }}>
            Verification Code
          </Text>

          <Text style={{ fontSize: 16, lineHeight: 24, color: colors.textSub, marginBottom: 32 }}>
            We've sent a 4-digit code to{" "}
            <Text style={{ color: colors.text, fontWeight: '600' }}>+233 55 123 4567</Text>. Please
            enter it below to authorize your{" "}
            <Text style={{ color: '#006B23', fontWeight: '600' }}>GHS 45.00</Text> payment.
          </Text>

          <View className="flex-row gap-4 mb-6">
            {codeDigits.map((digit, index) => {
              const isFilled = index < code.length;

              return (
                <Pressable
                  key={index}
                  onPress={() => inputRef.current?.focus()}
                  style={{ width: 52, height: 64, borderWidth: 2, borderColor: colors.border, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface }}
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
            <Text style={{ fontSize: 12, fontWeight: '500', color: colors.text }}>
              {resendTimer > 0
                ? `Resend code in ${resendTimer}s`
                : "Resend code"}
            </Text>

            <Pressable
              onPress={handleResend}
              disabled={resendTimer > 0}
              style={[
                { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
                resendTimer > 0 ? { opacity: 0.5 } : {},
              ]}
            >
              <Text style={{ fontSize: 12, fontWeight: '500', color: colors.text }}>
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
          bottomOffset={8}
          navigation={navigation}
        />
      </View>
    </SafeAreaView>
  );
}

export default PaymentVerificationScreen;
