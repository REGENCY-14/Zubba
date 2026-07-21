import React, { useState, useEffect, useRef } from 'react';
import { Pressable, Text, TextInput, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import type { RootStackScreenProps } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';
import { useResendOtp, useVerifyOtp } from '../../slices/auth/auth.hooks';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { updateUser } from '../../slices/auth/authSlice';
import { userService } from '../../api/userService';
import { toast } from '../../hooks/toast';

export function UpdateDetailsOtpScreen({ route, navigation }: RootStackScreenProps<'UpdateDetailsOtp'>) {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  
  const contact = route.params?.phone ?? '024 11 22 310';
  const email = route.params?.email ?? 'name@example.com';
  const kind = route.params?.kind ?? 'phone';
  const step = route.params?.step ?? 'old';
  const userId = route.params?.userId;
  
  const [codeDigits, setCodeDigits] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { mutate: resendOtp, isPending: isResending } = useResendOtp();
  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyOtp();

  const isCodeComplete = codeDigits.every((digit) => digit.length === 1);
  const otp = codeDigits.join('');

  useEffect(() => {
    if (countdown > 0) {
      timerRef.current = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [countdown]);

  useEffect(() => {
    setCountdown(60);
    setCanResend(false);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const updateDigit = (index: number, value: string) => {
    const digit = value.replace(/[^0-9]/g, '').slice(-1);
    const nextDigits = [...codeDigits];
    nextDigits[index] = digit;
    setCodeDigits(nextDigits);
    if (digit && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || isResending) return;

    const authKey = kind === 'email' ? 'email' : 'phone';
    const authValue = kind === 'email' ? email : contact;
    const purpose = step === 'old' ? 'update_old' : 'update_new';

    resendOtp(
      {
        authKey,
        authValue,
        purpose,
      },
      {
        onSuccess: () => {
          toast.success('OTP resent successfully');
          setCountdown(60);
          setCanResend(false);
          setCodeDigits(['', '', '', '']);
          inputRefs.current[0]?.focus();
        },
        onError: (error: any) => {
          toast.error(error?.message || 'Failed to resend OTP');
        },
      }
    );
  };

  const handleVerifyOtp = async () => {
    if (!isCodeComplete || isVerifying) return;

    const authKey = kind === 'email' ? 'email' : 'phone';
    const authValue = kind === 'email' ? email : contact;
    const purpose = step === 'old' ? 'update_old' : 'update_new';

    verifyOtp(
      {
        authKey,
        authValue,
        otp,
        purpose,
      },
      {
        onSuccess: async () => {
          if (step === 'old') {
            // First OTP verification successful - proceed to new details
            toast.success('OTP verified successfully');
            navigation.navigate('UpdateDetails', {
              kind,
              step: 'new',
              phone: kind === 'phone' ? contact : undefined,
              email: kind === 'email' ? email : undefined,
            });
          } else {
            // Second OTP verification successful - update user details
            try {
              const updateData = {
                ...(kind === 'phone' ? { phone: contact } : {}),
                ...(kind === 'email' ? { email: email } : {}),
              };

              await userService.updateUser(userId ?? "", updateData);
              dispatch(updateUser(updateData));
              toast.success(`Your ${kind} has been updated successfully`);
              
              navigation.navigate('Profile', {
                updatedAt: Date.now(),
                ...updateData,
              });
            } catch (error: any) {
              toast.error(error?.message || 'Failed to update details');
            }
          }
        },
        onError: (error: any) => {
          toast.error(error?.message || 'Invalid OTP. Please try again.');
          setCodeDigits(['', '', '', '']);
          inputRefs.current[0]?.focus();
        },
      }
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getContactDisplay = () => {
    if (kind === 'email') {
      const [local, domain] = email.split('@');
      if (local.length > 3) {
        return `${local.slice(0, 2)}${'*'.repeat(Math.min(local.length - 2, 4))}@${domain}`;
      }
      return email;
    }
    if (contact.length > 6) {
      const lastFour = contact.slice(-4);
      const masked = '*'.repeat(contact.length - 4);
      return `${masked}${lastFour}`;
    }
    return contact;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right']}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <View style={{ 
          height: 48, 
          paddingHorizontal: 16, 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          backgroundColor: colors.bg 
        }}>
          <Pressable 
            style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }} 
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="chevron-left" size={24} color={colors.text} />
          </Pressable>
          <Text style={{ 
            fontSize: 16, 
            lineHeight: 24, 
            fontWeight: '600', 
            color: colors.text, 
            textAlign: 'center' 
          }}>
            Code Verification
          </Text>
          <View style={{ width: 24, height: 24 }} />
        </View>

        <View style={{ flex: 1, paddingHorizontal: 22, paddingTop: 18, gap: 18 }}>
          <View style={{ gap: 4 }}>
            <Text
              style={{ 
                fontSize: 18, 
                fontWeight: 'bold', 
                lineHeight: 25, 
                letterSpacing: 0.15, 
                color: colors.text, 
                fontFamily: 'Poppins' 
              }}
            >
              {step === 'old' 
                ? `Enter the 4-digit code sent via ${kind === 'email' ? 'email' : 'SMS'} to ${getContactDisplay()}`
                : `Enter the verification code sent to your new ${kind}`}
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
                  borderColor: codeDigits[index] ? colors.border : '#31973D',
                  backgroundColor: codeDigits[index] ? colors.surface : colors.card,
                }}
              >
                <TextInput
                  ref={(ref) => { inputRefs.current[index] = ref; }}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    fontSize: 20, 
                    fontWeight: '500', 
                    color: colors.text, 
                    textAlign: 'center' 
                  }}
                  value={codeDigits[index]}
                  onChangeText={(value) => updateDigit(index, value)}
                  keyboardType="number-pad"
                  maxLength={1}
                  textAlign="center"
                  editable={!isVerifying}
                />
              </Pressable>
            ))}
          </View>

          <Pressable
            className="rounded-full"
            style={{ 
              height: 48, 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginTop: 10, 
              backgroundColor: isCodeComplete && !isVerifying ? '#34A853' : 'rgba(52,168,83,0.5)',
              opacity: isVerifying ? 0.7 : 1,
            }}
            disabled={!isCodeComplete || isVerifying}
            onPress={handleVerifyOtp}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 14, lineHeight: 20 }}>
              {isVerifying ? 'Verifying...' : 'Verify'}
            </Text>
          </Pressable>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ color: colors.text, fontSize: 11, lineHeight: 16 }}>
              {kind === 'email' ? 'Resend code by email' : 'Resend code by SMS'}
            </Text>
            <Text style={{ color: canResend ? colors.textSub : '#34A853', fontSize: 11, lineHeight: 16 }}>
              ({canResend ? 'Resend' : formatTime(countdown)})
            </Text>
          </View>

          <View style={{ gap: 8, alignItems: 'flex-start' }}>
            <Pressable 
              style={{ 
                borderWidth: 1, 
                borderColor: colors.border, 
                borderRadius: 22, 
                paddingVertical: 6, 
                paddingHorizontal: 12, 
                backgroundColor: colors.card,
                opacity: canResend && !isResending ? 1 : 0.5,
              }} 
              onPress={handleResendOtp}
              disabled={!canResend || isResending}
            >
              <Text style={{ color: colors.text, fontSize: 12, fontWeight: '500' }}>
                {isResending ? 'Sending...' : 'Resend'}
              </Text>
            </Pressable>
            <Pressable 
              style={{ 
                borderWidth: 1, 
                borderColor: colors.border, 
                borderRadius: 22, 
                paddingVertical: 6, 
                paddingHorizontal: 12, 
                backgroundColor: colors.card 
              }} 
              onPress={() => {
                // TODO: later
                toast.info('WhatsApp OTP feature coming soon');
              }}
            >
              <Text style={{ color: colors.text, fontSize: 12, fontWeight: '500' }}>
                Send code via WhatsApp
              </Text>
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