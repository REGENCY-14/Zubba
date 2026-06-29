import React from 'react';
import { Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import type { RootStackScreenProps } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';

const ghanaFlag = require('../../../assets/ghana-flag.png');

export function UpdateDetailsScreen({ route, navigation }: RootStackScreenProps<'UpdateDetails'>) {
  const { colors } = useTheme();
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
    ? isNewContactStep ? "What's your new email address" : "What's your old email address"
    : isNewContactStep ? "What's your new phone number" : "What's your old phone number";

  const contactPlaceholder = isEmailMode
    ? isNewContactStep ? 'Enter your new email address' : 'Enter your old email address'
    : isNewContactStep ? 'Enter your new phone number' : 'Enter your old phone number';

  const contactHelper = isEmailMode
    ? isNewContactStep ? 'Update your new email to continue' : 'Resend code by email (1:00)'
    : isNewContactStep ? 'Update your new number to continue' : 'Resend code by SMS (1:00)';

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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right']}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <View style={{ height: 48, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.bg }}>
          <Pressable style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-left" size={24} color={colors.text} />
          </Pressable>
          <Text style={{ fontSize: 16, lineHeight: 24, fontWeight: '600', color: colors.text, textAlign: 'center' }}>Update Details</Text>
          <View style={{ width: 24, height: 24 }} />
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 16, paddingBottom: 40, gap: 24 }} showsVerticalScrollIndicator={false}>
          <View style={{ alignItems: 'center', backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.borderLight, paddingHorizontal: 18, paddingVertical: 24, gap: 16 }}>
            <View
              style={{ width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(65, 158, 106, 0.1)' }}
            >
              <MaterialCommunityIcons name="cellphone-arrow-down" size={24} color="#0D631B" />
            </View>
            <Text style={{ fontSize: 14, lineHeight: 20, color: colors.textSub, textAlign: 'center', fontFamily: 'Poppins' }}>
              Keep your account safe and accessible by ensuring your contact information is current.
            </Text>
          </View>

          <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 16, gap: 8 }}>
            <Pressable
              style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 6, borderRadius: 11, backgroundColor: selectedTab === 'number' ? colors.surface : 'transparent' }}
              onPress={() => setSelectedTab('number')}
            >
              <MaterialCommunityIcons name="phone" size={16} color={selectedTab === 'number' ? colors.textSub : colors.textMuted} />
              <Text style={{ fontSize: 12, lineHeight: 16, color: colors.textSub, fontFamily: 'Poppins' }}>Update number</Text>
            </Pressable>

            <Pressable
              style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 6, borderRadius: 11, backgroundColor: selectedTab === 'email' ? colors.surface : 'transparent' }}
              onPress={() => setSelectedTab('email')}
            >
              <MaterialCommunityIcons name="email-outline" size={16} color={selectedTab === 'email' ? colors.textSub : colors.textMuted} />
              <Text style={{ fontSize: 12, lineHeight: 16, color: colors.textSub, fontFamily: 'Poppins' }}>Update email</Text>
            </Pressable>
          </View>

          {true ? (
            <View style={{ backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border, padding: 16, borderRadius: 12 }}>
              <View style={{ gap: 16 }}>
                <Text style={{ fontSize: 15, lineHeight: 22, color: colors.text, fontFamily: 'Nexa Text-Trial' }}>{contactLabel}</Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  {!isEmailMode ? (
                    <View style={{ width: 94, height: 48, padding: 10, borderWidth: 1, borderColor: colors.border, borderRadius: 12, backgroundColor: colors.card, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Image source={ghanaFlag} style={{ width: 28, height: 20 }} resizeMode="contain" />
                      <MaterialCommunityIcons name="menu-down" size={24} color={colors.iconColor} />
                    </View>
                  ) : null}

                  <TextInput
                    style={{ flex: 1, height: 48, backgroundColor: colors.card, borderRadius: 12, paddingHorizontal: 16, fontSize: 15, color: colors.text, borderWidth: 1.8, borderColor: colors.border, fontFamily: 'Poppins', lineHeight: 18 }}
                    value={contactValue}
                    onChangeText={setContactValue}
                    keyboardType={contactKeyboardType}
                    autoCapitalize={isEmailMode ? 'none' : 'words'}
                    placeholder={contactPlaceholder}
                    placeholderTextColor={colors.textSub}
                  />
                </View>

                <Text style={{ fontSize: 11, lineHeight: 16, color: colors.text, fontFamily: 'Poppins' }}>{contactHelper}</Text>

                <Pressable
                  style={{ width: '100%', height: 48, backgroundColor: '#31973D', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}
                  onPress={() =>
                    navigation.navigate('UpdateDetailsOtp', {
                      kind: isEmailMode ? 'email' : 'phone',
                      phone: isEmailMode ? undefined : phoneNumber,
                      email: isEmailMode ? emailAddress : undefined,
                      step: isNewContactStep ? 'new' : 'old',
                    })
                  }
                >
                  <Text style={{ color: '#FFFFFF', fontSize: 14, lineHeight: 20, fontFamily: 'Plus Jakarta Sans' }}>{contactActionLabel}</Text>
                </Pressable>

                <View style={{ gap: 8 }}>
                  <Pressable style={{ width: 99, height: 32, borderRadius: 22, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 }} onPress={() => {}}>
                    <Text style={{ color: colors.text, fontSize: 12, lineHeight: 20, fontWeight: '500', fontFamily: 'Plus Jakarta Sans' }}>Resend</Text>
                  </Pressable>
                  <Pressable style={{ width: 178, height: 32, borderRadius: 22, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 }} onPress={() => {}}>
                    <Text style={{ color: colors.text, fontSize: 12, lineHeight: 20, fontWeight: '500', fontFamily: 'Plus Jakarta Sans' }}>{isEmailMode ? 'Send code via email' : 'Send code via WhatsApp'}</Text>
                  </Pressable>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 16, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card }}>
                  <View
                    style={{ width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 107, 35, 0.1)' }}
                  >
                    <MaterialCommunityIcons name="information" size={18} color="#31973D" />
                  </View>
                  <Text style={{ flex: 1, fontSize: 14, lineHeight: 21, color: colors.textSub, fontFamily: 'Poppins' }}>
                    {contactNotice}
                  </Text>
                </View>
              </View>
            </View>
          ) : null}
        </ScrollView>

      </View>
    </SafeAreaView>
  );
}

export default UpdateDetailsScreen;
