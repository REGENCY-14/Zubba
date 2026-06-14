import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../navigation/types';
import { AppBottomNav } from '../components';

export function PaymentMethodScreen({ navigation }: RootStackScreenProps<'PaymentMethod'>) {
  const [phoneNumber, setPhoneNumber] = React.useState<string>('055 123 4567');

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
            <View style={styles.summaryCard}>
              <View style={styles.summaryIconWrap}>
                <Text style={styles.summaryIcon}>◉</Text>
              </View>
              <Text style={styles.totalLabel}>Total to Pay</Text>
              <Text style={styles.totalAmount}>GHS 45.00</Text>
              <View style={styles.summaryDivider} />
              <View style={styles.feesBadge}>
                <Text style={styles.feesBadgeText}>Includes all fees</Text>
              </View>
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Wallet Phone Number</Text>
              <TextInput
                style={styles.textInput}
                placeholder="055 123 4567"
                placeholderTextColor="#64748A"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
              <Text style={styles.helpText}>Enter your mobile money number</Text>
            </View>

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

            <Pressable
              style={styles.continueButton}
              onPress={() => navigation.navigate('PaymentVerification')}
            >
              <Text style={styles.continueButtonText}>Proceed to verify</Text>
            </Pressable>

            <Text style={styles.securityText}>SECURED BY ZUBBA PAY ARCHITECTURE</Text>
          </View>
        </ScrollView>

        <AppBottomNav
          activeTab="home"
          onHomePress={() => navigation.navigate('LocationSharing')}
          onSavedPress={() => navigation.navigate('Details', { itemId: 'save', title: 'Saved' })}
          onSettingsPress={() => navigation.navigate('Settings')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9F9F9' },
  screen: { flex: 1, backgroundColor: '#F9F9F9' },
  header: {
    height: 90,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderBottomWidth: 0,
  },
  backButton: { width: 24, height: 24, alignItems: 'flex-start', justifyContent: 'center' },
  backText: { fontSize: 28, color: '#1F2A33', lineHeight: 28, marginTop: -2 },
  title: { fontSize: 16, fontWeight: '600', color: '#1F2A33' },
  headerSpacer: { width: 24, height: 24 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 12, paddingTop: 16, paddingBottom: 120 },
  main: { gap: 24 },

  summaryCard: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 24,
    padding: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    gap: 16,
  },
  summaryIconWrap: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(65, 158, 106, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryIcon: { color: '#31973D', fontSize: 26, lineHeight: 26 },
  totalLabel: { fontSize: 16, lineHeight: 24, color: '#3F4A3D', fontWeight: '400', textAlign: 'center' },
  totalAmount: { fontSize: 32, lineHeight: 38, color: '#1F2A33', fontWeight: '600', textAlign: 'center' },
  summaryDivider: { width: '100%', height: 1, backgroundColor: '#BECAB9', opacity: 0.2 },
  feesBadge: {
    backgroundColor: '#E8F2E8',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  feesBadgeText: { color: '#31973D', fontSize: 13, lineHeight: 20, fontWeight: '700' },

  inputSection: { gap: 7 },
  inputLabel: { fontSize: 16, lineHeight: 16, color: '#1F2A33', fontWeight: '400' },
  textInput: {
    height: 48,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#CBD5E0',
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    color: '#1F2A33',
  },
  helpText: { fontSize: 12, lineHeight: 16, color: '#64748A', fontWeight: '400' },

  instructionsCard: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#BECAB9',
    backgroundColor: '#FFFFFF',
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
  instructionsText: { fontSize: 14, lineHeight: 24, color: '#64748A', fontWeight: '400' },

  continueButton: {
    height: 48,
    borderRadius: 999,
    backgroundColor: '#31973D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: { color: '#FFFFFF', fontSize: 14, lineHeight: 20, fontWeight: '400' },

  securityText: {
    marginTop: 0,
    fontSize: 10,
    lineHeight: 16,
    letterSpacing: -0.275,
    textTransform: 'uppercase',
    color: '#A1A1AA',
    fontWeight: '200',
    textAlign: 'center',
  },

});

export default PaymentMethodScreen;
