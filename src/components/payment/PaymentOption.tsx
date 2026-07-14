import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

export type PaymentOptionProps = {
  selected: boolean;
  title: string;
  badge?: string;
  image?: any;
  iconName?: string;
  badgeBg?: string;
  badgeTextColor?: string;
  showBorder?: boolean;
  onPress: () => void;
};

export function PaymentOption({
  selected,
  title,
  badge,
  image,
  iconName,
  badgeBg = "bg-gray-200",
  badgeTextColor = "text-black",
  showBorder = true,
  onPress,
}: PaymentOptionProps) {
    const {colors} = useTheme()
  return (
    <Pressable
      onPress={onPress}
      style={{borderColor: colors.border, borderBottomWidth: showBorder ? 1 : 0,}}
      className={`flex-row items-center justify-between px-4 py-6`}
    >
      <View className="flex-row items-center flex-1 gap-4">
        <View className={`w-12 h-7 rounded-xl items-center justify-center overflow-hidden ${badgeBg}`}>
          {iconName ? (
            <MaterialCommunityIcons name={iconName as any} size={22} color="#31973D" />
          ) : image ? (
            <Image source={image} style={{ width: 28, height: 28 }} resizeMode="contain" />
          ) : (
            <Text className={`text-xs font-bold ${badgeTextColor}`}>{badge}</Text>
          )}
        </View>

        <View className="flex-1">
          <Text style={{color: colors.text}} className="text-base font-medium">{title}</Text>
        </View>
      </View>

      <View
        style={{backgroundColor: selected ? "#31973D" : colors.surface}}
        className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
          selected ? "bg-[#31973D] border-[#31973D]" : "bg-white border-[#8E7164]"
        }`}
      >
        {selected && <View style={{backgroundColor: colors.surface}} className="w-2 h-2 rounded-full" />}
      </View>
    </Pressable>
  );
}

export default PaymentOption;