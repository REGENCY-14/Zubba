import React, { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import type { RootStackScreenProps } from "../../navigation/types";
import { AppBottomNav } from "../../components";
import CustomAppBar from "../../components/common/CustomAppBar";
import { useTheme } from "../../context/ThemeContext";
import { useAppSelector } from "../../hooks/useAppSelector";

type PaymentMethodId = "wallet" | "momo" | "telecel" | "airtel";

const airtelTigo = require("../../../assets/airtelTigo.png");
export function PaymentScreen({ navigation }: RootStackScreenProps<"Payment">) {
  const { colors } = useTheme();
  const customer = useAppSelector((state) => state.customer);
  const isPremium = true;
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId>(isPremium ? "wallet" : "momo");

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.bg }}
      edges={["top", "left", "right"]}
    >
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <CustomAppBar navigation={navigation} title="Payment" />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16, gap: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.card,
              borderRadius: 24,
              padding: 24,
              gap: 16,
            }}
          >
            <View className="flex-row justify-between items-start">
              <View className="gap-1">
                <Text
                  style={{
                    fontSize: 16,
                    textTransform: "uppercase",
                    letterSpacing: 2,
                    color: colors.text,
                  }}
                >
                  Estimated Cost
                </Text>
                <Text className="text-[#006B23] text-sm">GHS 45.00</Text>
              </View>

              <View
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: "rgba(0,107,35,0.1)",
                }}
              >
                <Text className="text-[#31973D] text-[13px]">
                  {isPremium ? "Premium" : "Standard"}
                </Text>
              </View>
            </View>

            <View className="gap-2">
              <View
                className="border-t border-black/10"
                style={{ borderStyle: "dashed" }}
              />

              <View className="flex-row justify-between">
                <Text style={{ fontSize: 15, color: colors.text }}>
                  Pickup - Organic Waste
                </Text>
                <Text style={{ fontSize: 15, color: colors.textSub }}>
                  GHS 35.00
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text style={{ fontSize: 15, color: colors.text }}>
                  Service Fee
                </Text>
                <Text style={{ fontSize: 15, color: colors.textSub }}>
                  GHS 10.00
                </Text>
              </View>
            </View>
          </View>

          <View className="gap-4">
            <Text
              style={{ fontSize: 16, fontWeight: "700", color: colors.text }}
            >
              Select Payment Method
            </Text>

            {isPremium && (
              <PaymentOption
                selected={selectedMethod === "wallet"}
                title="Zubba Wallet"
                iconName="wallet"
                badgeBg="bg-[#31973D]"
                onPress={() => setSelectedMethod("wallet")}
                cardBg={colors.card}
                cardBorder={colors.border}
                textColor={colors.text}
              />
            )}

            <PaymentOption
              selected={selectedMethod === "momo"}
              title="MTN MoMo"
              badge="MTN"
              badgeBg="bg-[#FFCC00]"
              badgeTextColor="text-black"
              onPress={() => setSelectedMethod("momo")}
              cardBg={colors.card}
              cardBorder={colors.border}
              textColor={colors.text}
            />

            <PaymentOption
              selected={selectedMethod === "telecel"}
              title="Telecel Cash"
              badge="Telecel"
              badgeBg="bg-[#DC2626]"
              badgeTextColor="text-white"
              onPress={() => setSelectedMethod("telecel")}
              cardBg={colors.card}
              cardBorder={colors.border}
              textColor={colors.text}
            />

            <PaymentOption
              selected={selectedMethod === "airtel"}
              title="Airtel Money"
              image={airtelTigo}
              badgeBg="bg-white"
              badgeTextColor="text-[#1E3A8A]"
              onPress={() => setSelectedMethod("airtel")}
              cardBg={colors.card}
              cardBorder={colors.border}
              textColor={colors.text}
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

        {/* <AppBottomNav
          activeTab="home"
          paddingBottom={14}
          bottomOffset={8}
          onHomePress={() => navigation.navigate("Home")}
          onSavedPress={() =>
            navigation.navigate("Details", { itemId: "saved", title: "Saved" })
          }
          onSettingsPress={() => navigation.navigate("Settings")}
          onCalendarPress={() =>
            navigation.navigate("Details", {
              itemId: "calendar",
              title: "Calendar",
            })
          }
        /> */}
      </View>
    </SafeAreaView>
  );
}

export default PaymentScreen;

type PaymentOptionProps = {
  selected: boolean;
  title: string;
  badge?: string;
  image?: any;
  iconName?: string;
  badgeBg?: string;
  badgeTextColor?: string;
  onPress: () => void;
  cardBg: string;
  cardBorder: string;
  textColor: string;
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
  cardBg,
  cardBorder,
  textColor,
}: PaymentOptionProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        borderRadius: 24,
        borderWidth: 1,
        minHeight: 82,
        backgroundColor: selected ? "rgba(49,151,61,0.10)" : cardBg,
        borderColor: selected ? "#31973D" : cardBorder,
      }}
    >
      <View className="flex-row items-center flex-1 gap-4">
        <View
          className={`w-12 h-12 rounded-xl items-center justify-center overflow-hidden ${badgeBg}`}
        >
          {iconName ? (
            <MaterialCommunityIcons
              name={iconName as any}
              size={22}
              color="#FFFFFF"
            />
          ) : image ? (
            <Image
              source={image}
              style={{ width: 28, height: 28 }}
              resizeMode="contain"
            />
          ) : (
            <Text className={`text-xs font-bold ${badgeTextColor}`}>
              {badge}
            </Text>
          )}
        </View>

        <View className="flex-1">
          <Text style={{ fontSize: 16, fontWeight: "500", color: textColor }}>
            {title}
          </Text>
        </View>
      </View>

      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          borderWidth: 2,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: selected ? "#31973D" : cardBg,
          borderColor: selected ? "#31973D" : "#8E7164",
        }}
      >
        {selected && <View className="w-2 h-2 rounded-full bg-white" />}
      </View>
    </Pressable>
  );
}
