import React from 'react';
import { Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AppBottomNav } from '../../components';
import type { RootStackScreenProps } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';
import CustomAppBar from '../../components/common/CustomAppBar';
import { useAppSelector } from '../../hooks/useAppSelector';

const ghanaFlag = require('../../../assets/ghana-flag.png');

export function UpdateDetailsScreen({ route, navigation }: RootStackScreenProps<'UpdateDetails'>) {
  const { isDark, colors } = useTheme()
  const user = useAppSelector((state) => state.auth.user)

  const selectedKind = route.params?.kind ?? 'phone';
  const isNewNumberStep = route.params?.step === 'new';
  const [phoneNumber, setPhoneNumber] = React.useState(isNewNumberStep ? '' : route.params?.phone ?? user?.phone ?? '');
  const [emailAddress, setEmailAddress] = React.useState(isNewNumberStep ? '' : route.params?.email ?? user?.email ?? '');
  const [selectedTab, setSelectedTab] = React.useState<'number' | 'email'>(selectedKind === 'email' ? 'email' : 'number');

  React.useEffect(() => {
    setSelectedTab(selectedKind === 'email' ? 'email' : 'number');
    setPhoneNumber(isNewNumberStep ? '' : route.params?.phone ?? user?.phone ?? '');
    setEmailAddress(isNewNumberStep ? '' : route.params?.email ?? user?.email ?? '');
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
    <SafeAreaView style={{backgroundColor: colors.bg}} className="flex-1" edges={['top', 'left', 'right']}>
      <View className="flex-1">
        <CustomAppBar title="Update Details" navigation={navigation} />

        <ScrollView contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 16, paddingBottom: 128, gap: 24 }} showsVerticalScrollIndicator={false}>
          <View className="items-center px-[18px] py-6 gap-4">
            <View
              className="w-[54px] h-[54px] rounded-full items-center justify-center"
              style={{ backgroundColor: 'rgba(65, 158, 106, 0.1)' }}
            >
              <MaterialCommunityIcons name="cellphone-arrow-down" size={24} color="#0D631B" />
            </View>
            <Text className="text-sm leading-5 text-[#64748A] text-center" style={{ color: colors.text }}>
              Keep your account safe and accessible by ensuring your contact information is current.
            </Text>
          </View>

          <View className='flex-row items-center justify-center'>
          <View style={{backgroundColor: colors.surface}} className="flex-row justify-center items-center py-2 px-1.5 rounded-full gap-2">
            <Pressable
              style={{backgroundColor: selectedTab === 'number' ? colors.card : ''}}
              className={`flex-row items-center gap-1 px-2 py-[6px] rounded-full`}
              onPress={() => setSelectedTab('number')}
            >
              <MaterialCommunityIcons name="phone" size={16} color={selectedTab === 'number' ? '#64748A' : '#94A3B8'} />
              <Text className={`text-xs leading-4`} style={{ color: colors.textSub }}>Update number</Text>
            </Pressable>

            <Pressable
              style={{backgroundColor: selectedTab === 'email' ? colors.card : ''}}
              className={`flex-row items-center gap-1 px-2 py-[6px] rounded-full`}
              onPress={() => setSelectedTab('email')}
            >
              <MaterialCommunityIcons name="email-outline" size={16} color={selectedTab === 'email' ? '#64748A' : '#94A3B8'} />
              <Text className="text-xs leading-4" style={{ color: colors.textSub }}>Update email</Text>
            </Pressable>
          </View>
          </View>

          {true ? (
            <View style={{borderColor: colors.border}} className="border p-4 rounded-xl">
              <View className="gap-4">
                <Text className="text-[15px] leading-[22px]" style={{ color: colors.text, fontFamily: 'Poppins' }}>{contactLabel}</Text>

                <View className="flex-row items-center gap-2">
                  {!isEmailMode ? (
                    <View style={{borderColor: colors.border}} className="h-12 p-[10px] gap-2 border rounded-full flex-row items-center justify-between">
                      <View className="rounded-full overflow-hidden">
                        <Image source={ghanaFlag} style={{ width: 28, height: 20 }} resizeMode="contain" />
                      </View>
                      <MaterialCommunityIcons name="menu-down" size={24} color={colors.text} />
                    </View>
                  ) : null}

                  <TextInput
                    style={{borderColor: colors.border, color: colors.text}}
                    className="flex-1 h-12 rounded-full px-4 text-[15px]  border"
                    value={contactValue}
                    onChangeText={setContactValue}
                    keyboardType={contactKeyboardType}
                    autoCapitalize={isEmailMode ? 'none' : 'words'}
                    placeholder={contactPlaceholder}
                    placeholderTextColor="#64748A"
                  />
                </View>

                <Text className="text-[11px] leading-4 " style={{ color: colors.text }}>{contactHelper}</Text>

                <Pressable
                  className="w-full h-12 bg-[#31973D] rounded-full items-center justify-center"
                  onPress={() =>
                    navigation.navigate('UpdateDetailsOtp', {
                      kind: isEmailMode ? 'email' : 'phone',
                      phone: isEmailMode ? undefined : phoneNumber,
                      email: isEmailMode ? emailAddress : undefined,
                      step: isNewContactStep ? 'new' : 'old',
                    })
                  }
                >
                  <Text className="text-white text-sm leading-5" style={{ color: "#FFFFFF" }}>{contactActionLabel}</Text>
                </Pressable>

                <View className="gap-2">
                  <Pressable className="w-[99px] h-8 rounded-[22px] border items-center justify-center px-3" style={{ borderColor: colors.border }} onPress={() => {}}>
                    <Text className=" text-xs leading-5 font-medium" style={{ color: colors.text }}>Resend</Text>
                  </Pressable>
                  <Pressable className="w-[178px] h-8 rounded-[22px] border items-center justify-center px-3" style={{ borderColor: colors.border }} onPress={() => {}}>
                    <Text className=" text-xs leading-5 font-medium" style={{ color: colors.text }}>{isEmailMode ? 'Send code via email' : 'Send code via WhatsApp'}</Text>
                  </Pressable>
                </View>

                <View className="flex-row items-start gap-4 p-4 rounded-2xl border" style={{ borderColor: colors.border }}>
                  <View
                    className="w-8 h-8 rounded-full items-center justify-center"
                    style={{ backgroundColor: 'rgba(0, 107, 35, 0.1)' }}
                  >
                    <MaterialCommunityIcons name="information" size={18} color="#31973D" />
                  </View>
                  <Text className="flex-1 text-sm leading-[21px] text-[#64748A]" style={{ color: colors.textSub }}>
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
          navigation={navigation}
        />
      </View>
    </SafeAreaView>
  );
}

export default UpdateDetailsScreen;
