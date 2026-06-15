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
import { IoMdArrowBack } from "react-icons/io";
import { RootState } from "../../store";

import type { RootStackScreenProps } from "../../navigation/types";
import { useAppSelector } from "../../hooks/useAppSelector";
import { userService } from "../../api/userService";

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

  const handleNext = async () => {
  if (!user?.id) return;

  try {
    const payload = shouldCollectPhone ? { phone: contactCandidate } : { email: contactCandidate };
    await userService.updateUser(user.id, payload);
    navigation.navigate("KycCollection", nextParams);
  } catch (err) {
    console.log("Update user failed:", err);
  }
};

  const nextParams = useMemo(() => {
    if (shouldCollectPhone) {
      return {
        email: existingEmail,
        phone: contactCandidate,
      };
    }

    return {
      phone: existingPhone,
      email: contactCandidate,
    };
  }, [shouldCollectPhone, existingEmail, existingPhone, contactCandidate]);

  return (
    <SafeAreaView className="flex-1 bg-white">
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
              <Text className="text-[20px] font-bold text-[#1F2A33]">
                {shouldCollectPhone
                  ? "What's your phone number"
                  : "What's your email address"}
              </Text>

              <Text className="text-xs text-[#1F2A33] underline mt-2 mb-3">
                {shouldCollectPhone
                  ? "Tip: This helps secure your account and makes sign-in easier."
                  : "Tip: This helps us find your account if you change your phone or lose your number."}
              </Text>

              <View className="w-full h-12 border border-black/5 rounded-full px-4 justify-center">
                <TextInput
                  className="text-[13px] text-[#1F2A33] outline-none focus:outline-none border-0"
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
                <IoMdArrowBack color="#000000" size={24} />
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
