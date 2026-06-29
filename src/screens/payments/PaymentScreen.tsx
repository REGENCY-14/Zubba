import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import type { RootStackScreenProps } from "../../navigation/types";
import { AppBottomNav } from "../../components";
import CustomAppBar from "../../components/common/CustomAppBar";

type PaymentMethodId = "wallet" | "momo" | "telecel" | "airtel";

type PaymentOptionProps = {
  selected: boolean;
  title: string;
  badge?: string;
  image?: any;
  iconName?: string;
  badgeBg?: string;
  badgeTextColor?: string;
  onPress: () => void;
};

function PaymentOption({
  selected,
  title,
  badge,
  image,
  iconName,
  badgeBg = "bg-gray-200",
  badgeTextColor = "text-black",
  onPress,
}: PaymentOptionProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center justify-between p-4 rounded-3xl border min-h-[82px] ${
        selected
          ? "bg-[#31973D]/10 border-[#31973D]"
          : "bg-white border-[#E2E8F0]"
      }`}
    >
      <View className="flex-row items-center flex-1 gap-4">
        <View className={`w-12 h-12 rounded-xl items-center justify-center overflow-hidden ${badgeBg}`}>
          {iconName ? (
            <MaterialCommunityIcons name={iconName as any} size={22} color="#FFFFFF" />
          ) : image ? (
            <Image source={image} style={{ width: 28, height: 28 }} resizeMode="contain" />
          ) : (
            <Text className={`text-xs font-bold ${badgeTextColor}`}>{badge}</Text>
          )}
        </View>

        <View className="flex-1">
          <Text className="text-base font-medium text-[#1C1B1B]">{title}</Text>
        </View>
      </View>

      <View
        className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
          selected ? "bg-[#31973D] border-[#31973D]" : "bg-white border-[#8E7164]"
        }`}
      >
        {selected && <View className="w-2 h-2 rounded-full bg-white" />}
      </View>
    </Pressable>
  );
}

const airtelTigo = require("../../../assets/airtelTigo.png");
export function PaymentScreen({ navigation }: RootStackScreenProps<"Payment">) {
  const [selectedMethod, setSelectedMethod] =
    React.useState<PaymentMethodId>("wallet");

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <View className="flex-1 bg-white">
        <CustomAppBar navigation={navigation} title="Payment" />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: 120, gap: 24 }}
        >
          <View className="border border-[#E2E8F0] bg-white rounded-3xl p-6 gap-4">
            <View className="flex-row justify-between items-start">
              <View className="gap-1">
                <Text className="text-[16px] uppercase tracking-widest text-[#1F2A33]">
                  Estimated Cost
                </Text>
                <Text className="text-[#006B23] text-sm">GHS 45.00</Text>
              </View>

              <View className="px-3 py-1 rounded-full border border-[#E2E8F0]" style={{ backgroundColor: 'rgba(0,107,35,0.1)' }}>
                <Text className="text-[#31973D] text-[13px]">Premium</Text>
              </View>
            </View>

            <View className="gap-2">
              <View className="border-t border-black/10" style={{ borderStyle: "dashed" }} />

              <View className="flex-row justify-between">
                <Text className="text-[15px] text-[#1F2A33]">
                  Pickup - Organic Waste
                </Text>
                <Text className="text-[15px] text-[#64748A]">GHS 35.00</Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-[15px] text-[#1F2A33]">Service Fee</Text>
                <Text className="text-[15px] text-[#64748A]">GHS 10.00</Text>
              </View>
            </View>
          </View>

          <View className="gap-4">
            <Text className="text-base font-bold text-[#1F2A33]">
              Select Payment Method
            </Text>

            <PaymentOption
              selected={selectedMethod === "wallet"}
              title="Zubba Wallet"
              iconName="wallet"
              badgeBg="bg-[#31973D]"
              onPress={() => setSelectedMethod("wallet")}
            />

            <PaymentOption
              selected={selectedMethod === "momo"}
              title="MTN MoMo"
              badge="MTN"
              badgeBg="bg-[#FFCC00]"
              badgeTextColor="text-black"
              onPress={() => setSelectedMethod("momo")}
            />

            <PaymentOption
              selected={selectedMethod === "telecel"}
              title="Telecel Cash"
              badge="Telecel"
              badgeBg="bg-[#DC2626]"
              badgeTextColor="text-white"
              onPress={() => setSelectedMethod("telecel")}
            />

            <PaymentOption
              selected={selectedMethod === "airtel"}
              title="Airtel Money"
              image={airtelTigo}
              badgeBg="bg-white"
              badgeTextColor="text-[#1E3A8A]"
              onPress={() => setSelectedMethod("airtel")}
            />
          </View>

          <Pressable
            onPress={() =>
              selectedMethod === "wallet"
                ? navigation.navigate("WalletCheckout")
                : navigation.navigate("PaymentMethod")
            }
            className="h-12 bg-[#31973D] rounded-full items-center justify-center"
          >
            <Text className="text-white text-sm">Continue</Text>
          </Pressable>
        </ScrollView>

        <AppBottomNav
          activeTab="home"
          paddingBottom={14}
          bottomOffset={8}
          onHomePress={() => navigation.navigate('Home')}
          onSavedPress={() => navigation.navigate('Details', { itemId: 'saved', title: 'Saved' })}
          onSettingsPress={() => navigation.navigate('Settings')}
          onCalendarPress={() => navigation.navigate('Details', { itemId: 'calendar', title: 'Calendar' })}
        />
      </View>
    </SafeAreaView>
  );
}

export default PaymentScreen;
