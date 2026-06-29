import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';


type Tab = 'home' | 'calendar' | 'saved' | 'settings';

type Props = {
  onHomePress: () => void;
  onSavedPress: () => void;
  onSettingsPress?: () => void;
  onAccountPress?: () => void;
  onCalendarPress?: () => void;
  activeTab: Tab;
  paddingBottom?: number;
  bottomOffset?: number;
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
  bottomOffset = 20,
}: Props) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const bottomPadding = Math.max(insets.bottom, paddingBottom);
  const isActive = (tab: Tab) => activeTab === tab;
  const iconColor = (tab: Tab) => isActive(tab) ? '#fff' : colors.textSub;

  return (
    <View
      className="absolute left-0 right-0 items-center px-2"
      style={{ bottom: bottomOffset, paddingBottom: bottomPadding }}
    >
      <View
        className="w-full max-w-[402px] py-3 flex-row items-center justify-between px-4 rounded-full shadow-sm"
        style={{
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >

        <NavItem
          active={isActive('home')}
          onPress={onHomePress}
          icon={
            isActive('home') ? (
              <MaterialCommunityIcons size={20} name="home" color="#fff" />
            ) : (
              <MaterialCommunityIcons name="home-outline" size={20} color={colors.textSub} />
            )
          }
          label="Home"
        />

        <NavItem
          active={isActive('calendar')}
          onPress={onCalendarPress ?? (() => {})}
          icon={
            isActive('calendar') ? (
              <MaterialCommunityIcons size={20} name="calendar" color="#fff" />
            ) : (
              <MaterialCommunityIcons name="calendar-outline" size={20} color={colors.textSub} />
            )
          }
          label="Schedule"
        />

        <NavItem
          active={isActive('saved')}
          onPress={onSavedPress}
          icon={
            isActive('saved') ? (
              <MaterialCommunityIcons size={20} name="bookmark" color="#fff" />
            ) : (
              <MaterialCommunityIcons name="bookmark-outline" size={20} color={colors.textSub} />
            )
          }
          label="Saved"
        />

        <NavItem
          active={isActive('settings')}
          onPress={onSettingsPress ?? onAccountPress ?? (() => {})}
          icon={
            isActive('settings') ? (
              <MaterialCommunityIcons size={20} name="cog" color="#fff" />
            ) : (
              <MaterialCommunityIcons name="cog" size={20} color={colors.textSub} />
            )
          }
          label="Settings"
        />

      </View>
    </View>
  );
}
