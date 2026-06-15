import { useMemo, useState } from "react";
import {
  Text,
  View,
  Pressable,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { RootStackScreenProps } from "../../navigation/types";
import { userService } from "../../api/userService";

const ghanaFlag = require("../../../assets/ghana-flag.png");

export function FindAccountScreen({
  route,
  navigation,
}: RootStackScreenProps<"FindAccount">) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const isPhoneValid = useMemo(
    () => phoneNumber.trim().length > 0,
    [phoneNumber],
  );

  const handleFindUser = async () => {
    const phone = phoneNumber.trim();

    if (!isPhoneValid) return;

    try {
      setLoading(true);

      console.log(phone)

      const res = await userService.findUser({
        authKey: "phone",
        authValue: phone,
      });

      const user = res.data.user;

      if (!user) {
        console.log("User not found");
        return;
      }

      navigation.navigate("FindAccountOtp", {
        phone,
      });
    } catch (err) {
      console.log("Find user failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-5 pt-10 pb-6 justify-between">
        <View className="gap-4">
          <Text className="text-[15px] text-[#1F2A33]">
            What's your phone number
          </Text>

          <View className="flex-row items-center gap-2 h-12">
            <View className="flex-row rounded-full items-center justify-between gap-4 h-12 p-[10px] bg-white border border-[#F2F2F2]">
              <View className="rounded-full overflow-hidden">
                <Image
                  source={ghanaFlag}
                  style={{ width: 28, height: 20 }}
                  resizeMode="contain"
                />
              </View>
              <MaterialCommunityIcons name="chevron-down" size={24} color="#000000" />
            </View>

            <View
              className={[
                "flex-1 h-12 justify-center px-4 rounded-full border",
                isFocused || isPhoneValid ? "border-black" : "border-black/5",
              ].join(" ")}
            >
              <TextInput
                className={[
                  "text-[15px] outline-none",
                  isPhoneValid ? "text-[#1F2A33]" : "text-[#707579]",
                ].join(" ")}
                placeholder="phone number"
                placeholderTextColor="#707579"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </View>
          </View>

          <Pressable
            className="self-start px-5 h-8 border border-[#E2E8F0] rounded-full items-center justify-center"
            onPress={() => navigation.navigate("FindAccountEmail")}
          >
            <Text className="text-xs font-medium text-[#1F2A33]">
              Find account with email
            </Text>
          </Pressable>
        </View>

        <View className="flex-row items-center justify-between h-12">
          <Pressable
            onPress={() => navigation.goBack()}
            className="w-12 h-12 rounded-xl items-center justify-center"
          >
            <MaterialCommunityIcons color="#000000" name="arrow-left" size={24} />
          </Pressable>

          <Pressable
            disabled={!isPhoneValid || loading}
            onPress={handleFindUser}
            className={[
              "w-24 h-12 rounded-xl items-center justify-center flex-row gap-1",
              isPhoneValid && !loading ? "bg-[#34A853]" : "bg-[#34A85380]",
            ].join(" ")}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text className="text-white text-sm">Next</Text>
                <MaterialCommunityIcons name="arrow-right" size={12} color="#fff" />
              </>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
