import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

type AppBottomNavProps = {
  onHomePress: () => void;
  onSavedPress: () => void;
  onSettingsPress?: () => void;
  onAccountPress?: () => void;
  onCalendarPress?: () => void;
  activeTab?: 'home' | 'settings';
  paddingBottom?: number;
};

export function AppBottomNav({
  onHomePress,
  onSavedPress,
  onSettingsPress,
  onAccountPress,
  onCalendarPress,
  activeTab,
  paddingBottom = 8,
}: AppBottomNavProps) {
  const insets = useSafeAreaInsets();

  const isHomeActive = activeTab === 'home';
  const isSettingsActive = activeTab === 'settings';

  const bottomPadding = Math.max(insets.bottom, paddingBottom);

  return (
    <View
      className="absolute left-0 right-0 bottom-0 items-center"
      style={{ paddingBottom: bottomPadding }}
    >
      <View className="w-full max-w-[402px] h-[78px] bg-white border border-black/10 rounded-full flex-row items-center justify-between px-4">

        {/* HOME */}
        <Pressable
          onPress={onHomePress}
          className={`flex-row items-center justify-center rounded-full px-5 py-2 gap-2 ${
            isHomeActive ? 'bg-[#31973D] w-[105px]' : 'w-[64px]'
          }`}
        >
          <MaterialIcons
            name="home"
            size={24}
            color={isHomeActive ? '#FFFFFF' : '#64748A'}
          />

          {isHomeActive && (
            <Text className="text-white text-xs leading-4 font-normal">
              Home
            </Text>
          )}
        </Pressable>

        {/* CALENDAR */}
        <Pressable
          onPress={onCalendarPress}
          className="w-[64px] h-[44px] items-center justify-center"
        >
          <MaterialCommunityIcons
            name="calendar-outline"
            size={24}
            color="#64748A"
          />
        </Pressable>

        {/* SAVED */}
        <Pressable
          onPress={onSavedPress}
          className="w-[64px] h-[44px] items-center justify-center"
        >
          <MaterialCommunityIcons
            name="content-save-outline"
            size={24}
            color="#64748A"
          />
        </Pressable>

        {/* SETTINGS */}
        <Pressable
          onPress={onSettingsPress ?? onAccountPress}
          className={`flex-row items-center justify-center rounded-full px-5 py-2 gap-2 ${
            isSettingsActive ? 'bg-[#31973D] w-[105px]' : 'w-[64px]'
          }`}
        >
          <MaterialCommunityIcons
            name="cog-outline"
            size={24}
            color={isSettingsActive ? '#FFFFFF' : '#64748A'}
          />

          {isSettingsActive && (
            <Text className="text-white text-xs leading-4 font-normal">
              Settings
            </Text>
          )}
        </Pressable>

      </View>
    </View>
  );
}