import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TextInput, Pressable, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';

import type { RootStackScreenProps } from '../navigation/types';

// Purpose: Collect basic identity details as part of KYC flow.
export function KycCollectionScreen({ route, navigation }: RootStackScreenProps<'KycCollection'>) {
  const contact = route.params?.phone ?? route.params?.email ?? '';
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const isValid = firstName.trim().length > 0 && lastName.trim().length > 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right", "bottom"]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoid}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.headerSpace} />

          <View style={styles.frameTop}>
            <Text style={styles.title}>What’s your name?</Text>
            <Text style={styles.subtitle}>Let us know how to properly address you</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputField}>
              <TextInput
                style={styles.input}
                placeholder="Please enter first name"
                value={firstName}
                onChangeText={setFirstName}
                placeholderTextColor="#BDBDBD"
                autoCapitalize="words"
              />
            </View>

            <View style={[styles.inputField, { marginTop: 16 }]}>
              <TextInput
                style={styles.input}
                placeholder="Please enter last name"
                value={lastName}
                onChangeText={setLastName}
                placeholderTextColor="#BDBDBD"
                autoCapitalize="words"
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable style={styles.arrowButton} onPress={() => navigation.goBack()}>
            <Text style={styles.arrow}>←</Text>
          </Pressable>

          <Pressable disabled={!isValid} style={[styles.nextButton, !isValid && styles.nextButtonDisabled]} onPress={() => navigation.navigate('TermsAcceptance', { firstName, lastName })}>
            <Text style={styles.nextText}>Continue</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  keyboardAvoid: { flex: 1, flexDirection: 'column' },
  container: { paddingHorizontal: 22, paddingTop: 24, paddingBottom: 24 },
  headerSpace: { height: 6 },
  frameTop: { width: '100%', gap: 12 },
  title: { fontSize: 20, fontWeight: '700', color: '#1F2A33' },
  subtitle: { fontSize: 13, color: '#1F2A33', marginTop: 4 },
  form: { marginTop: 24 },
  inputField: {
    width: 358,
    height: 56,
    minHeight: 56,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: 'rgba(0,0,0,0.04)',
    borderRadius: 18,
    paddingHorizontal: 20,
    justifyContent: 'center'
  },
  inputLabel: { fontFamily: 'Roboto', fontSize: 13, lineHeight: 24, color: '#707579', marginBottom: 0 },
  input: { fontSize: 15, color: '#707579', lineHeight: 24 },
  footer: { paddingHorizontal: 22, paddingVertical: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  arrowButton: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  arrow: { fontSize: 24, color: '#000' },
  backButton: { width: 96, height: 48, backgroundColor: 'rgba(52,168,83,0.5)', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  backText: { color: '#FFFFFF', fontSize: 14 },
  nextButton: { width: 96, height: 48, backgroundColor: '#34A853', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  nextButtonDisabled: { backgroundColor: 'rgba(52,168,83,0.5)' },
  nextText: { color: '#FFFFFF', fontSize: 14 },
  nextArrow: { color: '#FFFFFF', fontSize: 14, fontWeight: '500' }
});
