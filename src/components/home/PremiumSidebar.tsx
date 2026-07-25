import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Pressable, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useTheme } from '../../context/ThemeContext';
import { scale, verticalScale, moderateScale } from '../../utils/scale';

const SIDEBAR_WIDTH = 260;
const SCREEN_WIDTH = Dimensions.get('window').width;

type MenuItem = {
  key: string;
  label: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  onPress: () => void;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  activeKey?: string;
};

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <View style={{ width: moderateScale(64), height: moderateScale(64), alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: moderateScale(54),
          height: moderateScale(54),
          borderRadius: 9999,
          backgroundColor: '#D1FAD7',
          borderWidth: 2,
          borderColor: '#90FA96',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: moderateScale(18), fontWeight: '700', color: '#006B23' }}>{initials}</Text>
      </View>
      <View
        style={{
          position: 'absolute',
          width: moderateScale(20),
          height: moderateScale(20),
          borderRadius: 9999,
          backgroundColor: '#006B23',
          borderWidth: 2,
          borderColor: '#FFFFFF',
          alignItems: 'center',
          justifyContent: 'center',
          right: 0,
          bottom: 0,
        }}
      >
        <MaterialCommunityIcons name="check" size={moderateScale(10)} color="#FFFFFF" />
      </View>
    </View>
  );
}

export function PremiumSidebar({ isOpen, onClose, menuItems, activeKey }: Props) {
  const user = useAppSelector((state) => state.auth.user);
  const { colors } = useTheme();
  const translateX = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(translateX, { toValue: 0, duration: 260, useNativeDriver: true }),
        Animated.timing(overlayOpacity, { toValue: 1, duration: 260, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateX, { toValue: -SIDEBAR_WIDTH, duration: 220, useNativeDriver: true }),
        Animated.timing(overlayOpacity, { toValue: 0, duration: 220, useNativeDriver: true }),
      ]).start();
    }
  }, [isOpen]);

  const fullName = user ? `${user.firstname} ${user.lastname}` : 'Guest User';
  const contact = user?.phone ?? user?.email ?? '';

  return (
    <>
      <Animated.View
        pointerEvents={isOpen ? 'auto' : 'none'}
        style={{
          position: 'absolute', top: 0, left: 0,
          width: SCREEN_WIDTH, height: '100%',
          backgroundColor: 'rgba(0,0,0,0.4)',
          zIndex: 20, opacity: overlayOpacity,
        }}
      >
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={{
          position: 'absolute', top: 0, left: 0,
          width: SIDEBAR_WIDTH, height: '100%',
          backgroundColor: colors.card,
          zIndex: 30, transform: [{ translateX }],
        }}
      >
        <View
          style={{
            paddingHorizontal: scale(16), paddingTop: verticalScale(40), paddingBottom: verticalScale(12), gap: moderateScale(12),
            borderBottomWidth: 1, borderBottomColor: colors.border,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(10) }}>
            <Avatar name={fullName} />
            <View style={{ flex: 1, gap: moderateScale(2) }}>
              <Text style={{ fontSize: moderateScale(20), fontWeight: '400', color: colors.text, lineHeight: moderateScale(28) }} numberOfLines={1}>
                {fullName}
              </Text>
              <Text style={{ fontSize: moderateScale(12), color: colors.textSub, lineHeight: moderateScale(18) }}>{contact}</Text>
            </View>
          </View>
        </View>

        <View style={{ padding: moderateScale(16), gap: moderateScale(12) }}>
          {menuItems.map((item) => {
            const isActive = item.key === activeKey;
            return (
              <Pressable
                key={item.key}
                onPress={() => { onClose(); item.onPress(); }}
                style={{
                  flexDirection: 'row', alignItems: 'center',
                  paddingHorizontal: scale(12), paddingVertical: verticalScale(8), gap: scale(8),
                  height: verticalScale(56), borderRadius: moderateScale(39),
                  backgroundColor: isActive ? colors.surface : 'transparent',
                }}
              >
                <View style={{ width: moderateScale(40), height: moderateScale(40), borderRadius: moderateScale(27), backgroundColor: 'rgba(0, 107, 35, 0.1)', alignItems: 'center', justifyContent: 'center' }}>
                  <MaterialCommunityIcons name={item.icon} size={moderateScale(22)} color="#31973D" />
                </View>
                <Text style={{ fontSize: moderateScale(14), fontWeight: '500', color: colors.text, lineHeight: moderateScale(20) }}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Animated.View>
    </>
  );
}
