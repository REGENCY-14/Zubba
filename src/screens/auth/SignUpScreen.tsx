import { useState } from "react";
import {
  Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { RootStackScreenProps } from "../../navigation/types";
import { useRegister } from "../../slices/auth/auth.hooks";
import { useTheme } from "../../context/ThemeContext";

const googleIcon = require("../../../assets/Google icon.png");
const ghanaFlag = require("../../../assets/ghana-flag.png");

export function SignUpScreen({ navigation }: RootStackScreenProps<"SignUp">) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const registerMutation = useRegister();
  const { colors } = useTheme();

  const digitsOnly = phoneNumber.replace(/\D/g, "");
  const canContinue = digitsOnly.length >= 6;

  const handleRegister = async () => {
    try {
      const res = await registerMutation.mutateAsync({
        authKey: "phone",
        authValue: phoneNumber,
        role: "customer",
      });
      const isExisting = res.message.includes("Welcome back");
      navigation.navigate("Verify", { phone: phoneNumber, userExists: isExisting });
    } catch (err) {
      console.log("Register error:", err);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 20 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: "400", color: colors.text, marginBottom: 8 }}>
                What's your phone number
              </Text>

              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <View style={{ flexDirection: "row", borderRadius: 9999, alignItems: "center", justifyContent: "space-between", gap: 16, height: 48, padding: 10, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}>
                  <View style={{ borderRadius: 9999, overflow: "hidden" }}>
                    <Image source={ghanaFlag} style={{ width: 28, height: 20 }} resizeMode="contain" />
                  </View>
                  <MaterialCommunityIcons name="chevron-down" size={24} color={colors.iconColor} />
                </View>

                <TextInput
                  style={{ flex: 1, height: 48, paddingHorizontal: 16, borderWidth: 1, borderColor: colors.border, borderRadius: 9999, backgroundColor: colors.card, fontSize: 15, color: colors.text }}
                  placeholder="phone number"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
              </View>

              {!canContinue && phoneNumber.length > 0 && (
                <Text style={{ color: "#DC2626", fontSize: 12, marginBottom: 8, paddingHorizontal: 4 }}>
                  Enter a valid phone number
                </Text>
              )}

              <Pressable
                style={{ height: 48, borderRadius: 9999, alignItems: "center", justifyContent: "center", marginBottom: 16, backgroundColor: "#34A853", opacity: canContinue && !registerMutation.isPending ? 1 : 0.6 }}
                onPress={handleRegister}
                disabled={!canContinue || registerMutation.isPending}
              >
                <Text style={{ color: "#FFFFFF", fontSize: 14 }}>
                  {registerMutation.isPending ? "Please wait..." : "Continue"}
                </Text>
              </Pressable>

              <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 16 }}>
                <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
                <Text style={{ marginHorizontal: 16, fontSize: 12, color: colors.textSub }}>or</Text>
                <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
              </View>

              <Pressable style={{ flexDirection: "row", alignItems: "center", gap: 8, justifyContent: "center", borderWidth: 1, borderColor: colors.border, borderRadius: 9999, height: 48, backgroundColor: colors.card, marginBottom: 12 }}>
                <Image source={googleIcon} style={{ width: 16, height: 16 }} resizeMode="contain" />
                <Text style={{ fontSize: 14, color: colors.text, fontWeight: "500" }}>Continue with Google</Text>
              </Pressable>

              <Pressable style={{ flexDirection: "row", alignItems: "center", gap: 8, justifyContent: "center", borderWidth: 1, borderColor: colors.border, borderRadius: 9999, height: 48, backgroundColor: colors.card, marginBottom: 12 }}>
                <MaterialCommunityIcons name="apple" size={18} color={colors.text} />
                <Text style={{ fontSize: 14, color: colors.text, fontWeight: "500" }}>Continue with Apple</Text>
              </Pressable>

              <Pressable
                style={{ flexDirection: "row", alignItems: "center", gap: 8, justifyContent: "center", borderWidth: 1, borderColor: colors.border, borderRadius: 9999, height: 48, backgroundColor: colors.card, marginBottom: 20 }}
                onPress={() => navigation.navigate("EmailSignUp")}
              >
                <MaterialCommunityIcons name="email" size={16} color={colors.text} />
                <Text style={{ fontSize: 14, color: colors.text, fontWeight: "500" }}>Continue with Email</Text>
              </Pressable>

              <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 16 }}>
                <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
                <Text style={{ marginHorizontal: 16, fontSize: 12, color: colors.textSub }}>or</Text>
                <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <MaterialCommunityIcons name="magnify" size={14} color={colors.iconColor} />
                <Pressable onPress={() => navigation.navigate("FindAccount", { itemId: "find-account", title: "Find my account" })}>
                  <Text style={{ textAlign: "center", fontSize: 12, color: colors.text }}>Find my account</Text>
                </Pressable>
              </View>

              <Text style={{ fontSize: 11, color: colors.textSub, marginTop: 16 }}>
                By continuing, you agree to calls including autodialler, WhatsApp or texts from Zubba and its affiliates.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
