import { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RootState } from "../../store";

import type { RootStackScreenProps } from "../../navigation/types";
import { useAppSelector } from "../../hooks/useAppSelector";
import { userService } from "../../api/userService";
import { useTheme } from "../../context/ThemeContext";

export function NewUserOnboardingScreen({
  route,
  navigation,
}: RootStackScreenProps<"NewUserOnboarding">) {
  const existingPhone = route.params?.phone;
  const existingEmail = route.params?.email;
  const shouldCollectPhone = Boolean(existingEmail && !existingPhone);
  const [contactInput, setContactInput] = useState("");
  const contactCandidate = contactInput.trim();

  const { user } = useAppSelector((state: RootState) => state.auth);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactCandidate);
  const phoneDigits = contactCandidate.replace(/\D/g, "");
  const isPhoneValid = phoneDigits.length >= 6;

  const isValid = shouldCollectPhone ? isPhoneValid : isEmailValid;
  const { colors } = useTheme();

  const handleNext = () => {
    navigation.navigate("KycCollection", {
      email: shouldCollectPhone ? existingEmail : contactCandidate,
      phone: shouldCollectPhone ? contactCandidate : existingPhone,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 p-5">
            <View className="mt-6 gap-3 items-start">
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>
                {shouldCollectPhone
                  ? "What's your phone number"
                  : "What's your email address"}
              </Text>

              <Text style={{ fontSize: 12, color: colors.text, textDecorationLine: 'underline', marginTop: 8, marginBottom: 12 }}>
                {shouldCollectPhone
                  ? "Tip: This helps secure your account and makes sign-in easier."
                  : "Tip: This helps us find your account if you change your phone or lose your number."}
              </Text>

              <View style={{ width: '100%', height: 48, borderWidth: 1, borderColor: colors.border, borderRadius: 9999, paddingHorizontal: 16, justifyContent: 'center', backgroundColor: colors.card }}>
                <TextInput
                  style={{ fontSize: 13, color: colors.text }}
                  placeholder={
                    shouldCollectPhone
                      ? "Enter your phone number"
                      : "Enter your email"
                  }
                  placeholderTextColor="#707579"
                  keyboardType={
                    shouldCollectPhone ? "phone-pad" : "email-address"
                  }
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={contactInput}
                  onChangeText={setContactInput}
                />
              </View>
            </View>
          </View>

          <View className="absolute bottom-6 left-[22px] right-[22px] flex-row justify-between items-center">
            <Pressable className="w-12 h-12 rounded-xl items-center justify-center">
              <Text className="text-2xl text-black">
                <MaterialCommunityIcons
                  name="arrow-left"
                  color={colors.text}
                  size={24}
                />
              </Text>
            </Pressable>

            <Pressable
              disabled={!isValid}
              onPress={handleNext}
              className={[
                "w-24 h-12 rounded-xl items-center justify-center",
                isValid ? "bg-[#34A853]" : "bg-[#34A85380]",
              ].join(" ")}
            >
              <Text className="text-white text-sm">Next</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
