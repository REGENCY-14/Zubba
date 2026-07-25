import { useEffect, useState } from "react";
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
import { handleApiError } from "../../utils/handleApiError";
import { scale, verticalScale, moderateScale } from "../../utils/scale";

const googleIcon = require("../../../assets/Google icon.png");
const ghanaFlag = require("../../../assets/ghana-flag.png");

export function SignUpScreen({ navigation }: RootStackScreenProps<"SignUp">) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const registerMutation = useRegister();
  const { colors } = useTheme();

  const digitsOnly = phoneNumber.replace(/\D/g, "");
  const canContinue = digitsOnly.length >= 6;

  const { request, promptAsync, response } = useGoogleLogin();

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
      handleApiError(err)
    }
  };

  useEffect(() => {
    if (response?.type === "success") {
      const idToken = response.params.id_token;
      authService.googleLogin(idToken);
    }
  }, [response]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
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
                <View
                  style={{
                    flexDirection: "row",
                    borderRadius: 9999,
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: scale(16),
                    height: verticalScale(48),
                    padding: moderateScale(10),
                    backgroundColor: colors.card,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                >
                  <View style={{ borderRadius: 9999, overflow: "hidden" }}>
                    <Image
                      source={ghanaFlag}
                      style={{ width: scale(28), height: verticalScale(20) }}
                      resizeMode="contain"
                    />
                  </View>
                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={moderateScale(24)}
                    color={colors.iconColor}
                  />
                </View>

                <TextInput
                  style={{
                    flex: 1,
                    height: verticalScale(48),
                    paddingHorizontal: scale(16),
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 9999,
                    backgroundColor: colors.card,
                    fontSize: moderateScale(15),
                    color: colors.text,
                  }}
                  className="outline-none"
                  placeholder="phone number"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
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
                  backgroundColor: "#34A853",
                  opacity: canContinue && !registerMutation.isPending ? 1 : 0.6,
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
                onPress={() => promptAsync()}
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
                }}
              >
                <Image
                  source={googleIcon}
                  style={{ width: moderateScale(16), height: moderateScale(16) }}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    fontSize: moderateScale(14),
                    color: colors.text,
                    fontWeight: "500",
                  }}
                >
                  Continue with Google
                </Text>
              </Pressable>

              <Pressable
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
                  marginBottom: verticalScale(20),
                }}
                onPress={() => navigation.navigate("EmailSignUp")}
              >
                <MaterialCommunityIcons
                  name="email-outline"
                  size={moderateScale(16)}
                  color={colors.text}
                />
                <Text
                  style={{
                    fontSize: moderateScale(14),
                    color: colors.text,
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
