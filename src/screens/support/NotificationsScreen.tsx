import React from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBottomNav } from '../../components';
import type { RootStackScreenProps } from '../../navigation/types';

type ToggleRowProps = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

function ToggleRow({ icon, title, subtitle, value, onValueChange }: ToggleRowProps) {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 min-h-[72px] bg-white border border-slate-200 rounded-2xl">
      <View className="flex-row items-center flex-1 mr-3">
        <View className="w-10 h-10 rounded-[10px] bg-slate-50 items-center justify-center mr-4">
          {icon}
        </View>

        <View className="flex-1">
          <Text className="text-[14px] leading-5 font-semibold text-[#1A1C1E]">
            {title}
          </Text>
          <Text className="text-[12px] leading-4 text-[#64748A]">
            {subtitle}
          </Text>
        </View>
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#CBD5E0', true: '#31973D' }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

export function NotificationsScreen({ navigation }: RootStackScreenProps<'Notifications'>) {
  const [pickupAlerts, setPickupAlerts] = React.useState(true);
  const [rewardMilestone, setRewardMilestone] = React.useState(true);
  const [walletUpdates, setWalletUpdates] = React.useState(true);
  const [newsOffers, setNewsOffers] = React.useState(false);
  const [pushNotifications, setPushNotifications] = React.useState(true);
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [smsNotifications, setSmsNotifications] = React.useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <View className="flex-1 bg-white">

        <View className="h-12 px-4 flex-row items-center justify-between bg-white">
          <Pressable onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-left" size={28} color="#1F2A33" />
          </Pressable>

          <Text className="text-[16px] font-semibold text-[#1F2A33]">
            Notification
          </Text>

          <View className="w-6 h-6" />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-3 pt-4 pb-32 gap-6"
        >
          <View className="items-center bg-white border border-slate-200 rounded-2xl px-[18px] py-6 gap-4">
            <View className="w-[54px] h-[54px] rounded-full bg-[#E5F3EA] items-center justify-center">
              <MaterialCommunityIcons name="bell-outline" size={28} color="#006B23" />
            </View>

            <Text className="text-[14px] leading-5 text-center text-slate-500">
              Manage how you want to be notified about your waste collection services.
            </Text>
          </View>

          <View className="bg-slate-50 border border-slate-200 rounded-xl p-1.5 gap-3">
            <ToggleRow
              icon={<MaterialCommunityIcons name="trash-can-outline" size={24} color="#111827" />}
              title="Pickup Alerts"
              subtitle="Real-time truck tracking"
              value={pickupAlerts}
              onValueChange={setPickupAlerts}
            />

            <ToggleRow
              icon={<MaterialCommunityIcons name="star-outline" size={24} color="#111827" />}
              title="Reward Milestone"
              subtitle="Eco-point updates"
              value={rewardMilestone}
              onValueChange={setRewardMilestone}
            />

            <ToggleRow
              icon={<MaterialCommunityIcons name="wallet-outline" size={24} color="#111827" />}
              title="Wallet Updates"
              subtitle="Transaction confirmations"
              value={walletUpdates}
              onValueChange={setWalletUpdates}
            />

            <ToggleRow
              icon={<MaterialCommunityIcons name="newspaper-variant-outline" size={24} color="#111827" />}
              title="News/Offers"
              subtitle="New features and discounts"
              value={newsOffers}
              onValueChange={setNewsOffers}
            />
          </View>

          <View className="bg-slate-50 border border-slate-200 rounded-xl p-1.5 gap-3">
            <ToggleRow
              icon={<MaterialCommunityIcons name="bell-ring-outline" size={24} color="#111827" />}
              title="Push Notifications"
              subtitle="Instant app alerts"
              value={pushNotifications}
              onValueChange={setPushNotifications}
            />

            <ToggleRow
              icon={<MaterialCommunityIcons name="star-outline" size={24} color="#111827" />}
              title="Email"
              subtitle="Zubba-user@example.com"
              value={emailNotifications}
              onValueChange={setEmailNotifications}
            />

            <ToggleRow
              icon={<MaterialCommunityIcons name="message-text-outline" size={24} color="#111827" />}
              title="SMS"
              subtitle="+233 20 0000 000"
              value={smsNotifications}
              onValueChange={setSmsNotifications}
            />
          </View>
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

export default NotificationsScreen;