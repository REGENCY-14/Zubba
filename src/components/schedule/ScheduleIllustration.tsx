import React from "react";
import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

export function ScheduleIllustration() {
  const { colors } = useTheme();
  return (
    <View className="w-[222px] h-[152px]">
      <View className="absolute left-0 right-14 top-0 bottom-7 bg-[#64748A] rounded-md overflow-hidden">
        <View className="h-4 flex-row items-center gap-[3px] px-1.5">
          {[0, 1, 2].map((k) => (
            <View
              key={k}
              className="w-[5px] h-[5px] rounded-full bg-[#F0F0F0]"
            />
          ))}
        </View>
        <View className="flex-1 bg-[#31973D] m-px rounded-sm pt-1.5 gap-2.5">
          <View className="h-2 bg-white/30 mx-1.5 rounded-sm" />
          {[0, 1].map((k) => (
            <View key={k} className="flex-row items-center gap-1.5 px-1.5">
              <View className="w-3.5 h-3.5 rounded-full" />
              <View className="flex-1 h-[5px] bg-white/40 rounded-sm" />
            </View>
          ))}
        </View>
      </View>
      <View
        style={{ backgroundColor: colors.bg }}
        className="absolute right-0 bottom-0 w-[62px] h-[62px] p-2.5 rounded-full border-[2.5px] border-[#31973D] items-center justify-center"
      >
        <View
          style={{ backgroundColor: colors.iconBg }}
          className="w-10 h-10 rounded-full flex items-center justify-center"
        >
          <MaterialCommunityIcons
            name="plus"
            size={26}
            color={colors.iconColor}
          />
        </View>
      </View>
    </View>
  );
}
