import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AppBottomNav } from '../components';
import type { RootStackScreenProps } from '../navigation/types';

const ghanaFlag = require('../../assets/ghana-flag.png');

export function UpdateDetailsScreen({ route, navigation }: RootStackScreenProps<'UpdateDetails'>) {
  const selectedKind = route.params?.kind ?? 'phone';
  const isNewNumberStep = route.params?.step === 'new';
  const [phoneNumber, setPhoneNumber] = React.useState(isNewNumberStep ? '' : route.params?.phone ?? '233 24 11 22 310');
  const [emailAddress, setEmailAddress] = React.useState(isNewNumberStep ? '' : route.params?.email ?? 'name@example.com');
  const [selectedTab, setSelectedTab] = React.useState<'number' | 'email'>(selectedKind === 'email' ? 'email' : 'number');

  React.useEffect(() => {
    setSelectedTab(selectedKind === 'email' ? 'email' : 'number');
    setPhoneNumber(isNewNumberStep ? '' : route.params?.phone ?? '233 24 11 22 310');
    setEmailAddress(isNewNumberStep ? '' : route.params?.email ?? 'name@example.com');
  }, [isNewNumberStep, route.params?.email, route.params?.phone, selectedKind]);

  const isEmailMode = selectedTab === 'email';
  const isNewContactStep = route.params?.step === 'new';

  const contactLabel = isEmailMode
    ? isNewContactStep
      ? "What's your new email address"
      : "What's your old email address"
    : isNewContactStep
      ? "What’s your new phone number"
      : "What’s your old phone number";

  const contactPlaceholder = isEmailMode
    ? isNewContactStep
      ? 'Enter your new email address'
      : 'Enter your old email address'
    : isNewContactStep
      ? 'Enter your new phone number'
      : 'Enter your old phone number';

  const contactHelper = isEmailMode
    ? isNewContactStep
      ? 'Update your new email to continue'
      : 'Resend code by email (1:00)'
    : isNewContactStep
      ? 'Update your new number to continue'
      : 'Resend code by SMS (1:00)';

  const contactValue = isEmailMode ? emailAddress : phoneNumber;
  const setContactValue = isEmailMode ? setEmailAddress : setPhoneNumber;
  const contactKeyboardType = isEmailMode ? 'email-address' : 'phone-pad';
  const contactActionLabel = isEmailMode ? (isNewContactStep ? 'Save new email' : 'Continue') : isNewContactStep ? 'Save new number' : 'Continue';
  const contactNotice = isEmailMode
    ? isNewContactStep
      ? 'Make sure your new email is active so you can receive verification codes.'
      : 'For your protection, an OTP verification code will be sent to your current email to confirm this change.'
    : isNewContactStep
      ? 'Make sure your new number is active so you can receive verification codes.'
      : 'For your protection, an OTP verification code will be sent to your current number to confirm this change.';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-left" size={24} color="#0F1621" />
          </Pressable>
          <Text style={styles.headerTitle}>Update Details</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.heroCard}>
            <View style={styles.heroIconWrap}>
              <MaterialCommunityIcons name="cellphone-arrow-down" size={24} color="#0D631B" />
            </View>
            <Text style={styles.heroText}>
              Keep your account safe and accessible by ensuring your contact information is current.
            </Text>
          </View>

          <View style={styles.toggleShell}>
            <Pressable
              style={[styles.toggleTab, selectedTab === 'number' && styles.toggleTabActive]}
              onPress={() => setSelectedTab('number')}
            >
              <MaterialCommunityIcons
                name="phone"
                size={16}
                color={selectedTab === 'number' ? '#64748A' : '#94A3B8'}
              />
              <Text style={[styles.toggleText, selectedTab === 'number' && styles.toggleTextActive]}>Update number</Text>
            </Pressable>

            <Pressable
              style={[styles.toggleTab, selectedTab === 'email' && styles.toggleTabActive]}
              onPress={() => setSelectedTab('email')}
            >
              <MaterialCommunityIcons
                name="email-outline"
                size={16}
                color={selectedTab === 'email' ? '#64748A' : '#94A3B8'}
              />
              <Text style={[styles.toggleText, selectedTab === 'email' && styles.toggleTextActive]}>Update email</Text>
            </Pressable>
          </View>

          {true ? (
            <View style={styles.formCard}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>{contactLabel}</Text>

                <View style={styles.phoneRow}>
                  {!isEmailMode ? (
                    <View style={styles.countryPicker}>
                      <Image source={ghanaFlag} style={styles.flagIcon} resizeMode="contain" />
                      <MaterialCommunityIcons name="menu-down" size={24} color="#111827" />
                    </View>
                  ) : null}

                  <TextInput
                    style={styles.phoneInput}
                    value={contactValue}
                    onChangeText={setContactValue}
                    keyboardType={contactKeyboardType}
                    autoCapitalize={isEmailMode ? 'none' : 'words'}
                    placeholder={contactPlaceholder}
                    placeholderTextColor="#64748A"
                  />
                </View>

                <Text style={styles.helperText}>{contactHelper}</Text>

                <Pressable
                  style={styles.primaryButton}
                  onPress={() =>
                    navigation.navigate('UpdateDetailsOtp', {
                      kind: isEmailMode ? 'email' : 'phone',
                      phone: isEmailMode ? undefined : phoneNumber,
                      email: isEmailMode ? emailAddress : undefined,
                      step: isNewContactStep ? 'new' : 'old',
                    })
                  }
                >
                  <Text style={styles.primaryButtonText}>{contactActionLabel}</Text>
                </Pressable>

                <View style={styles.secondaryActions}>
                  <Pressable style={styles.secondaryButton} onPress={() => {}}>
                    <Text style={styles.secondaryButtonText}>Resend</Text>
                  </Pressable>

                  <Pressable style={styles.secondaryButtonWide} onPress={() => {}}>
                    <Text style={styles.secondaryButtonText}>{isEmailMode ? 'Send code via email' : 'Send code via WhatsApp'}</Text>
                  </Pressable>
                </View>

                <View style={styles.noticeCard}>
                  <View style={styles.noticeIconWrap}>
                    <MaterialCommunityIcons name="information" size={18} color="#31973D" />
                  </View>
                  <Text style={styles.noticeText}>
                    {contactNotice}
                  </Text>
                </View>
              </View>
            </View>
          ) : null}
        </ScrollView>

        <AppBottomNav
          activeTab="settings"
          paddingBottom={0}
          onHomePress={() => navigation.navigate('LocationSharing')}
          onSavedPress={() => navigation.navigate('Details', { itemId: 'save', title: 'Saved' })}
          onSettingsPress={() => navigation.navigate('Settings')}
        />
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
  content: { paddingHorizontal: 12, paddingTop: 16, paddingBottom: 128, gap: 24 },
  heroCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    paddingHorizontal: 18,
    paddingVertical: 24,
    gap: 16,
  },
  heroIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 999,
    backgroundColor: 'rgba(65, 158, 106, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: { fontSize: 14, lineHeight: 20, color: '#64748A', textAlign: 'center', fontFamily: 'Poppins' },
  toggleShell: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    gap: 8,
  },
  toggleTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 11,
    backgroundColor: 'transparent',
  },
  toggleTabActive: { backgroundColor: '#FFFFFF' },
  toggleText: { fontSize: 12, lineHeight: 16, color: '#64748A', fontFamily: 'Poppins' },
  toggleTextActive: { color: '#64748A' },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    padding: 16,
    borderRadius: 12,
  },
  formGroup: { gap: 16 },
  label: { fontSize: 15, lineHeight: 22, color: '#1F2A33', fontFamily: 'Nexa Text-Trial', fontWeight: '400' },
  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  countryPicker: {
    width: 94,
    height: 48,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F2F2F2',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flagIcon: { width: 28, height: 20 },
  phoneInput: {
    flex: 1,
    height: 48,
    borderWidth: 1.8,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    fontSize: 15,
    lineHeight: 18,
    color: '#1F2A33',
    fontFamily: 'Poppins',
  },
  helperText: { fontSize: 11, lineHeight: 16, color: '#1F2A33', fontFamily: 'Poppins' },
  primaryButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#31973D',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 14, lineHeight: 20, fontFamily: 'Plus Jakarta Sans', fontWeight: '400' },
  secondaryActions: { gap: 8 },
  secondaryButton: {
    width: 99,
    height: 32,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  secondaryButtonWide: {
    width: 178,
    height: 32,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  secondaryButtonText: { color: '#1F2A33', fontSize: 12, lineHeight: 20, fontFamily: 'Plus Jakarta Sans', fontWeight: '500' },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  noticeIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 107, 35, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeText: { flex: 1, fontSize: 14, lineHeight: 21, color: '#64748A', fontFamily: 'Poppins' },
});

export default UpdateDetailsScreen;