import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackScreenProps } from '../navigation/types';

const logo = require('../../assets/zubba icon.png');

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

        <View style={styles.content}>
          <View style={styles.driverCard}>
            <View style={styles.avatarWrap}>
              <Image source={logo} style={styles.avatar} />
            </View>

            <Text style={styles.name}>MARCUS CHEN</Text>
            <Text style={styles.meta}>4.9 • ZB-0248</Text>

            <View style={styles.actionsRow}>
              <Pressable style={styles.actionChip}>
                <Text style={styles.actionIcon}>☎</Text>
                <Text style={styles.actionLabel}>Call</Text>
              </Pressable>
              <Pressable style={styles.actionChip}>
                <Text style={styles.actionIcon}>▭</Text>
                <Text style={styles.actionLabel}>Message</Text>
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
            <View>
              <Text style={styles.confirmTitle}>Confirm Collection</Text>
              <Text style={styles.confirmSubtitle}>Please verify the materials are loaded</Text>
            </View>

            <View style={styles.readyBadge}>
              <View style={styles.readyDot} />
              <Text style={styles.readyText}>Driver Ready</Text>
            </View>
          </View>

          <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('Details', { itemId: 'payment', title: 'Payment' })}>
            <Text style={styles.primaryButtonText}>Proceed to payment</Text>
          </Pressable>

          <Pressable style={styles.issueButton} onPress={() => navigation.navigate('Details', { itemId: 'issue', title: 'Issue' })}>
            <Text style={styles.issueButtonText}>Report an Issue</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  statusHeader: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: { width: 32, height: 32, alignItems: 'flex-start', justifyContent: 'center' },
  backText: { fontSize: 28, color: '#1F2A33', lineHeight: 28, marginTop: -2 },
  screenTitle: { fontSize: 16, fontWeight: '400', color: '#1F2A33' },
  headerSpacer: { width: 32, height: 32 },
  content: { flex: 1, paddingHorizontal: 12, paddingTop: 4, paddingBottom: 16 },
  driverCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarWrap: { width: 59, height: 59, borderRadius: 999, backgroundColor: 'rgba(65, 158, 106, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  avatar: { width: 29, height: 29, borderRadius: 61, resizeMode: 'cover' },
  name: { fontSize: 16, fontWeight: '700', color: '#1F2A33', letterSpacing: 1.6, textAlign: 'center' },
  meta: { marginTop: 4, color: '#0D631B', fontSize: 14, textAlign: 'center' },
  actionsRow: { marginTop: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 28 },
  actionChip: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  actionIcon: { fontSize: 14, color: '#171D14' },
  actionLabel: { fontSize: 14, color: '#171D14', fontWeight: '400' },
  codeCard: { backgroundColor: '#0D631B', borderRadius: 16, paddingVertical: 24, paddingHorizontal: 24, alignItems: 'center', marginBottom: 24 },
  codeLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 },
  codeRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  codeBox: { width: 47, height: 56, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  codeDigit: { fontSize: 36, lineHeight: 40, fontWeight: '900', color: '#FFFFFF' },
  codeHint: { color: '#FFFFFF', opacity: 0.9, fontSize: 12, textAlign: 'center' },
  confirmCard: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  confirmTitle: { fontSize: 14, fontWeight: '600', color: '#1F2A33' },
  confirmSubtitle: { marginTop: 4, fontSize: 12, color: '#64748A', lineHeight: 16, maxWidth: 185 },
  readyBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(65, 158, 106, 0.1)', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, gap: 6 },
  readyDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#2E7D32' },
  readyText: { fontSize: 12, color: '#31973D', fontWeight: '500' },
  primaryButton: { backgroundColor: '#31973D', borderRadius: 12, height: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '400' },
  issueButton: { alignItems: 'center', justifyContent: 'center', height: 24 },
  issueButtonText: { color: '#171D14', fontSize: 14, fontWeight: '400' },
});

export default DriverArrivesScreen;
