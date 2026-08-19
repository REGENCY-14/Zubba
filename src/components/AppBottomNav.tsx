import React from 'react';
import { LayoutChangeEvent, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { APP_DARK } from '../constants/appDarkTheme';
import { useAppSelector } from '../hooks/useAppSelector';
import { scale, verticalScale, moderateScale } from '../utils/scale';


type Tab = 'home' | 'calendar' | 'saved' | 'settings';

type Props = {
  activeTab: Tab;
  paddingBottom?: number;
  bottomOffset?: number;
  showCalendar?: boolean;
  navigation: any;
  // Reports the nav's own rendered height (pill + paddingBottom, not
  // including `bottomOffset`'s gap from the screen edge) so callers that
  // need to reserve exact space above it — instead of guessing a constant
  // that only happens to fit the screen it was tuned on — can measure it.
  onLayout?: (event: LayoutChangeEvent) => void;
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
  const { isDark } = useTheme();

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
          active ? (isDark ? '' : 'bg-[#31973D]') : 'bg-transparent'
        }`}
        style={active && isDark ? { backgroundColor: APP_DARK.navActivePillBg } : null}
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
  navigation,
  onLayout,
}: Props) {
  const { colors, isDark } = useTheme();
  const isActive = (tab: Tab) => activeTab === tab;
  const isPremium = useAppSelector((state) => state.customer.is_premium)

  return (
    <View
      className="absolute left-0 bottom-0 right-0 items-center px-2"
      style={{
        bottom: bottomOffset,
        paddingBottom: paddingBottom,
        marginHorizontal: 16
      }}
      onLayout={onLayout}
    >
      <View
        style={{
          width: '100%',
          maxWidth: isPremium ? scale(402) : scale(300),
          paddingVertical: verticalScale(12),
          paddingHorizontal: scale(16),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: 9999,
          backgroundColor: isDark ? APP_DARK.navBg : colors.card,
          borderWidth: 1,
          borderColor: isDark ? APP_DARK.navBorder : colors.border,
        }}
      >

        <NavItem
          active={isActive('home')}
          onPress={() => navigation.navigate("Home")}
          icon={
            isActive('home') ? (
              <MaterialCommunityIcons size={moderateScale(20)} name="home" color="#fff" />
            ) : (
              <MaterialCommunityIcons name="home-outline" size={moderateScale(20)} color={colors.textSub} />
            )
          }
          label="Home"
        />

        {isPremium && (
          <NavItem
            active={isActive('calendar')}
            onPress={() => navigation.navigate("Schedule")}
            icon={
              isActive('calendar') ? (
                <MaterialCommunityIcons size={moderateScale(20)} name="calendar" color="#fff" />
              ) : (
                <MaterialCommunityIcons name="calendar-outline" size={moderateScale(20)} color={colors.textSub} />
              )
            }
            label="Schedule"
          />
        )}

        <NavItem
          active={isActive('saved')}
          onPress={() => {navigation.navigate("Pickups")}}
          icon={
            isActive('saved') ? (
              <MaterialCommunityIcons size={moderateScale(20)} name="truck" color="#fff" />
            ) : (
              <MaterialCommunityIcons name="truck-outline" size={moderateScale(20)} color={colors.textSub} />
            )
          }
          label="Pickups"
        />

        <NavItem
          active={isActive('settings')}
          onPress={() => {navigation.navigate("Settings")}}
          icon={
            isActive('settings') ? (
              <MaterialCommunityIcons size={moderateScale(20)} name="cog" color="#fff" />
            ) : (
              <MaterialCommunityIcons name="cog" size={moderateScale(20)} color={colors.textSub} />
            )
          }
          label="Settings"
        />

      </View>
    </View>
  );
}
