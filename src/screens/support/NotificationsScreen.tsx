import React from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
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
    <View style={styles.toggleCard}>
      <View style={styles.toggleCardLeft}>
        <View style={styles.iconShell}>{icon}</View>
        <View style={styles.textWrap}>
          <Text style={styles.rowTitle}>{title}</Text>
          <Text style={styles.rowSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Switch value={value} onValueChange={onValueChange} trackColor={{ false: '#CBD5E0', true: '#31973D' }} thumbColor="#FFFFFF" />
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
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-left" size={28} color="#1F2A33" />
          </Pressable>
          <Text style={styles.headerTitle}>Notification</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.heroCard}>
            <View style={styles.heroIconWrap}>
              <MaterialCommunityIcons name="bell-outline" size={28} color="#006B23" />
            </View>
            <Text style={styles.heroText}>Manage how you want to be notified about your waste collection services.</Text>
          </View>

          <View style={styles.sectionCard}>
            <ToggleRow icon={<MaterialCommunityIcons name="trash-can-outline" size={24} color="#111827" />} title="Pickup Alerts" subtitle="Real-time truck tracking" value={pickupAlerts} onValueChange={setPickupAlerts} />
            <ToggleRow icon={<MaterialCommunityIcons name="star-outline" size={24} color="#111827" />} title="Reward Milestone" subtitle="Eco-point updates" value={rewardMilestone} onValueChange={setRewardMilestone} />
            <ToggleRow icon={<MaterialCommunityIcons name="wallet-outline" size={24} color="#111827" />} title="Wallet Updates" subtitle="Transaction confirmations" value={walletUpdates} onValueChange={setWalletUpdates} />
            <ToggleRow icon={<MaterialCommunityIcons name="newspaper-variant-outline" size={24} color="#111827" />} title="News/Offers" subtitle="New features and discounts" value={newsOffers} onValueChange={setNewsOffers} />
          </View>

          <View style={styles.sectionCard}>
            <ToggleRow icon={<MaterialCommunityIcons name="bell-ring-outline" size={24} color="#111827" />} title="Push Notifications" subtitle="Instant app alerts" value={pushNotifications} onValueChange={setPushNotifications} />
            <ToggleRow icon={<MaterialCommunityIcons name="star-outline" size={24} color="#111827" />} title="Email" subtitle="Zubba-user@example.com" value={emailNotifications} onValueChange={setEmailNotifications} />
            <ToggleRow icon={<MaterialCommunityIcons name="message-text-outline" size={24} color="#111827" />} title="SMS" subtitle="+233 20 0000 000" value={smsNotifications} onValueChange={setSmsNotifications} />
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

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    height: 48,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  backButton: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, lineHeight: 24, fontWeight: '600', color: '#1F2A33', fontFamily: 'Inter' },
  headerSpacer: { width: 24, height: 24 },
  content: { paddingHorizontal: 12, paddingTop: 16, paddingBottom: 128, gap: 24 },
  heroCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D9E2EC',
    paddingHorizontal: 18,
    paddingVertical: 24,
    gap: 16,
  },
  heroIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 999,
    backgroundColor: '#E5F3EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: { fontSize: 14, lineHeight: 20, color: '#64748A', textAlign: 'center', fontFamily: 'Poppins' },
  sectionCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 6,
    gap: 12,
  },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 72,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
  },
  toggleCardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 12 },
  iconShell: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textWrap: { flex: 1 },
  rowTitle: { fontSize: 14, lineHeight: 20, fontWeight: '600', color: '#1A1C1E', fontFamily: 'Poppins' },
  rowSubtitle: { fontSize: 12, lineHeight: 16, color: '#64748A', fontFamily: 'Poppins' },
});

export default NotificationsScreen;