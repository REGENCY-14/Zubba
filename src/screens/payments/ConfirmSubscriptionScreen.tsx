import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';

const PLANS = [
  {
    label: 'FAMILY',
    displayName: 'Family',
    price: 'GHS 800.00',
    pricePer: '/year',
    pillText: 'GHS 800.00/year (Family)',
  },
  {
    label: 'MONTHLY',
    displayName: 'Monthly',
    price: 'GHS 50.00',
    pricePer: '/month',
    pillText: 'GHS 50.00/month',
  },
  {
    label: 'YEARLY',
    displayName: 'Yearly',
    price: 'GHS 550.00',
    pricePer: '/year',
    pillText: 'GHS 550.00/year',
  },
] as const;

type PaymentMethod = { id: string; name: string };

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'mtn', name: 'MTN MoMo' },
  { id: 'telecel', name: 'Telecel cash' },
  { id: 'airtel', name: 'Airtel money' },
  { id: 'credit', name: 'Credit Card' },
];

function PaymentBadge({ id }: { id: string }) {
  if (id === 'mtn') {
    return (
      <View className="w-[42px] h-[26px] rounded-lg items-center justify-center bg-[#FFCC00]">
        <Text className="text-xs font-semibold text-black" style={{ fontFamily: 'Poppins' }}>MTN</Text>
      </View>
    );
  }
  if (id === 'telecel') {
    return (
      <View className="w-[42px] h-[26px] rounded-lg items-center justify-center bg-[#DC2626]">
        <Text className="text-xs font-bold text-white" style={{ fontFamily: 'Poppins' }}>T.cash</Text>
      </View>
    );
  }
  if (id === 'airtel') {
    return (
      <View className="w-[42px] h-[26px] rounded-lg items-center justify-center bg-white border border-[#E2E8F0]">
        <Text className="text-sm font-bold">
          <Text style={{ color: '#0062A3' }}>a</Text>
          <Text style={{ color: '#EF4444' }}>t</Text>
        </Text>
      </View>
    );
  }
  return (
    <View className="w-[42px] h-[26px] rounded-lg items-center justify-center bg-[#FFF7ED]">
      <View className="w-5 h-[14px] bg-[#31973D] rounded-[3px] justify-start pt-[3px]">
        <View className="h-[3px] mx-[2px]" style={{ backgroundColor: 'rgba(255,255,255,0.6)' }} />
      </View>
    </View>
  );
}

export function ConfirmSubscriptionScreen({ navigation, route }: RootStackScreenProps<'ConfirmSubscription'>) {
  const { colors } = useTheme();
  const [selectedIndex, setSelectedIndex] = React.useState(route.params?.planIndex ?? 1);
  const [showPaymentSheet, setShowPaymentSheet] = React.useState(false);
  const [selectedPayment, setSelectedPayment] = React.useState('credit');

  const selected = PLANS[selectedIndex];
  const alternates = PLANS.filter((_, i) => i !== selectedIndex);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right']}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <View style={{ height: 48, backgroundColor: colors.bg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 }}>
          <Pressable className="w-6 h-6 items-center justify-center" onPress={() => navigation.goBack()}>
            <Text style={{ fontSize: 28, color: colors.text, lineHeight: 28, marginTop: -2 }}>‹</Text>
          </Pressable>
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>Payment</Text>
          <View className="w-6 h-6" />
        </View>

        <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 24, padding: 16, gap: 24, backgroundColor: colors.card }}>
            <Text style={{ fontSize: 24, fontWeight: '500', color: colors.text, lineHeight: 32 }}>Confirm Subscription</Text>

            <Text style={{ fontSize: 14, lineHeight: 26, color: colors.textSub }}>
              {'You selected the '}
              <Text style={{ fontWeight: '700', color: colors.text }}>{selected.displayName} Subscription</Text>
              {'. Enjoy a '}
              <Text style={{ fontWeight: '700', color: colors.text }}>free 7-day trial.</Text>
              {" You won't be charged until your trial ends. Confirm the amount and continue."}
            </Text>

            <View style={{ height: 196, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 32, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {/* Green circle blobs rendered first — BlurView above will blur them */}
              <View style={{ position: 'absolute', width: 140, height: 140, borderRadius: 70, right: -20, bottom: -20, backgroundColor: 'rgba(89, 247, 138, 0.6)' }} />
              <View style={{ position: 'absolute', width: 140, height: 140, borderRadius: 70, left: -40, top: -40, backgroundColor: 'rgba(89, 247, 138, 0.6)' }} />

              {/* Blur the blobs into the white background */}
              <BlurView intensity={28} tint="light" style={StyleSheet.absoluteFillObject} />

              {/* Text sits sharp above the blur */}
              <Text style={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: 32, lineHeight: 32, letterSpacing: -2, color: '#1F2A33', zIndex: 10 }}>
                {selected.price}
                <Text style={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: 18, letterSpacing: 0 }}>{selected.pricePer}</Text>
              </Text>
              <Text style={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: 14, lineHeight: 13, color: '#64748A', textAlign: 'center', zIndex: 10, marginTop: 12 }}>
                Enjoy a 7-day free trial and pay afterward.
              </Text>
            </View>

            <View className="gap-[6px]">
              <Text className="text-sm font-medium text-[#31973D] leading-5">Choose another plan</Text>
              <View className="flex-row gap-[10px] flex-wrap">
                {alternates.map((plan) => (
                  <Pressable
                    key={plan.label}
                    style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 53, paddingHorizontal: 10, paddingVertical: 4, height: 48, justifyContent: 'center' }}
                    onPress={() => setSelectedIndex(PLANS.findIndex((p) => p.label === plan.label))}
                  >
                    <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, letterSpacing: -1 }}>{plan.pillText}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View className="flex-row items-center gap-[10px]">
              <Pressable
                className="w-10 h-10 bg-[#FFE2E2] rounded-xl items-center justify-center"
                onPress={() => navigation.goBack()}
              >
                <Text className="text-sm text-[#EF4444] font-bold">✕</Text>
              </Pressable>
              <Pressable
                className="flex-1 h-10 bg-[#31973D] rounded-full items-center justify-center"
                onPress={() => setShowPaymentSheet(true)}
              >
                <Text className="text-sm text-white leading-5">Confirm Subscription</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>


      </View>

      <Modal
        visible={showPaymentSheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPaymentSheet(false)}
      >
        <Pressable className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }} onPress={() => setShowPaymentSheet(false)}>
          <Pressable style={{ backgroundColor: colors.card, borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingBottom: 32, paddingTop: 16, gap: 16 }} onPress={() => {}}>
            <View style={{ width: 152, height: 3, backgroundColor: colors.border, borderRadius: 20, alignSelf: 'center' }} />

            <View className="px-6">
              <Text style={{ fontSize: 16, fontWeight: '500', color: colors.text, lineHeight: 28, letterSpacing: -0.48 }}>Select  a transfer method</Text>
            </View>

            <View className="px-5">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = method.id === selectedPayment;
                return (
                  <Pressable
                    key={method.id}
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}
                    onPress={() => setSelectedPayment(method.id)}
                  >
                    <View className="flex-row items-center gap-4">
                      <PaymentBadge id={method.id} />
                      <Text style={{ fontSize: 14, color: colors.text, lineHeight: 24 }}>{method.name}</Text>
                    </View>
                    <View
                      style={isSelected
                        ? { width: 22, height: 22, borderRadius: 11, backgroundColor: '#31973D', borderWidth: 1, borderColor: '#31973D', alignItems: 'center', justifyContent: 'center' }
                        : { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.card, borderWidth: 1, borderColor: '#8E7164', alignItems: 'center', justifyContent: 'center' }}
                    >
                      {isSelected && <View className="w-2 h-2 rounded-full bg-white" />}
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <View className="flex-row items-center gap-[10px] px-6">
              <Pressable
                className="w-10 h-10 bg-[#FFE2E2] rounded-xl items-center justify-center"
                onPress={() => setShowPaymentSheet(false)}
              >
                <Text className="text-sm text-[#EF4444] font-bold">✕</Text>
              </Pressable>
              <Pressable
                className="flex-1 h-12 bg-[#31973D] rounded-full items-center justify-center"
                onPress={() => {
                  setShowPaymentSheet(false);
                  if (selectedPayment === 'credit') {
                    navigation.navigate('AddCard', { planIndex: selectedIndex });
                  } else {
                    navigation.navigate('WalletNumber');
                  }
                }}
              >
                <Text className="text-sm text-white leading-5">Continue</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

export default ConfirmSubscriptionScreen;
