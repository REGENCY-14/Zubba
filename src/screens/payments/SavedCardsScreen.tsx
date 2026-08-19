import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { upgradeToPremium } from '../../slices/customer/customerSlice';
import { scale, verticalScale, moderateScale } from '../../utils/scale';
import { APP_DARK } from '../../constants/appDarkTheme';

type MethodId = 'mtn' | 'telecel' | 'airtel';

function ContactlessIcon() {
  return (
    <View style={{ width: moderateScale(25), height: moderateScale(25), borderRadius: moderateScale(12.5), backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
      <MaterialCommunityIcons name="contactless-payment" size={moderateScale(14)} color="#31973D" />
    </View>
  );
}

function MastercardIcon() {
  return (
    <View style={{ width: scale(32), height: verticalScale(20), flexDirection: 'row' }}>
      <View style={{ width: moderateScale(20), height: moderateScale(20), borderRadius: moderateScale(10), backgroundColor: 'rgba(235,0,27,0.8)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' }} />
      <View style={{ width: moderateScale(20), height: moderateScale(20), borderRadius: moderateScale(10), backgroundColor: 'rgba(247,158,27,0.4)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)', marginLeft: scale(-8) }} />
    </View>
  );
}

export function SavedCardsScreen({ navigation }: RootStackScreenProps<'SavedCards'>) {
  const { colors, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const [selectedMethod, setSelectedMethod] = React.useState<MethodId>('mtn');
  const [menuVisible, setMenuVisible] = React.useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right']}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>

        {/* Header */}
        <View style={{ height: verticalScale(48), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: scale(16) }}>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={{ fontSize: moderateScale(28), color: colors.text, lineHeight: moderateScale(28), marginTop: verticalScale(-2) }}>‹</Text>
          </Pressable>
          <Text style={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: moderateScale(16), lineHeight: moderateScale(24), color: colors.text }}>Payment</Text>
          <View style={{ width: scale(24) }} />
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: scale(12), paddingTop: verticalScale(16), paddingBottom: verticalScale(40) }} showsVerticalScrollIndicator={false}>
          <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: moderateScale(24), padding: moderateScale(16), gap: moderateScale(16), backgroundColor: colors.card }}>

            {/* ── Payment method tiles ── */}
            <View style={{ gap: moderateScale(16) }}>
              <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: moderateScale(16), lineHeight: moderateScale(24), color: colors.text }}>
                Select your payment method.
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ flexDirection: 'row', gap: scale(16), alignItems: 'center' }}
              >
                {/* MTN */}
                <Pressable
                  onPress={() => setSelectedMethod('mtn')}
                  style={{ width: scale(102), height: verticalScale(95), borderRadius: moderateScale(11), borderWidth: 2, borderColor: selectedMethod === 'mtn' ? '#31973D' : 'transparent', alignItems: 'center', justifyContent: 'center', padding: moderateScale(4) }}
                >
                  <View style={{ width: scale(84), height: verticalScale(78), backgroundColor: '#FFCC00', borderRadius: moderateScale(8), alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: isDark ? 1 : 0, borderColor: APP_DARK.border }}>
                    <Text style={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: moderateScale(12), color: '#000000' }}>MTN</Text>
                  </View>
                </Pressable>

                {/* Telecel */}
                <Pressable
                  onPress={() => setSelectedMethod('telecel')}
                  style={{ width: scale(102), height: verticalScale(95), borderRadius: moderateScale(11), borderWidth: 2, borderColor: selectedMethod === 'telecel' ? '#31973D' : 'transparent', alignItems: 'center', justifyContent: 'center', padding: moderateScale(4) }}
                >
                  <View style={{ width: scale(84), height: verticalScale(78), backgroundColor: '#DC2626', borderRadius: moderateScale(12), alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <Text style={{ fontFamily: 'Poppins', fontWeight: '700', fontSize: moderateScale(12), color: '#FFFFFF', textAlign: 'center', lineHeight: moderateScale(15) }}>{'Telecel\nCash'}</Text>
                  </View>
                </Pressable>

                {/* Airtel */}
                <Pressable
                  onPress={() => setSelectedMethod('airtel')}
                  style={{ width: scale(102), height: verticalScale(95), borderRadius: moderateScale(11), borderWidth: 2, borderColor: selectedMethod === 'airtel' ? '#31973D' : 'transparent', alignItems: 'center', justifyContent: 'center', padding: moderateScale(4) }}
                >
                  <View style={{ width: scale(84), height: verticalScale(78), backgroundColor: colors.surface, borderRadius: moderateScale(8), borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <Text numberOfLines={1} style={{ fontSize: moderateScale(12), includeFontPadding: false }}>
                      <Text style={{ color: '#0062A3', fontWeight: '700' }}>a</Text>
                      <Text style={{ color: '#EF4444', fontWeight: '700' }}>t</Text>
                    </Text>
                  </View>
                </Pressable>
              </ScrollView>
            </View>

            {/* ── Saved cards ── */}
            <View style={{ gap: moderateScale(8) }}>
              <Text style={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: moderateScale(14), lineHeight: moderateScale(17), letterSpacing: 0.28, color: colors.text }}>
                Select your card
              </Text>

              {/* Wrapper gives context menu a non-clipped positioning parent */}
              <View style={{ position: 'relative' }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: scale(16) }}>

                  {/* Primary green card — overflow:hidden only clips the card itself */}
                  <View style={{ width: scale(280), height: verticalScale(170), borderRadius: moderateScale(24), overflow: 'hidden' }}>
                    <View style={[StyleSheet.absoluteFill, { backgroundColor: '#006B23' }]} />
                    <View style={[StyleSheet.absoluteFill, { backgroundColor: '#31973D', opacity: 0.85 }]} />

                    <View style={{ flex: 1, padding: moderateScale(24), justifyContent: 'space-between' }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <ContactlessIcon />
                        <Pressable onPress={() => setMenuVisible(v => !v)} hitSlop={8}>
                          <MaterialCommunityIcons name="dots-vertical" size={moderateScale(20)} color="#FFFFFF" />
                        </Pressable>
                      </View>

                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(16) }}>
                        <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: moderateScale(14), color: 'rgba(255,255,255,0.8)' }}>xxx</Text>
                        <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: moderateScale(14), color: 'rgba(255,255,255,0.8)' }}>xxx</Text>
                        <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: moderateScale(14), color: 'rgba(255,255,255,0.8)' }}>xxx</Text>
                        <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: moderateScale(18), color: '#FFFFFF', letterSpacing: 1.8 }}>0932</Text>
                      </View>

                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <View style={{ gap: moderateScale(2) }}>
                          <Text style={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: moderateScale(10), color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Cardholder's Name</Text>
                          <Text style={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: moderateScale(14), color: '#FFFFFF', letterSpacing: 0.7, textTransform: 'uppercase' }}>Isabella Steele</Text>
                        </View>
                        <View style={{ gap: moderateScale(2), alignItems: 'flex-end' }}>
                          <Text style={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: moderateScale(10), color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Valid Thru</Text>
                          <Text style={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: moderateScale(14), color: '#FFFFFF' }}>08/25</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Secondary placeholder card */}
                <View style={{ width: scale(280), height: verticalScale(170), borderRadius: moderateScale(24), backgroundColor: colors.surface, opacity: 0.6, borderWidth: 1, borderColor: colors.border, padding: moderateScale(24), justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <MastercardIcon />
                    <Text style={{ fontFamily: 'Poppins', fontStyle: 'italic', fontWeight: '700', fontSize: moderateScale(20), color: colors.text }}>VISA</Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(16) }}>
                    <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: moderateScale(14), color: colors.textSub }}>xxx</Text>
                    <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: moderateScale(14), color: colors.textSub }}>xxx</Text>
                    <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: moderateScale(14), color: colors.textSub }}>xxx</Text>
                    <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: moderateScale(18), color: colors.text, letterSpacing: 1.8 }}>0932</Text>
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <View style={{ gap: moderateScale(2) }}>
                      <Text style={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: moderateScale(10), color: colors.textMuted, textTransform: 'uppercase' }}>
                        Cardholder's Name
                      </Text>
                      <Text style={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: moderateScale(14), color: colors.text, letterSpacing: 0.7, textTransform: 'uppercase' }}>
                        Isabella Steele
                      </Text>
                    </View>
                    <View style={{ gap: moderateScale(2), alignItems: 'flex-end' }}>
                      <Text style={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: moderateScale(10), color: colors.textMuted, textTransform: 'uppercase' }}>
                        Valid Thru
                      </Text>
                      <Text style={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: moderateScale(14), color: colors.text }}>
                        08/25
                      </Text>
                    </View>
                  </View>
                </View>

                </ScrollView>

                {/* Context menu — sibling of ScrollView, not inside overflow:hidden card */}
                {menuVisible && (
                  <View style={{ position: 'absolute', right: scale(0), top: verticalScale(44), width: scale(105), height: verticalScale(64), borderRadius: moderateScale(12), overflow: 'hidden', borderWidth: 1, borderColor: colors.border, zIndex: 10 }}>
                    <BlurView intensity={40} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                    <View style={[StyleSheet.absoluteFill, { backgroundColor: isDark ? 'rgba(20,29,43,0.7)' : 'rgba(250,250,250,0.3)' }]} />

                    <Pressable
                      style={{ flexDirection: 'row', alignItems: 'center', gap: scale(8), paddingHorizontal: scale(8), height: verticalScale(32), borderBottomWidth: 0.5, borderBottomColor: colors.border }}
                      onPress={() => setMenuVisible(false)}
                    >
                      <MaterialCommunityIcons name="pencil-outline" size={moderateScale(16)} color={colors.iconColor} />
                      <Text style={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: moderateScale(14), lineHeight: moderateScale(24), color: colors.text }}>Edit</Text>
                    </Pressable>

                    <Pressable
                      style={{ flexDirection: 'row', alignItems: 'center', gap: scale(8), paddingHorizontal: scale(8), height: verticalScale(32) }}
                      onPress={() => setMenuVisible(false)}
                    >
                      <MaterialCommunityIcons name="close-circle-outline" size={moderateScale(16)} color={isDark ? APP_DARK.statusErrorText : '#EF4444'} />
                      <Text style={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: moderateScale(14), lineHeight: moderateScale(20), color: isDark ? APP_DARK.statusErrorText : '#FF181C' }}>Delete</Text>
                    </Pressable>
                  </View>
                )}
              </View>

              {/* Add new card link */}
              <Pressable
                style={{ flexDirection: 'row', alignItems: 'center', gap: scale(8), marginTop: verticalScale(4) }}
                onPress={() => navigation.navigate('AddCard')}
              >
                <View style={{ width: moderateScale(10.5), height: moderateScale(10.5), borderRadius: moderateScale(5.25), backgroundColor: isDark ? APP_DARK.buttonPrimaryBg : '#31973D', alignItems: 'center', justifyContent: 'center' }}>
                  <MaterialCommunityIcons name="plus" size={moderateScale(8)} color="#FFFFFF" />
                </View>
                <Text style={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: moderateScale(14), lineHeight: moderateScale(20), color: isDark ? APP_DARK.accentGreen : '#31973D' }}>
                  Or add a new one
                </Text>
              </Pressable>
            </View>


            {/* Continue */}
            <Pressable
              style={{ height: verticalScale(48), backgroundColor: isDark ? APP_DARK.buttonPrimaryBg : '#31973D', borderRadius: 999, alignItems: 'center', justifyContent: 'center' }}
              onPress={() => {
                dispatch(upgradeToPremium());
                navigation.navigate('PremiumHome');
              }}
            >
              <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: moderateScale(14), lineHeight: moderateScale(20), color: '#FFFFFF' }}>
                Continue
              </Text>
            </Pressable>

          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default SavedCardsScreen;
