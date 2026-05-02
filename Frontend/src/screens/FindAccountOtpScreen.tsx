import { useState } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../navigation/types';

export function FindAccountOtpScreen({ route, navigation }: RootStackScreenProps<'FindAccountOtp'>) {
  const phone = route.params?.phone || '';
  const [codeDigits, setCodeDigits] = useState<string[]>(['', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [showResendModal, setShowResendModal] = useState(false);

  const isCodeComplete = codeDigits.every(digit => digit !== '');

  const handleDigitChange = (index: number, value: string) => {
    // Only allow single digit
    const digit = value.replace(/[^0-9]/g, '').slice(-1);
    const newDigits = [...codeDigits];
    newDigits[index] = digit;
    setCodeDigits(newDigits);

    // Auto focus next input if digit entered
    if (digit && index < 3) {
      setFocusedIndex(index + 1);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={styles.title}>Enter the 4-digits code sent via SMS at {phone}</Text>

          <View style={styles.codeInputWrapper}>
            <View style={styles.codeRow}>
              {codeDigits.map((digit, index) => (
                <Pressable 
                  key={index}
                  onPress={() => setFocusedIndex(index)}
                  style={[
                    styles.codeBox,
                    !!(focusedIndex === index || digit) && styles.codeBoxActive
                  ]}
                >
                  <TextInput
                    style={styles.codeInput}
                    maxLength={1}
                    keyboardType="number-pad"
                    value={digit}
                    onChangeText={(value) => handleDigitChange(index, value)}
                    onFocus={() => setFocusedIndex(index)}
                    onBlur={() => {}}
                  />
                </Pressable>
              ))}
            </View>
          </View>

          <Pressable style={styles.changeNumberButton}>
            <Text style={styles.changeNumberText}>changed my mobile number?</Text>
          </Pressable>

          <Pressable 
            style={[styles.submitButton, !isCodeComplete && styles.submitButtonDisabled]}
            disabled={!isCodeComplete}
            onPress={() => {
              if (!isCodeComplete) return;
              navigation.replace('ExistingUserNotification', { phone });
            }}
          >
            <Text style={styles.submitButtonText}>Verify</Text>
          </Pressable>

          <Pressable style={styles.resendButton} onPress={() => setShowResendModal(true)}>
            <Text style={styles.resendButtonText}>Resend code</Text>
          </Pressable>

          <Pressable style={styles.whatsappButton}>
            <Text style={styles.whatsappButtonText}>Resend code via WhatsApp</Text>
          </Pressable>

          <Modal visible={showResendModal} transparent animationType="fade" onRequestClose={() => setShowResendModal(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalCard}>
                <View style={styles.modalInner}>
                  <Text style={styles.modalTitle}>Resend code to: {phone}</Text>

                  <View style={styles.modalButtons}>
                    <Pressable style={styles.modalPrimaryButton}>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  scrollContent: {
    flexGrow: 1
  },
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 40,
    paddingBottom: 24,
  },
  title: {
    fontSize: 18,
    lineHeight: 25,
    fontWeight: '700',
    color: '#1F2A33',
    letterSpacing: 0.15,
    marginBottom: 32,
  },
  codeInputWrapper: {
    marginBottom: 24,
  },
  codeRow: {
    flexDirection: 'row',
    gap: 12
  },
  codeBox: {
    width: 39,
    height: 34,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: 'rgba(184, 184, 184, 0.2)',
    alignItems: 'center',
  },
  codeBoxActive: {
    borderColor: '#F47309',
    borderWidth: 1.5,
    backgroundColor: '#FFFFFF'
  },
  codeInput: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '500',
    color: '#1F2A33'
  },
  changeNumberButton: {
    marginBottom: 24,
  },
  changeNumberText: {
    fontSize: 13,
    lineHeight: 25,
    fontWeight: '500',
    color: '#1F2A33',
    textDecorationLine: 'underline',
    letterSpacing: 0.1
  },
  submitButton: {
    width: 358,
    height: 48,
    backgroundColor: '#34A853',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  submitButtonDisabled: {
    backgroundColor: 'rgba(52, 168, 83, 0.5)'
  },
  submitButtonText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    color: '#FFFFFF'
  },
  resendButton: {
    width: 99,
    height: 32,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center'
  },
  resendButtonText: {
    fontSize: 12,
    lineHeight: 20,
    fontWeight: '500',
    color: '#1F2A33'
  },
  whatsappButton: {
    width: 178,
    height: 32,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8
  },
  whatsappButtonText: {
    fontSize: 12,
    lineHeight: 20,
    fontWeight: '500',
    color: '#1F2A33'
  },
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
  modalInner: {
    width: '100%',
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 28,
    textAlign: 'center',
    color: '#000000',
    marginBottom: 12
  },
  modalButtons: {
    width: '100%',
    marginTop: 12
  },
  modalPrimaryButton: {
    height: 48,
    backgroundColor: '#31973D',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalPrimaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20
  },
  modalSecondaryButton: {
    height: 48,
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalSecondaryText: {
    color: '#1F2A33',
    fontSize: 14,
    lineHeight: 20
  }
});
