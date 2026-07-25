import React, { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme } from '../../context/ThemeContext';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { cancelPremium } from '../../slices/customer/customerSlice';
import type { RootStackScreenProps } from '../../navigation/types';
import { scale, verticalScale, moderateScale } from '../../utils/scale';

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
        <View style={{ height: verticalScale(48), paddingHorizontal: scale(16), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
            <MaterialCommunityIcons name="chevron-left" size={moderateScale(24)} color={colors.text} />
          </Pressable>
          <Text style={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: moderateScale(16), lineHeight: moderateScale(24), color: colors.text }}>
            Subscription
          </Text>
          <View style={{ width: moderateScale(24) }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: scale(16), paddingTop: verticalScale(12), paddingBottom: verticalScale(40), gap: verticalScale(20) }}
        >
          {/* Current plan */}
          <View style={{ backgroundColor: '#31973D', borderRadius: moderateScale(20), padding: moderateScale(20), gap: verticalScale(16), overflow: 'hidden' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(8) }}>
                <MaterialCommunityIcons name="crown" size={moderateScale(20)} color="#FFE088" />
                <Text style={{ fontFamily: 'Poppins', fontSize: moderateScale(18), fontWeight: '700', color: '#FFFFFF' }}>Gold Plan</Text>
              </View>
              <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 999, paddingHorizontal: scale(10), paddingVertical: verticalScale(4) }}>
                <Text style={{ fontFamily: 'Poppins', fontSize: moderateScale(11), fontWeight: '600', color: '#FFFFFF' }}>ACTIVE</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: scale(4) }}>
              <Text style={{ fontFamily: 'Poppins', fontSize: moderateScale(28), fontWeight: '700', color: '#FFFFFF' }}>GHS 50.00</Text>
              <Text style={{ fontFamily: 'Poppins', fontSize: moderateScale(14), color: 'rgba(255,255,255,0.85)' }}>/month</Text>
            </View>

            <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.2)' }} />

            <View style={{ gap: verticalScale(4) }}>
              <Text style={{ fontFamily: 'Poppins', fontSize: moderateScale(12), color: 'rgba(255,255,255,0.85)' }}>Next billing date</Text>
              <Text style={{ fontFamily: 'Poppins', fontSize: moderateScale(14), fontWeight: '600', color: '#FFFFFF' }}>{renewalDate}</Text>
            </View>
          </View>

          {/* Payment method */}
          <View style={{ gap: verticalScale(8) }}>
            <Text style={{ fontFamily: 'Poppins', fontSize: moderateScale(14), fontWeight: '600', color: colors.text }}>
              Payment Method
            </Text>
            <Pressable
              onPress={() => navigation.navigate('SavedCards')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: scale(12),
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: moderateScale(16),
                padding: moderateScale(16),
              }}
            >
              <View style={{ width: moderateScale(40), height: moderateScale(40), borderRadius: moderateScale(10), backgroundColor: colors.iconBg, alignItems: 'center', justifyContent: 'center' }}>
                <MaterialCommunityIcons name="wallet-outline" size={moderateScale(20)} color={colors.iconColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'Poppins', fontSize: moderateScale(14), color: colors.text }}>Zubba Wallet</Text>
                <Text style={{ fontFamily: 'Poppins', fontSize: moderateScale(12), color: colors.textSub }}>Charged automatically each cycle</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={moderateScale(20)} color={colors.textMuted} />
            </Pressable>
          </View>

          {/* Extra features */}
          <View style={{ gap: verticalScale(8) }}>
            <Text style={{ fontFamily: 'Poppins', fontSize: moderateScale(14), fontWeight: '600', color: colors.text }}>
              Your Gold Benefits
            </Text>
            <View
              style={{
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: moderateScale(16),
                overflow: 'hidden',
              }}
            >
              {GOLD_FEATURES.map((feature, index) => (
                <View
                  key={feature.label}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: scale(12),
                    padding: moderateScale(16),
                    borderBottomWidth: index === GOLD_FEATURES.length - 1 ? 0 : 1,
                    borderBottomColor: colors.borderLight,
                  }}
                >
                  <View style={{ width: moderateScale(32), height: moderateScale(32), borderRadius: moderateScale(16), backgroundColor: 'rgba(49,151,61,0.12)', alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialCommunityIcons name={feature.icon} size={moderateScale(16)} color="#31973D" />
                  </View>
                  <Text style={{ fontFamily: 'Poppins', fontSize: moderateScale(14), color: colors.text, flex: 1 }}>{feature.label}</Text>
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
              height: verticalScale(52),
              borderRadius: 999,
              backgroundColor: '#31973D',
            }}
          >
            <Text style={{ fontFamily: 'Poppins', fontSize: moderateScale(14), fontWeight: '600', color: '#FFFFFF' }}>
              Change Plan
            </Text>
          </Pressable>

          {/* Cancel subscription */}
          <Pressable
            onPress={() => setCancelModalOpen(true)}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: verticalScale(52),
              borderRadius: 999,
              borderWidth: 1,
              borderColor: '#EF4444',
            }}
          >
            <Text style={{ fontFamily: 'Poppins', fontSize: moderateScale(14), fontWeight: '600', color: '#EF4444' }}>
              Cancel Subscription
            </Text>
          </Pressable>
        </ScrollView>
      </View>

      <Modal visible={cancelModalOpen} transparent animationType="fade" onRequestClose={() => setCancelModalOpen(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', padding: scale(24) }}>
          <Pressable style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onPress={() => setCancelModalOpen(false)} />
          <View style={{ width: '100%', maxWidth: scale(360), backgroundColor: colors.card, borderRadius: moderateScale(24), padding: moderateScale(24), gap: verticalScale(16) }}>
            <View style={{ width: moderateScale(44), height: moderateScale(44), borderRadius: moderateScale(22), backgroundColor: 'rgba(239,68,68,0.12)', alignItems: 'center', justifyContent: 'center' }}>
              <MaterialCommunityIcons name="alert-outline" size={moderateScale(22)} color="#EF4444" />
            </View>
            <Text style={{ fontFamily: 'Poppins', fontSize: moderateScale(18), fontWeight: '700', color: colors.text }}>
              Cancel Gold subscription?
            </Text>
            <Text style={{ fontFamily: 'Poppins', fontSize: moderateScale(14), lineHeight: moderateScale(20), color: colors.textSub }}>
              You'll keep Gold benefits until {renewalDate}, then your account moves to the free plan — no more double Eco-Points, priority support, or scheduled pickups.
            </Text>

            <Pressable
              onPress={handleConfirmCancel}
              style={{ height: verticalScale(52), borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EF4444' }}
            >
              <Text style={{ fontFamily: 'Poppins', fontSize: moderateScale(14), fontWeight: '600', color: '#FFFFFF' }}>
                Yes, Cancel Subscription
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setCancelModalOpen(false)}
              style={{ height: verticalScale(52), borderRadius: 999, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border }}
            >
              <Text style={{ fontFamily: 'Poppins', fontSize: moderateScale(14), fontWeight: '600', color: colors.text }}>
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
