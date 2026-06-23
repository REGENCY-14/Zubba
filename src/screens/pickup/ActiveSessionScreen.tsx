import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBottomNav } from '../../components';
import type { RootStackScreenProps } from '../../navigation/types';

type DeviceCardProps = {
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
  location: string;
  status: string;
  actionLabel: string;
  actionTone?: 'current' | 'revoke';
  isCurrent?: boolean;
};

function DeviceCard({ iconName, title, location, status, actionLabel, actionTone = 'revoke', isCurrent = false }: DeviceCardProps) {
  return (
    <View className="flex-row items-stretch bg-white border-b border-b-[#E2E8F0]">
      {isCurrent ? <View className="w-[6px] bg-[#31973D] rounded-tl-2xl rounded-bl-2xl" /> : null}
      <View className="flex-1 flex-row items-center justify-between p-4 m-4 rounded-2xl border border-[#E2E8F0] bg-white">
        <View className="flex-row items-center flex-1 mr-4">
          <View className="w-10 h-10 rounded-[10px] bg-[#F8FAFC] items-center justify-center mr-4">
            <MaterialCommunityIcons name={iconName} size={24} color="#3F4A3D" />
          </View>
          <View className="flex-1">
            <Text className="text-sm leading-5 font-semibold text-[#111827]" style={{ fontFamily: 'Poppins' }}>{title}</Text>
            <Text className="text-xs leading-4 text-[#64748A] mt-[2px]" style={{ fontFamily: 'Poppins' }}>{location}</Text>
            <Text className="text-[10px] leading-4 text-[#31973D] mt-1" style={{ fontFamily: 'Poppins' }}>{status}</Text>
          </View>
        </View>

        <View
          className={`min-w-[69px] h-8 rounded-2xl items-center justify-center px-3 ${
            actionTone === 'current'
              ? 'bg-[#E4E1ED] border border-[#E2E8F0]'
              : 'border border-[#FF383C] bg-white'
          }`}
        >
          <Text
            className={`text-[13px] leading-5 font-bold ${actionTone === 'current' ? 'text-[#31973D]' : 'text-[#FF383C]'}`}
            style={{ fontFamily: 'Nexa Text-Trial' }}
          >
            {actionLabel}
          </Text>
        </View>
      </View>
    </View>
  );
}

function InfoCard() {
  return (
    <View className="flex-row items-start gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-4">
      <View
        className="w-[33px] h-[33px] rounded-full items-center justify-center"
        style={{ backgroundColor: 'rgba(0, 107, 35, 0.1)' }}
      >
        <MaterialCommunityIcons name="information-outline" size={20} color="#31973D" />
      </View>
      <Text className="flex-1 text-sm leading-[21px] text-[#64748A]" style={{ fontFamily: 'Poppins' }}>
        If you notice a device you don&apos;t recognize, revoke its access immediately and change your password.
      </Text>
    </View>
  );
}

export function ActiveSessionScreen({ navigation }: RootStackScreenProps<'ActiveSession'>) {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <View className="flex-1 bg-white">
        <View className="h-12 px-4 flex-row items-center justify-between bg-white">
          <Pressable className="w-6 h-6 items-center justify-center" onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-left" size={28} color="#1F2A33" />
          </Pressable>
          <Text className="text-base leading-6 font-semibold text-[#1F2A33]" style={{ fontFamily: 'Inter' }}>Active Session</Text>
          <View className="w-6 h-6" />
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 16, paddingBottom: 128, gap: 24 }} showsVerticalScrollIndicator={false}>
          <View className="items-center bg-white rounded-2xl border border-[#E2E8F0] px-[18px] py-6 gap-4">
            <View
              className="w-[54px] h-[54px] rounded-full items-center justify-center"
              style={{ backgroundColor: 'rgba(65, 158, 106, 0.1)' }}
            >
              <MaterialCommunityIcons name="shield-outline" size={28} color="#006B23" />
            </View>
            <Text className="text-sm leading-5 text-[#64748A] text-center" style={{ fontFamily: 'Poppins' }}>
              Review and manage devices currently logged into your Zubba account.
            </Text>
          </View>

          <View className="flex-row items-center justify-between px-1">
            <Text
              className="text-sm leading-[17px] font-medium text-[#1A1C1E] uppercase tracking-[0.7px]"
              style={{ fontFamily: 'Poppins' }}
            >
              Active Devices
            </Text>
            <View className="bg-[#31973D] rounded-full px-3 py-1">
              <Text className="text-[#F7FFF1] text-xs leading-[14px]" style={{ fontFamily: 'Poppins' }}>3 Active</Text>
            </View>
          </View>

          <View className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl overflow-hidden">
            <DeviceCard
              iconName="cellphone"
              title="iPhone 13"
              location="Accra, Ghana"
              status="Active now"
              actionLabel="Current"
              actionTone="current"
              isCurrent
            />
            <DeviceCard
              iconName="laptop"
              title='MacBook Pro 14"'
              location="Accra, Ghana"
              status="Active now"
              actionLabel="Revoke"
            />
            <DeviceCard
              iconName="cellphone"
              title="iPhone 13"
              location="Accra, Ghana"
              status="Active now"
              actionLabel="Revoke"
            />
          </View>

          <View className="pt-1">
            <Pressable
              className="h-12 rounded-xl bg-[#31973D] items-center justify-center"
              onPress={() => navigation.navigate('Settings')}
            >
              <Text className="text-white text-sm leading-5" style={{ fontFamily: 'Plus Jakarta Sans' }}>Back to Settings</Text>
            </Pressable>
          </View>

          <InfoCard />
        </ScrollView>

        <AppBottomNav
          activeTab="settings"
          paddingBottom={0}
          onHomePress={() => navigation.navigate('Home')}
          onSavedPress={() => navigation.navigate('Details', { itemId: 'save', title: 'Saved' })}
          onSettingsPress={() => navigation.navigate('Settings')}
        />
      </View>
    </SafeAreaView>
  );
}

export default ActiveSessionScreen;
