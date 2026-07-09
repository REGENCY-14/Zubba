import React, { useEffect, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PaymentOption } from "./PaymentOption";
import { useTheme } from "../../context/ThemeContext";

const airtelTigo = require("../../../assets/airtelTigo.png");

type PaymentMethodId = "wallet" | "momo" | "telecel" | "airtel";

type Props = {
  visible: boolean;
  onClose: () => void;
  onContinue: (method: PaymentMethodId) => void;
  initialMethod?: PaymentMethodId;
};

export function PaymentMethodDrawer({
  visible,
  onClose,
  onContinue,
  initialMethod = "wallet",
}: Props) {
  const [selectedMethod, setSelectedMethod] =
    useState<PaymentMethodId>(initialMethod);
  const { colors } = useTheme();

  useEffect(() => {
    if (visible) setSelectedMethod(initialMethod);
  }, [visible, initialMethod]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable onPress={onClose} className="flex-1 bg-black/40 justify-end">
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{ backgroundColor: colors.bg, borderColor: colors.border }}
          className="rounded-t-[32px] px-4 pt-3 pb-6 border-t"
        >
          <View className="items-center mb-4">
            <View
              style={{ backgroundColor: colors.text, width: "30%", maxWidth: 200 }}
              className="h-0.5 rounded-full bg-[#E2E8F0]"
            />
          </View>

          <Text
            style={{ color: colors.text }}
            className="text-base font-bold text-[#1F2A33] mb-4"
          >
            Select a payment method
          </Text>

          <View className="gap-3">
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
              title="Telecel cash"
              badge="T.cash"
              badgeBg="bg-[#DC2626]"
              badgeTextColor="text-white"
              onPress={() => setSelectedMethod("telecel")}
            />

            <PaymentOption
              selected={selectedMethod === "airtel"}
              title="Airtel money"
              image={airtelTigo}
              badgeBg="bg-white"
              badgeTextColor="text-[#1E3A8A]"
              onPress={() => setSelectedMethod("airtel")}
            />

            <PaymentOption
              selected={selectedMethod === "wallet"}
              title="Zubba wallet"
              iconName="credit-card"
              badgeBg=""
              onPress={() => setSelectedMethod("wallet")}
            />
          </View>

          <View className="flex-row items-center gap-3 mt-6">
            <Pressable
              onPress={onClose}
              className="w-8 h-8 rounded-xl bg-[#FDE8E8] items-center justify-center"
            >
              <MaterialCommunityIcons name="close" size={20} color="#DC2626" />
            </Pressable>

            <Pressable
              onPress={() => onContinue(selectedMethod)}
              className="flex-1 h-10 bg-[#31973D] rounded-full items-center justify-center"
            >
              <Text className="text-white text-sm">Continue</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default PaymentMethodDrawer;
