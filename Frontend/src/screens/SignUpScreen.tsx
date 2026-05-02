import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../navigation/types';

const googleIcon = require('../../assets/Google icon.png');
const ghanaFlag = require('../../assets/ghana-flag.png');

export function SignUpScreen({ navigation }: RootStackScreenProps<'SignUp'>) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  const canContinue = digitsOnly.length >= 6;
  const existingTail = '1234567890';
  const isExisting = digitsOnly === existingTail || digitsOnly.endsWith(existingTail);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoid}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View style={styles.content}>
              <Text style={styles.title}>What's your phone number</Text>

              <View style={styles.inputWrapper}>
                <View style={styles.countryCodePicker}>
                  <Image source={ghanaFlag} style={styles.flagIcon} resizeMode="contain" />
                  <Text style={styles.chevron}>›</Text>
                </View>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="phone number"
                  placeholderTextColor="#A8A8A8"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
              </View>
              {!canContinue && phoneNumber.length > 0 ? (
                <Text style={styles.phoneError}>Enter a valid phone number</Text>
              ) : null}

              <Pressable
                style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
                onPress={() => navigation.navigate('Verify', { phone: phoneNumber, userExists: isExisting })}
                disabled={!canContinue}
              >
                <Text style={styles.continueButtonText}>Continue</Text>
              </Pressable>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <Pressable style={styles.googleButton} onPress={() => {}}>
                <Image source={googleIcon} style={styles.googleIcon} resizeMode="contain" />
                <Text style={styles.googleButtonText}>Continue with Google</Text>
              </Pressable>

              <Pressable style={styles.emailButton} onPress={() => navigation.navigate('EmailSignUp')}>
                <Text style={styles.emailIcon}>✉</Text>
                <Text style={styles.emailButtonText}>Continue with Email</Text>
              </Pressable>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <Pressable onPress={() => navigation.navigate('FindAccount', { itemId: 'find-account', title: 'Find my account' })}>
                <Text style={styles.findAccountText}>Find my account</Text>
              </Pressable>
            </View>

            <Text style={styles.disclaimer}>
              By continuing, you agree to calls including autodialler, WhatsApp or texts from Zubba and its affiliates.
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
    paddingBottom: 24,
    justifyContent: 'flex-start'
  },
  content: {
    flex: 1,
    marginBottom: 22
  },
  title: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
    color: '#1F2A33',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 8
  },
  countryCodePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 94,
    height: 48,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F2F2F2',
    borderRadius: 12,
    overflow: 'hidden'
  },
  flagIcon: {
    width: 28,
    height: 20
  },
  chevron: {
    fontSize: 24,
    lineHeight: 24,
    color: '#000000'
  },
  phoneInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    paddingVertical: 0,
    borderWidth: 1,
    borderColor: '#F2F2F2',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 15,
    lineHeight: 18,
    color: '#707579'
  },
  continueButton: {
    height: 48,
    backgroundColor: '#34A853',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400'
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginVertical: 16
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8EEF3'
  },
  dividerText: {
    color: '#656F77',
    fontSize: 12,
    lineHeight: 16
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    height: 48,
    backgroundColor: '#FFFFFF',
    marginBottom: 12
  },
  googleIcon: {
    width: 16,
    height: 16,
    marginRight: 8
  },
  googleButtonText: {
    color: '#262D3A',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500'
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    height: 48,
    backgroundColor: '#FFFFFF',
    marginBottom: 20
  },
  emailIcon: {
    fontSize: 18,
    marginRight: 8
  },
  emailButtonText: {
    color: '#262D3A',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500'
  },
  findAccountText: {
    alignSelf: 'stretch',
    textAlign: 'center',
    color: '#1F2A33',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    paddingHorizontal: 4,
    marginVertical: 4
  },
  disclaimer: {
    fontSize: 11,
    color: '#707579',
    lineHeight: 16,
    marginTop: 12,
    textAlign: 'left',
    alignSelf: 'stretch',
    paddingHorizontal: 4
  },
  continueButtonDisabled: {
    opacity: 0.6
  },
  phoneError: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 6,
    marginBottom: 8,
    paddingHorizontal: 4
  }
});
