import { useState } from 'react';
import { StyleSheet, Text, View, Image, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '../components/Card';
import type { RootStackScreenProps } from '../navigation/types';

const ghanaFlag = require('../../assets/ghana-flag.png');

export function FindAccountScreen({ route, navigation }: RootStackScreenProps<'FindAccount'>) {
  const item = route.params;
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const isPhoneValid = phoneNumber.trim().length > 0;

  return (
    <SafeAreaView style={styles.findAccountSafeArea} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.findAccountContainer}>
        <View style={styles.findAccountContent}>
          <Text style={styles.findAccountTitle}>What's your phone number</Text>

          <View style={styles.findAccountInputWrapper}>
            <View style={styles.countryCodePicker}>
              <Image source={ghanaFlag} style={styles.flagIcon} resizeMode="contain" />
              <Text style={styles.chevron}>›</Text>
            </View>
            <TextInput
              style={[styles.phoneInputDisabled, (isFocused || isPhoneValid) && styles.phoneInputActive]}
              placeholder="phone number"
              placeholderTextColor="#A8A8A8"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              editable={true}
            />
          </View>

          <Pressable 
            style={styles.emailButton}
            onPress={() => navigation.navigate('FindAccountEmail')}
          >
            <Text style={styles.emailButtonText}>Find account with email</Text>
          </Pressable>
        </View>

        <View style={styles.findAccountFooter}>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
          <Pressable 
            style={[styles.nextButton, isPhoneValid && styles.nextButtonActive]}
            onPress={() => isPhoneValid && navigation.navigate('FindAccountOtp', { phone: phoneNumber })}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  findAccountSafeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  findAccountContainer: {
    flex: 1,
    paddingHorizontal: 23,
    paddingTop: 40,
    paddingBottom: 24,
    justifyContent: 'space-between'
  },
  findAccountContent: {
    gap: 16
  },
  findAccountTitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#1F2A33',
    fontWeight: '400',
    marginBottom: 8
  },
  findAccountInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 48
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
    borderRadius: 12
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
  phoneInputDisabled: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    paddingVertical: 0,
    borderWidth: 1.8,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 15,
    lineHeight: 18,
    color: '#707579',
    opacity: 0.5
  },
  phoneInputActive: {
    borderColor: '#000000',
    opacity: 1,
    color: '#1F2A33'
  },
  emailButton: {
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
  emailButtonText: {
    color: '#1F2A33',
    fontSize: 12,
    lineHeight: 20,
    fontWeight: '500'
  },
  findAccountFooter: {
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
