import React from 'react';
import { Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AppBottomNav } from '../../components';
import type { RootStackScreenProps } from '../../navigation/types';

const ghanaFlag = require('../../../assets/ghana-flag.png');

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
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <View className="flex-1 bg-white">
        <View className="h-12 px-4 flex-row items-center justify-between bg-white">
          <Pressable className="w-6 h-6 items-center justify-center" onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-left" size={24} color="#0F1621" />
          </Pressable>
          <Text className="text-base leading-6 font-semibold text-[#1F2A33] text-center">Update Details</Text>
          <View className="w-6 h-6" />
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 16, paddingBottom: 128, gap: 24 }} showsVerticalScrollIndicator={false}>
          <View className="items-center bg-white rounded-2xl border border-[#F1F5F9] px-[18px] py-6 gap-4">
            <View
              className="w-[54px] h-[54px] rounded-full items-center justify-center"
              style={{ backgroundColor: 'rgba(65, 158, 106, 0.1)' }}
            >
              <MaterialCommunityIcons name="cellphone-arrow-down" size={24} color="#0D631B" />
            </View>
            <Text className="text-sm leading-5 text-[#64748A] text-center" style={{ fontFamily: 'Poppins' }}>
              Keep your account safe and accessible by ensuring your contact information is current.
            </Text>
          </View>

          <View className="w-full flex-row justify-center items-center p-4 bg-white border border-[#E2E8F0] rounded-2xl gap-2">
            <Pressable
              className={`flex-row items-center gap-1 px-2 py-[6px] rounded-[11px] ${selectedTab === 'number' ? 'bg-white' : 'bg-transparent'}`}
              onPress={() => setSelectedTab('number')}
            >
              <MaterialCommunityIcons name="phone" size={16} color={selectedTab === 'number' ? '#64748A' : '#94A3B8'} />
              <Text className={`text-xs leading-4 text-[#64748A]`} style={{ fontFamily: 'Poppins' }}>Update number</Text>
            </Pressable>

            <Pressable
              className={`flex-row items-center gap-1 px-2 py-[6px] rounded-[11px] ${selectedTab === 'email' ? 'bg-white' : 'bg-transparent'}`}
              onPress={() => setSelectedTab('email')}
            >
              <MaterialCommunityIcons name="email-outline" size={16} color={selectedTab === 'email' ? '#64748A' : '#94A3B8'} />
              <Text className="text-xs leading-4 text-[#64748A]" style={{ fontFamily: 'Poppins' }}>Update email</Text>
            </Pressable>
          </View>

          {true ? (
            <View className="bg-white border-t border-t-[#E2E8F0] p-4 rounded-xl">
              <View className="gap-4">
                <Text className="text-[15px] leading-[22px] text-[#1F2A33]" style={{ fontFamily: 'Nexa Text-Trial' }}>{contactLabel}</Text>

                <View className="flex-row items-center gap-2">
                  {!isEmailMode ? (
                    <View className="w-[94px] h-12 p-[10px] border border-[#F2F2F2] rounded-xl bg-white flex-row items-center justify-between">
                      <Image source={ghanaFlag} className="w-7 h-5" resizeMode="contain" />
                      <MaterialCommunityIcons name="menu-down" size={24} color="#111827" />
                    </View>
                  ) : null}

                  <TextInput
                    className="flex-1 h-12 bg-white rounded-xl px-4 text-[15px] text-[#1F2A33]"
                    style={{ borderWidth: 1.8, borderColor: 'rgba(0,0,0,0.05)', fontFamily: 'Poppins', lineHeight: 18 }}
                    value={contactValue}
                    onChangeText={setContactValue}
                    keyboardType={contactKeyboardType}
                    autoCapitalize={isEmailMode ? 'none' : 'words'}
                    placeholder={contactPlaceholder}
                    placeholderTextColor="#64748A"
                  />
                </View>

                <Text className="text-[11px] leading-4 text-[#1F2A33]" style={{ fontFamily: 'Poppins' }}>{contactHelper}</Text>

                <Pressable
                  className="w-full h-12 bg-[#31973D] rounded-xl items-center justify-center"
                  onPress={() =>
                    navigation.navigate('UpdateDetailsOtp', {
                      kind: isEmailMode ? 'email' : 'phone',
                      phone: isEmailMode ? undefined : phoneNumber,
                      email: isEmailMode ? emailAddress : undefined,
                      step: isNewContactStep ? 'new' : 'old',
                    })
                  }
                >
                  <Text className="text-white text-sm leading-5" style={{ fontFamily: 'Plus Jakarta Sans' }}>{contactActionLabel}</Text>
                </Pressable>

                <View className="gap-2">
                  <Pressable className="w-[99px] h-8 rounded-[22px] border border-[#E2E8F0] bg-white items-center justify-center px-3" onPress={() => {}}>
                    <Text className="text-[#1F2A33] text-xs leading-5 font-medium" style={{ fontFamily: 'Plus Jakarta Sans' }}>Resend</Text>
                  </Pressable>
                  <Pressable className="w-[178px] h-8 rounded-[22px] border border-[#E2E8F0] bg-white items-center justify-center px-3" onPress={() => {}}>
                    <Text className="text-[#1F2A33] text-xs leading-5 font-medium" style={{ fontFamily: 'Plus Jakarta Sans' }}>{isEmailMode ? 'Send code via email' : 'Send code via WhatsApp'}</Text>
                  </Pressable>
                </View>

                <View className="flex-row items-start gap-4 p-4 rounded-2xl border border-[#E2E8F0] bg-white">
                  <View
                    className="w-8 h-8 rounded-full items-center justify-center"
                    style={{ backgroundColor: 'rgba(0, 107, 35, 0.1)' }}
                  >
                    <MaterialCommunityIcons name="information" size={18} color="#31973D" />
                  </View>
                  <Text className="flex-1 text-sm leading-[21px] text-[#64748A]" style={{ fontFamily: 'Poppins' }}>
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
          onHomePress={() => navigation.navigate('Home')}
          onSavedPress={() => navigation.navigate('Details', { itemId: 'save', title: 'Saved' })}
          onSettingsPress={() => navigation.navigate('Settings')}
        />
      </View>
    </SafeAreaView>
  );
}

export default UpdateDetailsScreen;
