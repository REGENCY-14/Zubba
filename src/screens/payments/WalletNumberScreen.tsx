import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { upgradeToPremium } from '../../slices/customer/customerSlice';
import { scale, verticalScale, moderateScale } from '../../utils/scale';

export function WalletNumberScreen({ navigation }: RootStackScreenProps<'WalletNumber'>) {
  const [phone, setPhone] = React.useState('');
  const [showSuccess, setShowSuccess] = React.useState(false);
  const { colors } = useTheme();
  const dispatch = useAppDispatch();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={{ flex: 1, backgroundColor: colors.bg }}>
          <View style={{ height: verticalScale(48), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: scale(16) }}>
            <Pressable style={{ width: moderateScale(24), height: moderateScale(24), alignItems: 'center', justifyContent: 'center' }} onPress={() => navigation.goBack()}>
              <Text style={{ fontSize: moderateScale(28), color: colors.text, lineHeight: moderateScale(28), marginTop: verticalScale(-2) }}>‹</Text>
            </Pressable>
            <Text style={{ fontSize: moderateScale(16), fontWeight: '600', color: colors.text }}>Payment</Text>
            <View style={{ width: moderateScale(24), height: moderateScale(24) }} />
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: scale(12), paddingTop: verticalScale(16), paddingBottom: verticalScale(40) }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: moderateScale(24), padding: moderateScale(16), gap: moderateScale(32), backgroundColor: colors.card }}>
              <View style={{ gap: moderateScale(24) }}>
                <View style={{ gap: moderateScale(16) }}>
                  <Text style={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: moderateScale(24), lineHeight: moderateScale(32), color: colors.text }}>Wallet Number</Text>
                  <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: moderateScale(14), lineHeight: moderateScale(26), color: colors.textSub }}>
                    Enter your wallet number to proceed with the transaction.
                  </Text>
                </View>

                <View style={{ gap: moderateScale(7) }}>
                  <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: moderateScale(16), lineHeight: moderateScale(16), color: colors.text }}>Wallet Phone Number</Text>
                  <TextInput
                    style={{
                      height: verticalScale(48),
                      borderWidth: 1,
                      borderColor: '#CBD5E0',
                      borderRadius: 999,
                      paddingHorizontal: scale(12),
                      fontSize: moderateScale(16),
                      color: colors.text,
                      backgroundColor: colors.bg,
                    }}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="055 123 4567"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="phone-pad"
                    autoFocus
                    returnKeyType="done"
                  />
                  <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: moderateScale(12), lineHeight: moderateScale(16), color: colors.textSub }}>
                    Enter your mobile money number
                  </Text>
                </View>
              </View>

              <Pressable
                style={{ height: verticalScale(48), backgroundColor: '#31973D', borderRadius: 999, alignItems: 'center', justifyContent: 'center' }}
                onPress={() => setShowSuccess(true)}
              >
                <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: moderateScale(14), lineHeight: moderateScale(20), color: '#FFFFFF' }}>
                  Continue
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      {showSuccess && (
        <View style={StyleSheet.absoluteFillObject}>
          <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFillObject} />
          <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(255,255,255,0.30)' }]} />

          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: scale(24), gap: moderateScale(32) }}>
            <View style={{ alignItems: 'center', gap: moderateScale(12) }}>
              <Text style={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: moderateScale(36), lineHeight: moderateScale(44), letterSpacing: -1.08, textAlign: 'center', color: '#0F1621' }}>
                Successful
              </Text>
              <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: moderateScale(16), lineHeight: moderateScale(20), letterSpacing: -0.32, textAlign: 'center', color: '#1F2A33' }}>
                Enjoy double Eco-Points, priority support, and a cleaner tomorrow.
              </Text>
            </View>

            <View style={{ width: '100%', gap: moderateScale(12) }}>
              <Pressable
                style={{ height: verticalScale(48), backgroundColor: '#31973D', borderRadius: 9999, alignItems: 'center', justifyContent: 'center' }}
                onPress={() => {
                  dispatch(upgradeToPremium());
                  setShowSuccess(false);
                  navigation.navigate('PremiumHome');
                }}
              >
                <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: moderateScale(14), color: '#FFFFFF' }}>
                  Proceed to Premium
                </Text>
              </Pressable>

              <Pressable
                style={{ height: verticalScale(48), backgroundColor: '#FFFFFF', borderRadius: 9999, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' }}
                onPress={() => {
                  dispatch(upgradeToPremium());
                  setShowSuccess(false);
                  navigation.navigate('PremiumHome');
                }}
              >
                <Text style={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: moderateScale(14), color: '#1F2A33' }}>
                  Set Package expiry alert
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

export default WalletNumberScreen;
