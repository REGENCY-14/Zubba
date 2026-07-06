import React from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackScreenProps } from '../../navigation/types';
import { AppBottomNav } from '../../components';
import { useTheme } from '../../context/ThemeContext';

type MethodId = 'wallet' | 'mtn' | 'telecel' | 'airtel';

export function PremiumPaymentScreen({ navigation }: RootStackScreenProps<'PremiumPayment'>) {
  const { colors } = useTheme();
  const [selected, setSelected] = React.useState<MethodId>('wallet');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right']}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <View style={{ height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, backgroundColor: colors.bg }}>
          <Pressable className="w-6 h-6 items-center justify-center" onPress={() => navigation.goBack()}>
            <Text style={{ fontSize: 28, color: colors.text, lineHeight: 30 }}>‹</Text>
          </Pressable>
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>Payment</Text>
          <View className="w-6 h-6" />
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 16, paddingBottom: 120, gap: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 24, padding: 24, gap: 16, backgroundColor: colors.card }}>
            <View className="flex-row justify-between items-start">
              <View className="gap-1">
                <Text style={{ fontSize: 16, color: colors.text, textTransform: 'uppercase', letterSpacing: 1.6 }}>ESTIMATED COST</Text>
                <Text className="text-sm text-[#006B23] leading-6">GHS 45.00</Text>
              </View>
              <View style={{ borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: colors.border, backgroundColor: 'rgba(0,107,35,0.10)' }}>
                <Text className="text-[13px] text-[#31973D] leading-5">Premium</Text>
              </View>
            </View>

            <View className="h-0 border-t border-t-[#BECAB9]/30 mt-1" style={{ borderStyle: 'dashed' }} />

            <View className="gap-2">
              <View className="flex-row justify-between items-center">
                <Text style={{ fontSize: 15, color: colors.text, lineHeight: 24 }}>Pickup - Organic Waste</Text>
                <Text style={{ fontSize: 15, color: colors.textSub, lineHeight: 24 }}>GHS 35.00</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text style={{ fontSize: 15, color: colors.text, lineHeight: 24 }}>Service Fee</Text>
                <Text style={{ fontSize: 15, color: colors.textSub, lineHeight: 24 }}>GHS 10.00</Text>
              </View>
            </View>
          </View>

          <View className="gap-4">
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text, lineHeight: 24 }}>Select Payment Method</Text>

            <View className="gap-4">
              <Pressable
                style={[
                  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderWidth: 1, borderRadius: 24, minHeight: 82, backgroundColor: colors.card },
                  selected === 'wallet' ? { borderColor: '#31973D', backgroundColor: 'rgba(49,151,61,0.11)' } : { borderColor: colors.border },
                ]}
                onPress={() => setSelected('wallet')}
              >
                <View className="flex-row items-center gap-4">
                  <View className="w-12 h-12 rounded-xl bg-[#31973D] items-center justify-center">
                    <MaterialCommunityIcons name="wallet-outline" size={20} color="#FFFFFF" />
                  </View>
                  <Text style={{ fontSize: 16, fontWeight: '500', color: colors.text, lineHeight: 24 }}>Zubba Wallet</Text>
                </View>
                <View style={selected === 'wallet'
                  ? { width: 22, height: 22, borderRadius: 11, backgroundColor: '#31973D', alignItems: 'center', justifyContent: 'center' }
                  : { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.surface, borderWidth: 1, borderColor: '#8E7164', alignItems: 'center', justifyContent: 'center' }}>
                  {selected === 'wallet' && <View className="w-2 h-2 rounded-full bg-white" />}
                </View>
              </Pressable>

              <Pressable
                style={[
                  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderWidth: 1, borderRadius: 24, minHeight: 82, backgroundColor: colors.card },
                  selected === 'mtn' ? { borderColor: '#31973D', backgroundColor: 'rgba(49,151,61,0.11)' } : { borderColor: colors.border },
                ]}
                onPress={() => setSelected('mtn')}
              >
                <View className="flex-row items-center gap-4">
                  <View className="w-12 h-12 rounded-lg bg-[#FFCC00] items-center justify-center">
                    <Text className="text-xs font-semibold text-black">MTN</Text>
                  </View>
                  <Text style={{ fontSize: 16, fontWeight: '500', color: colors.text, lineHeight: 24 }}>MTN MoMo</Text>
                </View>
                <View style={selected === 'mtn'
                  ? { width: 22, height: 22, borderRadius: 11, backgroundColor: '#31973D', alignItems: 'center', justifyContent: 'center' }
                  : { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.surface, borderWidth: 1, borderColor: '#8E7164', alignItems: 'center', justifyContent: 'center' }}>
                  {selected === 'mtn' && <View className="w-2 h-2 rounded-full bg-white" />}
                </View>
              </Pressable>

              <Pressable
                style={[
                  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderWidth: 1, borderRadius: 24, minHeight: 82, backgroundColor: colors.card },
                  selected === 'telecel' ? { borderColor: '#31973D', backgroundColor: 'rgba(49,151,61,0.11)' } : { borderColor: colors.border },
                ]}
                onPress={() => setSelected('telecel')}
              >
                <View className="flex-row items-center gap-4">
                  <View className="w-12 h-12 rounded-xl bg-[#DC2626] items-center justify-center">
                    <Text className="text-xs font-bold text-white text-center leading-[15px]">{'Telecel\nCash'}</Text>
                  </View>
                  <Text style={{ fontSize: 16, fontWeight: '500', color: colors.text, lineHeight: 24 }}>Telecel Cash</Text>
                </View>
                <View style={selected === 'telecel'
                  ? { width: 22, height: 22, borderRadius: 11, backgroundColor: '#31973D', alignItems: 'center', justifyContent: 'center' }
                  : { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.surface, borderWidth: 1, borderColor: '#8E7164', alignItems: 'center', justifyContent: 'center' }}>
                  {selected === 'telecel' && <View className="w-2 h-2 rounded-full bg-white" />}
                </View>
              </Pressable>

              <Pressable
                style={[
                  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderWidth: 1, borderRadius: 24, minHeight: 82, backgroundColor: colors.card },
                  selected === 'airtel' ? { borderColor: '#31973D', backgroundColor: 'rgba(49,151,61,0.11)' } : { borderColor: colors.border },
                ]}
                onPress={() => setSelected('airtel')}
              >
                <View className="flex-row items-center gap-4">
                  <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' }}>
                    <Text className="text-base">
                      <Text style={{ color: '#0062A3', fontSize: 16, fontWeight: '700' }}>a</Text>
                      <Text style={{ color: '#EF4444', fontSize: 16, fontWeight: '700' }}>t</Text>
                    </Text>
                  </View>
                  <Text style={{ fontSize: 16, fontWeight: '500', color: colors.text, lineHeight: 24 }}>Airtel money</Text>
                </View>
                <View style={selected === 'airtel'
                  ? { width: 22, height: 22, borderRadius: 11, backgroundColor: '#31973D', alignItems: 'center', justifyContent: 'center' }
                  : { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.surface, borderWidth: 1, borderColor: '#8E7164', alignItems: 'center', justifyContent: 'center' }}>
                  {selected === 'airtel' && <View className="w-2 h-2 rounded-full bg-white" />}
                </View>
              </Pressable>
            </View>
          </View>

          <Pressable
            className="h-12 bg-[#31973D] rounded-full items-center justify-center"
            onPress={() =>
              selected === 'wallet'
                ? navigation.navigate('WalletCheckout')
                : navigation.navigate('WalletNumber')
            }
          >
            <Text className="text-sm text-white leading-5">Continue</Text>
          </Pressable>
        </ScrollView>

        <AppBottomNav
          activeTab="home"
          paddingBottom={14}
          bottomOffset={8}
          showCalendar
          onHomePress={() => navigation.navigate('PremiumHome')}
          onSavedPress={() => navigation.navigate('Details', { itemId: 'saved', title: 'Saved' })}
          onSettingsPress={() => navigation.navigate('Settings')}
          onCalendarPress={() => navigation.navigate('Schedule')}
        />
      </View>
    </SafeAreaView>
  );
}

export default PremiumPaymentScreen;
