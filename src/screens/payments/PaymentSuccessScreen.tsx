import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { RootStackScreenProps } from "../../navigation/types";

export function PaymentSuccessScreen({
  navigation,
}: RootStackScreenProps<"PaymentSuccess">) {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <View className="flex-1 bg-white">

        <View className="h-12 flex-row items-center justify-between px-4 bg-white">
          <Pressable
            onPress={() => navigation.goBack()}
            className="w-6 h-6 items-center justify-center"
          >
            <Text className="text-[28px] text-[#1F2A33]">‹</Text>
          </Pressable>

          <Text className="text-base font-semibold text-[#1F2A33]">
            Success
          </Text>

          <View className="w-6 h-6" />
        </View>

        <View className="flex-1 items-center gap-6 pt-28">
          <View className="w-24 h-24 rounded-full bg-[#16A34A] items-center justify-center shadow-md">
            <MaterialCommunityIcons name="check" size={40} color="#fff" />
          </View>

          <Text className="text-2xl font-bold text-black text-center leading-8">
            Your transaction is{"\n"}successful
          </Text>
        </View>

        <View className="absolute inset-0 bg-black/40" pointerEvents="none" />

        <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] pt-4 pb-6 gap-4">

          <View className="w-36 h-[3px] bg-[#334154] rounded-full self-center" />

          <Text className="px-6 text-base font-medium text-black">
            Select a transfer method
          </Text>

          <View className="px-5">
            <View className="bg-white rounded-3xl p-6 gap-4">

              <View className="flex-row justify-between items-center border-b border-[#E2E2E5] pb-4">
                <Text className="text-[#64748A] text-base">Transaction ID</Text>
                <Text className="text-[#1F2A33] font-medium">ZB-9928374</Text>
              </View>

              <View className="gap-2">
                <View className="flex-row justify-between">
                  <Text className="text-[#64748A]">Bin Bags</Text>
                  <Text className="text-[#1F2A33] font-medium">2 Bags</Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-[#64748A]">Pickup time</Text>
                  <Text className="text-[#1F2A33] font-medium">Today, 10:30 AM</Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-[#64748A]">Payment Method</Text>
                  <Text className="text-[#1F2A33] font-medium">MTN MoMo</Text>
                </View>
              </View>

              <View className="border-t border-dashed border-[#BECAB9] pt-4 flex-row justify-between">
                <Text className="text-[#64748A]">Amount Paid</Text>

                <View className="items-end">
                  <Text className="text-[#1F2A33] font-medium">GHS</Text>
                  <Text className="text-[#1F2A33] font-medium">45.00</Text>
                </View>
              </View>
            </View>
          </View>

          <View className="px-6 gap-2">
            <Pressable
              onPress={() => navigation.navigate("RateRide")}
              className="h-12 bg-[#31973D] rounded-full items-center justify-center"
            >
              <Text className="text-white text-sm">Continue</Text>
            </Pressable>

            <Pressable className="h-12 bg-white border border-[#E2E8F0] rounded-full items-center justify-center">
              <Text className="text-[#1F2A33]">Download Transaction</Text>
            </Pressable>

            <Pressable className="h-12 bg-white rounded-full items-center justify-center">
              <Text className="text-[#1F2A33] font-semibold">
                Report Issue
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default PaymentSuccessScreen;