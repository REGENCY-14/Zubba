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

export function WalletCheckoutScreen({ navigation }: RootStackScreenProps<'WalletCheckout'>) {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <View className="flex-1 bg-[#F8FAFC]">
        <View className="bg-white border border-[#E2E8F0] border-t-0 rounded-bl-[32px] rounded-br-[32px] pb-6">
          <View className="h-12 flex-row items-center justify-between px-4">
            <Pressable className="w-6 h-6 items-center justify-center" onPress={() => navigation.goBack()}>
              <Text className="text-[28px] text-[#1F2A33] leading-[30px]">‹</Text>
            </Pressable>
            <Text className="text-base font-semibold text-[#1F2A33]">Payment</Text>
            <View className="w-6 h-6" />
          </View>

          <View className="items-center gap-[10px]">
            <View className="flex-row items-center gap-[6px] rounded-full px-2 py-1" style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}>
              <View className="rounded-full px-3 py-[6px] border border-[#E2E8F0]" style={{ backgroundColor: 'rgba(0,107,35,0.10)' }}>
                <Text className="text-[13px] text-[#31973D] leading-5">Total to pay</Text>
              </View>
              <Text className="text-[10px] font-bold tracking-[0.5px] text-[#1F2A33]">GHS</Text>
            </View>

            <Text className="text-[48px] font-bold text-[#1F2A33] leading-[56px]" style={{ letterSpacing: -1.2 }}>GHS 45.00</Text>

            <View className="flex-row items-center gap-1 bg-[#31973D] rounded-full border-2 border-white px-3 py-1">
              <MaterialCommunityIcons name="trending-up" size={12} color="#FFFFFF" />
              <Text className="text-xs font-bold text-white leading-4">2X Eco-Points</Text>
            </View>
          </View>
        </View>

        <View className="flex-row items-center px-6 py-4 gap-[10px] bg-[#F8FAFC]">
          <Pressable
            className="w-8 h-8 bg-[#FFE2E2] rounded-xl items-center justify-center"
            onPress={() => navigation.navigate('Home')}
          >
            <MaterialCommunityIcons name="close" size={16} color="#EF4444" />
          </Pressable>
          <Pressable
            className="flex-1 h-10 bg-[#31973D] rounded-full items-center justify-center"
            onPress={() => navigation.navigate('PaymentSuccess')}
          >
            <Text className="text-sm text-white leading-5">Pay</Text>
          </Pressable>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 4, paddingBottom: 120, gap: 12 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="border border-[#E2E8F0] rounded-3xl px-4 bg-white">
            <View className="flex-row justify-between items-center py-[14px] border-b border-b-[#F1F5F9]">
              <Text className="text-base text-[#64748A] leading-6">EStimated Cost</Text>
              <Text className="text-base text-[#1F2A33] font-bold leading-6">GHS 45.00</Text>
            </View>
            <View className="flex-row justify-between items-center py-[14px] border-b border-b-[#F1F5F9]">
              <Text className="text-base text-[#64748A] leading-6">Pickup - Organic Waste</Text>
              <Text className="text-base text-[#1F2A33] font-bold leading-6">GHS 35.00</Text>
            </View>
            <View className="flex-row justify-between items-center py-[14px]">
              <Text className="text-base text-[#64748A] leading-6">Service Fee</Text>
              <Text className="text-base text-[#1F2A33] font-bold leading-6">GHS 10.00</Text>
            </View>
          </View>

          <View className="border border-[#E2E8F0] rounded-3xl p-4 gap-4 bg-white">
            <View className="border border-[#E2E8F0] rounded-3xl p-5 flex-row justify-between items-center bg-white">
              <View className="gap-1">
                <Text className="text-base font-medium text-[#1F2A33] leading-6">Zubba Wallet Balance</Text>
                <Text className="text-base font-medium text-[#64748A] leading-6">GHS 124.50</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Text className="text-base font-bold text-[#31973D] leading-6">READY</Text>
                <View className="w-2 h-2 rounded-full bg-[#31973D]" />
              </View>
            </View>

            <View className="border border-[#E2E8F0] rounded-3xl p-5 gap-3 bg-white">
              <View className="flex-row justify-between items-center">
                <Text className="text-base text-[#64748A] leading-6">Base Points</Text>
                <Text className="text-base text-[#1F2A33] leading-6">45 XP</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center gap-1">
                  <Text className="text-base text-[#64748A] leading-6">Premium Multiplier</Text>
                  <MaterialCommunityIcons name="lightning-bolt" size={10} color="#1F2A33" />
                </View>
                <Text className="text-base text-[#1F2A33] leading-6">x 2</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-base text-[#1F2A33] leading-6">Total Reward</Text>
                <Text className="text-base text-[#31973D] leading-6">90 Eco-Points</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <AppBottomNav
          activeTab="home"
          paddingBottom={14}
          bottomOffset={8}
          navigation={navigation}
        />
      </View>
    </SafeAreaView>
  );
}

export default WalletCheckoutScreen;
