import React from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { RootStackScreenProps } from "../../navigation/types";
import { AppBottomNav } from "../../components";
import CustomAppBar from "../../components/common/CustomAppBar";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export function PaymentMethodScreen({
  navigation,
}: RootStackScreenProps<"PaymentMethod">) {
  const [phoneNumber, setPhoneNumber] = React.useState("055 123 4567");

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <View className="flex-1 bg-white">
        <CustomAppBar navigation={navigation} title="Payment" />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 12, paddingTop: 16, paddingBottom: 120, gap: 24 }}
        >

          <View className="gap-6">

            <View className="bg-white border border-[#E2E8F0] rounded-3xl p-6 items-center gap-4">

              <View className="w-14 h-14 rounded-full bg-[#41A06A]/10 items-center justify-center">
                <MaterialCommunityIcons
                  name="wallet"
                  size={27}
                  color="#31973D"
                />
              </View>

              <Text className="text-base text-center text-[#3F4A3D]">
                Total to Pay
              </Text>

              <Text className="text-[32px] font-semibold text-[#1F2A33] text-center">
                GHS 45.00
              </Text>

              <View className="w-full border-t border-black/10" />

              <View className="bg-[#E8F2E8] px-3 py-1 rounded-full border border-[#E2E8F0]">
                <Text className="text-[#31973D] text-[13px] font-bold">
                  Includes all fees
                </Text>
              </View>
            </View>

            <View className="gap-2">

              <Text className="text-base text-[#1F2A33]">
                Wallet Phone Number
              </Text>

              <TextInput
                className="h-12 px-4 border border-[#CBD5E0] rounded-full bg-white text-[#1F2A33]"
                placeholder="055 123 4567"
                placeholderTextColor="#64748A"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />

              <Text className="text-xs text-[#64748A]">
                Enter your mobile money number
              </Text>
            </View>

            <View className="flex-row gap-4 p-4 border border-[#BECAB9] rounded-3xl bg-white">

              <View className="w-8 h-8 rounded-full bg-[#006B23]/10 items-center justify-center">
                <MaterialCommunityIcons
                  name="information-outline"
                  size={18}
                  color="#31973D"
                />
              </View>

              <View className="flex-1 gap-1">
                <Text className="text-base text-[#1F2A33]">
                  How it works
                </Text>

                <Text className="text-sm text-[#64748A] leading-6">
                  You will receive a secure payment prompt on your mobile phone.
                  Enter your MM PIN to authorize the transaction instantly.
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => navigation.navigate("PaymentVerification")}
              className="h-12 bg-[#31973D] rounded-full items-center justify-center"
            >
              <Text className="text-white text-sm">
                Proceed to verify
              </Text>
            </Pressable>

            <Text className="text-[10px] text-center uppercase text-gray-400">
              Secured by Zubba Pay Architecture
            </Text>
          </View>
        </ScrollView>

        <AppBottomNav
          activeTab="home"
          onHomePress={() => navigation.navigate("LocationSharing")}
          onSavedPress={() =>
            navigation.navigate("Details", { itemId: "save", title: "Saved" })
          }
          onSettingsPress={() => navigation.navigate("Settings")}
        />
      </View>
    </SafeAreaView>
  );
}

export default PaymentMethodScreen;