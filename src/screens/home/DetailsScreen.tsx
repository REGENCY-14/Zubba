import { useState } from "react";
import {
  Text,
  View,
  Image,
  Pressable,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Card } from "../../components/Card";
import type { RootStackScreenProps } from "../../navigation/types";

const ghanaFlag = require("../../../assets/ghana-flag.png");

export function DetailsScreen({
  route,
  navigation,
}: RootStackScreenProps<"Details">) {
  const item = route.params;
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const isFindAccount = item?.itemId === "find-account";
  const isPhoneValid = phoneNumber.trim().length > 0;

  if (isFindAccount) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right", "bottom"]}>
        <View className="flex-1 px-[23px] pt-10 pb-6 justify-between">

          <View className="gap-4">

            <Text className="text-[15px] leading-[22px] text-[#1F2A33]">
              What's your phone number
            </Text>

            <View className="flex-row items-center gap-2 h-12">

              <View className="flex-row items-center justify-between w-[94px] h-12 px-[10px] border border-[#F2F2F2] rounded-xl bg-white">

                <Image
                  source={ghanaFlag}
                  style={{ width: 28, height: 20 }}
                  resizeMode="contain"
                />

                <MaterialCommunityIcons
                  name="chevron-right"
                  size={22}
                  color="#000"
                />
              </View>

              <TextInput
                className={`flex-1 h-12 px-4 border rounded-xl text-[15px] ${
                  isFocused || isPhoneValid
                    ? "border-black text-[#1F2A33] opacity-100"
                    : "border-black/10 text-[#707579] opacity-50"
                }`}
                placeholder="phone number"
                placeholderTextColor="#A8A8A8"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </View>

            <Pressable className="w-[178px] h-8 border border-[#E2E8F0] rounded-full items-center justify-center">
              <Text className="text-xs text-[#1F2A33] font-medium">
                Search my account
              </Text>
            </Pressable>
          </View>

          <View className="flex-row items-center justify-between h-12">

            <Pressable onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={26}
                color="#000"
              />
            </Pressable>

            <Pressable
              className={`w-24 h-12 rounded-xl items-center justify-center ${
                isPhoneValid ? "bg-[#34A853]" : "bg-[#34A853]/50"
              }`}
            >
              <Text className="text-white text-sm">Next</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-[#F8FAFC] p-5">
      <Card>
        <Text className="text-[#0F172A] text-2xl font-extrabold mb-2">
          {item?.title ?? "Details"}
        </Text>

        <Text className="text-[#475569] text-base leading-6 mb-3">
          This is a placeholder screen connected through typed React Navigation.
        </Text>

        <Text className="text-[#334155] text-sm font-semibold">
          Item ID: {item?.itemId ?? "n/a"}
        </Text>
      </Card>
    </View>
  );
}