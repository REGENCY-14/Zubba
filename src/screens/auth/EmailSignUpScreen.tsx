import { useEffect, useMemo, useState } from "react";
import {
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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const googleIcon = require("../../../assets/Google icon.png");

export function EmailSignUpScreen({
  navigation,
}: RootStackScreenProps<"EmailSignUp">) {
  const [email, setEmail] = useState("");
  const registerMutation = useRegister();
  const { colors } = useTheme();

  const { request, promptAsync, response } = useGoogleLogin();

  useEffect(() => {
    if (response?.type === "success") {
      const idToken = response.params.id_token;
      authService.googleLogin(idToken);
    }
  }, [response]);

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
      console.log(err);
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
          <View style={{ flex: 1, padding: 20, paddingBottom: 24 }}>
            <Text
              style={{ fontSize: 15, color: colors.text, marginBottom: 12 }}
            >
              What's your email address
            </Text>

            <View
              style={{
                borderWidth: 1,
                borderRadius: 9999,
                paddingHorizontal: 16,
                height: 48,
                justifyContent: "center",
                backgroundColor: colors.card,
                marginBottom: 16,
                borderColor: isEmailValid
                  ? "rgba(52,168,83,0.2)"
                  : colors.border,
              }}
            >
              <TextInput
                style={{ color: colors.text, fontSize: 13 }}
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
                height: 48,
                borderRadius: 9999,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
                backgroundColor: "#34A853",
                opacity: isEmailValid && !registerMutation.isPending ? 1 : 0.5,
              }}
              disabled={!isEmailValid || registerMutation.isPending}
              onPress={handleContinue}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 14 }}>
                {registerMutation.isPending ? "Please wait..." : "Continue"}
              </Text>
            </Pressable>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 16,
              }}
            >
              <View
                style={{ flex: 1, height: 1, backgroundColor: colors.border }}
              />
              <Text
                style={{
                  marginHorizontal: 16,
                  fontSize: 12,
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
              onPress={() => promptAsync()}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                justifyContent: "center",
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 9999,
                height: 48,
                backgroundColor: colors.card,
                marginBottom: 12,
              }}
            >
              <Image
                source={googleIcon}
                style={{ width: 16, height: 16 }}
                resizeMode="contain"
              />
              <Text
                style={{ fontSize: 14, color: colors.text, fontWeight: "500" }}
              >
                Continue with Google
              </Text>
            </Pressable>

            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 9999,
                height: 48,
                backgroundColor: colors.card,
                marginBottom: 20,
              }}
              onPress={() => navigation.navigate("SignUp")}
            >
              <MaterialCommunityIcons
                name="phone"
                size={16}
                color={colors.text}
              />
              <Text
                style={{
                  marginLeft: 8,
                  color: colors.text,
                  fontSize: 14,
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
                marginVertical: 16,
              }}
            >
              <View
                style={{ flex: 1, height: 1, backgroundColor: colors.border }}
              />
              <Text
                style={{
                  marginHorizontal: 16,
                  fontSize: 12,
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
                gap: 8,
              }}
            >
              <MaterialCommunityIcons
                name="magnify"
                size={14}
                color={colors.iconColor}
              />
              <Pressable
                onPress={() => navigation.navigate("FindAccountEmail")}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 12,
                    color: colors.text,
                  }}
                >
                  Find my account
                </Text>
              </Pressable>
            </View>

            <Text
              style={{ fontSize: 11, color: colors.textSub, marginTop: 16 }}
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
