import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../../navigation/types';
import { AppBottomNav } from '../../components';

export function AuthorizePaymentScreen({ navigation }: RootStackScreenProps<'AuthorizePayment'>) {
  const [pin, setPin] = React.useState('');
  const inputRef = React.useRef<TextInput | null>(null);

  const digits = ['', '', '', ''];
  for (let i = 0; i < pin.length && i < 4; i++) digits[i] = pin[i];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.handle} />

        <View style={styles.appHeader}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backWrap}>
            <Text style={styles.backArrow}>‹</Text>
          </Pressable>
          <Text style={styles.appTitle}>Payment Verification</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.headerRow}>
          <View style={styles.enterPinRow}>
            <View style={styles.iconBadge}>
              <Text style={styles.iconBadgeText}>🛡️</Text>
            </View>
            <Text style={styles.headerTitle}>Enter PIN</Text>
          </View>

          <View style={styles.providerPill}>
            <View style={styles.providerDot} />
            <Text style={styles.providerText}>MTN MoMo</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.subtitle}>
            Enter your 4-digit PIN to authorize the payment of <Text style={styles.amount}>GHS 45.00</Text> to <Text style={styles.merchant}>Zubba</Text>.
          </Text>

          <View style={styles.codeContainerWrapper}>
            <View style={styles.codeContainer}>
              {digits.map((d, i) => (
                <Pressable key={i} onPress={() => inputRef.current?.focus()}>
                  <View style={[styles.codeBox, i < pin.length ? styles.codeBoxFilled : styles.codeBoxEmpty, i === pin.length && styles.codeBoxActive]}>
                    {i < pin.length && <View style={styles.dot} />}
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          <TextInput
            ref={inputRef}
            value={pin}
            onChangeText={(text) => text.length <= 4 && /^\d*$/.test(text) && setPin(text)}
            keyboardType="numeric"
            maxLength={4}
            style={styles.hiddenInput}
            autoFocus
          />

          <Pressable
            style={[styles.primaryButtonFull, pin.length === 4 ? styles.primaryButtonActive : styles.primaryButtonDisabled]}
            onPress={() => pin.length === 4 && navigation.navigate('PaymentSuccess')}
            disabled={pin.length !== 4}
          >
            <View style={styles.primaryButtonContent}>
              <Text style={[styles.buttonLock, pin.length === 4 ? null : styles.primaryButtonTextDisabled]}>🔒</Text>
              <Text style={[styles.primaryButtonText, pin.length === 4 ? null : styles.primaryButtonTextDisabled]}>Proceed to pay</Text>
            </View>
          </Pressable>
        </View>

        <AppBottomNav activeTab="home" onHomePress={() => navigation.navigate('LocationSharing')} onSavedPress={() => navigation.navigate('Details', { itemId: 'save', title: 'Saved' })} onSettingsPress={() => navigation.navigate('Settings')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center' },
  handle: { width: 108, height: 6, backgroundColor: '#E6E6E9', borderRadius: 12, marginTop: 16 },
  headerRow: { width: '100%', maxWidth: 390, paddingHorizontal: 24, marginTop: 16, flexDirection: 'row', alignItems: 'center' },
  appHeader: { width: '100%', height: 56, paddingHorizontal: 16, marginTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backWrap: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 24, color: '#1F2A33' },
  appTitle: { fontSize: 18, color: '#1F2A33', textAlign: 'center', fontWeight: '600' },
  headerSpacer: { width: 24, height: 24 },
  headerTitle: { fontSize: 16, fontWeight: '400', color: '#1A1C1E', lineHeight: 24 },
  enterPinRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBadge: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#31973D', marginRight: 6, alignItems: 'center', justifyContent: 'center' },
  iconBadgeText: { fontSize: 16, color: '#FFFFFF' },
  content: { width: '100%', maxWidth: 390, paddingHorizontal: 24, alignItems: 'center', marginTop: 16, gap: 24 },
  subtitle: { width: '100%', fontSize: 16, lineHeight: 24, color: '#64748A', textAlign: 'left', marginBottom: 0 },
  amount: { fontWeight: '700', color: '#1A1C1E' },
  merchant: { fontWeight: '700', color: '#1A1C1E' },
  codeContainerWrapper: { width: '100%', alignItems: 'center' },
  codeContainer: { width: 280, flexDirection: 'row', gap: 18, justifyContent: 'space-between', marginBottom: 0 },
  codeBox: {
    width: 64,
    height: 64,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#BECAB9',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1
  },
  codeBoxActive: {
    borderColor: '#31973D',
    borderWidth: 3,
    shadowColor: '#006B23',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3
  },
  codeBoxFilled: { borderColor: '#BECAB9' },
  codeBoxEmpty: { borderColor: '#BECAB9' },
  dot: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#31973D' },
  hiddenInput: { position: 'absolute', opacity: 0, height: 48, width: 1, left: 24 },
  primaryButton: { width: '100%', height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  primaryButtonFull: { width: '100%', height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  primaryButtonContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  buttonLock: { color: '#FFFFFF', fontSize: 14 },
  primaryButtonActive: { backgroundColor: '#31973D' },
  primaryButtonDisabled: { backgroundColor: '#E0E7DD' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '400', lineHeight: 20 },
  primaryButtonTextDisabled: { color: '#94A3B8' },
  bottomNavPlaceholder: { height: 88 },
  providerPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#F3F3F6', borderRadius: 999, gap: 8 },
  providerDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#006B23' },
  providerText: { fontSize: 12, fontWeight: '600', color: '#1A1C1E' }
});

export default AuthorizePaymentScreen;
