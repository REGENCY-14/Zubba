import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import type { RootStackScreenProps } from '../../navigation/types';

export function UpdateDetailsOtpScreen({ route, navigation }: RootStackScreenProps<'UpdateDetailsOtp'>) {
  const contact = route.params?.phone ?? '024 11 22 310';
  const email = route.params?.email ?? 'name@example.com';
  const kind = route.params?.kind ?? 'phone';
  const step = route.params?.step ?? 'old';
  const [codeDigits, setCodeDigits] = React.useState(['', '', '', '']);
  const inputRefs = React.useRef<Array<TextInput | null>>([]);

  const isCodeComplete = codeDigits.every((digit) => digit.length === 1);

  const updateDigit = (index: number, value: string) => {
    const digit = value.replace(/[^0-9]/g, '').slice(-1);
    const nextDigits = [...codeDigits];
    nextDigits[index] = digit;
    setCodeDigits(nextDigits);
    if (digit && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <View className="flex-1 bg-white">
        <View className="h-12 px-4 flex-row items-center justify-between bg-white">
          <Pressable className="w-6 h-6 items-center justify-center" onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-left" size={24} color="#0F1621" />
          </Pressable>
          <Text className="text-base leading-6 font-semibold text-[#1F2A33] text-center">Code Verification</Text>
          <View className="w-6 h-6" />
        </View>

        <View className="flex-1 px-[22px] pt-[18px] gap-[18px]">
          <View className="gap-1">
            <Text
              className="text-[18px] font-bold leading-[25px] tracking-[0.15px] text-[#1F2A33]"
              style={{ fontFamily: 'Nexa Text-Trial' }}
            >
              {kind === 'email'
                ? step === 'old'
                  ? `Enter the 4-digits code sent via email at ${email}`
                  : 'Enter the verification code sent to your new email'
                : step === 'old'
                  ? `Enter the 4-digits code sent via SMS at ${contact}`
                  : 'Enter the verification code sent to your new number'}
            </Text>
          </View>

          <View className="flex-row gap-3 mt-[10px]">
            {[0, 1, 2, 3].map((index) => (
              <Pressable
                key={index}
                onPress={() => inputRefs.current[index]?.focus()}
                className={`w-[39px] h-[34px] rounded-[6px] border items-center justify-center ${
                  index === 0 && codeDigits[0] === ''
                    ? 'border-[#31973D] bg-white'
                    : 'border-[#B8B8B8]/20 bg-[#B8B8B8]/20'
                }`}
              >
                <TextInput
                  ref={(ref) => { inputRefs.current[index] = ref; }}
                  className="w-full h-full text-[20px] font-medium text-[#1F2A33]"
                  value={codeDigits[index]}
                  onChangeText={(value) => updateDigit(index, value)}
                  keyboardType="number-pad"
                  maxLength={1}
                  textAlign="center"
                />
              </Pressable>
            ))}
          </View>

          <Pressable
            className={`h-12 rounded-xl items-center justify-center mt-[10px] ${isCodeComplete ? 'bg-[#34A853]' : 'bg-[#34A853]/50'}`}
            disabled={!isCodeComplete}
            onPress={() =>
              step === 'old'
                ? navigation.navigate('UpdateDetails', {
                    kind,
                    step: 'new',
                    phone: kind === 'phone' ? contact : undefined,
                    email: kind === 'email' ? email : undefined,
                  })
                : navigation.navigate('UpdateDetailsSuccess')
            }
          >
            <Text className="text-white text-sm leading-5">Verify</Text>
          </Pressable>

          <Text className="text-[#1F2A33] text-[11px] leading-4" style={{ fontFamily: 'Poppins' }}>
            {kind === 'email' ? 'Resend code by email (1:00)' : 'Resend code by SMS (1:00)'}
          </Text>

          <View className="gap-2 items-start">
            <Pressable className="border border-[#E2E8F0] rounded-[22px] py-[6px] px-3 bg-white" onPress={() => {}}>
              <Text className="text-[#1F2A33] text-xs leading-5 font-medium">Resend</Text>
            </Pressable>
            <Pressable className="border border-[#E2E8F0] rounded-[22px] py-[6px] px-3 bg-white" onPress={() => {}}>
              <Text className="text-[#1F2A33] text-xs leading-5 font-medium">Send code via WhatsApp</Text>
            </Pressable>
          </View>
        </View>

        <View className="h-6 items-center justify-center pb-2">
          <View className="w-[108px] h-1 rounded-[12px] bg-black opacity-90" />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default UpdateDetailsOtpScreen;
