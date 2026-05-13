import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../navigation/types';
import { AppBottomNav } from '../components';

export function PaymentVerificationScreen({ navigation }: RootStackScreenProps<'PaymentVerification'>) {
  const [code, setCode] = React.useState('');
  const [resendTimer, setResendTimer] = React.useState(0);
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
          {/* Verification Header */}
          <Text style={styles.heading}>Verification Code</Text>

          <Text style={styles.description}>
            We've sent a 4-digit code to +233 55 123 4567. Please enter it below to authorize your GHS 45.00 payment.
          </Text>

          {/* Code Input Boxes */}
          <View style={styles.codeContainerWrapper}>
            <View style={styles.codeContainer}>
              {codeDigits.map((digit, index) => (
                <Pressable key={index} onPress={() => inputRef.current?.focus()}>
                  <View
                    style={[
                      styles.codeBox,
                      index < code.length ? styles.codeBoxFilled : styles.codeBoxEmpty,
                      index === code.length ? styles.codeBoxActive : null,
                      index === 1 && code.length === 1 ? styles.codeBoxActive : null,
                    ]}
                  >
                    {index < code.length && <Text style={styles.codeText}>●</Text>}
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Hidden input for code entry */}
          <TextInput
            ref={inputRef}
            style={styles.hiddenInput}
            value={code}
            onChangeText={(text) => {
              if (text.length <= 4 && /^\d*$/.test(text)) {
                setCode(text);
              }
            }}
            keyboardType="numeric"
            maxLength={4}
            autoFocus
          />

          {/* Resend Section: caption above a pill-shaped button, left-aligned under code boxes */}
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
              <Text style={[styles.resendPillText, resendTimer > 0 && styles.resendPillTextDisabled]}>Resend</Text>
            </Pressable>
          </View>

          {/* Verify Button */}
          <Pressable
            style={[styles.verifyButtonFull, code.length === 4 && styles.verifyButtonActive]}
            onPress={() => code.length === 4 && navigation.navigate('AuthorizePayment')}
            disabled={code.length !== 4}
          >
            <Text style={[styles.verifyButtonTextFull, code.length === 4 && styles.verifyButtonTextActive]}>Verify</Text>
          </Pressable>
        </ScrollView>

        <AppBottomNav
          activeTab="home"
          onHomePress={() => navigation.navigate('LocationSharing')}
          onSavedPress={() => navigation.navigate('Details', { itemId: 'save', title: 'Saved' })}
          onAccountPress={() => navigation.navigate('Details', { itemId: 'account', title: 'Account' })}
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
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 28, color: '#1F2A33', lineHeight: 28, marginTop: -2 },
  title: { fontSize: 16, fontWeight: '400', color: '#1F2A33' },
  headerSpacer: { width: 24, height: 24 },
  main: { flex: 1 },
  mainContent: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 100, gap: 24 },

  /* Verification Content */
  heading: { fontSize: 24, fontWeight: '600', color: '#1F2A33', lineHeight: 31, marginBottom: 16 },
  description: {
    fontSize: 16,
    lineHeight: 26,
    color: '#3F4A3D',
    fontWeight: '400',
    marginBottom: 24,
  },

  /* Code Input */
  codeContainer: { flexDirection: 'row', gap: 15, marginBottom: 32 },
  codeContainerWrapper: { width: 253, alignItems: 'center', marginBottom: 24 },
  codeBox: {
    width: 52,
    height: 64,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  codeBoxEmpty: { borderColor: '#BECAB9' },
  codeBoxFilled: { borderColor: '#31973D', backgroundColor: '#FFFFFF' },
  codeBoxActive: { borderColor: '#31973D', backgroundColor: '#FFFFFF', shadowColor: '#006B23', shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  codeText: { fontSize: 24, color: '#31973D', fontWeight: '600' },

  /* Hidden Input */
  hiddenInput: { position: 'absolute', opacity: 0, height: 48, width: 1, left: 16 },

  /* Resend Section */
  // Place the resend text directly under the code boxes and left-align it.
  // Code boxes total width = 4 * 52 + 3 * 15 = 253
  resendSection: {width: 253, alignItems: 'flex-start', marginBottom: 24 },
  resendCaption: { fontSize: 14, color: '#64748A', marginBottom: 8 },
  resendPill: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E6EEF0',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  resendPillDisabled: { opacity: 0.6 },
  resendPillText: { fontSize: 14, color: '#111827', fontWeight: '500' },
  resendPillTextDisabled: { color: '#94A3B8' },
  resendCountdown: { fontSize: 14, color: '#64748A', fontWeight: '400' },

  /* Verify Button */
  verifyButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E0E7DD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyButtonActive: { backgroundColor: '#31973D' },
  verifyButtonText: { color: '#94A3B8', fontSize: 14, fontWeight: '400', lineHeight: 20 },
  verifyButtonTextActive: { color: '#FFFFFF' },
  /* Full width variant */
  verifyButtonFull: {
    height: 56,
    borderRadius: 12,
    backgroundColor: '#E0E7DD',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 8,
  },
  verifyButtonTextFull: { color: '#94A3B8', fontSize: 16, fontWeight: '400', lineHeight: 22 },

});

export default PaymentVerificationScreen;
