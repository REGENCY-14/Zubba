import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RootState } from "../../store";

import type { RootStackScreenProps } from "../../navigation/types";
import { useAppSelector } from "../../hooks/useAppSelector";
import { userService } from "../../api/userService";

export function KycCollectionScreen({
  route,
  navigation,
}: RootStackScreenProps<"KycCollection">) {
  const phone = route.params?.phone;
  const email = route.params?.email;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const { user } = useAppSelector((state: RootState) => state.auth);
  const isValid = firstName.trim().length > 0 && lastName.trim().length > 0;

  const handleContinue = async () => {
    if (!user?.id) return;

    try {
      await userService.updateUser(user.id, {
        email,
        phone,
        firstname: firstName.trim(),
        lastname: lastName.trim(),
      });

      navigation.navigate("TermsAcceptance", {
        firstName,
        lastName,
      });
    } catch (err) {
      console.log("KYC update failed:", err);
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      edges={["top", "left", "right", "bottom"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="p-5"
          keyboardShouldPersistTaps="handled"
        >
          <View className="h-[6px]" />

          <View className="w-full gap-3">
            <Text className="text-[20px] font-bold text-[#1F2A33]">
              What's your name?
            </Text>
            <Text className="text-[13px] text-[#1F2A33] mt-1">
              Let us know how to properly address you
            </Text>
          </View>

          <View className="mt-6">
            <View className="w-[358px] h-[56px] min-h-[56px] bg-white border border-black/5 rounded-full px-5 justify-center">
              <TextInput
                className="text-[15px] text-[#707579] outline-none focus:outline-none"
                placeholder="Please enter first name"
                value={firstName}
                onChangeText={setFirstName}
                placeholderTextColor="#BDBDBD"
                autoCapitalize="words"
              />
            </View>

            <View className="w-[358px] h-[56px] min-h-[56px] bg-white border border-black/5 rounded-full px-5 justify-center mt-4">
              <TextInput
                className="text-[15px] text-[#707579] outline-none focus:outline-none"
                placeholder="Please enter last name"
                value={lastName}
                onChangeText={setLastName}
                placeholderTextColor="#BDBDBD"
                autoCapitalize="words"
              />
            </View>
          </View>
        </ScrollView>

        <View className="px-[22px] py-6 flex-row justify-between items-center">
          <Pressable
            onPress={() => navigation.goBack()}
            className="w-12 h-12 rounded-xl items-center justify-center"
          >
            <Text className="text-2xl text-black">
              <MaterialCommunityIcons
                name="arrow-left"
                color="#000000"
                size={24}
              />
            </Text>
          </Pressable>

          <Pressable
            disabled={!isValid}
            onPress={handleContinue}
            className={`w-24 h-12 rounded-xl items-center justify-center ${
              isValid ? "bg-[#34A853]" : "bg-[#34A853]/50"
            }`}
          >
            <Text className="text-white text-sm">Continue</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
