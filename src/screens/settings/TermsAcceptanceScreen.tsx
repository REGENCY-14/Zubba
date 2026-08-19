import React, { useState } from "react";
import { CommonActions } from "@react-navigation/native";
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
import { AUTH_DARK } from "../../constants/authDarkTheme";
import { scale, moderateScale } from "../../utils/scale";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { updateUser } from "../../slices/auth/authSlice";
import { userService } from "../../api/userService";
import { toast } from "../../hooks/toast";

export function TermsAcceptanceScreen({
  route,
  navigation,
}: RootStackScreenProps<"TermsAcceptance">) {
  const { colors, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: isDark ? AUTH_DARK.bg : colors.bg }}
      edges={["top", "left", "right", "bottom"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, padding: moderateScale(20) }}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <View className="h-[42px]" />

          <View className="w-full gap-3 mb-6">
            <Text
              style={{
                fontSize: moderateScale(20),
                fontWeight: "400",
                color: colors.text,
                lineHeight: moderateScale(22),
              }}
            >
              Accept Zubba's Terms & Review Privacy Notice
            </Text>

            <Text
              style={{
                fontSize: moderateScale(11),
                fontWeight: "400",
                color: colors.text,
                lineHeight: moderateScale(16),
              }}
            >
              By selecting 'I Agree' below, I have reviewed and agree to the{" "}
              <Text
                style={{ color: "#3b82f6", textDecorationLine: "underline" }}
              >
                Terms of Use
              </Text>{" "}
              and acknowledged the{" "}
              <Text
                style={{ color: "#3b82f6", textDecorationLine: "underline" }}
              >
                Privacy Notice
              </Text>
              . I am at least 18 years of age
            </Text>
          </View>
        </ScrollView>

        <View className="w-full mt-4 gap-[17px]">
          <View style={{ borderTopWidth: 1, borderTopColor: isDark ? AUTH_DARK.border : colors.border }} />

          <View className="flex-row items-center justify-between">
            <Text style={{ fontSize: moderateScale(10), color: colors.text, lineHeight: moderateScale(16) }}>
              I agree
            </Text>
            <Pressable
              onPress={() => setAgreedToTerms(!agreedToTerms)}
              style={[
                {
                  width: moderateScale(18),
                  height: moderateScale(18),
                  borderWidth: 1,
                  borderRadius: moderateScale(2),
                  alignItems: "center",
                  justifyContent: "center",
                },
                agreedToTerms
                  ? { backgroundColor: isDark ? AUTH_DARK.accentGreen : "#34A853", borderColor: isDark ? AUTH_DARK.accentGreen : "#34A853" }
                  : {
                      backgroundColor: isDark ? AUTH_DARK.card : colors.surface,
                      borderColor: isDark ? AUTH_DARK.border : colors.text,
                    },
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
            style={{
              width: moderateScale(48),
              height: moderateScale(48),
              borderRadius: moderateScale(12),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              color={colors.text}
              size={moderateScale(24)}
            />
          </Pressable>

          <Pressable
            disabled={!agreedToTerms || submitting}
            onPress={async () => {
              setSubmitting(true);
              try {
                console.log("accepting terms");
                const res = await userService.acceptTerms();
                console.log(res);
                if (res.success) {
                  dispatch(updateUser(res.data.user));
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{ name: "Home" }],
                    }),
                  );
                }
              } catch {
                toast.error("Could not accept terms. Please try again.");
              } finally {
                setSubmitting(false);
              }
            }}
            style={[
              {
                width: scale(96),
                height: moderateScale(48),
                borderRadius: moderateScale(12),
                alignItems: "center",
                justifyContent: "center",
              },
              isDark
                ? { backgroundColor: AUTH_DARK.buttonPrimaryBg }
                : agreedToTerms && !submitting
                ? { backgroundColor: "#34A853" }
                : { backgroundColor: "rgba(52, 168, 83, 0.5)" },
            ]}
          >
            <Text className="text-white text-sm">Continue</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
