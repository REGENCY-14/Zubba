import { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import type { RootStackScreenProps } from '../navigation/types';

export function NewUserOnboardingScreen({ route, navigation }: RootStackScreenProps<'NewUserOnboarding'>) {
  const existingPhone = route.params?.phone;
  const existingEmail = route.params?.email;
  const shouldCollectPhone = Boolean(existingEmail && !existingPhone);
  const [contactInput, setContactInput] = useState('');
  const contactCandidate = contactInput.trim();
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactCandidate);
  const phoneDigits = contactCandidate.replace(/\D/g, '');
  const isPhoneValid = phoneDigits.length >= 6;
  const isValid = shouldCollectPhone ? isPhoneValid : isEmailValid;

  const nextParams = useMemo(() => {
    if (shouldCollectPhone) {
      return {
        email: existingEmail,
        phone: contactCandidate
      };
    }

    return {
      phone: existingPhone,
      email: contactCandidate
    };
  }, [shouldCollectPhone, existingEmail, existingPhone, contactCandidate]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoid}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.container}>

            <View style={styles.topFrame}>
              <Text style={styles.title}>{shouldCollectPhone ? 'What\'s your phone number' : 'What\'s your email address'}</Text>
              <Text style={styles.tip}>
                {shouldCollectPhone
                  ? 'Tip: This helps secure your account and makes sign-in easier.'
                  : 'Tip: This helps us find your account if you change your phone or lose your number.'}
              </Text>

              <View style={styles.inputField}>
                <TextInput
                  style={styles.input}
                  placeholder={shouldCollectPhone ? 'Enter your phone number' : 'Enter your email'}
                  placeholderTextColor="#707579"
                  keyboardType={shouldCollectPhone ? 'phone-pad' : 'email-address'}
                  autoCapitalize={shouldCollectPhone ? 'none' : 'none'}
                  autoCorrect={false}
                  value={contactInput}
                  onChangeText={setContactInput}
                />
              </View>

            {/* buttons moved to footer for consistent placement */}
            </View>
          </View>

          <View style={styles.footer}>
            <Pressable style={styles.arrowButton} onPress={() => navigation.goBack()}>
              <Text style={styles.arrow}>←</Text>
            </Pressable>

            <Pressable
              style={[styles.nextButton, !isValid && styles.nextButtonDisabled]}
              disabled={!isValid}
              onPress={() => navigation.navigate('KycCollection', nextParams)}
            >
              <Text style={styles.nextText}>Continue</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  keyboardAvoid: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  container: { flex: 1, paddingHorizontal: 22, paddingTop: 24, paddingBottom: 24 },
  header: { height: 42, borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.15)' },
  topFrame: { marginTop: 24, width: '100%', alignItems: 'flex-start', gap: 12 },
  title: { fontSize: 20, lineHeight: 22, fontWeight: '700', color: '#1F2A33' },
  tip: { fontSize: 11, lineHeight: 25, color: '#1F2A33', textDecorationLine: 'underline', marginTop: 8, marginBottom: 12 },
  inputField: { width: '100%', height: 48, backgroundColor: '#FFFFFF', borderWidth: 1.8, borderColor: 'rgba(0,0,0,0.05)', borderRadius: 12, justifyContent: 'center', paddingHorizontal: 16 },
  input: { fontSize: 13, color: '#1F2A33', lineHeight: 24 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 },
  backButton: { width: 96, height: 48, backgroundColor: 'rgba(52,168,83,0.5)', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  backText: { color: '#FFFFFF', fontSize: 14 },
  nextButton: { width: 96, height: 48, backgroundColor: '#34A853', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  nextButtonDisabled: { backgroundColor: 'rgba(52,168,83,0.5)' },
  nextText: { color: '#FFFFFF', fontSize: 14 },
  footer: {
    position: 'absolute',
    left: 22,
    right: 22,
    bottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  arrowButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  arrow: {
    fontSize: 24,
    color: '#000'
  }
});
