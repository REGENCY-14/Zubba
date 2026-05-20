import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import type { RootStackScreenProps } from '../navigation/types';

export function UpdateDetailsOtpScreen({ route, navigation }: RootStackScreenProps<'UpdateDetailsOtp'>) {
  const contact = route.params?.phone ?? '024 11 22 310';
  const email = route.params?.email ?? 'name@example.com';
  const kind = route.params?.kind ?? 'phone';
  const step = route.params?.step ?? 'old';
  const [codeDigits, setCodeDigits] = React.useState(['', '', '', '']);
  const inputRefs = React.useRef<Array<TextInput | null>>([]);

  const isCodeComplete = codeDigits.every((digit) => digit.length === 1);

  const updateDigit = (index: number, value: string) => {
    const digit = value.replace(/[^0-9]/g, '').slice(-1);
    const nextDigits = [...codeDigits];
    nextDigits[index] = digit;
    setCodeDigits(nextDigits);
    if (digit && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-left" size={24} color="#0F1621" />
          </Pressable>
          <Text style={styles.headerTitle}>Code Verification</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.content}>
          <View style={styles.introWrap}>
            <Text style={styles.title}>
              {kind === 'email'
                ? step === 'old'
                  ? `Enter the 4-digits code sent via email at ${email}`
                  : 'Enter the verification code sent to your new email'
                : step === 'old'
                  ? `Enter the 4-digits code sent via SMS at ${contact}`
                  : 'Enter the verification code sent to your new number'}
            </Text>
          </View>

          <View style={styles.codeRow}>
            {[0, 1, 2, 3].map((index) => (
              <Pressable
                key={index}
                onPress={() => inputRefs.current[index]?.focus()}
                style={[styles.codeBox, index === 0 && codeDigits[0] === '' ? styles.codeBoxActive : null]}
              >
                <TextInput
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  style={styles.codeInput}
                  value={codeDigits[index]}
                  onChangeText={(value) => updateDigit(index, value)}
                  keyboardType="number-pad"
                  maxLength={1}
                  textAlign="center"
                />
              </Pressable>
            ))}
          </View>

          <Pressable
            style={[styles.verifyButton, !isCodeComplete && styles.verifyButtonDisabled]}
            disabled={!isCodeComplete}
            onPress={() =>
              step === 'old'
                ? navigation.navigate('UpdateDetails', {
                    kind,
                    step: 'new',
                    phone: kind === 'phone' ? contact : undefined,
                    email: kind === 'email' ? email : undefined,
                  })
                : navigation.navigate('UpdateDetailsSuccess')
            }
          >
            <Text style={styles.verifyButtonText}>Verify</Text>
          </Pressable>

          <Text style={styles.smallText}>{kind === 'email' ? 'Resend code by email (1:00)' : 'Resend code by SMS (1:00)'}</Text>

          <View style={styles.actionsWrap}>
            <Pressable style={styles.pillButton} onPress={() => {}}>
              <Text style={styles.pillButtonText}>Resend</Text>
            </Pressable>

            <Pressable style={styles.pillButton} onPress={() => {}}>
              <Text style={styles.pillButtonText}>Send code via WhatsApp</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.androidNavBar}>
          <View style={styles.androidHandle} />
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
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  backButton: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, lineHeight: 24, fontWeight: '600', color: '#1F2A33', textAlign: 'center' },
  headerSpacer: { width: 24, height: 24 },
  content: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 18,
    gap: 18,
  },
  introWrap: { gap: 4 },
  title: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 25,
    letterSpacing: 0.15,
    color: '#1F2A33',
    fontFamily: 'Nexa Text-Trial',
  },
  codeRow: { flexDirection: 'row', gap: 12, marginTop: 10 },
  codeBox: {
    width: 39,
    height: 34,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(184, 184, 184, 0.2)',
    backgroundColor: 'rgba(184, 184, 184, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeBoxActive: { borderColor: '#31973D', backgroundColor: '#FFFFFF' },
  codeInput: { width: '100%', height: '100%', fontSize: 20, fontWeight: '500', color: '#1F2A33' },
  verifyButton: {
    height: 48,
    backgroundColor: '#34A853',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  verifyButtonDisabled: { backgroundColor: 'rgba(52, 168, 83, 0.5)' },
  verifyButtonText: { color: '#FFFFFF', fontSize: 14, lineHeight: 20, fontWeight: '400' },
  smallText: { color: '#1F2A33', fontSize: 11, lineHeight: 16, fontFamily: 'Poppins' },
  actionsWrap: { gap: 8, alignItems: 'flex-start' },
  pillButton: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 22,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  pillButtonText: { color: '#1F2A33', fontSize: 12, lineHeight: 20, fontWeight: '500' },
  androidNavBar: {
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
  },
  androidHandle: {
    width: 108,
    height: 4,
    borderRadius: 12,
    backgroundColor: '#000000',
    opacity: 0.9,
  },
});

export default UpdateDetailsOtpScreen;