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

export function WalletCheckoutScreen({ navigation }: RootStackScreenProps<'WalletCheckout'>) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right']}>
      <View style={{ flex: 1, backgroundColor: colors.surface }}>
        <View style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderTopWidth: 0, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, paddingBottom: 24 }}>
          <View style={{ height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 }}>
            <Pressable style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }} onPress={() => navigation.goBack()}>
              <Text style={{ fontSize: 28, color: colors.text, lineHeight: 30 }}>‹</Text>
            </Pressable>
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>Payment</Text>
            <View style={{ width: 24, height: 24 }} />
          </View>

          <View style={{ alignItems: 'center', gap: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: 'rgba(255,255,255,0.7)' }}>
              <View style={{ borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: colors.border, backgroundColor: 'rgba(0,107,35,0.10)' }}>
                <Text style={{ fontSize: 13, color: '#31973D', lineHeight: 20 }}>Total to pay</Text>
              </View>
              <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 0.5, color: colors.text }}>GHS</Text>
            </View>

            <Text style={{ fontSize: 48, fontWeight: '700', color: colors.text, lineHeight: 56, letterSpacing: -1.2 }}>GHS 45.00</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#31973D', borderRadius: 999, borderWidth: 2, borderColor: colors.card, paddingHorizontal: 12, paddingVertical: 4 }}>
              <MaterialCommunityIcons name="trending-up" size={12} color="#FFFFFF" />
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#FFFFFF', lineHeight: 16 }}>2X Eco-Points</Text>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16, gap: 10, backgroundColor: colors.surface }}>
          <Pressable
            style={{ width: 32, height: 32, backgroundColor: '#FFE2E2', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => navigation.navigate('PremiumHome')}
          >
            <MaterialCommunityIcons name="close" size={16} color="#EF4444" />
          </Pressable>
          <Pressable
            style={{ flex: 1, height: 40, backgroundColor: '#31973D', borderRadius: 999, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => navigation.navigate('PaymentSuccess', { method: 'Zubba Wallet', phone: '' })}
          >
            <Text style={{ fontSize: 14, color: '#FFFFFF', lineHeight: 20 }}>Pay</Text>
          </Pressable>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 4, paddingBottom: 120, gap: 12 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 24, paddingHorizontal: 16, backgroundColor: colors.card }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.borderLight }}>
              <Text style={{ fontSize: 16, color: colors.textSub, lineHeight: 24 }}>EStimated Cost</Text>
              <Text style={{ fontSize: 16, color: colors.text, fontWeight: '700', lineHeight: 24 }}>GHS 45.00</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.borderLight }}>
              <Text style={{ fontSize: 16, color: colors.textSub, lineHeight: 24 }}>Pickup - Organic Waste</Text>
              <Text style={{ fontSize: 16, color: colors.text, fontWeight: '700', lineHeight: 24 }}>GHS 35.00</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14 }}>
              <Text style={{ fontSize: 16, color: colors.textSub, lineHeight: 24 }}>Service Fee</Text>
              <Text style={{ fontSize: 16, color: colors.text, fontWeight: '700', lineHeight: 24 }}>GHS 10.00</Text>
            </View>
          </View>

          <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 24, padding: 16, gap: 16, backgroundColor: colors.card }}>
            <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 24, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.card }}>
              <View style={{ gap: 4 }}>
                <Text style={{ fontSize: 16, fontWeight: '500', color: colors.text, lineHeight: 24 }}>Zubba Wallet Balance</Text>
                <Text style={{ fontSize: 16, fontWeight: '500', color: colors.textSub, lineHeight: 24 }}>GHS 124.50</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#31973D', lineHeight: 24 }}>READY</Text>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#31973D' }} />
              </View>
            </View>

            <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 24, padding: 20, gap: 12, backgroundColor: colors.card }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, color: colors.textSub, lineHeight: 24 }}>Base Points</Text>
                <Text style={{ fontSize: 16, color: colors.text, lineHeight: 24 }}>45 XP</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={{ fontSize: 16, color: colors.textSub, lineHeight: 24 }}>Premium Multiplier</Text>
                  <MaterialCommunityIcons name="lightning-bolt" size={10} color={colors.text} />
                </View>
                <Text style={{ fontSize: 16, color: colors.text, lineHeight: 24 }}>x 2</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, color: colors.text, lineHeight: 24 }}>Total Reward</Text>
                <Text style={{ fontSize: 16, color: '#31973D', lineHeight: 24 }}>90 Eco-Points</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <AppBottomNav
          activeTab="home"
          paddingBottom={14}
          bottomOffset={8}
          showCalendar
          onHomePress={() => navigation.navigate('PremiumHome')}
          onSavedPress={() => navigation.navigate('Pickups')}
          onSettingsPress={() => navigation.navigate('Settings')}
          onCalendarPress={() => navigation.navigate('Schedule')}
        />
      </View>
    </SafeAreaView>
  );
}

export default WalletCheckoutScreen;
