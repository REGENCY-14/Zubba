import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import type { RootStackScreenProps } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';

export function UpdateDetailsOtpScreen({ route, navigation }: RootStackScreenProps<'UpdateDetailsOtp'>) {
  const { colors } = useTheme();
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right']}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <View style={{ height: 48, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.bg }}>
          <Pressable style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-left" size={24} color={colors.text} />
          </Pressable>
          <Text style={{ fontSize: 16, lineHeight: 24, fontWeight: '600', color: colors.text, textAlign: 'center' }}>Code Verification</Text>
          <View style={{ width: 24, height: 24 }} />
        </View>

        <View style={{ flex: 1, paddingHorizontal: 22, paddingTop: 18, gap: 18 }}>
          <View style={{ gap: 4 }}>
            <Text
              style={{ fontSize: 18, fontWeight: 'bold', lineHeight: 25, letterSpacing: 0.15, color: colors.text, fontFamily: 'Poppins' }}
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

          <View style={{ flexDirection: 'row', gap: 12, marginTop: 10 }}>
            {[0, 1, 2, 3].map((index) => (
              <Pressable
                key={index}
                onPress={() => inputRefs.current[index]?.focus()}
                style={{
                  width: 39,
                  height: 34,
                  borderRadius: 6,
                  borderWidth: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: index === 0 && codeDigits[0] === '' ? '#31973D' : colors.border,
                  backgroundColor: index === 0 && codeDigits[0] === '' ? colors.card : colors.surface,
                }}
              >
                <TextInput
                  ref={(ref) => { inputRefs.current[index] = ref; }}
                  style={{ width: '100%', height: '100%', fontSize: 20, fontWeight: '500', color: colors.text, textAlign: 'center' }}
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
            style={{ height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 10, backgroundColor: isCodeComplete ? '#34A853' : 'rgba(52,168,83,0.5)' }}
            disabled={!isCodeComplete}
            onPress={() =>
              step === 'old'
                ? navigation.navigate('UpdateDetails', {
                    kind,
                    step: 'new',
                    phone: kind === 'phone' ? contact : undefined,
                    email: kind === 'email' ? email : undefined,
                  })
                : navigation.navigate('Profile', {
                    updatedAt: Date.now(),
                    newPhone: kind === 'phone' ? contact : undefined,
                    newEmail: kind === 'email' ? email : undefined,
                  })
            }
          >
            <Text style={{ color: '#FFFFFF', fontSize: 14, lineHeight: 20 }}>Verify</Text>
          </Pressable>

          <Text style={{ color: colors.text, fontSize: 11, lineHeight: 16, fontFamily: 'Poppins' }}>
            {kind === 'email' ? 'Resend code by email (1:00)' : 'Resend code by SMS (1:00)'}
          </Text>

          <View style={{ gap: 8, alignItems: 'flex-start' }}>
            <Pressable style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 22, paddingVertical: 6, paddingHorizontal: 12, backgroundColor: colors.card }} onPress={() => {}}>
              <Text style={{ color: colors.text, fontSize: 12, lineHeight: 20, fontWeight: '500' }}>Resend</Text>
            </Pressable>
            <Pressable style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 22, paddingVertical: 6, paddingHorizontal: 12, backgroundColor: colors.card }} onPress={() => {}}>
              <Text style={{ color: colors.text, fontSize: 12, lineHeight: 20, fontWeight: '500' }}>Send code via WhatsApp</Text>
            </Pressable>
          </View>
        </View>

        <View style={{ height: 24, alignItems: 'center', justifyContent: 'center', paddingBottom: 8 }}>
          <View style={{ width: 108, height: 4, borderRadius: 12, backgroundColor: colors.border }} />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default UpdateDetailsOtpScreen;
