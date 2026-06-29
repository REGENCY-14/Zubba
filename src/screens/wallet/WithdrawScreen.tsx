import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import type { RootStackScreenProps } from '../../navigation/types';

const QUICK_AMOUNTS = [10, 20, 50, 100, 200];

export function WithdrawScreen({ navigation }: RootStackScreenProps<'Withdraw'>) {
  const [phone, setPhone] = useState('055 123 4567');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState('GHS 50.00');

  const handleAmountChip = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount(`GHS ${amount}.00`);
  };

  const handleAmountChange = (text: string) => {
    setCustomAmount(text);
    setSelectedAmount(null);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top', 'left', 'right']}>

      {/* Header */}
      <View
        style={{
          height: 48,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          backgroundColor: '#FFFFFF',
        }}
      >
        <Pressable
          style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="chevron-left" size={24} color="#0F1621" />
        </Pressable>

        <Text style={{ fontSize: 16, fontWeight: '600', color: '#1F2A33', lineHeight: 24 }}>
          Debit Account
        </Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, padding: 12, paddingBottom: 96 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Form card */}
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderWidth: 1,
            borderColor: '#E2E8F0',
            borderRadius: 24,
            padding: 16,
            gap: 16,
          }}
        >
          {/* Wallet Phone Number */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: '400', letterSpacing: 0.15, color: '#1F2A33', lineHeight: 22 }}>
              Wallet Phone Number
            </Text>

            <TextInput
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="055 123 4567"
              placeholderTextColor="#ACB5BB"
              style={{
                height: 48,
                borderWidth: 1,
                borderColor: '#CBD5E0',
                borderRadius: 9999,
                paddingHorizontal: 12,
                fontSize: 16,
                color: '#1F2A33',
              }}
            />

            <Text style={{ fontSize: 12, fontWeight: '400', color: '#64748A', lineHeight: 16 }}>
              Enter your mobile money number
            </Text>
          </View>

          {/* Amount to withdraw */}
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: '#E2E8F0',
              paddingTop: 8,
              gap: 8,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '400', letterSpacing: 0.15, color: '#1F2A33', lineHeight: 22 }}>
              Amount to withdraw
            </Text>

            <TextInput
              value={customAmount}
              onChangeText={handleAmountChange}
              keyboardType="numeric"
              placeholder="GHS 0.00"
              placeholderTextColor="#ACB5BB"
              style={{
                height: 48,
                borderWidth: 1,
                borderColor: '#CBD5E0',
                borderRadius: 9999,
                paddingHorizontal: 12,
                fontSize: 16,
                color: '#1F2A33',
              }}
            />

            {/* Quick select chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 8, gap: 8 }}
            >
              {QUICK_AMOUNTS.map((amount) => {
                const isSelected = selectedAmount === amount;
                return (
                  <Pressable
                    key={amount}
                    onPress={() => handleAmountChip(amount)}
                    style={{
                      paddingHorizontal: 24,
                      paddingVertical: 9,
                      borderRadius: 9999,
                      backgroundColor: isSelected ? '#31973D' : 'rgba(0, 107, 35, 0.1)',
                      borderWidth: isSelected ? 0 : 1,
                      borderColor: '#E2E8F0',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '400',
                        lineHeight: 24,
                        color: isSelected ? '#FFFFFF' : '#3F4A3D',
                      }}
                    >
                      GHS {amount}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* Bottom "Withdraw" button */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 24,
          paddingBottom: 32,
          paddingTop: 12,
          backgroundColor: '#FFFFFF',
        }}
      >
        <Pressable
          style={{
            height: 48,
            backgroundColor: '#31973D',
            borderRadius: 9999,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => navigation.navigate('ZubbaWallet', { debited: true })}
        >
          <Text style={{ fontSize: 14, fontWeight: '400', color: '#FFFFFF', lineHeight: 20 }}>
            Withdraw
          </Text>
        </Pressable>
      </View>

    </SafeAreaView>
  );
}

export default WithdrawScreen;
