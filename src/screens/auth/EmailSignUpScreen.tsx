import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../../navigation/types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const googleIcon = require('../../../assets/Google icon.png');

export function EmailSignUpScreen({ navigation }: RootStackScreenProps<'EmailSignUp'>) {
  const [email, setEmail] = useState('');
  const isEmailValid = useMemo(() => EMAIL_REGEX.test(email.trim()), [email]);
  const existingEmail = 'zak@gmail.com';
  const isExistingEmail = email.trim().toLowerCase() === existingEmail;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoid}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
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
              style={[styles.continueButton, !isEmailValid && styles.continueButtonDisabled]}
              disabled={!isEmailValid}
              onPress={() => navigation.navigate('Verify', { email: email.trim(), userExists: isExistingEmail })}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </Pressable>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <Pressable style={styles.providerButton} onPress={() => {}}>
              <Image source={googleIcon} style={styles.googleIcon} resizeMode="contain" />
              <Text style={styles.providerButtonText}>Continue with Google</Text>
            </Pressable>

            <Pressable style={styles.providerButton} onPress={() => {}}>
              <Text style={styles.providerButtonText}>Continue with Apple</Text>
            </Pressable>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <Pressable style={styles.findAccountButton} onPress={() => navigation.navigate('FindAccount', { itemId: 'find-account', title: 'Find my account' })}>
              <Text style={styles.findAccountText}>Find my account</Text>
            </Pressable>

            <Text style={styles.disclaimer}>
              By continuing, you agree to calls including autodialer, WhatsApp or texts from Zubba and its affiliates.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  keyboardAvoid: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1
  },
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 66,
    paddingBottom: 24
  },
  title: {
    fontSize: 15,
    lineHeight: 22,
    color: '#1F2A33',
    fontWeight: '400',
    marginBottom: 12,
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
  continueButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#34A853',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  continueButtonDisabled: {
    backgroundColor: 'rgba(52, 168, 83, 0.5)'
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8EEF3'
  },
  dividerText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#656F77'
  },
  providerButton: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 12
  },
  googleIcon: {
    width: 18,
    height: 18,
    marginRight: 8
  },
  providerButtonText: {
    color: '#1F2A33',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500'
  },
  findAccountButton: {
    alignSelf: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  findAccountText: {
    color: '#1F2A33',
    fontSize: 12,
    lineHeight: 16
  },
  disclaimer: {
    marginTop: 'auto',
    color: '#707579',
    fontSize: 11,
    lineHeight: 16
  }
});
