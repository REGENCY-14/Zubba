import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { RootStackScreenProps } from "../../navigation/types";
import { useRegister } from "../../slices/auth/auth.hooks";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const googleIcon = require("../../../assets/Google icon.png");

export function EmailSignUpScreen({
  navigation,
}: RootStackScreenProps<"EmailSignUp">) {
  const [email, setEmail] = useState("");

  const registerMutation = useRegister();

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
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 p-5 pb-6">
            <Text className="text-[15px] text-[#1F2A33] mb-3">
              What's your email address
            </Text>

            <View
              className={`border rounded-full px-4 h-12 justify-center bg-white mb-4 ${
                isEmailValid ? "border-[#34A85333]" : "border-[#0000000D]"
              }`}
            >
              <TextInput
                className="text-[#1F2A33] text-[13px] outline-none"
                placeholder="Enter your email"
                placeholderTextColor="#707579"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <Pressable
              className={`h-12 rounded-full items-center justify-center mb-4 ${
                isEmailValid && !registerMutation.isPending
                  ? "bg-[#34A853]"
                  : "bg-[#34A85380]"
              }`}
              disabled={!isEmailValid || registerMutation.isPending}
              onPress={handleContinue}
            >
              <Text className="text-white text-sm">
                {registerMutation.isPending ? "Please wait..." : "Continue"}
              </Text>
            </Pressable>

            <View className="flex-row items-center my-4">
              <View className="flex-1 h-px bg-[#E8EEF3]" />
              <Text className="mx-4 text-xs text-[#656F77]">or</Text>
              <View className="flex-1 h-px bg-[#E8EEF3]" />
            </View>

            <Pressable className="flex-row items-center gap-2 justify-center border border-[#E2E8F0] rounded-full h-12 bg-white mb-3">
              <Image
                source={googleIcon}
                style={{ width: 16, height: 16 }}
                resizeMode="contain"
              />
              <Text className="text-sm text-[#262D3A] font-medium">
                Continue with Google
              </Text>
            </Pressable>

            <Pressable className="flex-row items-center gap-2 justify-center border border-[#E2E8F0] rounded-full h-12 mb-5">
              <MaterialCommunityIcons name="apple" size={16} color="#000000" />
              <Text className="text-[#1F2A33] text-sm font-medium">
                Continue with Apple
              </Text>
            </Pressable>

            <Pressable
              className="flex-row items-center justify-center border border-[#E2E8F0] rounded-full h-12 mb-5"
              onPress={() => navigation.navigate("SignUp")}
            >
              <MaterialCommunityIcons name="phone" size={16} color="#000000" />
              <Text className="ml-2 text-[#262D3A] text-sm font-medium">
                Continue with Phone
              </Text>
            </Pressable>

            <View className="flex-row items-center my-4">
              <View className="flex-1 h-px bg-[#E8EEF3]" />
              <Text className="mx-4 text-xs text-[#656F77]">or</Text>
              <View className="flex-1 h-px bg-[#E8EEF3]" />
            </View>

            <View className="flex-row items-center justify-center gap-2">
              <MaterialCommunityIcons name="magnify" size={14} color="#000000" />
              <Pressable
                onPress={() =>
                  navigation.navigate("FindAccountEmail")
                }
              >
                <Text className="text-center text-xs text-[#1F2A33]">
                  Find my account
                </Text>
              </Pressable>
            </View>

            <Text className="text-[11px] text-[#707579] mt-4 text-left">
              By continuing, you agree to calls including autodialler, WhatsApp
              or texts from Zubba and its affiliates.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
