import { useState, useMemo } from "react";
import {
  Pressable,
  Text,
  View,
  Modal,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { RootStackScreenProps } from "../../navigation/types";
import { OTPInput } from "../../components/common/OTPInput";

export function FindAccountOtpScreen({
  route,
  navigation,
}: RootStackScreenProps<"FindAccountOtp">) {
  const phone = route.params?.phone || "";

  const [codeDigits, setCodeDigits] = useState(["", "", "", ""]);
  const [showResendModal, setShowResendModal] = useState(false);

  const isCodeComplete = useMemo(
    () => codeDigits.every((d) => d !== ""),
    [codeDigits],
  );

  const handleVerify = (otp: string) => {
    if (otp.length !== 4) return;

    navigation.replace("ExistingUserNotification", {
      phone,
    });
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
            onPress={() => setShowResendModal(true)}
            className="w-[99px] h-8 border border-[#E2E8F0] rounded-full items-center justify-center"
          >
            <Text className="text-xs font-medium text-[#1F2A33]">
              Resend code
            </Text>
          </Pressable>

          <Pressable
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
          onRequestClose={() => setShowResendModal(false)}
        >
          <View className="flex-1 bg-[#1F2A334D] justify-end items-center">
            <View className="w-[94%] bg-white rounded-2xl p-6 mb-10 items-center">

              <Text className="text-center text-[18px] font-medium mb-3">
                Resend code to: {phone}
              </Text>

              <View className="w-full gap-3">

                <Pressable className="h-12 bg-[#31973D] rounded-xl items-center justify-center">
                  <Text className="text-white text-sm">Resend</Text>
                </Pressable>

                <Pressable
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