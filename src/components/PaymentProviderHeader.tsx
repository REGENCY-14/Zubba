import React from 'react';
import { Pressable, Text, View } from 'react-native';

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
  return (
    <View className="h-14 flex-row items-center justify-between px-4 border-b bg-white" style={{ borderBottomColor: 'rgba(0,0,0,0.08)' }}>
      <Pressable className="w-8 h-8 items-center justify-center" onPress={onMenuPress}>
        <Text className="text-base text-[#1F2A33]">☰</Text>
      </Pressable>

      <View className="items-center justify-center">
        <View className="flex-row items-center gap-2">
          <View className="w-[10px] h-[10px] rounded-full" style={{ backgroundColor: providerColor }} />
          <Text className="text-sm text-[#1F2A33] font-semibold">{provider}</Text>
        </View>
        {isActive ? <Text className="mt-[2px] text-xs text-[#31973D]">Active</Text> : null}
      </View>

      <Pressable className="w-8 h-8 items-center justify-center" onPress={onClosePress}>
        <Text className="text-base text-[#1F2A33]">✕</Text>
      </Pressable>
    </View>
  );
}
