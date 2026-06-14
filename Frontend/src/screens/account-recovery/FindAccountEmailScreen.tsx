import { useMemo, useState } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../../navigation/types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function FindAccountEmailScreen({ route, navigation }: RootStackScreenProps<'FindAccountEmail'>) {
  const [email, setEmail] = useState('');
  const isEmailValid = useMemo(() => EMAIL_REGEX.test(email.trim()), [email]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>What's your email address</Text>

          <View style={[styles.inputField, isEmailValid && styles.inputFieldActive]}>
            <TextInput
              style={styles.emailInput}
              placeholder="Enter your email"
              placeholderTextColor="#707579"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <Pressable
            style={styles.findButton}
            onPress={() => navigation.navigate('FindAccount')}
          >
            <Text style={styles.findButtonText}>Find account with phone number</Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
          <Pressable
            style={[styles.nextButton, isEmailValid && styles.nextButtonActive]}
            disabled={!isEmailValid}
            onPress={() => isEmailValid && navigation.navigate('FindAccountEmailOtp', { email: email.trim() })}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  container: {
    flex: 1,
    paddingHorizontal: 23,
    paddingTop: 66,
    paddingBottom: 24,
    justifyContent: 'space-between'
  },
  content: {
    gap: 16
  },
  title: {
    fontSize: 20,
    lineHeight: 22,
    fontWeight: '700',
    color: '#1F2A33',
    letterSpacing: 0.15,
    marginBottom: 8
  },
  inputField: {
    borderWidth: 1.8,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 12,
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    width: 357,
    alignSelf: 'center'
  },
  inputFieldActive: {
    borderColor: '#34A85333'
  },
  emailInput: {
    fontSize: 13,
    color: '#1F2A33',
    lineHeight: 24,
    paddingVertical: 8
  },
  findButton: {
    width: 183,
    height: 32,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center'
  },
  findButtonDisabled: {
    opacity: 0.5
  },
  findButtonText: {
    color: '#1F2A33',
    fontSize: 12,
    lineHeight: 20,
    fontWeight: '500'
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48
  },
  backArrow: {
    fontSize: 24,
    color: '#000000',
    fontWeight: '400'
  },
  nextButton: {
    width: 96,
    height: 48,
    backgroundColor: 'rgba(52, 168, 83, 0.5)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  nextButtonActive: {
    backgroundColor: '#34A853'
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400'
  }
});
