import React from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { RootStackScreenProps } from "../../navigation/types";
import { AppBottomNav } from "../../components";
import CustomAppBar from "../../components/common/CustomAppBar";

export function AuthorizePaymentScreen({
  navigation,
}: RootStackScreenProps<"AuthorizePayment">) {
  const [pin, setPin] = React.useState("");
  const inputRef = React.useRef<TextInput | null>(null);

  const digits = Array.from({ length: 4 }).map((_, i) => pin[i] || "");

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <View className="flex-1 bg-white">
        <CustomAppBar navigation={navigation} title="Payment Verification" />

        <ScrollView className="flex-1" contentContainerClassName="px-6 pt-6 pb-24 gap-6">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <View className="w-8 h-8 rounded-lg bg-[#31973D] items-center justify-center">
                <MaterialCommunityIcons name="shield-account-outline" size={16} color="#fff" />
              </View>
              <Text className="text-base text-[#1A1C1E]">Enter PIN</Text>
            </View>

            <View className="flex-row items-center gap-2 px-3 py-1 rounded-full bg-[#F3F3F6]">
              <View className="w-2 h-2 rounded-full bg-[#006B23]" />
              <Text className="text-xs font-semibold text-[#1A1C1E]">
                MTN MoMo
              </Text>
            </View>
          </View>

          <Text className="text-base text-[#64748A] leading-6">
            Enter your 4-digit PIN to authorize the payment of{" "}
            <Text className="font-bold text-[#1A1C1E]">GHS 45.00</Text> to{" "}
            <Text className="font-bold text-[#1A1C1E]">Zubba</Text>.
          </Text>

          <View className="flex-row gap-3">
            {digits.map((d, i) => {
              const filled = i < pin.length;
              const active = i === pin.length && pin.length < 4;

              return (
                <Pressable
                  key={i}
                  onPress={() => inputRef.current?.focus()}
                  className={[
                    "w-[52px] h-[64px] rounded-xl border items-center justify-center bg-white",
                    filled || active
                      ? "border-[#31973D]"
                      : "border-[#BECAB9]",
                    active ? "w-[56px] h-[68px]" : "",
                  ].join(" ")}
                >
                  {filled && (
                    <View className="w-3 h-3 rounded-full bg-[#31973D]" />
                  )}
                </Pressable>
              );
            })}
          </View>

          <TextInput
            ref={inputRef}
            value={pin}
            onChangeText={(text) => {
              if (/^\d*$/.test(text) && text.length <= 4) setPin(text);
            }}
            keyboardType="numeric"
            maxLength={4}
            className="absolute opacity-0 w-1 h-1"
          />

          <Pressable
            onPress={() =>
              pin.length === 4 && navigation.navigate("PaymentSuccess")
            }
            className="h-12 rounded-full bg-[#31973D] flex-row items-center justify-center gap-2"
          >
            <MaterialCommunityIcons name="lock-outline" size={16} color="#fff" />
            <Text className="text-white text-sm">Proceed to pay</Text>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default AuthorizePaymentScreen;