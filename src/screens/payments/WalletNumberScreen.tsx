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
import { useTheme } from '../../context/ThemeContext';

export function WalletNumberScreen({ navigation }: RootStackScreenProps<'WalletNumber'>) {
  const [phone, setPhone] = React.useState('');
  const [showSuccess, setShowSuccess] = React.useState(false);
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={{ flex: 1, backgroundColor: colors.bg }}>
          <View style={{ height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 }}>
            <Pressable style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }} onPress={() => navigation.goBack()}>
              <Text style={{ fontSize: 28, color: colors.text, lineHeight: 28, marginTop: -2 }}>‹</Text>
            </Pressable>
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>Payment</Text>
            <View style={{ width: 24, height: 24 }} />
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 16, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 24, padding: 16, gap: 32, backgroundColor: colors.card }}>
              <View style={{ gap: 24 }}>
                <View style={{ gap: 16 }}>
                  <Text style={{ fontSize: 24, fontWeight: '500', color: colors.text, lineHeight: 32 }}>Wallet Number</Text>
                  <Text style={{ fontSize: 14, color: colors.textSub, lineHeight: 26 }}>
                    Enter your wallet number to proceed with the transaction.
                  </Text>
                </View>

                <View style={{ gap: 7 }}>
                  <Text style={{ fontSize: 16, color: colors.text, lineHeight: 16 }}>Wallet Phone Number</Text>
                  <TextInput
                    style={{
                      height: 48,
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: 999,
                      paddingHorizontal: 12,
                      fontSize: 16,
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
                  <Text style={{ fontSize: 12, color: colors.textSub, lineHeight: 16 }}>Enter your mobile money number</Text>
                </View>
              </View>

              <Pressable
                style={{ height: 48, backgroundColor: '#31973D', borderRadius: 999, alignItems: 'center', justifyContent: 'center' }}
                onPress={() => setShowSuccess(true)}
              >
                <Text style={{ fontSize: 14, color: '#FFFFFF', lineHeight: 20 }}>Continue</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      <Modal visible={showSuccess} transparent animationType="fade">
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <View
            style={{ width: '100%', backgroundColor: colors.card, borderRadius: 24, paddingHorizontal: 24, paddingVertical: 32, alignItems: 'center', gap: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 6 }}
          >
            <Text style={{ fontSize: 36, fontWeight: '500', color: colors.text, textAlign: 'center' }}>Successful</Text>
            <Text style={{ fontSize: 14, color: colors.textSub, textAlign: 'center', lineHeight: 22 }}>
              Enjoy double Eco-Points, priority support,{'\n'}and a cleaner tomorrow.
            </Text>
            <Pressable
              style={{ width: '100%', height: 48, backgroundColor: '#31973D', borderRadius: 999, alignItems: 'center', justifyContent: 'center', marginTop: 8 }}
              onPress={() => {
                setShowSuccess(false);
                navigation.navigate('Home');
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#FFFFFF' }}>Proceed to Premium</Text>
            </Pressable>
            <Pressable
              style={{ width: '100%', height: 48, borderRadius: 999, borderWidth: 1, borderColor: '#31973D', alignItems: 'center', justifyContent: 'center' }}
              onPress={() => {
                setShowSuccess(false);
                navigation.navigate('Home');
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#31973D' }}>Set Package expiry alert</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default WalletNumberScreen;
