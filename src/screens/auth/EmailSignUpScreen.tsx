import { useEffect, useMemo, useState } from "react";
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
import { useGoogleLogin } from "../../services/googleAuth";
import { authService } from "../../api/authService";
import { handleApiError } from "../../utils/handleApiError";
import { scale, verticalScale, moderateScale } from "../../utils/scale";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const googleIcon = require("../../../assets/google-icon.png");

export function EmailSignUpScreen({
  navigation,
}: RootStackScreenProps<"EmailSignUp">) {
  const [email, setEmail] = useState("");
  const registerMutation = useRegister();
  const { colors } = useTheme();

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

  const isEmailValid = useMemo(() => EMAIL_REGEX.test(email.trim()), [email]);

  const handleContinue = async () => {
    try {
      await registerMutation.mutateAsync({
        authKey: "email",
        authValue: email.trim().toLowerCase(),
        role: "customer",
      });
      navigation.navigate("Verify", {
        email: email.trim().toLowerCase(),
        userExists: false,
      });
    } catch (err) {
      handleApiError(err)
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flex: 1, padding: moderateScale(20), paddingBottom: verticalScale(24) }}>
            <Text
              style={{ fontSize: moderateScale(15), color: colors.text, marginBottom: verticalScale(12) }}
            >
              What's your email address
            </Text>

            <View
              style={{
                borderWidth: 1,
                borderRadius: 9999,
                paddingHorizontal: scale(16),
                height: verticalScale(48),
                justifyContent: "center",
                backgroundColor: colors.card,
                marginBottom: verticalScale(16),
                borderColor: isEmailValid
                  ? "rgba(52,168,83,0.2)"
                  : colors.border,
              }}
            >
              <TextInput
                style={{ color: colors.text, fontSize: moderateScale(13) }}
                placeholder="Enter your email"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <Pressable
              style={{
                height: verticalScale(48),
                borderRadius: 9999,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: verticalScale(16),
                backgroundColor: "#34A853",
                opacity: isEmailValid && !registerMutation.isPending ? 1 : 0.5,
              }}
              disabled={!isEmailValid || registerMutation.isPending}
              onPress={handleContinue}
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
                style={{ flex: 1, height: 1, backgroundColor: colors.border }}
              />
              <Text
                style={{
                  marginHorizontal: scale(16),
                  fontSize: moderateScale(12),
                  color: colors.textSub,
                }}
              >
                or
              </Text>
              <View
                style={{ flex: 1, height: 1, backgroundColor: colors.border }}
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
                borderColor: colors.border,
                borderRadius: 9999,
                height: verticalScale(48),
                backgroundColor: colors.card,
                marginBottom: verticalScale(12),
                opacity: isGoogleLoading ? 0.6 : 1,
              }}
            >
              {isGoogleLoading ? (
                <ActivityIndicator size="small" color={colors.text} />
              ) : (
                <>
                  <Image
                    source={googleIcon}
                    style={{ width: moderateScale(20), height: moderateScale(20) }}
                    resizeMode="contain"
                  />
                  <Text
                    style={{ fontSize: moderateScale(14), color: colors.text, fontWeight: "500" }}
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
                justifyContent: "center",
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 9999,
                height: verticalScale(48),
                backgroundColor: colors.card,
                marginBottom: verticalScale(20),
              }}
              onPress={() => navigation.navigate("SignUp")}
            >
              <MaterialCommunityIcons
                name="phone"
                size={moderateScale(16)}
                color={colors.text}
              />
              <Text
                style={{
                  marginLeft: scale(8),
                  color: colors.text,
                  fontSize: moderateScale(14),
                  fontWeight: "500",
                }}
              >
                Continue with Phone
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
                style={{ flex: 1, height: 1, backgroundColor: colors.border }}
              />
              <Text
                style={{
                  marginHorizontal: scale(16),
                  fontSize: moderateScale(12),
                  color: colors.textSub,
                }}
              >
                or
              </Text>
              <View
                style={{ flex: 1, height: 1, backgroundColor: colors.border }}
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
                color={colors.iconColor}
              />
              <Pressable
                onPress={() => navigation.navigate("FindAccountEmail")}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: moderateScale(12),
                    color: colors.text,
                  }}
                >
                  Find my account
                </Text>
              </Pressable>
            </View>

            <Text
              style={{ fontSize: moderateScale(11), color: colors.textSub, marginTop: verticalScale(16) }}
            >
              By continuing, you agree to calls including autodialler, WhatsApp
              or texts from Zubba and its affiliates.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
