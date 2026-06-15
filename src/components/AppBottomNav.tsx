import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';

import {
  HiHome,
  HiOutlineHome,
  HiCalendar,
  HiOutlineCalendar,
  HiCog6Tooth,
  HiOutlineCog6Tooth,
} from 'react-icons/hi2';
import { HiOutlineSaveAs, HiSaveAs } from "react-icons/hi";


type Tab = 'home' | 'calendar' | 'saved' | 'settings';

type Props = {
  onHomePress: () => void;
  onSavedPress: () => void;
  onSettingsPress?: () => void;
  onAccountPress?: () => void;
  onCalendarPress?: () => void;
  activeTab: Tab;
  paddingBottom?: number;
};

function NavItem({
  active,
  onPress,
  icon,
  label,
}: {
  active?: boolean;
  onPress: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withSpring(active ? 1.08 : 1);
  }, [active]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPress={onPress}
        className={`flex-row items-center justify-center rounded-full px-5 py-2 gap-2 ${
          active ? 'bg-[#31973D]' : 'bg-transparent'
        }`}
      >
        <View className="w-6 h-6 items-center justify-center">
          {icon}
        </View>

        {active && (
          <Text className="text-white text-xs font-normal">
            {label}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

export function AppBottomNav({
  onHomePress,
  onSavedPress,
  onSettingsPress,
  onAccountPress,
  onCalendarPress,
  activeTab,
  paddingBottom = 8,
}: Props) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, paddingBottom);
  const isActive = (tab: Tab) => activeTab === tab;
  const iconColor = (tab: Tab) => isActive(tab) ? '#fff' : '#64748B';

  return (
    <View
      className="absolute left-0 right-0 bottom-5 items-center"
      style={{ paddingBottom: bottomPadding }}
    >
      <View className="w-full max-w-[402px] h-[78px] flex-row items-center justify-between px-4 bg-white rounded-full border border-black/10 shadow-sm">

        <NavItem
          active={isActive('home')}
          onPress={onHomePress}
          icon={
            isActive('home') ? (
              <HiHome size={20} color="#fff" />
            ) : (
              <HiOutlineHome size={20} color="#64748B" />
            )
          }
          label="Home"
        />

        <NavItem
          active={isActive('calendar')}
          onPress={onCalendarPress ?? (() => {})}
          icon={
            isActive('calendar') ? (
              <HiCalendar size={20} color="#fff" />
            ) : (
              <HiOutlineCalendar size={20} color="#64748B" />
            )
          }
          label="Calendar"
        />

        <NavItem
          active={isActive('saved')}
          onPress={onSavedPress}
          icon={
            isActive('saved') ? (
              <HiSaveAs size={20} color="#fff" />
            ) : (
              <HiOutlineSaveAs size={20} color="#64748B" />
            )
          }
          label="Saved"
        />

        <NavItem
          active={isActive('settings')}
          onPress={onSettingsPress ?? onAccountPress ?? (() => {})}
          icon={
            isActive('settings') ? (
              <HiCog6Tooth size={20} color="#fff" />
            ) : (
              <HiOutlineCog6Tooth size={20} color="#64748B" />
            )
          }
          label="Settings"
        />

      </View>
    </View>
  );
}