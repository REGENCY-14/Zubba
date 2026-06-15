import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { IoMdArrowBack } from "react-icons/io";

import type { RootStackScreenProps } from "../../navigation/types";

export function TermsAcceptanceScreen({
  route,
  navigation,
}: RootStackScreenProps<"TermsAcceptance">) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      edges={["top", "left", "right", "bottom"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 p-5"
      >
        <ScrollView
          contentContainerClassName=""
          keyboardShouldPersistTaps="handled"
        >
          <View className="h-[42px]" />

          <View className="w-full gap-3 mb-6">
            <Text className="text-[20px] font-normal text-[#1F2A33] leading-[22px]">
              Accept Zubba's Terms & Review Privacy Notice
            </Text>

            <Text className="text-[11px] font-normal text-[#1F2A33] leading-4">
              By selecting 'I Agree' below, I have reviewed and agree to the{" "}
              <Text style={{ color: '#3b82f6', textDecorationLine: 'underline' }}>Terms of Use</Text> and
              acknowledged the{" "}
              <Text style={{ color: '#3b82f6', textDecorationLine: 'underline' }}>Privacy Notice</Text>. I
              am at least 18 years of age
            </Text>
          </View>
        </ScrollView>

        <View className="w-full mt-4 gap-[17px]">
          <View className="border-t border-black/15" />

          <View className="flex-row items-center justify-between">
            <Text className="text-[10px] text-[#1F2A33] leading-4">
              I agree
            </Text>
            <Pressable
              onPress={() => setAgreedToTerms(!agreedToTerms)}
              className={`w-[18px] h-[18px] border rounded bg-white items-center justify-center ${
                agreedToTerms
                  ? "bg-[#34A853] border-[#34A853]"
                  : "border-black/70"
              }`}
            >
              {agreedToTerms && (
                <Text className="text-white text-[12px] font-semibold">✓</Text>
              )}
            </Pressable>
          </View>
        </View>

        <View className="pt-6 flex-row justify-between items-center">
          <Pressable
            onPress={() => navigation.goBack()}
            className="w-12 h-12 rounded-xl items-center justify-center"
          >
            <Text className="text-2xl text-black">
              <IoMdArrowBack color="#000000" size={24} />
            </Text>
          </Pressable>

          <Pressable
            disabled={!agreedToTerms}
            onPress={() => navigation.replace("LocationSharing")}
            className={`w-24 h-12 rounded-xl items-center justify-center ${
              agreedToTerms ? "bg-[#34A853]" : "bg-[#34A853]/50"
            }`}
          >
            <Text className="text-white text-sm">Continue</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
