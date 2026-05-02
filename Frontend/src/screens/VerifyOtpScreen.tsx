import { useMemo, useState, useRef, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../navigation/types';

export function VerifyOtpScreen({ route, navigation }: RootStackScreenProps<'Verify'>) {
  const phone = route.params?.phone ?? '';
  const email = route.params?.email ?? '';
  const contact = email || phone;
  const deliveryLabel = email ? 'email' : 'SMS';
  const [codeDigits, setCodeDigits] = useState<string[]>(['', '', '', '']);

  const inputRefs = [useRef<TextInput | null>(null), useRef<TextInput | null>(null), useRef<TextInput | null>(null), useRef<TextInput | null>(null)];

  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  const isValid = useMemo(() => codeDigits.every(digit => digit.length === 1), [codeDigits]);
  const [showResendModal, setShowResendModal] = useState(false);
  const userExists = route.params?.userExists ?? false;
  const knownExistingContacts = ['+233241122310'];
  const contactValue = contact;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoid}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {email ? (
            <View style={styles.emailIntroWrap}>
              <Text style={styles.emailTitle}>Enter the 4-digits code sent to you at:</Text>
              <Text style={styles.contactText}>{contact}</Text>
            </View>
          ) : (
            <View style={styles.introWrap}>
              <Text style={styles.title}>Enter the 4-digits code sent via {deliveryLabel} at {contact}</Text>
              <Pressable style={styles.changeContactButton} onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.changeContactText}>changed my mobile number?</Text>
              </Pressable>
            </View>
          )}

          <View style={styles.codeRow}>
            {[0, 1, 2, 3].map(i => (
              <TextInput
                key={i}
                ref={inputRefs[i]}
                style={[styles.codeBox, i === 0 && codeDigits[0] === '' ? styles.codeBoxActive : null]}
                value={codeDigits[i]}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
                onChangeText={ch => {
                  if (!/^[0-9]$/.test(ch)) return;
                  const digits = [...codeDigits];
                  digits[i] = ch;
                  setCodeDigits(digits);
                  if (i < 3) {
                    inputRefs[i + 1].current?.focus();
                  }
                }}
                onKeyPress={e => {
                  if (e.nativeEvent.key === 'Backspace') {
                    if (codeDigits[i] === '') {
                      if (i > 0) inputRefs[i - 1].current?.focus();
                      if (i > 0) {
                        const digits = [...codeDigits];
                        digits[i - 1] = '';
                        setCodeDigits(digits);
                      }
                    } else {
                      const digits = [...codeDigits];
                      digits[i] = '';
                      setCodeDigits(digits);
                    }
                  }
                }}
              />
            ))}
          </View>

          <Text style={styles.tipText}>Tip: Be sure to check your inbox and spam folders</Text>

          <Pressable
            style={[styles.verifyButton, !isValid && styles.verifyButtonDisabled]}
            disabled={!isValid}
            onPress={() => {
              if (!isValid) return;
              const exists = userExists || knownExistingContacts.includes(contactValue);
              if (exists) {
                if (email) {
                  navigation.replace('ExistingUserNotification', { email: contactValue });
                } else {
                  navigation.replace('ExistingUserNotification', { phone: contactValue });
                }
              } else {
                // user doesn't exist -> show Inactive flow to collect additional info
                if (email) {
                  navigation.replace('NewUserOnboarding', { email: contactValue });
                } else {
                  navigation.replace('NewUserOnboarding', { phone: contactValue });
                }
              }
            }}
          >
            <Text style={styles.verifyButtonText}>Verify</Text>
          </Pressable>

          <Text style={styles.smallText}>Resend code by {deliveryLabel} (1:00)</Text>

          <View style={styles.actionsWrap}>
            <Pressable style={styles.pillButton} onPress={() => setShowResendModal(true)}>
              <Text style={styles.pillButtonText}>Resend</Text>
            </Pressable>

            <Pressable style={styles.pillButton} onPress={() => {}}>
              <Text style={styles.pillButtonText}>{email ? 'Send code to another email' : 'Send code via WhatsApp'}</Text>
            </Pressable>
          </View>

          <Modal visible={showResendModal} transparent animationType="fade" onRequestClose={() => setShowResendModal(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalCard}>
                <View style={styles.modalInner}>
                  <Text style={styles.modalTitle}>Resend code to: {contact}</Text>

                  <View style={styles.modalButtons}>
                    <Pressable
                      style={styles.modalPrimaryButton}
                      onPress={() => {
                        // placeholder resend action
                        setShowResendModal(false);
                        setCodeDigits(['', '', '', '']);
                        inputRefs[0].current?.focus();
                      }}
                    >
                      <Text style={styles.modalPrimaryText}>Resend</Text>
                    </Pressable>

                    <Pressable style={styles.modalSecondaryButton} onPress={() => setShowResendModal(false)}>
                      <Text style={styles.modalSecondaryText}>Cancel</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  keyboardAvoid: { flex: 1 },
  container: { paddingHorizontal: 22, paddingTop: 66, paddingBottom: 24, gap: 18 },
  introWrap: { gap: 4 },
  emailIntroWrap: { gap: 8, marginBottom: 8 },
  emailTitle: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 25,
    letterSpacing: 0.15,
    color: '#1F2A33'
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 25,
    letterSpacing: 0.15,
    color: '#1F2A33'
  },
  contactText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1F2A33'
  },
  changeContactButton: { alignSelf: 'flex-start' },
  changeContactText: {
    fontSize: 13,
    lineHeight: 25,
    letterSpacing: 0.1,
    textDecorationLine: 'underline',
    color: '#1F2A33'
  },
  codeRow: { flexDirection: 'row', gap: 12, marginTop: 18 },
  codeBox: {
    width: 39,
    height: 34,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(184, 184, 184, 0.2)',
    backgroundColor: 'rgba(184, 184, 184, 0.2)',
    fontSize: 20,
    color: '#1F2A33',
    fontWeight: '500',
    lineHeight: 25,
    paddingVertical: 0
  },
  codeBoxActive: { borderColor: '#F47309', backgroundColor: '#FFFFFF' },
  tipText: {
    fontSize: 11,
    lineHeight: 25,
    letterSpacing: 0.1,
    textDecorationLine: 'underline',
    color: '#1F2A33'
  },
  verifyButton: {
    height: 48,
    backgroundColor: '#34A853',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  verifyButtonDisabled: { backgroundColor: 'rgba(52, 168, 83, 0.5)' },
  verifyButtonText: { color: '#FFFFFF', fontSize: 14, lineHeight: 20 },
  smallText: { color: '#1F2A33', fontSize: 11, lineHeight: 16 },
  actionsWrap: { gap: 8, alignItems: 'flex-start' },
  pillButton: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 22,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF'
  },
  pillButtonText: { color: '#1F2A33', fontSize: 12, lineHeight: 20, fontWeight: '500' }
,
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(31, 42, 51, 0.3)',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  modalCard: {
    width: 382,
    maxWidth: '94%',
    backgroundColor: '#FFFFFF',
    borderRadius: 23,
    padding: 24,
    marginBottom: 47,
    alignItems: 'center'
  },
  modalInner: { width: '100%', alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: '500', lineHeight: 28, textAlign: 'center', color: '#000000', marginBottom: 12 },
  modalButtons: { width: '100%', marginTop: 12 },
  modalPrimaryButton: { height: 48, backgroundColor: '#31973D', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  modalPrimaryText: { color: '#FFFFFF', fontSize: 14, lineHeight: 20 },
  modalSecondaryButton: { height: 48, marginTop: 12, backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  modalSecondaryText: { color: '#1F2A33', fontSize: 14, lineHeight: 20 },
});
