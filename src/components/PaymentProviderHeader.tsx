import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { APP_DARK } from '../constants/appDarkTheme';

type PaymentProviderHeaderProps = {
  provider: string;
  providerColor: string;
  isActive?: boolean;
  onMenuPress?: () => void;
  onClosePress?: () => void;
};

export function PaymentProviderHeader({
  provider,
  providerColor,
  isActive = false,
  onMenuPress,
  onClosePress,
}: PaymentProviderHeaderProps) {
  const { colors, isDark } = useTheme();

  return (
    <View
      className="h-14 flex-row items-center justify-between px-4 border-b"
      style={{ backgroundColor: colors.card, borderBottomColor: colors.borderLight }}
    >
      <Pressable className="w-8 h-8 items-center justify-center" onPress={onMenuPress}>
        <Text style={{ color: colors.text }} className="text-base">☰</Text>
      </Pressable>

      <View className="items-center justify-center">
        <View className="flex-row items-center gap-2">
          <View className="w-[10px] h-[10px] rounded-full" style={{ backgroundColor: providerColor }} />
          <Text style={{ color: colors.text }} className="text-sm font-semibold">{provider}</Text>
        </View>
        {isActive ? (
          <Text
            className="mt-[2px] text-xs"
            style={{ color: isDark ? APP_DARK.accentGreen : "#31973D" }}
          >
            Active
          </Text>
        ) : null}
      </View>

      <Pressable className="w-8 h-8 items-center justify-center" onPress={onClosePress}>
        <Text style={{ color: colors.text }} className="text-base">✕</Text>
      </Pressable>
    </View>
  );
}
