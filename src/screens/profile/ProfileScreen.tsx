import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import type { RootStackScreenProps } from '../../navigation/types';
import { useAppSelector } from '../../hooks/useAppSelector';
import { TextAvatar } from '../../components/onboarding/TextAvatar';

function InfoCard({
  label,
  value,
  onPress,
  children,
}: {
  label: string;
  value: string;
  onPress?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 24,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 16,
      }}
    >
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#1F2A33', lineHeight: 20 }}>
          {label}
        </Text>
        <Text style={{ fontSize: 12, fontWeight: '400', color: '#64748A', lineHeight: 16 }}>
          {value}
        </Text>
        {children}
      </View>

      <MaterialCommunityIcons name="chevron-right" size={16} color="#64748A" style={{ marginTop: 2 }} />
    </Pressable>
  );
}

export function ProfileScreen({ navigation, route }: RootStackScreenProps<'Profile'>) {
  const user = useAppSelector((state) => state.auth.user);

  const fullName = route.params?.newFullName ?? (user ? `${user.firstname} ${user.lastname}` : 'Edwin Adu Boateng');
  const phone = route.params?.newPhone ?? user?.phone ?? '0244 11 22 310';
  const email = route.params?.newEmail ?? user?.email ?? 'Edwinaduboateng2@gmail.com';
  const isVerified = user?.verified ?? true;

  const [toastVisible, setToastVisible] = useState(false);
  const toastAnim = useRef(new Animated.Value(-80)).current;
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismissToast = () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    Animated.timing(toastAnim, { toValue: -80, duration: 260, useNativeDriver: true }).start(() =>
      setToastVisible(false)
    );
  };

  useEffect(() => {
    if (route.params?.updatedAt) {
      setToastVisible(true);
      toastAnim.setValue(-80);
      Animated.timing(toastAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
      toastTimer.current = setTimeout(dismissToast, 3500);
    }
    return () => { if (toastTimer.current) clearTimeout(toastTimer.current); };
  }, [route.params?.updatedAt]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top', 'left', 'right']}>

      {/* Header */}
      <View
        style={{
          height: 48,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          backgroundColor: '#FFFFFF',
        }}
      >
        <Pressable
          style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="chevron-left" size={24} color="#0F1621" />
        </Pressable>

        <Text style={{ fontSize: 16, fontWeight: '600', color: '#1F2A33', lineHeight: 24 }}>
          Profile
        </Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: '#F8FAFC',
          padding: 16,
          gap: 16,
          alignItems: 'center',
        }}
      >
        {/* Avatar section */}
        <View style={{ alignItems: 'center', gap: 16 }}>
          {/* Avatar with verified badge */}
          <View
            style={{
              width: 64,
              height: 64,
              backgroundColor: '#F4F4F5',
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View style={{ position: 'relative' }}>
              {/* Circular avatar */}
              <View
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 9999,
                  borderWidth: 2,
                  borderColor: '#90FA96',
                  overflow: 'hidden',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TextAvatar size={50} name={fullName} bgColor="#006B23" />
              </View>

              {/* Verified badge */}
              <View
                style={{
                  position: 'absolute',
                  right: -4,
                  bottom: -4,
                  width: 20,
                  height: 20,
                  borderRadius: 9999,
                  backgroundColor: '#006B23',
                  borderWidth: 2,
                  borderColor: '#FFFFFF',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MaterialCommunityIcons name="check" size={10} color="#FFFFFF" />
              </View>
            </View>
          </View>

          <Text style={{ fontSize: 14, fontWeight: '400', color: '#64748A', lineHeight: 20, textAlign: 'center' }}>
            Choose photo for easy identification
          </Text>
        </View>

        {/* Name card */}
        <InfoCard
          label="Name"
          value={fullName}
          onPress={() => navigation.navigate('UpdateName')}
        />

        {/* Phone number card */}
        <InfoCard
          label="Phone number"
          value={phone}
          onPress={() => navigation.navigate('UpdateDetails', { kind: 'phone' })}
        >
          {isVerified && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'flex-start',
                backgroundColor: 'rgba(0, 107, 35, 0.1)',
                borderRadius: 11,
                paddingRight: 8,
                marginTop: 4,
              }}
            >
              <View style={{ padding: 4 }}>
                <MaterialCommunityIcons name="check-circle" size={14} color="#31973D" />
              </View>
              <Text style={{ fontSize: 10, fontWeight: '400', color: '#31973D', letterSpacing: 0.48, lineHeight: 14 }}>
                Verified
              </Text>
            </View>
          )}
        </InfoCard>

        {/* Email address card */}
        <InfoCard
          label="Email Address"
          value={email}
          onPress={() => navigation.navigate('UpdateDetails', { kind: 'email' })}
        />
      </ScrollView>

      {/* Success toast */}
      {toastVisible && (
        <Animated.View
          style={{
            position: 'absolute',
            top: 52,
            left: 16,
            right: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#F0FDFA',
            borderWidth: 1,
            borderColor: '#14B8A6',
            borderRadius: 999,
            paddingVertical: 8,
            paddingHorizontal: 20,
            gap: 12,
            transform: [{ translateY: toastAnim }],
            zIndex: 999,
            shadowColor: 'rgba(69,71,69,0.25)',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
            <MaterialCommunityIcons name="check-circle" size={24} color="#14B8A6" />
            <Text style={{ fontSize: 13, fontWeight: '500', color: '#0F766E', lineHeight: 28, flex: 1 }}>
              Details updated successfully
            </Text>
          </View>
          <Pressable onPress={dismissToast} hitSlop={8}>
            <MaterialCommunityIcons name="close" size={18} color="#0D9488" />
          </Pressable>
        </Animated.View>
      )}

    </SafeAreaView>
  );
}

export default ProfileScreen;
