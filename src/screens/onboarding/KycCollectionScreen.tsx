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
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { updateUser } from "../../slices/auth/authSlice";
import { useTheme } from "../../context/ThemeContext";

export function KycCollectionScreen({
  route,
  navigation,
}: RootStackScreenProps<"KycCollection">) {
  const phone = route.params?.phone;
  const email = route.params?.email;
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const { colors } = useTheme();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch()
  const isValid = firstname.trim().length > 0 && lastname.trim().length > 0;

  const handleContinue = async () => {
    if (!user?.id) return;

    try {
      await userService.updateUser(user.id, {
        email,
        phone,
        firstname: firstname.trim(),
        lastname: lastname.trim(),
      });
      dispatch(updateUser({...user, firstname, lastname}))

      navigation.navigate("TermsAcceptance", {
        firstname,
        lastname,
      });
    } catch (err) {
      console.log("KYC update failed:", err);
    }
  };

  return (
    <SafeAreaView
    style={{backgroundColor: colors.bg}}
      className="flex-1"
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
            <Text style={{color: colors.text}} className="text-[20px] font-bold">
              What's your name?
            </Text>
            <Text style={{color: colors.textSub}} className="text-[13px] mt-1">
              Let us know how to properly address you
            </Text>
          </View>

          <View className="mt-6">
            <View style={{backgroundColor: colors.surface, borderColor: colors.border}} className="w-full h-[56px] min-h-[56px border rounded-full px-5 justify-center">
              <TextInput
                className="text-[15px] text-[#707579] outline-none focus:outline-none"
                placeholder="Please enter first name"
                value={firstname}
                onChangeText={setFirstname}
                placeholderTextColor={colors.textMuted}
                autoCapitalize="words"
              />
            </View>

            <View style={{backgroundColor: colors.surface, borderColor: colors.border}} className="w-full h-[56px] min-h-[56px] border rounded-full px-5 justify-center mt-4">
              <TextInput
                style={{color: colors.textSub}}
                className="text-[15px] outline-none focus:outline-none"
                placeholder="Please enter last name"
                value={lastname}
                onChangeText={setLastname}
                placeholderTextColor={colors.textMuted}
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
            <Text className="text-2xl">
              <MaterialCommunityIcons
                name="arrow-left"
                color={colors.text}
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
