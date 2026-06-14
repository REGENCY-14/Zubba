import { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput, ScrollView, Modal, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../../navigation/types';

export function FindAccountEmailOtpScreen({ route, navigation }: RootStackScreenProps<'FindAccountEmailOtp'>) {
  const email = route.params?.email || '';
  const [codeDigits, setCodeDigits] = useState<string[]>(['', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [showResendModal, setShowResendModal] = useState(false);

  const isCodeComplete = codeDigits.every(digit => digit !== '');

  const handleDigitChange = (index: number, value: string) => {
    // Only allow single digit
    const digit = value.replace(/[^0-9]/g, '').slice(-1);
    const newDigits = [...codeDigits];
    newDigits[index] = digit;
    setCodeDigits(newDigits);

    // Auto focus next input if digit entered
    if (digit) {
      if (index < 3) {
        const next = index + 1;
        setFocusedIndex(next);
        inputRefs.current[next]?.focus();
      } else {
        // last digit entered - blur keyboard
        inputRefs.current[index]?.blur();
      }
    }
  };

  const handleKeyPress = (index: number, e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === 'Backspace') {
      // if current box is empty, move focus to previous
      if (codeDigits[index] === '' && index > 0) {
        const prev = index - 1;
        const newDigits = [...codeDigits];
        newDigits[prev] = '';
        setCodeDigits(newDigits);
        setFocusedIndex(prev);
        inputRefs.current[prev]?.focus();
      }
    }
  };

  useEffect(() => {
    // ensure the focused input receives focus
    inputRefs.current[focusedIndex]?.focus();
  }, [focusedIndex]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={styles.title}>Enter the 4-digits code sent to you at: {email}</Text>

          <View style={styles.codeInputWrapper}>
            <View style={styles.codeRow}>
              {codeDigits.map((digit, index) => (
                <Pressable
                  key={index}
                  onPress={() => {
                    setFocusedIndex(index);
                    inputRefs.current[index]?.focus();
                  }}
                  style={[
                    styles.codeBox,
                    !!(focusedIndex === index || digit) && styles.codeBoxActive
                  ]}
                >
                  <TextInput
                    ref={el => (inputRefs.current[index] = el)}
                    style={styles.codeInput}
                    maxLength={1}
                    keyboardType="number-pad"
                    value={digit}
                    onChangeText={(value) => handleDigitChange(index, value)}
                    onKeyPress={(e) => handleKeyPress(index, e)}
                    onFocus={() => setFocusedIndex(index)}
                    onBlur={() => {}}
                  />
                </Pressable>
              ))}
            </View>
          </View>

          <Pressable style={styles.changeEmailButton}>
            <Text style={styles.changeEmailText}>changed my email address?</Text>
          </Pressable>

          <Pressable 
            style={[styles.submitButton, !isCodeComplete && styles.submitButtonDisabled]}
            disabled={!isCodeComplete}
            onPress={() => {
              if (!isCodeComplete) return;
              navigation.replace('ExistingUserNotification', { email });
            }}
          >
            <Text style={styles.submitButtonText}>Verify</Text>
          </Pressable>

          <Pressable style={styles.resendButton} onPress={() => setShowResendModal(true)}>
            <Text style={styles.resendButtonText}>Resend code</Text>
          </Pressable>

          <Modal visible={showResendModal} transparent animationType="fade" onRequestClose={() => setShowResendModal(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalCard}>
                <View style={styles.modalInner}>
                  <Text style={styles.modalTitle}>Resend code to: {email}</Text>

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
  changeEmailButton: {
    marginBottom: 24,
  },
  changeEmailText: {
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
