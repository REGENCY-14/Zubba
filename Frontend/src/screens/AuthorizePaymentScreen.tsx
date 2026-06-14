import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../navigation/types';
import { AppBottomNav } from '../components';

export function AuthorizePaymentScreen({ navigation }: RootStackScreenProps<'AuthorizePayment'>) {
  const [pin, setPin] = React.useState('');
  const inputRef = React.useRef<TextInput | null>(null);

  const digits = ['', '', '', ''];
  for (let i = 0; i < pin.length && i < 4; i++) digits[i] = pin[i];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <Text style={styles.title}>Payment Verification</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.main} contentContainerStyle={styles.mainContent}>
          {/* Enter PIN row + provider badge */}
          <View style={styles.pinHeaderRow}>
            <View style={styles.enterPinGroup}>
              <View style={styles.iconBadge}>
                <Text style={styles.iconBadgeText}>🛡</Text>
              </View>
              <Text style={styles.enterPinLabel}>Enter PIN</Text>
            </View>

            <View style={styles.providerPill}>
              <View style={styles.providerDot} />
              <Text style={styles.providerText}>MTN MoMo</Text>
            </View>
          </View>

          {/* Instruction text */}
          <Text style={styles.description}>
            {'Enter your 4-digit PIN to authorize the payment of '}
            <Text style={styles.bold}>GHS 45.00</Text>
            {' to '}
            <Text style={styles.bold}>Zubba</Text>
            {'.'}
          </Text>

          {/* PIN boxes */}
          <View style={styles.codeContainer}>
            {digits.map((_, index) => {
              const isFilled = index < pin.length;
              const isActive = index === pin.length && pin.length < 4;
              return (
                <Pressable
                  key={index}
                  onPress={() => inputRef.current?.focus()}
                  style={[
                    styles.codeBox,
                    isFilled ? styles.codeBoxFilled : styles.codeBoxEmpty,
                    isActive && styles.codeBoxActive,
                  ]}
                >
                  {isFilled && <View style={styles.codeDot} />}
                </Pressable>
              );
            })}
          </View>

          <TextInput
            ref={inputRef}
            value={pin}
            onChangeText={(text) => {
              if (text.length <= 4 && /^\d*$/.test(text)) setPin(text);
            }}
            keyboardType="numeric"
            maxLength={4}
            style={styles.hiddenInput}
            autoFocus
          />

          {/* Proceed button */}
          <Pressable
            style={styles.proceedButton}
            onPress={() => pin.length === 4 && navigation.navigate('PaymentSuccess')}
          >
            <Text style={styles.proceedButtonLock}>🔒</Text>
            <Text style={styles.proceedButtonText}>Proceed to pay</Text>
          </Pressable>
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
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    height: 48,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 28, color: '#1F2A33', lineHeight: 28, marginTop: -2 },
  title: { fontSize: 16, fontWeight: '600', color: '#1F2A33' },
  headerSpacer: { width: 24, height: 24 },
  main: { flex: 1 },
  mainContent: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 100, gap: 24 },

  pinHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  enterPinGroup: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#31973D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadgeText: { fontSize: 15, color: '#FFFFFF' },
  enterPinLabel: { fontSize: 16, fontWeight: '400', color: '#1A1C1E', lineHeight: 24 },
  providerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F3F6',
    borderRadius: 999,
    gap: 8,
  },
  providerDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#006B23' },
  providerText: { fontSize: 12, fontWeight: '600', color: '#1A1C1E', letterSpacing: 0.48 },

  description: { fontSize: 16, lineHeight: 24, color: '#64748A', fontWeight: '400' },
  bold: { fontWeight: '700', color: '#1A1C1E' },

  codeContainer: { flexDirection: 'row', gap: 15, alignItems: 'center' },
  codeBox: {
    width: 52,
    height: 64,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  codeBoxEmpty: { borderColor: '#BECAB9' },
  codeBoxFilled: { borderColor: '#BECAB9' },
  codeBoxActive: {
    width: 56,
    height: 68,
    borderColor: '#31973D',
    shadowColor: '#006B23',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },
  codeDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#31973D' },

  hiddenInput: { position: 'absolute', opacity: 0, height: 1, width: 1, top: 0, left: 0 },

  proceedButton: {
    height: 48,
    borderRadius: 999,
    backgroundColor: '#31973D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  proceedButtonLock: { fontSize: 14, color: '#FFFFFF' },
  proceedButtonText: { fontSize: 14, fontWeight: '400', color: '#FFFFFF', lineHeight: 20 },
});

export default AuthorizePaymentScreen;
