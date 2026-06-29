import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Pressable, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppSelector } from '../../hooks/useAppSelector';

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
    <View style={{ width: 64, height: 64, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: 54,
          height: 54,
          borderRadius: 9999,
          backgroundColor: '#D1FAD7',
          borderWidth: 2,
          borderColor: '#90FA96',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#006B23' }}>{initials}</Text>
      </View>
      {/* Verified badge */}
      <View
        style={{
          position: 'absolute',
          width: 20,
          height: 20,
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
        <MaterialCommunityIcons name="check" size={10} color="#FFFFFF" />
      </View>
    </View>
  );
}

export function PremiumSidebar({ isOpen, onClose, menuItems, activeKey }: Props) {
  const user = useAppSelector((state) => state.auth.user);
  const translateX = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 260,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -SIDEBAR_WIDTH,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen]);

  const fullName = user
    ? `${user.firstname} ${user.lastname}`
    : 'Guest User';
  const contact = user?.phone ?? user?.email ?? '';

  return (
    <>
      {/* Backdrop */}
      <Animated.View
        pointerEvents={isOpen ? 'auto' : 'none'}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: SCREEN_WIDTH,
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.4)',
          zIndex: 20,
          opacity: overlayOpacity,
        }}
      >
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      {/* Sidebar panel */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: SIDEBAR_WIDTH,
          height: '100%',
          backgroundColor: '#F9F9F9',
          zIndex: 30,
          transform: [{ translateX }],
        }}
      >
        {/* Profile header */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 40,
            paddingBottom: 12,
            gap: 12,
            borderBottomWidth: 1,
            borderBottomColor: '#E2E8F0',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Avatar name={fullName} />
            <View style={{ flex: 1, gap: 2 }}>
              <Text
                style={{ fontSize: 20, fontWeight: '400', color: '#1F2A33', lineHeight: 28 }}
                numberOfLines={1}
              >
                {fullName}
              </Text>
              <Text style={{ fontSize: 12, color: '#64748A', lineHeight: 18 }}>{contact}</Text>
            </View>
          </View>
        </View>

        {/* Menu items */}
        <View style={{ padding: 16, gap: 12 }}>
          {menuItems.map((item) => {
            const isActive = item.key === activeKey;
            return (
              <Pressable
                key={item.key}
                onPress={() => {
                  onClose();
                  item.onPress();
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  gap: 8,
                  height: 56,
                  borderRadius: 39,
                  backgroundColor: isActive ? '#F1F5F9' : 'transparent',
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 27,
                    backgroundColor: 'rgba(0, 107, 35, 0.1)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MaterialCommunityIcons name={item.icon} size={22} color="#31973D" />
                </View>
                <Text style={{ fontSize: 14, fontWeight: '500', color: '#1F2A33', lineHeight: 20 }}>
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
