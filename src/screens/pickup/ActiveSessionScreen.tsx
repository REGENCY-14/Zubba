import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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
    <View style={styles.deviceWrap}>
      {isCurrent ? <View style={styles.currentAccent} /> : null}
      <View style={styles.deviceCard}>
        <View style={styles.deviceLeft}>
          <View style={styles.deviceIconShell}>
            <MaterialCommunityIcons name={iconName} size={24} color="#3F4A3D" />
          </View>
          <View style={styles.deviceTextGroup}>
            <Text style={styles.deviceTitle}>{title}</Text>
            <Text style={styles.deviceLocation}>{location}</Text>
            <Text style={styles.deviceStatus}>{status}</Text>
          </View>
        </View>

        <View style={[styles.deviceAction, actionTone === 'current' ? styles.currentAction : styles.revokeAction]}>
          <Text style={[styles.deviceActionText, actionTone === 'current' ? styles.currentActionText : styles.revokeActionText]}>{actionLabel}</Text>
        </View>
      </View>
    </View>
  );
}

function InfoCard() {
  return (
    <View style={styles.infoCard}>
      <View style={styles.infoIconShell}>
        <MaterialCommunityIcons name="information-outline" size={20} color="#31973D" />
      </View>
      <Text style={styles.infoText}>
        If you notice a device you don&apos;t recognize, revoke its access immediately and change your password.
      </Text>
    </View>
  );
}

export function ActiveSessionScreen({ navigation }: RootStackScreenProps<'ActiveSession'>) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-left" size={28} color="#1F2A33" />
          </Pressable>
          <Text style={styles.headerTitle}>Active Session</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.heroCard}>
            <View style={styles.heroIconWrap}>
              <MaterialCommunityIcons name="shield-outline" size={28} color="#006B23" />
            </View>
            <Text style={styles.heroText}>
              Review and manage devices currently logged into your Zubba account.
            </Text>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Active Devices</Text>
            <View style={styles.activePill}>
              <Text style={styles.activePillText}>3 Active</Text>
            </View>
          </View>

          <View style={styles.deviceListCard}>
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

          <View style={styles.backButtonWrap}>
            <Pressable style={styles.backToSettingsButton} onPress={() => navigation.navigate('Settings')}>
              <Text style={styles.backToSettingsText}>Back to Settings</Text>
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
    borderColor: '#E2E8F0',
    paddingHorizontal: 18,
    paddingVertical: 24,
    gap: 16,
  },
  heroIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 999,
    backgroundColor: 'rgba(65, 158, 106, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: { fontSize: 14, lineHeight: 20, color: '#64748A', textAlign: 'center', fontFamily: 'Poppins' },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  sectionLabel: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '500',
    color: '#1A1C1E',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    fontFamily: 'Poppins',
  },
  activePill: {
    backgroundColor: '#31973D',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  activePillText: { color: '#F7FFF1', fontSize: 12, lineHeight: 14, fontFamily: 'Poppins' },
  deviceListCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 0,
    overflow: 'hidden',
  },
  deviceWrap: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  currentAccent: {
    width: 6,
    backgroundColor: '#31973D',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  deviceCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  deviceLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 16 },
  deviceIconShell: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  deviceTextGroup: { flex: 1 },
  deviceTitle: { fontSize: 14, lineHeight: 20, fontWeight: '600', color: '#111827', fontFamily: 'Poppins' },
  deviceLocation: { fontSize: 12, lineHeight: 16, color: '#64748A', fontFamily: 'Poppins', marginTop: 2 },
  deviceStatus: { fontSize: 10, lineHeight: 16, color: '#31973D', fontFamily: 'Poppins', marginTop: 4 },
  deviceAction: {
    minWidth: 69,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  currentAction: { backgroundColor: '#E4E1ED', borderWidth: 1, borderColor: '#E2E8F0' },
  revokeAction: { borderWidth: 1, borderColor: '#FF383C', backgroundColor: '#FFFFFF' },
  deviceActionText: { fontSize: 13, lineHeight: 20, fontWeight: '700', fontFamily: 'Nexa Text-Trial' },
  currentActionText: { color: '#31973D' },
  revokeActionText: { color: '#FF383C' },
  backButtonWrap: { paddingTop: 4 },
  backToSettingsButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#31973D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backToSettingsText: { color: '#FFFFFF', fontSize: 14, lineHeight: 20, fontFamily: 'Plus Jakarta Sans', fontWeight: '400' },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  infoIconShell: {
    width: 32.67,
    height: 32.67,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 107, 35, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: { flex: 1, fontSize: 14, lineHeight: 21, color: '#64748A', fontFamily: 'Poppins' },
});

export default ActiveSessionScreen;