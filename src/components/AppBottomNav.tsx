import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';


type Tab = 'home' | 'calendar' | 'saved' | 'settings';

type Props = {
  activeTab: Tab;
  paddingBottom?: number;
  bottomOffset?: number;
  showCalendar?: boolean;
  navigation: any
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
  activeTab,
  paddingBottom = 8,
  bottomOffset = 20,
  showCalendar = false,
  navigation
}: Props) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const bottomPadding = Math.max(insets.bottom, paddingBottom);
  const isActive = (tab: Tab) => activeTab === tab;

  return (
    <View
      className="absolute left-0 right-0 items-center px-2"
      style={{ bottom: bottomOffset, paddingBottom: bottomPadding }}
    >
      <View
        style={{
          width: '100%',
          maxWidth: showCalendar ? 402 : 300,
          paddingVertical: 12,
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: 9999,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >

        <NavItem
          active={isActive('home')}
          onPress={() => navigation.navigate("Home")}
          icon={
            isActive('home') ? (
              <MaterialCommunityIcons size={20} name="home" color="#fff" />
            ) : (
              <MaterialCommunityIcons name="home-outline" size={20} color={colors.textSub} />
            )
          }
          label="Home"
        />

        {showCalendar && (
          <NavItem
            active={isActive('calendar')}
            onPress={() => navigation.navigate("Schedule")}
            icon={
              isActive('calendar') ? (
                <MaterialCommunityIcons size={20} name="calendar" color="#fff" />
              ) : (
                <MaterialCommunityIcons name="calendar-outline" size={20} color={colors.textSub} />
              )
            }
            label="Schedule"
          />
        )}

        <NavItem
          active={isActive('saved')}
          onPress={() => {navigation.navigate("Details", { itemId: "save", title: "Saved" })}}
          icon={
            isActive('saved') ? (
              <MaterialCommunityIcons size={20} name="truck" color="#fff" />
            ) : (
              <MaterialCommunityIcons name="truck-outline" size={20} color={colors.textSub} />
            )
          }
          label="Pickups"
        />

        <NavItem
          active={isActive('settings')}
          onPress={() => {navigation.navigate("Settings")}}
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
