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
import { APP_DARK } from '../../constants/appDarkTheme';
import { scale, verticalScale, moderateScale } from '../../utils/scale';
import {
  getMethodLabel,
  mapMethodToChannel,
  mapMethodToProvider,
  type PaymentMethodId,
} from '../../utils/paymentProviders';

export function PremiumPaymentScreen({ navigation }: RootStackScreenProps<'PremiumPayment'>) {
  const [selected, setSelected] = React.useState<PaymentMethodId>('wallet');
  const { colors, isDark } = useTheme();

  return (
    <SafeAreaView style={{ backgroundColor: colors.bg }} className="flex-1" edges={['top', 'left', 'right']}>
      <View style={{ backgroundColor: colors.bg }} className="flex-1">
        <View style={{ backgroundColor: colors.bg }} className="h-12 flex-row items-center justify-between px-4">
          <Pressable className="w-6 h-6 items-center justify-center" onPress={() => navigation.goBack()}>
            <Text style={{ color: colors.text }} className="text-[28px] leading-[30px]">‹</Text>
          </Pressable>
          <Text style={{ color: colors.text }} className="text-base font-semibold">Payment</Text>
          <View className="w-6 h-6" />
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: scale(12), paddingTop: verticalScale(16), paddingBottom: verticalScale(120), gap: verticalScale(24) }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ borderColor: colors.border, backgroundColor: colors.card }} className="border rounded-3xl p-6 gap-4">
            <View className="flex-row justify-between items-start">
              <View className="gap-1">
                <Text style={{ letterSpacing: 1.6, color: colors.text }} className="text-base uppercase">ESTIMATED COST</Text>
                <Text style={{ color: isDark ? APP_DARK.statusSuccessText : '#31973D' }} className="text-sm leading-6">GHS 45.00</Text>
              </View>
              <View style={{ borderColor: colors.border, backgroundColor: isDark ? APP_DARK.statusSuccessBg : 'rgba(0,107,35,0.10)' }} className="rounded-full px-3 py-[6px] border">
                <Text style={{ color: isDark ? APP_DARK.statusSuccessText : '#31973D' }} className="text-[13px] leading-5">Premium</Text>
              </View>
            </View>

            <View style={{ borderStyle: 'dashed', borderTopColor: colors.borderLight }} className="h-0 border-t mt-1" />

            <View className="gap-2">
              <View className="flex-row justify-between items-center">
                <Text style={{ color: colors.text }} className="text-[15px] leading-6">Pickup - Organic Waste</Text>
                <Text style={{ color: colors.textSub }} className="text-[15px] leading-6">GHS 35.00</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text style={{ color: colors.text }} className="text-[15px] leading-6">Service Fee</Text>
                <Text style={{ color: colors.textSub }} className="text-[15px] leading-6">GHS 10.00</Text>
              </View>
            </View>
          </View>

          <View className="gap-4">
            <Text style={{ color: colors.text }} className="text-base font-bold leading-6">Select Payment Method</Text>

            <View className="gap-4">
              <Pressable
                style={{
                  borderColor: selected === 'wallet' ? (isDark ? APP_DARK.statusSuccessBorder : '#31973D') : colors.border,
                  backgroundColor: selected === 'wallet' ? (isDark ? APP_DARK.statusSuccessBg : 'rgba(49,151,61,0.11)') : colors.card,
                }}
                className="flex-row items-center justify-between p-4 border rounded-3xl min-h-[82px]"
                onPress={() => setSelected('wallet')}
              >
                <View className="flex-row items-center gap-4">
                  <View style={{ backgroundColor: isDark ? APP_DARK.accentGreen : '#31973D' }} className="w-12 h-12 rounded-xl items-center justify-center">
                    <MaterialCommunityIcons name="wallet-outline" size={moderateScale(20)} color="#FFFFFF" />
                  </View>
                  <Text style={{ color: colors.text }} className="text-base font-medium leading-6">{getMethodLabel('wallet')}</Text>
                </View>
                <View
                  style={{
                    backgroundColor: selected === 'wallet' ? (isDark ? APP_DARK.accentGreen : '#31973D') : colors.card,
                    borderColor: selected === 'wallet' ? (isDark ? APP_DARK.accentGreen : '#31973D') : (isDark ? APP_DARK.border : '#8E7164'),
                  }}
                  className={`items-center justify-center border ${selected === 'wallet' ? 'w-[22px] h-[22px] rounded-[11px]' : 'w-5 h-5 rounded-[10px]'}`}
                >
                  {selected === 'wallet' && <View className="w-2 h-2 rounded-full bg-white" />}
                </View>
              </Pressable>

              <Pressable
                style={{
                  borderColor: selected === 'mobile_money' ? (isDark ? APP_DARK.statusSuccessBorder : '#31973D') : colors.border,
                  backgroundColor: selected === 'mobile_money' ? (isDark ? APP_DARK.statusSuccessBg : 'rgba(49,151,61,0.11)') : colors.card,
                }}
                className="flex-row items-center justify-between p-4 border rounded-3xl min-h-[82px]"
                onPress={() => setSelected('mobile_money')}
              >
                <View className="flex-row items-center gap-4">
                  <View
                    className="w-12 h-12 rounded-lg bg-[#FFCC00] items-center justify-center"
                    style={isDark ? { borderWidth: 1, borderColor: APP_DARK.border } : null}
                  >
                    <Text className="text-xs font-semibold text-black">MOMO</Text>
                  </View>
                  <Text style={{ color: colors.text }} className="text-base font-medium leading-6">{getMethodLabel('mobile_money')}</Text>
                </View>
                <View
                  style={{
                    backgroundColor: selected === 'mobile_money' ? (isDark ? APP_DARK.accentGreen : '#31973D') : colors.card,
                    borderColor: selected === 'mobile_money' ? (isDark ? APP_DARK.accentGreen : '#31973D') : (isDark ? APP_DARK.border : '#8E7164'),
                  }}
                  className={`items-center justify-center border ${selected === 'mobile_money' ? 'w-[22px] h-[22px] rounded-[11px]' : 'w-5 h-5 rounded-[10px]'}`}
                >
                  {selected === 'mobile_money' && <View className="w-2 h-2 rounded-full bg-white" />}
                </View>
              </Pressable>

              <Pressable
                style={{
                  borderColor: selected === 'card' ? (isDark ? APP_DARK.statusSuccessBorder : '#31973D') : colors.border,
                  backgroundColor: selected === 'card' ? (isDark ? APP_DARK.statusSuccessBg : 'rgba(49,151,61,0.11)') : colors.card,
                }}
                className="flex-row items-center justify-between p-4 border rounded-3xl min-h-[82px]"
                onPress={() => setSelected('card')}
              >
                <View className="flex-row items-center gap-4">
                  <View style={{ backgroundColor: isDark ? APP_DARK.statusSuccessBg : '#E8F2E8' }} className="w-12 h-12 rounded-xl items-center justify-center">
                    <MaterialCommunityIcons name="credit-card-outline" size={moderateScale(20)} color={isDark ? APP_DARK.statusSuccessText : '#31973D'} />
                  </View>
                  <Text style={{ color: colors.text }} className="text-base font-medium leading-6">{getMethodLabel('card')}</Text>
                </View>
                <View
                  style={{
                    backgroundColor: selected === 'card' ? (isDark ? APP_DARK.accentGreen : '#31973D') : colors.card,
                    borderColor: selected === 'card' ? (isDark ? APP_DARK.accentGreen : '#31973D') : (isDark ? APP_DARK.border : '#8E7164'),
                  }}
                  className={`items-center justify-center border ${selected === 'card' ? 'w-[22px] h-[22px] rounded-[11px]' : 'w-5 h-5 rounded-[10px]'}`}
                >
                  {selected === 'card' && <View className="w-2 h-2 rounded-full bg-white" />}
                </View>
              </Pressable>
            </View>
          </View>

          <Pressable
            style={{ backgroundColor: isDark ? APP_DARK.buttonPrimaryBg : '#31973D' }}
            className="h-12 rounded-full items-center justify-center"
            onPress={() => {
              if (selected === 'wallet') {
                navigation.navigate('WalletCheckout');
                return;
              }

              navigation.navigate('PaymentMethod', {
                provider: mapMethodToProvider(selected),
                methodLabel: getMethodLabel(selected),
                channel: mapMethodToChannel(selected),
              });
            }}
          >
            <Text className="text-sm text-white leading-5">Continue</Text>
          </Pressable>
        </ScrollView>

        <AppBottomNav
          activeTab="home"
          paddingBottom={14}
          bottomOffset={8}
          navigation={navigation}
        />
      </View>
    </SafeAreaView>
  );
}

export default PremiumPaymentScreen;
