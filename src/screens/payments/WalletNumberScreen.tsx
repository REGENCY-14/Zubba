import React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
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
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={styles.screen}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backText}>‹</Text>
            </Pressable>
            <Text style={styles.headerTitle}>Payment</Text>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView
            style={styles.main}
            contentContainerStyle={styles.mainContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.card}>
              {/* Top section */}
              <View style={styles.topSection}>
                {/* Heading + subtitle */}
                <View style={styles.headingSection}>
                  <Text style={styles.heading}>Wallet Number</Text>
                  <Text style={styles.subtitle}>
                    Enter your wallet number to proceed with the transaction.
                  </Text>
                </View>

                {/* Input group */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Wallet Phone Number</Text>
                  <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="055 123 4567"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="phone-pad"
                    autoFocus
                    returnKeyType="done"
                  />
                  <Text style={styles.helpText}>Enter your mobile money number</Text>
                </View>
              </View>

              {/* Continue button */}
              <Pressable
                style={styles.continueButton}
                onPress={() => setShowSuccess(true)}
              >
                <Text style={styles.continueText}>Continue</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      {/* Success overlay */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={successStyles.overlay}>
          <View style={successStyles.card}>
            <Text style={successStyles.heading}>Successful</Text>
            <Text style={successStyles.subtitle}>
              Enjoy double Eco-Points, priority support,{'\n'}and a cleaner tomorrow.
            </Text>
            <Pressable
              style={successStyles.primaryBtn}
              onPress={() => {
                setShowSuccess(false);
                navigation.navigate('PremiumHome');
              }}
            >
              <Text style={successStyles.primaryBtnText}>Proceed to Premium</Text>
            </Pressable>
            <Pressable
              style={successStyles.secondaryBtn}
              onPress={() => {
                setShowSuccess(false);
                navigation.navigate('Home');
              }}
            >
              <Text style={successStyles.secondaryBtnText}>Set Package expiry alert</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 28, color: '#1F2A33', lineHeight: 28, marginTop: -2 },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#1F2A33' },
  headerSpacer: { width: 24, height: 24 },

  main: { flex: 1 },
  mainContent: { paddingHorizontal: 12, paddingTop: 16, paddingBottom: 40 },

  card: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 24,
    padding: 16,
    gap: 32,
    backgroundColor: '#FFFFFF',
  },

  topSection: { gap: 24 },

  headingSection: { gap: 16 },
  heading: { fontSize: 24, fontWeight: '500', color: '#1F2A33', lineHeight: 32 },
  subtitle: { fontSize: 14, fontWeight: '400', color: '#64748A', lineHeight: 26 },

  inputGroup: { gap: 7 },
  inputLabel: { fontSize: 16, fontWeight: '400', color: '#1F2A33', lineHeight: 16 },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderRadius: 999,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#1F2A33',
    backgroundColor: '#FFFFFF',
  },
  helpText: { fontSize: 12, fontWeight: '400', color: '#64748A', lineHeight: 16 },

  continueButton: {
    height: 48,
    backgroundColor: '#31973D',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: { fontSize: 14, fontWeight: '400', color: '#FFFFFF', lineHeight: 20 },
});

const successStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  heading: {
    fontSize: 36,
    fontWeight: '500',
    color: '#1F2A33',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#64748A',
    textAlign: 'center',
    lineHeight: 22,
  },
  primaryBtn: {
    width: '100%',
    height: 48,
    backgroundColor: '#31973D',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  secondaryBtn: {
    width: '100%',
    height: 48,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#31973D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#31973D',
  },
});

export default WalletNumberScreen;
