import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../navigation/types';

export function PaymentScreen({ navigation }: RootStackScreenProps<'Payment'>) {
  const [selectedMethod, setSelectedMethod] = React.useState<'wallet' | 'momo' | 'telecel'>('momo');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <Text style={styles.title}>Payment</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.main} contentContainerStyle={styles.mainContent}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryTextBlock}>
                <Text style={styles.summaryLabel}>ESTIMATED COST</Text>
                <Text style={styles.summaryAmount}>GHS 45.00</Text>
              </View>

              <View style={styles.ecoBadge}>
                <Text style={styles.ecoBadgeText}>Standard</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.lineRow}>
              <Text style={styles.lineLabel}>Pickup - Organic Waste</Text>
              <Text style={styles.lineValue}>GHS 35.00</Text>
            </View>

            <View style={styles.lineRow}>
              <Text style={styles.lineLabel}>Service Fee</Text>
              <Text style={styles.lineValue}>GHS 10.00</Text>
            </View>
          </View>

          <View style={styles.optionsBlock}>
            <Text style={styles.sectionTitle}>Select Payment Method</Text>

            <Pressable
              style={[styles.optionCard, selectedMethod === 'momo' && styles.optionCardSelected]}
              onPress={() => setSelectedMethod('momo')}
            >
              <View style={styles.optionIconMtn}>
                <Text style={styles.optionIconMtnText}>MTN</Text>
              </View>
              <View style={styles.optionTextBlock}>
                <Text style={styles.optionTitle}>MTN MoMo</Text>
                <Text style={styles.optionSubtitle}>Direct carrier billing</Text>
              </View>
              <View style={[styles.radio, selectedMethod === 'momo' && styles.radioActive]}>
                {selectedMethod === 'momo' && <View style={styles.radioDot} />}
              </View>
            </Pressable>

            <Pressable
              style={[styles.optionCard, selectedMethod === 'telecel' && styles.optionCardSelected]}
              onPress={() => setSelectedMethod('telecel')}
            >
              <View style={styles.optionIconTelecel}>
                <Text style={styles.optionIconTelecelText}>▭</Text>
              </View>
              <View style={styles.optionTextBlock}>
                <Text style={styles.optionTitle}>Telecel Cash</Text>
                <Text style={styles.optionSubtitle}>Mobile money transfer</Text>
              </View>
              <View style={[styles.radio, selectedMethod === 'telecel' && styles.radioActive]}>
                {selectedMethod === 'telecel' && <View style={styles.radioDot} />}
              </View>
            </Pressable>
          </View>

          <Pressable style={styles.payButton} onPress={() => navigation.navigate('PaymentMethod')}>
            <Text style={styles.payButtonText}>Continue</Text>
          </Pressable>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNavWrap}>
          <View style={styles.handle} />
          <View style={styles.bottomNav}>
            <Pressable style={styles.navItem} onPress={() => navigation.navigate('LocationSharing')}>
              <Text style={styles.navIcon}>🏠</Text>
            </Pressable>

            <Pressable style={styles.navItem} onPress={() => {}}>
              <Text style={styles.navIcon}>📅</Text>
            </Pressable>

            <Pressable style={styles.navItem} onPress={() => navigation.navigate('Details', { itemId: 'save', title: 'Saved' })}>
              <Text style={styles.navIcon}>💾</Text>
            </Pressable>

            <Pressable style={styles.navItem} onPress={() => navigation.navigate('Details', { itemId: 'account', title: 'Account' })}>
              <Text style={styles.navIcon}>👥</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    height: 48,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)'
  },
  backButton: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 28, color: '#1F2A33', lineHeight: 28, marginTop: -2 },
  title: { fontSize: 16, fontWeight: '400', color: '#1F2A33' },
  headerSpacer: { width: 24, height: 24 },
  main: { flex: 1 },
  mainContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100, gap: 24 },
  summaryCard: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, padding: 24, backgroundColor: '#FFFFFF', gap: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  summaryTextBlock: { gap: 4 },
  summaryLabel: { fontSize: 16, lineHeight: 24, letterSpacing: 1.6, textTransform: 'uppercase', color: '#1F2A33', fontWeight: '400' },
  summaryAmount: { fontSize: 14, lineHeight: 24, color: '#006B23', fontWeight: '400' },
  ecoBadge: { backgroundColor: '#E8F2E8', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 12, paddingVertical: 6 },
  ecoBadgeText: { color: '#31973D', fontSize: 13, lineHeight: 20, fontWeight: '400' },
  divider: { borderTopWidth: 1, borderTopColor: 'rgba(190, 202, 185, 0.3)' },
  lineRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lineLabel: { fontSize: 15, lineHeight: 24, color: '#1F2A33', fontWeight: '400' },
  lineValue: { fontSize: 15, lineHeight: 24, color: '#64748A', fontWeight: '400' },
  optionsBlock: { gap: 16 },
  sectionTitle: { fontSize: 16, lineHeight: 24, color: '#1F2A33', fontWeight: '700' },
  optionCard: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 16, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' },
  optionCardSelected: { backgroundColor: 'rgba(49,151,61,0.11)', borderColor: '#31973D', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  optionCardDisabled: { opacity: 0.85 },
  optionIconMtn: { width: 48, height: 48, borderRadius: 8, backgroundColor: '#FFCC00', alignItems: 'center', justifyContent: 'center' },
  optionIconMtnText: { color: '#000000', fontSize: 12, fontWeight: '700' },
  optionIconTelecel: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#DC2626', alignItems: 'center', justifyContent: 'center' },
  optionIconTelecelText: { color: '#FFFFFF', fontSize: 22, fontWeight: '700' },
  optionTextBlock: { flex: 1 },
  optionTitle: { fontSize: 16, lineHeight: 24, color: '#1F2A33', fontWeight: '400' },
  optionSubtitle: { fontSize: 16, lineHeight: 24, color: '#64748A', fontWeight: '400' },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#31973D', alignItems: 'center', justifyContent: 'center' },
  radioActive: { backgroundColor: '#31973D' },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFFFFF' },
  payButton: { height: 48, borderRadius: 12, backgroundColor: '#31973D', alignItems: 'center', justifyContent: 'center' },
  payButtonText: { color: '#FFFFFF', fontSize: 14, lineHeight: 20, fontWeight: '400' },
  bottomNavWrap: { position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center', paddingBottom: 8 },
  handle: { width: 108, height: 4, backgroundColor: '#000000', opacity: 0.9, borderRadius: 12, marginBottom: 12 },
  bottomNav: { width: 402, maxWidth: '96%', height: 78, backgroundColor: '#FFFFFF', borderRadius: 75, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  navItem: { width: 64, height: 44, borderRadius: 44, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 10, gap: 8 },
  navIcon: { fontSize: 20, color: '#64748A' },
});

export default PaymentScreen;
