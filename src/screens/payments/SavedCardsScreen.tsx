import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';

type MethodId = 'mtn' | 'telecel' | 'airtel';

function ContactlessIcon() {
  return (
    <View style={{ width: 25, height: 25, borderRadius: 12.5, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
      <MaterialCommunityIcons name="contactless-payment" size={14} color="#31973D" />
    </View>
  );
}

function MastercardIcon() {
  return (
    <View style={{ width: 32, height: 20, flexDirection: 'row' }}>
      <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'rgba(235,0,27,0.8)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' }} />
      <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'rgba(247,158,27,0.4)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)', marginLeft: -8 }} />
    </View>
  );
}

export function SavedCardsScreen({ navigation }: RootStackScreenProps<'SavedCards'>) {
  const { colors } = useTheme();
  const [selectedMethod, setSelectedMethod] = React.useState<MethodId>('mtn');
  const [menuVisible, setMenuVisible] = React.useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right']}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>

        {/* Header */}
        <View style={{ height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 }}>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={{ fontSize: 28, color: colors.text, lineHeight: 28, marginTop: -2 }}>‹</Text>
          </Pressable>
          <Text style={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: 16, lineHeight: 24, color: '#1F2A33' }}>Payment</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          <View style={{ borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 24, padding: 16, gap: 16, backgroundColor: '#FFFFFF' }}>

            {/* ── Payment method tiles ── */}
            <View style={{ gap: 16 }}>
              <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: 16, lineHeight: 24, color: '#1C1B1B' }}>
                Select your payment method.
              </Text>

              <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
                {/* MTN */}
                <Pressable
                  onPress={() => setSelectedMethod('mtn')}
                  style={{ width: 102, height: 95, borderRadius: 11, borderWidth: 2, borderColor: selectedMethod === 'mtn' ? '#31973D' : 'transparent', alignItems: 'center', justifyContent: 'center', padding: 4 }}
                >
                  <View style={{ width: 84, height: 78, backgroundColor: '#FFCC00', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: 12, color: '#000000' }}>MTN</Text>
                  </View>
                </Pressable>

                {/* Telecel */}
                <Pressable
                  onPress={() => setSelectedMethod('telecel')}
                  style={{ width: 102, height: 95, borderRadius: 11, borderWidth: 2, borderColor: selectedMethod === 'telecel' ? '#31973D' : 'transparent', alignItems: 'center', justifyContent: 'center', padding: 4 }}
                >
                  <View style={{ width: 84, height: 78, backgroundColor: '#DC2626', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontFamily: 'Poppins', fontWeight: '700', fontSize: 12, color: '#FFFFFF', textAlign: 'center', lineHeight: 15 }}>{'Telecel\nCash'}</Text>
                  </View>
                </Pressable>

                {/* Airtel */}
                <Pressable
                  onPress={() => setSelectedMethod('airtel')}
                  style={{ width: 102, height: 95, borderRadius: 11, borderWidth: 2, borderColor: selectedMethod === 'airtel' ? '#31973D' : 'transparent', alignItems: 'center', justifyContent: 'center', padding: 4 }}
                >
                  <View style={{ width: 84, height: 78, backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' }}>
                    <Text>
                      <Text style={{ color: '#0062A3', fontSize: 16, fontWeight: '700' }}>a</Text>
                      <Text style={{ color: '#EF4444', fontSize: 16, fontWeight: '700' }}>t</Text>
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>

            {/* ── Saved cards ── */}
            <View style={{ gap: 8 }}>
              <Text style={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: 14, lineHeight: 17, letterSpacing: 0.28, color: '#3F4A3D' }}>
                Select your card
              </Text>

              {/* Wrapper gives context menu a non-clipped positioning parent */}
              <View style={{ position: 'relative' }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>

                  {/* Primary green card — overflow:hidden only clips the card itself */}
                  <View style={{ width: 280, height: 170, borderRadius: 24, overflow: 'hidden' }}>
                    <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#006B23' }]} />
                    <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#31973D', opacity: 0.85 }]} />

                    <View style={{ flex: 1, padding: 24, justifyContent: 'space-between' }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <ContactlessIcon />
                        <Pressable onPress={() => setMenuVisible(v => !v)} hitSlop={8}>
                          <MaterialCommunityIcons name="dots-vertical" size={20} color="#FFFFFF" />
                        </Pressable>
                      </View>

                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                        <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>xxx</Text>
                        <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>xxx</Text>
                        <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>xxx</Text>
                        <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: 18, color: '#FFFFFF', letterSpacing: 1.8 }}>0932</Text>
                      </View>

                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <View style={{ gap: 2 }}>
                          <Text style={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: 10, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Cardholder's Name</Text>
                          <Text style={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: 14, color: '#FFFFFF', letterSpacing: 0.7, textTransform: 'uppercase' }}>Isabella Steele</Text>
                        </View>
                        <View style={{ gap: 2, alignItems: 'flex-end' }}>
                          <Text style={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: 10, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Valid Thru</Text>
                          <Text style={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: 14, color: '#FFFFFF' }}>08/25</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Secondary placeholder card */}
                <View style={{ width: 280, height: 170, borderRadius: 24, backgroundColor: '#E2E2E5', opacity: 0.6, borderWidth: 1, borderColor: 'rgba(190,202,185,0.3)', padding: 24, justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <MastercardIcon />
                    <Text style={{ fontFamily: 'Poppins', fontStyle: 'italic', fontWeight: '700', fontSize: 20, color: '#1F2A33' }}>VISA</Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                    <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: 14, color: 'rgba(31,42,51,0.8)' }}>xxx</Text>
                    <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: 14, color: 'rgba(31,42,51,0.8)' }}>xxx</Text>
                    <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: 14, color: 'rgba(31,42,51,0.8)' }}>xxx</Text>
                    <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: 18, color: '#1F2A33', letterSpacing: 1.8 }}>0932</Text>
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <View style={{ gap: 2 }}>
                      <Text style={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: 10, color: 'rgba(31,42,51,0.6)', textTransform: 'uppercase' }}>
                        Cardholder's Name
                      </Text>
                      <Text style={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: 14, color: '#1F2A33', letterSpacing: 0.7, textTransform: 'uppercase' }}>
                        Isabella Steele
                      </Text>
                    </View>
                    <View style={{ gap: 2, alignItems: 'flex-end' }}>
                      <Text style={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: 10, color: 'rgba(31,42,51,0.6)', textTransform: 'uppercase' }}>
                        Valid Thru
                      </Text>
                      <Text style={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: 14, color: '#1F2A33' }}>
                        08/25
                      </Text>
                    </View>
                  </View>
                </View>

                </ScrollView>

                {/* Context menu — sibling of ScrollView, not inside overflow:hidden card */}
                {menuVisible && (
                  <View style={{ position: 'absolute', right: 0, top: 44, width: 105, height: 64, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#E2E8F0', zIndex: 10 }}>
                    <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFillObject} />
                    <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(250,250,250,0.3)' }]} />

                    <Pressable
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 8, height: 32, borderBottomWidth: 0.5, borderBottomColor: '#E2E8F0' }}
                      onPress={() => setMenuVisible(false)}
                    >
                      <MaterialCommunityIcons name="pencil-outline" size={16} color="#334154" />
                      <Text style={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: 14, lineHeight: 24, color: '#18181B' }}>Edit</Text>
                    </Pressable>

                    <Pressable
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 8, height: 32 }}
                      onPress={() => setMenuVisible(false)}
                    >
                      <MaterialCommunityIcons name="close-circle-outline" size={16} color="#EF4444" />
                      <Text style={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: 14, lineHeight: 20, color: '#FF181C' }}>Delete</Text>
                    </Pressable>
                  </View>
                )}
              </View>

              {/* Add new card link */}
              <Pressable
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}
                onPress={() => navigation.navigate('AddCard')}
              >
                <View style={{ width: 10.5, height: 10.5, borderRadius: 5.25, backgroundColor: '#31973D', alignItems: 'center', justifyContent: 'center' }}>
                  <MaterialCommunityIcons name="plus" size={8} color="#FFFFFF" />
                </View>
                <Text style={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: 14, lineHeight: 20, color: '#31973D' }}>
                  Or add a new one
                </Text>
              </Pressable>
            </View>


            {/* Continue */}
            <Pressable
              style={{ height: 48, backgroundColor: '#31973D', borderRadius: 999, alignItems: 'center', justifyContent: 'center' }}
              onPress={() => navigation.navigate('PremiumHome')}
            >
              <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: 14, lineHeight: 20, color: '#FFFFFF' }}>
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
