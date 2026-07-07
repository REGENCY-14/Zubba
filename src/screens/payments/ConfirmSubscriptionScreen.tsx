import React from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
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
  if (id === 'mtn') {
    return (
      <View className="w-[42px] h-[26px] rounded-lg items-center justify-center bg-[#FFCC00]">
        <Text className="text-xs font-semibold text-black" style={{ fontFamily: 'Inter' }}>MTN</Text>
      </View>
    );
  }
  if (id === 'telecel') {
    return (
      <View className="w-[42px] h-[26px] rounded-lg items-center justify-center bg-[#DC2626]">
        <Text className="text-xs font-bold text-white" style={{ fontFamily: 'Inter' }}>T.cash</Text>
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

            <View className="h-[196px] border border-[#E2E8F0] rounded-[32px] bg-white items-center justify-center overflow-hidden gap-2">
              <View className="absolute w-[140px] h-[120px] rounded-[70px] -left-10 -top-[30px]" style={{ backgroundColor: 'rgba(89, 247, 138, 0.45)' }} />
              <View className="absolute w-[140px] h-[120px] rounded-[70px] -right-[10px] -bottom-[10px]" style={{ backgroundColor: 'rgba(89, 247, 138, 0.45)' }} />
              <Text className="text-[32px] font-semibold text-[#1F2A33] tracking-[-2px] z-10">
                {selected.price}
                <Text className="text-[18px] font-medium tracking-normal">{selected.pricePer}</Text>
              </Text>
              <Text className="text-[10px] font-semibold text-[#64748A] text-center z-10">Enjoy a 7-day free trial and pay afterward.</Text>
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
                  navigation.navigate('AddCard', { planIndex: selectedIndex });
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
