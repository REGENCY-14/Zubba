import React from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackScreenProps } from '../../navigation/types';
import { AppBottomNav } from '../../components';

type MethodId = 'wallet' | 'mtn' | 'telecel' | 'airtel';

export function PremiumPaymentScreen({ navigation }: RootStackScreenProps<'PremiumPayment'>) {
  const [selected, setSelected] = React.useState<MethodId>('wallet');

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <View className="flex-1 bg-white">
        <View className="h-12 flex-row items-center justify-between px-4 bg-white">
          <Pressable className="w-6 h-6 items-center justify-center" onPress={() => navigation.goBack()}>
            <Text className="text-[28px] text-[#1F2A33] leading-[30px]">‹</Text>
          </Pressable>
          <Text className="text-base font-semibold text-[#1F2A33]">Payment</Text>
          <View className="w-6 h-6" />
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 16, paddingBottom: 120, gap: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="border border-[#E2E8F0] rounded-3xl p-6 gap-4 bg-white">
            <View className="flex-row justify-between items-start">
              <View className="gap-1">
                <Text className="text-base text-[#1F2A33] uppercase" style={{ letterSpacing: 1.6 }}>ESTIMATED COST</Text>
                <Text className="text-sm text-[#006B23] leading-6">GHS 45.00</Text>
              </View>
              <View className="rounded-full px-3 py-[6px] border border-[#E2E8F0]" style={{ backgroundColor: 'rgba(0,107,35,0.10)' }}>
                <Text className="text-[13px] text-[#31973D] leading-5">Premium</Text>
              </View>
            </View>

            <View className="h-0 border-t border-t-[#BECAB9]/30 mt-1" style={{ borderStyle: 'dashed' }} />

            <View className="gap-2">
              <View className="flex-row justify-between items-center">
                <Text className="text-[15px] text-[#1F2A33] leading-6">Pickup - Organic Waste</Text>
                <Text className="text-[15px] text-[#64748A] leading-6">GHS 35.00</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-[15px] text-[#1F2A33] leading-6">Service Fee</Text>
                <Text className="text-[15px] text-[#64748A] leading-6">GHS 10.00</Text>
              </View>
            </View>
          </View>

          <View className="gap-4">
            <Text className="text-base font-bold text-[#1F2A33] leading-6">Select Payment Method</Text>

            <View className="gap-4">
              <Pressable
                className={`flex-row items-center justify-between p-4 border rounded-3xl bg-white min-h-[82px] ${selected === 'wallet' ? 'border-[#31973D] bg-[#31973D]/[0.11]' : 'border-[#E2E8F0]'}`}
                onPress={() => setSelected('wallet')}
              >
                <View className="flex-row items-center gap-4">
                  <View className="w-12 h-12 rounded-xl bg-[#31973D] items-center justify-center">
                    <MaterialCommunityIcons name="wallet-outline" size={20} color="#FFFFFF" />
                  </View>
                  <Text className="text-base font-medium text-[#1C1B1B] leading-6">Zubba Wallet</Text>
                </View>
                <View className={`items-center justify-center ${selected === 'wallet' ? 'w-[22px] h-[22px] rounded-[11px] bg-[#31973D]' : 'w-5 h-5 rounded-[10px] bg-white border border-[#8E7164]'}`}>
                  {selected === 'wallet' && <View className="w-2 h-2 rounded-full bg-white" />}
                </View>
              </Pressable>

              <Pressable
                className={`flex-row items-center justify-between p-4 border rounded-3xl bg-white min-h-[82px] ${selected === 'mtn' ? 'border-[#31973D] bg-[#31973D]/[0.11]' : 'border-[#E2E8F0]'}`}
                onPress={() => setSelected('mtn')}
              >
                <View className="flex-row items-center gap-4">
                  <View className="w-12 h-12 rounded-lg bg-[#FFCC00] items-center justify-center">
                    <Text className="text-xs font-semibold text-black">MTN</Text>
                  </View>
                  <Text className="text-base font-medium text-[#1C1B1B] leading-6">MTN MoMo</Text>
                </View>
                <View className={`items-center justify-center ${selected === 'mtn' ? 'w-[22px] h-[22px] rounded-[11px] bg-[#31973D]' : 'w-5 h-5 rounded-[10px] bg-white border border-[#8E7164]'}`}>
                  {selected === 'mtn' && <View className="w-2 h-2 rounded-full bg-white" />}
                </View>
              </Pressable>

              <Pressable
                className={`flex-row items-center justify-between p-4 border rounded-3xl bg-white min-h-[82px] ${selected === 'telecel' ? 'border-[#31973D] bg-[#31973D]/[0.11]' : 'border-[#E2E8F0]'}`}
                onPress={() => setSelected('telecel')}
              >
                <View className="flex-row items-center gap-4">
                  <View className="w-12 h-12 rounded-xl bg-[#DC2626] items-center justify-center">
                    <Text className="text-xs font-bold text-white text-center leading-[15px]">{'Telecel\nCash'}</Text>
                  </View>
                  <Text className="text-base font-medium text-[#1C1B1B] leading-6">Telecel Cash</Text>
                </View>
                <View className={`items-center justify-center ${selected === 'telecel' ? 'w-[22px] h-[22px] rounded-[11px] bg-[#31973D]' : 'w-5 h-5 rounded-[10px] bg-white border border-[#8E7164]'}`}>
                  {selected === 'telecel' && <View className="w-2 h-2 rounded-full bg-white" />}
                </View>
              </Pressable>

              <Pressable
                className={`flex-row items-center justify-between p-4 border rounded-3xl bg-white min-h-[82px] ${selected === 'airtel' ? 'border-[#31973D] bg-[#31973D]/[0.11]' : 'border-[#E2E8F0]'}`}
                onPress={() => setSelected('airtel')}
              >
                <View className="flex-row items-center gap-4">
                  <View className="w-10 h-10 rounded-lg bg-white border border-[#E2E8F0] items-center justify-center">
                    <Text className="text-base">
                      <Text style={{ color: '#0062A3', fontSize: 16, fontWeight: '700' }}>a</Text>
                      <Text style={{ color: '#EF4444', fontSize: 16, fontWeight: '700' }}>t</Text>
                    </Text>
                  </View>
                  <Text className="text-base font-medium text-[#1C1B1B] leading-6">Airtel money</Text>
                </View>
                <View className={`items-center justify-center ${selected === 'airtel' ? 'w-[22px] h-[22px] rounded-[11px] bg-[#31973D]' : 'w-5 h-5 rounded-[10px] bg-white border border-[#8E7164]'}`}>
                  {selected === 'airtel' && <View className="w-2 h-2 rounded-full bg-white" />}
                </View>
              </Pressable>
            </View>
          </View>

          <Pressable
            className="h-12 bg-[#31973D] rounded-full items-center justify-center"
            onPress={() =>
              selected === 'wallet'
                ? navigation.navigate('WalletCheckout')
                : navigation.navigate('WalletNumber')
            }
          >
            <Text className="text-sm text-white leading-5">Continue</Text>
          </Pressable>
        </ScrollView>

        <AppBottomNav
          activeTab="home"
          paddingBottom={14}
          onHomePress={() => navigation.navigate('PremiumHome')}
          onSavedPress={() => navigation.navigate('Details', { itemId: 'saved', title: 'Saved' })}
          onSettingsPress={() => navigation.navigate('Settings')}
          onCalendarPress={() => navigation.navigate('Details', { itemId: 'calendar', title: 'Calendar' })}
        />
      </View>
    </SafeAreaView>
  );
}

export default PremiumPaymentScreen;
