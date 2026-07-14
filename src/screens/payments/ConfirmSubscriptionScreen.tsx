import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../../navigation/types';

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
  const { colors } = useTheme();
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
      <View style={{ width: 42, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}>
        <Text style={{ fontSize: 14, fontWeight: '700' }}>
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
  const { colors, isDark } = useTheme();
  const [selectedIndex, setSelectedIndex] = React.useState(route.params?.planIndex ?? 1);
  const [showPaymentSheet, setShowPaymentSheet] = React.useState(false);
  const [selectedPayment, setSelectedPayment] = React.useState('credit');

  const selected = PLANS[selectedIndex];
  const alternates = PLANS.filter((_, i) => i !== selectedIndex);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <View className="flex-1 bg-white">
        <View className="h-12 bg-white flex-row items-center justify-between px-4">
          <Pressable className="w-6 h-6 items-center justify-center" onPress={() => navigation.goBack()}>
            <Text className="text-[28px] text-[#1F2A33] leading-7 -mt-[2px]">‹</Text>
          </Pressable>
          <Text className="text-base font-semibold text-[#1F2A33]">Payment</Text>
          <View className="w-6 h-6" />
        </View>

        <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          <View className="border border-[#E2E8F0] rounded-3xl p-4 gap-6 bg-white">
            <Text className="text-2xl font-medium text-[#1F2A33] leading-8">Confirm Subscription</Text>

            <Text className="text-sm leading-[26px] text-[#64748A]">
              {'You selected the '}
              <Text className="font-bold text-[#1F2A33]">{selected.displayName} Subscription</Text>
              {'. Enjoy a '}
              <Text className="font-bold text-[#1F2A33]">free 7-day trial.</Text>
              {" You won't be charged until your trial ends. Confirm the amount and continue."}
            </Text>

            <View style={{ height: 196, borderWidth: 1, borderColor: colors.border, borderRadius: 32, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {/* Green circle blobs rendered first — BlurView above will blur them */}
              <View style={{ position: 'absolute', width: 140, height: 140, borderRadius: 70, right: -20, bottom: -20, backgroundColor: 'rgba(89, 247, 138, 0.6)' }} />
              <View style={{ position: 'absolute', width: 140, height: 140, borderRadius: 70, left: -40, top: -40, backgroundColor: 'rgba(89, 247, 138, 0.6)' }} />

              <BlurView intensity={28} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />

              <Text style={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: 32, lineHeight: 32, letterSpacing: -2, color: colors.text, zIndex: 10 }}>
                {selected.price}
                <Text style={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: 18, letterSpacing: 0 }}>{selected.pricePer}</Text>
              </Text>
              <Text style={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: 14, lineHeight: 13, color: colors.textSub, textAlign: 'center', zIndex: 10, marginTop: 12 }}>
                Enjoy a 7-day free trial and pay afterward.
              </Text>
            </View>

            <View className="gap-[6px]">
              <Text className="text-sm font-medium text-[#31973D] leading-5">Choose another plan</Text>
              <View className="flex-row gap-[10px] flex-wrap">
                {alternates.map((plan) => (
                  <Pressable
                    key={plan.label}
                    className="border border-[#E2E8F0] rounded-[53px] px-[10px] py-1 h-12 justify-center"
                    onPress={() => setSelectedIndex(PLANS.findIndex((p) => p.label === plan.label))}
                  >
                    <Text className="text-base font-semibold text-[#1F2A33] tracking-[-1px]">{plan.pillText}</Text>
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
          <Pressable className="bg-white rounded-tl-[32px] rounded-tr-[32px] pb-8 pt-4 gap-4" onPress={() => {}}>
            <View className="w-[152px] h-[3px] bg-[#334154] rounded-[20px] self-center" />

            <View className="px-6">
              <Text className="text-base font-medium text-black leading-7" style={{ letterSpacing: -0.48 }}>Select  a transfer method</Text>
            </View>

            <View className="px-5">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = method.id === selectedPayment;
                return (
                  <Pressable
                    key={method.id}
                    className="flex-row items-center justify-between py-4 border-b border-b-[#E2E8F0]"
                    onPress={() => setSelectedPayment(method.id)}
                  >
                    <View className="flex-row items-center gap-4">
                      <PaymentBadge id={method.id} />
                      <Text className="text-sm text-[#1C1B1B] leading-6">{method.name}</Text>
                    </View>
                    <View
                      className={`items-center justify-center ${isSelected ? 'w-[22px] h-[22px] rounded-[11px] bg-[#31973D] border border-[#31973D]' : 'w-5 h-5 rounded-[10px] bg-white border border-[#8E7164]'}`}
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
