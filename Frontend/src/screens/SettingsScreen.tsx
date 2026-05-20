import React from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBottomNav } from '../components';
import type { RootStackScreenProps } from '../navigation/types';

type SettingsRowProps = {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightSlot?: React.ReactNode;
  showChevron?: boolean;
};

function SettingsRow({ icon, title, subtitle, onPress, rightSlot, showChevron = true }: SettingsRowProps) {
  const Container = onPress ? Pressable : View;

  return (
    <Container style={styles.row} onPress={onPress}>
      <View style={styles.rowLeft}>
        <View style={styles.iconShell}>{icon}</View>
        <View style={styles.rowTextGroup}>
          <Text style={styles.rowTitle}>{title}</Text>
          {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      <View style={styles.rowRight}>
        {rightSlot}
        {showChevron ? <MaterialCommunityIcons name="chevron-right" size={22} color="#C7C4D7" /> : null}
      </View>
    </Container>
  );
}

function SectionCard({ title, children, compact = false }: { title: string; children: React.ReactNode; compact?: boolean }) {
  return (
    <View style={[styles.card, compact && styles.compactCard]}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionDivider} />
      {children}
    </View>
  );
}

export function SettingsScreen({ navigation }: RootStackScreenProps<'Settings'>) {
  const [appearanceEnabled, setAppearanceEnabled] = React.useState(true);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-left" size={24} color="#0F1621" />
          </Pressable>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.brandCard}>
            <Text style={styles.brandMark}>ZUBBA</Text>
            <Text style={styles.brandSubtitle}>Waste Pickup and Recycling Control</Text>
            <View style={styles.versionPill}>
              <Text style={styles.versionText}>Version 1.0.0</Text>
            </View>
          </View>

          <View style={styles.premiumCard}>
            <Text style={styles.premiumTitle}>Premium Benefits</Text>
            <View style={styles.premiumGrid}>
              <View style={styles.premiumTile}>
                <MaterialCommunityIcons name="flash-outline" size={20} color="#90FA96" />
                <Text style={styles.premiumTileText}>Double Eco-Points</Text>
              </View>
              <View style={styles.premiumTile}>
                <MaterialCommunityIcons name="headset" size={20} color="#90FA96" />
                <Text style={styles.premiumTileText}>Priority Support</Text>
              </View>
            </View>
          </View>

          <SectionCard title="Security and Configuration">
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={styles.iconShell}>
                  <MaterialCommunityIcons name="earth" size={22} color="#111827" />
                </View>
                <View style={styles.rowTextGroup}>
                  <Text style={styles.rowTitle}>Language</Text>
                  <Text style={styles.rowSubtitle}>App display language</Text>
                </View>
              </View>
              <View style={styles.languageButton}><Text style={styles.languageButtonText}>English</Text></View>
            </View>

            <SettingsRow
              icon={<MaterialCommunityIcons name="bell-outline" size={22} color="#111827" />}
              title="Notifications"
              subtitle="Manage your notifications and alerts."
              onPress={() => navigation.navigate('Notifications')}
            />
            <SettingsRow
              icon={<MaterialCommunityIcons name="lock-outline" size={22} color="#111827" />}
              title="Change phone number"
              subtitle="Update your security key"
              onPress={() => navigation.navigate('UpdateDetails')}
            />
            <SettingsRow
              icon={<MaterialCommunityIcons name="timer-outline" size={22} color="#111827" />}
              title="Active Session"
              subtitle="manage devices currently logged in"
              onPress={() => navigation.navigate('ActiveSession')}
            />
          </SectionCard>

          <SectionCard title="Preferences">
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={styles.iconShell}>
                  <MaterialCommunityIcons name="theme-light-dark" size={22} color="#111827" />
                </View>
                <View style={styles.rowTextGroup}>
                  <Text style={styles.rowTitle}>Appearance</Text>
                  <Text style={styles.rowSubtitle}>Light mode</Text>
                </View>
              </View>
              <Switch
                value={appearanceEnabled}
                onValueChange={setAppearanceEnabled}
                trackColor={{ false: '#CBD5E1', true: '#31973D' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </SectionCard>

          <View style={styles.bentoCard}>
            <View style={styles.bentoHeader}>
              <View style={styles.bentoTitleWrap}>
                <View style={styles.iconShell}><MaterialCommunityIcons name="chart-box-outline" size={22} color="#111827" /></View>
                <View>
                  <Text style={styles.rowTitle}>Eco-Impact Reports</Text>
                  <Text style={styles.rowSubtitle}>Weekly detailed insights</Text>
                </View>
              </View>
              <Pressable style={styles.exportButton}>
                <MaterialCommunityIcons name="download-outline" size={16} color="#1F2A33" />
                <Text style={styles.exportButtonText}>Export data</Text>
              </Pressable>
            </View>
          </View>

          <SectionCard title="Support & Legal" compact>
            <SettingsRow
              icon={<MaterialCommunityIcons name="help-circle-outline" size={22} color="#111827" />}
              title="Help Center"
              subtitle="FAQs and guides"
              onPress={() => navigation.navigate('HelpCenter')}
            />
            <SettingsRow
              icon={<MaterialCommunityIcons name="file-document-outline" size={22} color="#111827" />}
              title="Terms and Conditions"
              subtitle="Review our legal terms"
              onPress={() => navigation.navigate('TermsAndConditions')}
            />
            <SettingsRow
              icon={<MaterialCommunityIcons name="information-outline" size={22} color="#111827" />}
              title="About Zubba"
              subtitle="Version 1.0.0"
              onPress={() => navigation.navigate('AboutUs')}
            />
          </SectionCard>

          <Pressable style={styles.signOutButton} onPress={() => navigation.navigate('SignIn')}>
            <MaterialCommunityIcons name="logout" size={16} color="#C10007" />
            <Text style={styles.signOutText}>Sign out</Text>
          </Pressable>
        </ScrollView>

        <AppBottomNav
          activeTab="settings"
          paddingBottom={0}
          onHomePress={() => navigation.navigate('LocationSharing')}
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
  headerTitle: { fontSize: 16, lineHeight: 24, fontWeight: '600', color: '#1F2A33' },
  headerSpacer: { width: 24, height: 24 },
  content: { paddingHorizontal: 12, paddingTop: 16, paddingBottom: 128, gap: 24 },
  brandCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    paddingVertical: 24,
    paddingHorizontal: 16,
    gap: 8,
  },
  brandMark: { fontSize: 30, lineHeight: 34, fontWeight: '700', color: '#31973D', letterSpacing: 1 },
  brandSubtitle: { fontSize: 12, lineHeight: 16, color: '#64748A', textAlign: 'center' },
  versionPill: { backgroundColor: '#E3F2F7', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  versionText: { fontSize: 8, lineHeight: 11, color: '#000000', fontFamily: 'Inter' },
  premiumCard: {
    backgroundColor: '#31973D',
    borderRadius: 16,
    padding: 16,
    gap: 16,
    overflow: 'hidden',
  },
  premiumTitle: { color: '#FFFFFF', fontSize: 16, lineHeight: 24, fontWeight: '600' },
  premiumGrid: { flexDirection: 'row', gap: 5 },
  premiumTile: {
    flex: 1,
    minHeight: 72,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(144,250,150,0.2)',
    backgroundColor: 'rgba(20,135,50,0.4)',
    padding: 12,
    gap: 8,
  },
  premiumTileText: { color: '#FFFFFF', fontSize: 13, lineHeight: 20, fontFamily: 'Inter' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  compactCard: { gap: 0 },
  sectionTitle: { fontSize: 16, lineHeight: 24, fontWeight: '600', color: '#111827', padding: 16 },
  sectionDivider: { height: 1, backgroundColor: '#F1F5F9' },
  row: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 16,
  },
  rowLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 16 },
  rowTextGroup: { flex: 1, gap: 4 },
  rowTitle: { fontSize: 14, lineHeight: 20, fontWeight: '500', color: '#101828' },
  rowSubtitle: { fontSize: 12, lineHeight: 16, color: '#64748A' },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconShell: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageButton: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
  },
  languageButtonText: { fontSize: 12, lineHeight: 16, color: '#1F2A33' },
  bentoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
  },
  bentoHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  bentoTitleWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 16 },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  exportButtonText: { fontSize: 14, lineHeight: 20, color: '#1F2A33' },
  signOutButton: {
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C10007',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#FFFFFF',
  },
  signOutText: { fontSize: 14, lineHeight: 20, color: '#C10007', fontFamily: 'Manrope' },
});

export default SettingsScreen;