import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../navigation/types';

export function PaymentMethodScreen({ navigation }: RootStackScreenProps<'PaymentMethod'>) {
  const [phoneNumber, setPhoneNumber] = React.useState<string>('');
  const [selectedMethod, setSelectedMethod] = React.useState<'momo' | 'telecel'>('momo');

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

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.main}>
            {/* Summary Card */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryTextBlock}>
                  <Text style={styles.summaryLabel}>TOTAL AMOUNT</Text>
                  <View style={styles.amountContainer}>
                    <Text style={styles.currencyText}>GHS</Text>
                    <Text style={styles.amountText}>45.00</Text>
                  </View>
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

            {/* Network Selector */}
            <View style={styles.networkSection}>
              <Text style={styles.networkTitle}>Network Provider</Text>

              <View style={styles.networkGrid}>
                {/* MTN MoMo Button */}
                <Pressable
                  style={[styles.networkButton, selectedMethod === 'momo' && styles.networkButtonActive]}
                  onPress={() => setSelectedMethod('momo')}
                >
                  <View style={styles.networkIconMtn}>
                    <Text style={styles.networkIconText}>MTN</Text>
                  </View>
                  <Text style={styles.networkButtonLabel}>MTN MoMo</Text>
                  {selectedMethod === 'momo' && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </Pressable>

                {/* Telecel Cash Button */}
                <Pressable
                  style={[styles.networkButton, selectedMethod === 'telecel' && styles.networkButtonActive]}
                  onPress={() => setSelectedMethod('telecel')}
                >
                  <View style={styles.networkIconTelecel}>
                    <Text style={styles.networkIconText}>▭</Text>
                  </View>
                  <Text style={styles.networkButtonLabel}>Telecel Cash</Text>
                  {selectedMethod === 'telecel' && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </Pressable>
              </View>
            </View>

            {/* Phone Number Input */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Mobile Number</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your phone number"
                placeholderTextColor="#64748A"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
              <Text style={styles.helpText}>We'll send the payment prompt to this number</Text>
            </View>

            {/* Instructions Card */}
            <View style={styles.instructionsCard}>
              <View style={styles.infoIcon}>
                <Text style={styles.infoIconText}>ℹ</Text>
              </View>
              <View style={styles.instructionsContent}>
                <Text style={styles.instructionsTitle}>How it works</Text>
                <Text style={styles.instructionsText}>
                  You will receive a secure payment prompt on your mobile phone. Enter your MM PIN to authorize the transaction instantly.
                </Text>
              </View>
            </View>

            {/* Continue Button */}
            <Pressable
              style={styles.continueButton}
                onPress={() => navigation.navigate('PaymentVerification')}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </Pressable>

            {/* Security Footer */}
            <Text style={styles.securityText}>SECURED BY ZUBBA PAY ARCHITECTURE</Text>
          </View>
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
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 28, color: '#1F2A33', lineHeight: 28, marginTop: -2 },
  title: { fontSize: 16, fontWeight: '400', color: '#1F2A33' },
  headerSpacer: { width: 24, height: 24 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 12, paddingTop: 16, paddingBottom: 100 },
  main: { gap: 24 },

  /* Summary Card */
  summaryCard: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 24,
    backgroundColor: '#FFFFFF',
    gap: 16,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  summaryTextBlock: { gap: 4 },
  summaryLabel: {
    fontSize: 16,
    lineHeight: 15,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#1F2A33',
    fontWeight: '400',
  },
  amountContainer: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  currencyText: { fontSize: 15, lineHeight: 24, color: '#006B23', fontWeight: '400' },
  amountText: { fontSize: 15, lineHeight: 24, color: '#006B23', fontWeight: '400' },
  ecoBadge: {
    backgroundColor: '#E8F2E8',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  ecoBadgeText: { color: '#31973D', fontSize: 13, lineHeight: 20, fontWeight: '400' },
  divider: { borderTopWidth: 1, borderTopColor: 'rgba(190, 202, 185, 0.3)' },
  lineRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lineLabel: { fontSize: 15, lineHeight: 24, color: '#1F2A33', fontWeight: '400' },
  lineValue: { fontSize: 15, lineHeight: 24, color: '#64748A', fontWeight: '400' },

  /* Network Section */
  networkSection: { gap: 16 },
  networkTitle: { fontSize: 16, lineHeight: 24, color: '#1F2A33', fontWeight: '400' },
  networkGrid: { flexDirection: 'row', gap: 16, justifyContent: 'space-between' },
  networkButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    gap: 8,
  },
  networkButtonActive: {
    borderColor: '#31973D',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
  },
  networkIconMtn: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#FFCC00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  networkIconTelecel: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  networkIconText: { fontSize: 12, fontWeight: '700', color: '#1F2A33' },
  networkButtonLabel: { fontSize: 16, lineHeight: 24, color: '#1F2A33', fontWeight: '400', textAlign: 'center' },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#006B23',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 10,
    right: 10,
  },
  checkmarkText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },

  /* Input Section */
  inputSection: { gap: 7 },
  inputLabel: { fontSize: 16, lineHeight: 16, color: '#1F2A33', fontWeight: '400' },
  textInput: {
    height: 48,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E0',
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    color: '#1F2A33',
  },
  helpText: { fontSize: 12, lineHeight: 16, color: '#64748A', fontWeight: '400' },

  /* Instructions Card */
  instructionsCard: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BECAB9',
    backgroundColor: '#F3F3F6',
  },
  infoIcon: {
    width: 32.67,
    height: 32.67,
    borderRadius: 16.33,
    backgroundColor: 'rgba(0, 107, 35, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoIconText: { fontSize: 16, fontWeight: '700', color: '#31973D' },
  instructionsContent: { flex: 1, gap: 4 },
  instructionsTitle: { fontSize: 16, lineHeight: 24, color: '#1F2A33', fontWeight: '400' },
  instructionsText: { fontSize: 16, lineHeight: 24, color: '#64748A', fontWeight: '200' },

  /* Continue Button */
  continueButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#31973D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: { color: '#FFFFFF', fontSize: 14, lineHeight: 20, fontWeight: '400' },

  /* Security Text */
  securityText: {
    fontSize: 10,
    lineHeight: 16,
    letterSpacing: -0.275,
    textTransform: 'uppercase',
    color: '#A1A1AA',
    fontWeight: '200',
    textAlign: 'center',
  },

  /* Bottom Navigation */
  bottomNavWrap: { position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center', paddingBottom: 8 },
  handle: { width: 108, height: 4, backgroundColor: '#000000', opacity: 0.9, borderRadius: 12, marginBottom: 12 },
  bottomNav: { width: 402, maxWidth: '96%', height: 78, backgroundColor: '#FFFFFF', borderRadius: 75, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  navItem: { width: 64, height: 44, borderRadius: 44, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 10, gap: 8 },
  navIcon: { fontSize: 20, color: '#64748A' },
});

export default PaymentMethodScreen;
