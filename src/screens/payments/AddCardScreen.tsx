import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';

const PLAN_TOTALS = ['800/year', '50/month', '550/year'] as const;

function LockIcon() {
  return (
    <View className="w-4 h-4 items-center justify-end">
      <View className="w-2 h-[5px] border-[1.5px] border-white border-b-0 rounded-tl-[4px] rounded-tr-[4px] -mb-[0.5px]" />
      <View className="w-3 h-[9px] bg-white rounded-sm" />
    </View>
  );
}

type ToggleProps = { value: boolean; onValueChange: (v: boolean) => void };

function Toggle({ value, onValueChange }: ToggleProps) {
  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      className={`w-9 h-5 rounded-full ${value ? 'bg-[#31973D]' : 'bg-[#D1D5DB]'}`}
      style={value ? { borderWidth: 1, borderColor: 'rgba(52, 168, 83, 0.5)' } : undefined}
    >
      <View
        className={`absolute w-4 h-4 rounded-full bg-white top-[2px] ${value ? 'left-[18px]' : 'left-[2px]'}`}
      />
    </Pressable>
  );
}

export function AddCardScreen({ navigation, route }: RootStackScreenProps<'AddCard'>) {
  const { colors } = useTheme();
  const planIndex = route.params?.planIndex ?? 1;
  const [cardName, setCardName] = React.useState('');
  const [cardNumber, setCardNumber] = React.useState('');
  const [cvv, setCvv] = React.useState('');
  const [expiry, setExpiry] = React.useState('');
  const [saveCard, setSaveCard] = React.useState(true);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const displayName = cardName.trim() || 'Card Holder';
  const displayNumber = cardNumber || '•••• •••••• ••••••';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right']}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <View style={{ height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 }}>
          <Pressable className="w-6 h-6 items-center justify-center" onPress={() => navigation.goBack()}>
            <Text style={{ fontSize: 28, color: colors.text, lineHeight: 28, marginTop: -2 }}>‹</Text>
          </Pressable>
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>Add Card</Text>
          <View className="w-6 h-6" />
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 24, padding: 16, gap: 16, backgroundColor: colors.card }}>
            <View className="min-h-[200px] rounded-3xl p-6 bg-[#31973D] overflow-hidden justify-between">
              <View className="absolute w-[150px] h-[150px] -right-[30px] -top-[50px] rounded-[75px]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }} />
              <View className="absolute w-[104px] h-[100px] rounded-[50px] -bottom-5" style={{ left: '20%', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

              <View className="flex-row justify-between items-start z-10">
                <View>
                  <Text className="text-base leading-6" style={{ color: 'rgba(255,255,255,0.8)' }}>Card Holder</Text>
                  <Text className="text-base text-white leading-6">{displayName}</Text>
                </View>
                <View className="w-12 h-8 relative items-end justify-center">
                  <View className="w-[25px] h-5 bg-white rounded-[3px]" />
                  <View className="absolute w-8 h-8 left-4 top-0 rounded-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
                </View>
              </View>

              <View className="py-4 z-10">
                <Text className="text-base text-white leading-6" style={{ letterSpacing: 3.2 }}>{displayNumber}</Text>
              </View>

              <View className="flex-row justify-between items-end z-10">
                <View>
                  <Text className="text-base leading-6" style={{ color: 'rgba(255,255,255,0.8)' }}>Current Balance</Text>
                  <Text className="text-base font-bold text-white leading-6">GHS XXXXXXX</Text>
                </View>
                <View className="flex-row items-center">
                  <View className="w-8 h-8 rounded-full border border-white/40" style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />
                  <View className="w-8 h-8 rounded-full border border-white/40 -ml-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
                </View>
              </View>
            </View>

            <View className="gap-4">
              <View className="gap-2">
                <Text style={{ fontSize: 16, color: colors.text, paddingHorizontal: 8, lineHeight: 24 }}>Card Name</Text>
                <TextInput
                  style={{ height: 56, borderWidth: 1, borderColor: colors.border, borderRadius: 28, paddingHorizontal: 16, fontSize: 16, color: colors.text, backgroundColor: colors.surface }}
                  value={cardName}
                  onChangeText={setCardName}
                  placeholder="Chris Evans"
                  placeholderTextColor={colors.textMuted}
                />
              </View>

              <View className="gap-2">
                <Text style={{ fontSize: 16, color: colors.text, paddingHorizontal: 8, lineHeight: 24 }}>Card Number</Text>
                <TextInput
                  style={{ height: 56, borderWidth: 1, borderColor: colors.border, borderRadius: 28, paddingHorizontal: 16, fontSize: 16, color: colors.text, backgroundColor: colors.surface }}
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  placeholder="1245 78412 541236"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="number-pad"
                  maxLength={19}
                />
              </View>

              <View className="flex-row gap-4">
                <View className="flex-1 gap-2">
                  <Text style={{ fontSize: 16, color: colors.text, paddingHorizontal: 8, lineHeight: 24 }}>CVV</Text>
                  <TextInput
                    style={{ height: 56, borderWidth: 1, borderColor: colors.border, borderRadius: 28, paddingHorizontal: 16, fontSize: 16, color: colors.text, backgroundColor: colors.surface }}
                    value={cvv}
                    onChangeText={setCvv}
                    placeholder="***"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="number-pad"
                    maxLength={4}
                    secureTextEntry
                  />
                </View>
                <View className="flex-1 gap-2">
                  <Text style={{ fontSize: 16, color: colors.text, paddingHorizontal: 8, lineHeight: 24 }}>EXPIRED DATE</Text>
                  <TextInput
                    style={{ height: 56, borderWidth: 1, borderColor: colors.border, borderRadius: 28, paddingHorizontal: 16, fontSize: 16, color: colors.text, backgroundColor: colors.surface }}
                    value={expiry}
                    onChangeText={setExpiry}
                    placeholder="MM/YY"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="number-pad"
                    maxLength={5}
                  />
                </View>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 8 }}>
                <Text style={{ fontSize: 16, color: colors.text, lineHeight: 24 }}>Save your card information</Text>
                <Toggle value={saveCard} onValueChange={setSaveCard} />
              </View>
            </View>

            <View className="flex-row justify-between items-center gap-[10px]">
              <View>
                <Text style={{ fontSize: 13, fontWeight: '500', color: colors.text, lineHeight: 24 }}>Total</Text>
                <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text, lineHeight: 24 }}>{PLAN_TOTALS[planIndex]}</Text>
              </View>
              <Pressable
                className="flex-row items-center justify-center gap-2 h-12 flex-1 max-w-[210px] bg-[#31973D] rounded-full px-4"
                onPress={() => setShowSuccess(true)}
              >
                <LockIcon />
                <Text className="text-sm text-white leading-5">Proceed to pay</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>

      <Modal
        visible={showSuccess}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccess(false)}
      >
        <View
          className="flex-1 justify-center items-center px-6"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
        >
          <View style={{ width: '100%', gap: 32, alignItems: 'center', backgroundColor: colors.card, borderRadius: 24, padding: 32 }}>
            <View className="items-center gap-3">
              <Text style={{ fontSize: 36, fontWeight: '500', color: colors.text, textAlign: 'center', lineHeight: 44, letterSpacing: -1.08 }}>Successful</Text>
              <Text style={{ fontSize: 16, color: colors.text, textAlign: 'center', lineHeight: 20, letterSpacing: -0.32 }}>
                {'Enjoy double Eco-Points,priority support,\nand a cleaner tomorrow.'}
              </Text>
            </View>

            <View className="w-full gap-3">
              <Pressable
                className="h-12 bg-[#31973D] rounded-full items-center justify-center"
                onPress={() => {
                  setShowSuccess(false);
                  navigation.navigate('PremiumHome');
                }}
              >
                <Text className="text-sm text-white leading-5">Proceed to Premium</Text>
              </Pressable>
              <Pressable
                style={{ height: 48, backgroundColor: colors.surface, borderRadius: 24, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' }}
                onPress={() => {
                  setShowSuccess(false);
                  navigation.navigate('Home');
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: '500', color: colors.text, lineHeight: 20 }}>Set Package expiry alert</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default AddCardScreen;
