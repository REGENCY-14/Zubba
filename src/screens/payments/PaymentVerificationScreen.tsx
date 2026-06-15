import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../../navigation/types';
import { AppBottomNav } from '../../components';

export function PaymentVerificationScreen({ navigation }: RootStackScreenProps<'PaymentVerification'>) {
  const [code, setCode] = React.useState('');
  const [resendTimer, setResendTimer] = React.useState(60);
  const inputRef = React.useRef<TextInput | null>(null);

  React.useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleResend = () => {
    setCode('');
    setResendTimer(60);
  };

  const codeDigits = ['', '', '', ''];
  for (let i = 0; i < code.length && i < 4; i++) {
    codeDigits[i] = code[i];
  }

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
          <Text style={styles.heading}>Verification Code</Text>

          <Text style={styles.description}>
            {"We've sent a 4-digit code to "}
            <Text style={styles.phoneText}>+233 55 123 4567</Text>
            {'. Please enter it below to authorize your '}
            <Text style={styles.amountText}>GHS 45.00</Text>
            {' payment.'}
          </Text>

          <View style={styles.codeContainer}>
            {codeDigits.map((_, index) => {
              const isFilled = index < code.length;
              const isActive = index === code.length && code.length < 4;
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
            style={styles.hiddenInput}
            value={code}
            onChangeText={(text) => {
              if (text.length <= 4 && /^\d*$/.test(text)) setCode(text);
            }}
            keyboardType="numeric"
            maxLength={4}
            autoFocus
          />

          <View style={styles.resendSection}>
            <Text style={styles.resendCaption}>
              {resendTimer > 0
                ? `Resend code by SMS (${Math.floor(resendTimer / 60)}:${String(resendTimer % 60).padStart(2, '0')})`
                : 'Resend code by SMS'}
            </Text>

            <Pressable
              style={[styles.resendPill, resendTimer > 0 && styles.resendPillDisabled]}
              onPress={handleResend}
              disabled={resendTimer > 0}
            >
              <Text style={[styles.resendPillText, resendTimer > 0 && styles.resendPillTextDisabled]}>
                Resend
              </Text>
            </Pressable>
          </View>

          <Pressable
            style={styles.verifyButton}
            onPress={() => code.length === 4 && navigation.navigate('AuthorizePayment')}
          >
            <Text style={styles.verifyButtonText}>Verify</Text>
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
  mainContent: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 100 },

  heading: { fontSize: 24, fontWeight: '500', color: '#1F2A33', lineHeight: 31, marginBottom: 16 },
  description: { fontSize: 16, lineHeight: 26, color: '#64748A', fontWeight: '400', marginBottom: 32 },
  phoneText: { color: '#64748A' },
  amountText: { color: '#31973D' },

  codeContainer: { flexDirection: 'row', gap: 15, marginBottom: 24, alignItems: 'center' },
  codeBox: {
    width: 52,
    height: 64,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  codeBoxEmpty: {
    borderColor: '#BECAB9',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  codeBoxFilled: {
    borderColor: '#BECAB9',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
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

  resendSection: { alignItems: 'flex-start', marginBottom: 32, gap: 8 },
  resendCaption: { fontSize: 11, color: '#1F2A33', fontWeight: '500', lineHeight: 16 },
  resendPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  resendPillDisabled: { opacity: 0.6 },
  resendPillText: { fontSize: 12, color: '#1F2A33', fontWeight: '500', lineHeight: 20 },
  resendPillTextDisabled: { color: '#9CA3AF' },

  verifyButton: {
    height: 48,
    borderRadius: 999,
    backgroundColor: '#31973D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '400', lineHeight: 20 },
});

export default PaymentVerificationScreen;
