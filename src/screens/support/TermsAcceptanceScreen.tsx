import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, Pressable, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';

import type { RootStackScreenProps } from '../../navigation/types';

// Purpose: Collect agreement to terms and conditions before account completion.
export function TermsAcceptanceScreen({ route, navigation }: RootStackScreenProps<'TermsAcceptance'>) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right", "bottom"]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoid}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.headerSpace} />

          <View style={styles.content}>
            <Text style={styles.title}>Accept Zubba's Terms & Review Privacy Notice</Text>
            <Text style={styles.description}>By selecting 'I Agree' below, I have reviewed and agree to the Terms of Use and acknowledged the Privacy Notice. I am at least 18 years of age</Text>
          </View>

          <View style={styles.termsSection}>
            <View style={styles.divider} />
            <View style={styles.checkboxRow}>
              <Pressable
                style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}
                onPress={() => setAgreedToTerms(!agreedToTerms)}
              >
                {agreedToTerms && <Text style={styles.checkmark}>✓</Text>}
              </Pressable>
              <Text style={styles.agreeText}>I agree</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable style={styles.arrowButton} onPress={() => navigation.goBack()}>
            <Text style={styles.arrow}>←</Text>
          </Pressable>

          <Pressable
            disabled={!agreedToTerms}
            style={[styles.nextButton, !agreedToTerms && styles.nextButtonDisabled]}
            onPress={() => navigation.replace('LocationSharing')}
          >
            <Text style={styles.nextText}>Continue</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  keyboardAvoid: { flex: 1 },
  container: { paddingHorizontal: 22, paddingTop: 24, paddingBottom: 24 },
  headerSpace: { height: 42 },
  content: { width: '100%', gap: 12, marginBottom: 24 },
  title: { fontSize: 20, fontWeight: '400', fontFamily: 'Nexa Text-Trial', color: '#1F2A33', lineHeight: 22 },
  description: { fontSize: 11, fontWeight: '400', fontFamily: 'Nexa Text-Trial', color: '#1F2A33', lineHeight: 16 },
  termsSection: { width: '100%', marginTop: 16, gap: 17 },
  divider: { width: 358, height: 0.5, borderTopWidth: 0.5, borderTopColor: 'rgba(0,0,0,0.15)' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkbox: { width: 18, height: 18, borderWidth: 1, borderColor: 'rgba(0,0,0,0.7)', borderRadius: 4, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: '#34A853' },
  checkmark: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  agreeText: { fontSize: 10, fontWeight: '400', fontFamily: 'Nexa Text-Trial', color: '#1F2A33', lineHeight: 16 },
  footer: { paddingHorizontal: 22, paddingVertical: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  arrowButton: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  arrow: { fontSize: 24, color: '#000' },
  nextButton: { width: 96, height: 48, backgroundColor: '#34A853', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  nextButtonDisabled: { backgroundColor: 'rgba(52,168,83,0.5)' },
  nextText: { color: '#FFFFFF', fontSize: 14 }
});
