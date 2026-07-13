import React, { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme } from '../../context/ThemeContext';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { cancelPremium } from '../../slices/customer/customerSlice';
import type { RootStackScreenProps } from '../../navigation/types';

const GOLD_FEATURES = [
  { icon: 'flash-outline', label: 'Double Eco-Points on every pickup' },
  { icon: 'calendar-clock-outline', label: 'Advanced & recurring scheduling' },
  { icon: 'headset', label: 'Priority 24/7 support' },
  { icon: 'truck-fast-outline', label: 'Faster driver matching' },
] as const;

function formatDate(date: Date) {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function ManageSubscriptionScreen({ navigation }: RootStackScreenProps<'ManageSubscription'>) {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const renewalDate = useMemo(() => {
    const next = new Date();
    next.setMonth(next.getMonth() + 1);
    return formatDate(next);
  }, []);

  const handleConfirmCancel = () => {
    setCancelModalOpen(false);
    dispatch(cancelPremium());
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right']}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>

        {/* Header */}
        <View style={{ height: 48, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
            <MaterialCommunityIcons name="chevron-left" size={24} color={colors.text} />
          </Pressable>
          <Text style={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: 16, lineHeight: 24, color: colors.text }}>
            Subscription
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 40, gap: 20 }}
        >
          {/* Current plan */}
          <View style={{ backgroundColor: '#31973D', borderRadius: 20, padding: 20, gap: 16, overflow: 'hidden' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <MaterialCommunityIcons name="crown" size={20} color="#FFE088" />
                <Text style={{ fontFamily: 'Poppins', fontSize: 18, fontWeight: '700', color: '#FFFFFF' }}>Gold Plan</Text>
              </View>
              <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Text style={{ fontFamily: 'Poppins', fontSize: 11, fontWeight: '600', color: '#FFFFFF' }}>ACTIVE</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
              <Text style={{ fontFamily: 'Poppins', fontSize: 28, fontWeight: '700', color: '#FFFFFF' }}>GHS 50.00</Text>
              <Text style={{ fontFamily: 'Poppins', fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>/month</Text>
            </View>

            <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.2)' }} />

            <View style={{ gap: 4 }}>
              <Text style={{ fontFamily: 'Poppins', fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>Next billing date</Text>
              <Text style={{ fontFamily: 'Poppins', fontSize: 14, fontWeight: '600', color: '#FFFFFF' }}>{renewalDate}</Text>
            </View>
          </View>

          {/* Payment method */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontFamily: 'Poppins', fontSize: 14, fontWeight: '600', color: colors.text }}>
              Payment Method
            </Text>
            <Pressable
              onPress={() => navigation.navigate('SavedCards')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 16,
                padding: 16,
              }}
            >
              <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: colors.iconBg, alignItems: 'center', justifyContent: 'center' }}>
                <MaterialCommunityIcons name="wallet-outline" size={20} color={colors.iconColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'Poppins', fontSize: 14, color: colors.text }}>Zubba Wallet</Text>
                <Text style={{ fontFamily: 'Poppins', fontSize: 12, color: colors.textSub }}>Charged automatically each cycle</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textMuted} />
            </Pressable>
          </View>

          {/* Extra features */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontFamily: 'Poppins', fontSize: 14, fontWeight: '600', color: colors.text }}>
              Your Gold Benefits
            </Text>
            <View
              style={{
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 16,
                overflow: 'hidden',
              }}
            >
              {GOLD_FEATURES.map((feature, index) => (
                <View
                  key={feature.label}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    padding: 16,
                    borderBottomWidth: index === GOLD_FEATURES.length - 1 ? 0 : 1,
                    borderBottomColor: colors.borderLight,
                  }}
                >
                  <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(49,151,61,0.12)', alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialCommunityIcons name={feature.icon} size={16} color="#31973D" />
                  </View>
                  <Text style={{ fontFamily: 'Poppins', fontSize: 14, color: colors.text, flex: 1 }}>{feature.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Change plan */}
          <Pressable
            onPress={() => navigation.navigate('ChoosePlan')}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: 52,
              borderRadius: 999,
              backgroundColor: '#31973D',
            }}
          >
            <Text style={{ fontFamily: 'Poppins', fontSize: 14, fontWeight: '600', color: '#FFFFFF' }}>
              Change Plan
            </Text>
          </Pressable>

          {/* Cancel subscription */}
          <Pressable
            onPress={() => setCancelModalOpen(true)}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: 52,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: '#EF4444',
            }}
          >
            <Text style={{ fontFamily: 'Poppins', fontSize: 14, fontWeight: '600', color: '#EF4444' }}>
              Cancel Subscription
            </Text>
          </Pressable>
        </ScrollView>
      </View>

      <Modal visible={cancelModalOpen} transparent animationType="fade" onRequestClose={() => setCancelModalOpen(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Pressable style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onPress={() => setCancelModalOpen(false)} />
          <View style={{ width: '100%', maxWidth: 360, backgroundColor: colors.card, borderRadius: 24, padding: 24, gap: 16 }}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(239,68,68,0.12)', alignItems: 'center', justifyContent: 'center' }}>
              <MaterialCommunityIcons name="alert-outline" size={22} color="#EF4444" />
            </View>
            <Text style={{ fontFamily: 'Poppins', fontSize: 18, fontWeight: '700', color: colors.text }}>
              Cancel Gold subscription?
            </Text>
            <Text style={{ fontFamily: 'Poppins', fontSize: 14, lineHeight: 20, color: colors.textSub }}>
              You'll keep Gold benefits until {renewalDate}, then your account moves to the free plan — no more double Eco-Points, priority support, or scheduled pickups.
            </Text>

            <Pressable
              onPress={handleConfirmCancel}
              style={{ height: 52, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EF4444' }}
            >
              <Text style={{ fontFamily: 'Poppins', fontSize: 14, fontWeight: '600', color: '#FFFFFF' }}>
                Yes, Cancel Subscription
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setCancelModalOpen(false)}
              style={{ height: 52, borderRadius: 999, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border }}
            >
              <Text style={{ fontFamily: 'Poppins', fontSize: 14, fontWeight: '600', color: colors.text }}>
                Keep My Subscription
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default ManageSubscriptionScreen;
