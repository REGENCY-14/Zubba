import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackScreenProps } from '../navigation/types';
import { AppBottomNav } from '../components';

const driverPhoto = require('../../assets/tricycle image.png');

export function DriverArrivesScreen({ navigation }: RootStackScreenProps<'DriverArrives'>) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.screen}>
        <View style={styles.statusHeader}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <Text style={styles.screenTitle}>Driver Arrives</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.contentScroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.driverCard}>
            <View style={styles.avatarWrap}>
              <Image source={driverPhoto} style={styles.avatar} />
            </View>

            <Text style={styles.name}>MARCUS CHEN</Text>
            <Text style={styles.meta}><Text style={styles.metaValue}>4.9</Text> • ZB-0248</Text>

            <View style={styles.actionsRow}>
              <Pressable style={styles.actionChip}>
                <Text style={styles.actionLabel}>☎ Call</Text>
              </Pressable>
              <Pressable style={styles.actionChip}>
                <Text style={styles.actionLabel}>▭ Message</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.codeCard}>
            <Text style={styles.codeLabel}>COLLECTION CODE</Text>
            <View style={styles.codeRow}>
              <View style={styles.codeBox}><Text style={styles.codeDigit}>8</Text></View>
              <View style={styles.codeBox}><Text style={styles.codeDigit}>2</Text></View>
              <View style={styles.codeBox}><Text style={styles.codeDigit}>4</Text></View>
              <View style={styles.codeBox}><Text style={styles.codeDigit}>9</Text></View>
            </View>
            <Text style={styles.codeHint}>Show this to Marcus to verify</Text>
          </View>

          <View style={styles.confirmCard}>
            <View style={styles.confirmTextGroup}>
              <Text style={styles.confirmTitle}>Confirm Collection</Text>
              <Text style={styles.confirmSubtitle}>Please verify the materials are loaded</Text>
            </View>

            <View style={styles.readyBadge}>
              <View style={styles.readyDot} />
              <Text style={styles.readyText}>Driver Ready</Text>
            </View>
          </View>

          <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('PremiumPayment')}>
            <Text style={styles.primaryButtonText}>Proceed to payment</Text>
          </Pressable>

          <Pressable style={styles.issueButton} onPress={() => navigation.navigate('Details', { itemId: 'issue', title: 'Issue' })}>
            <Text style={styles.issueButtonText}>Report an Issue</Text>
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

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9F9F9' },
  screen: { flex: 1, backgroundColor: '#F9F9F9' },
  statusHeader: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: { width: 32, height: 32, alignItems: 'flex-start', justifyContent: 'center' },
  backText: { fontSize: 28, color: '#1F2A33', lineHeight: 28, marginTop: -2 },
  screenTitle: { fontSize: 16, fontWeight: '600', color: '#1F2A33' },
  headerSpacer: { width: 32, height: 32 },
  contentScroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 120, gap: 16 },
  driverCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 24,
  },
  avatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#F4F4F5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  avatar: { width: 54, height: 54, borderRadius: 27, borderWidth: 2, borderColor: '#90FA96', resizeMode: 'cover' },
  name: { fontSize: 16, fontWeight: '700', color: '#1F2A33', letterSpacing: 1.6, textAlign: 'center' },
  meta: { color: '#0D631B', fontSize: 14, textAlign: 'center', fontWeight: '400', lineHeight: 20 },
  metaValue: { fontWeight: '400' },
  actionsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 36 },
  actionChip: { flexDirection: 'row', alignItems: 'center' },
  actionLabel: { fontSize: 14, color: '#171D14', fontWeight: '400', lineHeight: 20 },
  codeCard: { backgroundColor: '#31973D', borderRadius: 24, padding: 24, alignItems: 'center', gap: 24 },
  codeLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 10, lineHeight: 15, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  codeRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  codeBox: {
    width: 47,
    height: 56,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeDigit: { fontSize: 36, lineHeight: 40, fontWeight: '900', color: '#FFFFFF' },
  codeHint: { color: '#FFFFFF', opacity: 0.9, fontSize: 12, lineHeight: 16, fontWeight: '500', textAlign: 'center' },
  confirmCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  confirmTextGroup: { flex: 1, minWidth: 0 },
  confirmTitle: { fontSize: 14, fontWeight: '600', color: '#1F2A33', lineHeight: 20 },
  confirmSubtitle: { marginTop: 4, fontSize: 12, color: '#64748A', lineHeight: 16, maxWidth: 185 },
  readyBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(49,151,61,0.1)', borderRadius: 9999, borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 12, paddingVertical: 6, gap: 8 },
  readyDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#2E7D32' },
  readyText: { fontSize: 13, lineHeight: 20, color: '#31973D', fontWeight: '400' },
  primaryButton: { backgroundColor: '#31973D', borderRadius: 9999, height: 48, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '400' },
  issueButton: { alignItems: 'center', justifyContent: 'center', height: 48, borderRadius: 16 },
  issueButtonText: { color: '#171D14', fontSize: 14, fontWeight: '400' },
});

export default DriverArrivesScreen;
