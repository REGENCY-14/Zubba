import React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackScreenProps } from '../../navigation/types';

export function WalletNumberScreen({ navigation }: RootStackScreenProps<'WalletNumber'>) {
  const [phone, setPhone] = React.useState('');
  const [showSuccess, setShowSuccess] = React.useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View className="flex-1 bg-white">
          <View className="h-12 flex-row items-center justify-between px-4">
            <Pressable className="w-6 h-6 items-center justify-center" onPress={() => navigation.goBack()}>
              <Text className="text-[28px] text-[#1F2A33] leading-7 -mt-[2px]">‹</Text>
            </Pressable>
            <Text className="text-base font-semibold text-[#1F2A33]">Payment</Text>
            <View className="w-6 h-6" />
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 16, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View className="border border-[#E2E8F0] rounded-3xl p-4 gap-8 bg-white">
              <View className="gap-6">
                <View className="gap-4">
                  <Text className="text-2xl font-medium text-[#1F2A33] leading-8">Wallet Number</Text>
                  <Text className="text-sm text-[#64748A] leading-[26px]">
                    Enter your wallet number to proceed with the transaction.
                  </Text>
                </View>

                <View className="gap-[7px]">
                  <Text className="text-base text-[#1F2A33] leading-4">Wallet Phone Number</Text>
                  <TextInput
                    className="h-12 border border-[#CBD5E0] rounded-full px-3 text-base text-[#1F2A33] bg-white"
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="055 123 4567"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="phone-pad"
                    autoFocus
                    returnKeyType="done"
                  />
                  <Text className="text-xs text-[#64748A] leading-4">Enter your mobile money number</Text>
                </View>
              </View>

              <Pressable
                className="h-12 bg-[#31973D] rounded-full items-center justify-center"
                onPress={() => setShowSuccess(true)}
              >
                <Text className="text-sm text-white leading-5">Continue</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      <Modal visible={showSuccess} transparent animationType="fade">
        <View
          className="flex-1 items-center justify-center px-6"
          style={{ backgroundColor: 'rgba(255,255,255,0.88)' }}
        >
          <View
            className="w-full bg-white rounded-3xl px-6 py-8 items-center gap-4"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 6 }}
          >
            <Text className="text-[36px] font-medium text-[#1F2A33] text-center">Successful</Text>
            <Text className="text-sm text-[#64748A] text-center leading-[22px]">
              Enjoy double Eco-Points, priority support,{'\n'}and a cleaner tomorrow.
            </Text>
            <Pressable
              className="w-full h-12 bg-[#31973D] rounded-full items-center justify-center mt-2"
              onPress={() => {
                setShowSuccess(false);
                navigation.navigate('PremiumHome');
              }}
            >
              <Text className="text-sm font-medium text-white">Proceed to Premium</Text>
            </Pressable>
            <Pressable
              className="w-full h-12 rounded-full border border-[#31973D] items-center justify-center"
              onPress={() => {
                setShowSuccess(false);
                navigation.navigate('Home');
              }}
            >
              <Text className="text-sm font-medium text-[#31973D]">Set Package expiry alert</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default WalletNumberScreen;
