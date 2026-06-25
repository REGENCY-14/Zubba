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
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";

export function TermsAcceptanceScreen({
  route,
  navigation,
}: RootStackScreenProps<"TermsAcceptance">) {
  const { colors } = useTheme();
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.bg }}
      edges={["top", "left", "right", "bottom"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, padding: 20 }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
        >
          <View className="h-[42px]" />

          <View className="w-full gap-3 mb-6">
            <Text style={{ fontSize: 20, fontWeight: '400', color: colors.text, lineHeight: 22 }}>
              Accept Zubba's Terms & Review Privacy Notice
            </Text>

            <Text style={{ fontSize: 11, fontWeight: '400', color: colors.text, lineHeight: 16 }}>
              By selecting 'I Agree' below, I have reviewed and agree to the{" "}
              <Text style={{ color: '#3b82f6', textDecorationLine: 'underline' }}>Terms of Use</Text> and
              acknowledged the{" "}
              <Text style={{ color: '#3b82f6', textDecorationLine: 'underline' }}>Privacy Notice</Text>. I
              am at least 18 years of age
            </Text>
          </View>
        </ScrollView>

        <View className="w-full mt-4 gap-[17px]">
          <View style={{ borderTopWidth: 1, borderTopColor: colors.border }} />

          <View className="flex-row items-center justify-between">
            <Text style={{ fontSize: 10, color: colors.text, lineHeight: 16 }}>
              I agree
            </Text>
            <Pressable
              onPress={() => setAgreedToTerms(!agreedToTerms)}
              style={[
                { width: 18, height: 18, borderWidth: 1, borderRadius: 2, alignItems: 'center', justifyContent: 'center' },
                agreedToTerms
                  ? { backgroundColor: '#34A853', borderColor: '#34A853' }
                  : { backgroundColor: colors.surface, borderColor: colors.text },
              ]}
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
            style={{ width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}
          >
            <MaterialCommunityIcons name="arrow-left" color={colors.text} size={24} />
          </Pressable>

          <Pressable
            disabled={!agreedToTerms}
            onPress={() => navigation.replace("Home")}
            style={[
              { width: 96, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
              agreedToTerms ? { backgroundColor: '#34A853' } : { backgroundColor: 'rgba(52, 168, 83, 0.5)' },
            ]}
          >
            <Text className="text-white text-sm">Continue</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
