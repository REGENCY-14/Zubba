import { useEffect, useState } from "react";
import {
    ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { RootStackScreenProps } from "../../navigation/types";
import { useRegister } from "../../slices/auth/auth.hooks";
import { useTheme } from "../../context/ThemeContext";
import { AUTH_DARK } from "../../constants/authDarkTheme";
import { useGoogleLogin } from "../../services/googleAuth";
import { authService } from "../../api/authService";
import { handleApiError } from "../../utils/handleApiError";
import { scale, verticalScale, moderateScale } from "../../utils/scale";

const googleIcon = require("../../../assets/google-icon.png");

export function SignUpScreen({ navigation }: RootStackScreenProps<"SignUp">) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [hasServerError, setHasServerError] = useState(false);
  const registerMutation = useRegister();
  const { colors, isDark } = useTheme();

  const digitsOnly = phoneNumber.replace(/\D/g, "");
  const canContinue = digitsOnly.length >= 6;

  const { signInWithGoogle, isLoading: isGoogleLoading } = useGoogleLogin();

  const handleGoogleContinue = async () => {
    const result = await signInWithGoogle("customer");
    if (!result) return;
    const { user, welcomeParams } = result;

    if (!user.email || !user.phone) {
      navigation.replace("NewUserOnboarding", { email: user.email });
    } else {
      navigation.replace("ExistingUserNotification", {
        email: user.email,
        ...welcomeParams,
      });
    }
  };

  const handleRegister = async () => {
    try {
      const res = await registerMutation.mutateAsync({
        authKey: "phone",
        authValue: phoneNumber,
        role: "customer",
      });
      const isExisting = res.message.includes("Welcome back");
      navigation.navigate("Verify", {
        phone: phoneNumber,
        userExists: isExisting,
      });
    } catch (err) {
      setHasServerError(true);
      handleApiError(err)
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? AUTH_DARK.bg : colors.bg }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flex: 1, paddingHorizontal: scale(20), paddingVertical: verticalScale(20) }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: moderateScale(15),
                  fontWeight: "400",
                  color: colors.text,
                  marginBottom: verticalScale(8),
                }}
              >
                What's your phone number
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: scale(8),
                  marginBottom: verticalScale(16),
                }}
              >
                <TextInput
                  style={{
                    flex: 1,
                    height: verticalScale(48),
                    paddingHorizontal: scale(16),
                    borderWidth: 1,
                    borderColor: isDark
                      ? hasServerError
                        ? AUTH_DARK.borderError
                        : AUTH_DARK.border
                      : colors.border,
                    borderRadius: 9999,
                    backgroundColor: isDark ? AUTH_DARK.card : colors.card,
                    fontSize: moderateScale(15),
                    color: colors.text,
                  }}
                  className="outline-none"
                  placeholder="phone number"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={(text) => {
                    setPhoneNumber(text);
                    if (hasServerError) setHasServerError(false);
                  }}
                />
              </View>

              {!canContinue && phoneNumber.length > 0 && (
                <Text
                  style={{
                    color: "#DC2626",
                    fontSize: moderateScale(12),
                    marginBottom: verticalScale(8),
                    paddingHorizontal: scale(4),
                  }}
                >
                  Enter a valid phone number
                </Text>
              )}

              <Pressable
                style={{
                  height: verticalScale(48),
                  borderRadius: 9999,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: verticalScale(16),
                  backgroundColor: isDark ? AUTH_DARK.buttonPrimaryBg : "#34A853",
                  opacity: isDark ? 1 : canContinue && !registerMutation.isPending ? 1 : 0.6,
                }}
                onPress={handleRegister}
                disabled={!canContinue || registerMutation.isPending}
              >
                <Text style={{ color: "#FFFFFF", fontSize: moderateScale(14) }}>
                  {registerMutation.isPending ? "Please wait..." : "Continue"}
                </Text>
              </Pressable>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: verticalScale(16),
                }}
              >
                <View
                  style={{ flex: 1, height: 1, backgroundColor: isDark ? AUTH_DARK.border : colors.border }}
                />
                <Text
                  style={{
                    marginHorizontal: scale(16),
                    fontSize: moderateScale(12),
                    color: isDark ? AUTH_DARK.textMuted : colors.textSub,
                  }}
                >
                  or
                </Text>
                <View
                  style={{ flex: 1, height: 1, backgroundColor: isDark ? AUTH_DARK.border : colors.border }}
                />
              </View>

              <Pressable
                onPress={handleGoogleContinue}
                disabled={isGoogleLoading}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: scale(8),
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: isDark ? AUTH_DARK.buttonSecondaryBorder : colors.border,
                  borderRadius: 9999,
                  height: verticalScale(48),
                  backgroundColor: isDark ? AUTH_DARK.buttonSecondaryBg : colors.card,
                  marginBottom: verticalScale(12),
                  opacity: isGoogleLoading ? 0.6 : 1,
                }}
              >
                {isGoogleLoading ? (
                  <ActivityIndicator size="small" color={isDark ? AUTH_DARK.buttonSecondaryText : colors.text} />
                ) : (
                  <>
                    <Image
                      source={googleIcon}
                      style={{ width: moderateScale(20), height: moderateScale(20) }}
                      resizeMode="contain"
                    />
                    <Text
                      style={{
                        fontSize: moderateScale(14),
                        color: isDark ? AUTH_DARK.buttonSecondaryText : colors.text,
                        fontWeight: "500",
                      }}
                    >
                      Continue with Google
                    </Text>
                  </>
                )}
              </Pressable>

              <Pressable
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: scale(8),
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: isDark ? AUTH_DARK.buttonSecondaryBorder : colors.border,
                  borderRadius: 9999,
                  height: verticalScale(48),
                  backgroundColor: isDark ? AUTH_DARK.buttonSecondaryBg : colors.card,
                  marginBottom: verticalScale(20),
                }}
                onPress={() => navigation.navigate("EmailSignUp")}
              >
                <MaterialCommunityIcons
                  name="email-outline"
                  size={moderateScale(16)}
                  color={isDark ? AUTH_DARK.buttonSecondaryText : colors.text}
                />
                <Text
                  style={{
                    fontSize: moderateScale(14),
                    color: isDark ? AUTH_DARK.buttonSecondaryText : colors.text,
                    fontWeight: "500",
                  }}
                >
                  Continue with Email
                </Text>
              </Pressable>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: verticalScale(16),
                }}
              >
                <View
                  style={{ flex: 1, height: 1, backgroundColor: isDark ? AUTH_DARK.border : colors.border }}
                />
                <Text
                  style={{
                    marginHorizontal: scale(16),
                    fontSize: moderateScale(12),
                    color: isDark ? AUTH_DARK.textMuted : colors.textSub,
                  }}
                >
                  or
                </Text>
                <View
                  style={{ flex: 1, height: 1, backgroundColor: isDark ? AUTH_DARK.border : colors.border }}
                />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: scale(8),
                }}
              >
                <MaterialCommunityIcons
                  name="magnify"
                  size={moderateScale(14)}
                  color={isDark ? AUTH_DARK.buttonSecondaryText : colors.iconColor}
                />
                <Pressable
                  onPress={() =>
                    navigation.navigate("FindAccount", {
                      itemId: "find-account",
                      title: "Find my account",
                    })
                  }
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: moderateScale(12),
                      color: isDark ? AUTH_DARK.buttonSecondaryText : colors.text,
                    }}
                  >
                    Find my account
                  </Text>
                </Pressable>
              </View>

              <Text
                style={{ fontSize: moderateScale(11), color: isDark ? AUTH_DARK.textDisclaimer : colors.textSub, marginTop: verticalScale(16) }}
              >
                By continuing, you agree to calls including autodialler,
                WhatsApp or texts from Zubba and its affiliates.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
