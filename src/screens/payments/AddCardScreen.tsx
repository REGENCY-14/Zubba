import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../../navigation/types';

const PLAN_TOTALS = ['800/year', '50/month', '550/year'] as const;

function LockIcon() {
  return (
    <View style={lockStyles.container}>
      <View style={lockStyles.shackle} />
      <View style={lockStyles.body} />
    </View>
  );
}

const lockStyles = StyleSheet.create({
  container: { width: 16, height: 16, alignItems: 'center', justifyContent: 'flex-end' },
  shackle: {
    width: 8,
    height: 5,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    borderBottomWidth: 0,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    marginBottom: -0.5,
  },
  body: { width: 12, height: 9, backgroundColor: '#FFFFFF', borderRadius: 2 },
});

type ToggleProps = { value: boolean; onValueChange: (v: boolean) => void };

function Toggle({ value, onValueChange }: ToggleProps) {
  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      style={[toggleStyles.track, value && toggleStyles.trackOn]}
    >
      <View style={[toggleStyles.thumb, value && toggleStyles.thumbOn]} />
    </Pressable>
  );
}

const toggleStyles = StyleSheet.create({
  track: {
    width: 36,
    height: 20,
    borderRadius: 9999,
    backgroundColor: '#D1D5DB',
  },
  trackOn: {
    backgroundColor: '#31973D',
    borderWidth: 1,
    borderColor: 'rgba(52, 168, 83, 0.5)',
  },
  thumb: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 9999,
    backgroundColor: '#FFFFFF',
    top: 2,
    left: 2,
  },
  thumbOn: { left: 18 },
});

export function AddCardScreen({ navigation, route }: RootStackScreenProps<'AddCard'>) {
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
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Add Card</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.main}
          contentContainerStyle={styles.mainContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.outerCard}>
            {/* Hero card visualization */}
            <View style={styles.heroCard}>
              <View style={styles.heroBlobTopRight} />
              <View style={styles.heroBlobBottomLeft} />

              {/* Cardholder + chip */}
              <View style={styles.heroTopRow}>
                <View>
                  <Text style={styles.heroLabel}>Card Holder</Text>
                  <Text style={styles.heroName}>{displayName}</Text>
                </View>
                <View style={styles.chipArea}>
                  <View style={styles.chipRect} />
                  <View style={styles.chipGlow} />
                </View>
              </View>

              {/* Card number */}
              <View style={styles.heroNumberRow}>
                <Text style={styles.heroNumber}>{displayNumber}</Text>
              </View>

              {/* Balance + network circles */}
              <View style={styles.heroBottomRow}>
                <View>
                  <Text style={styles.heroLabel}>Current Balance</Text>
                  <Text style={styles.heroBalance}>GHS XXXXXXX</Text>
                </View>
                <View style={styles.networkCircles}>
                  <View style={styles.circle1} />
                  <View style={styles.circle2} />
                </View>
              </View>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Card Name</Text>
                <TextInput
                  style={styles.input}
                  value={cardName}
                  onChangeText={setCardName}
                  placeholder="Chris Evans"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Card Number</Text>
                <TextInput
                  style={styles.input}
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  placeholder="1245 78412 541236"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                  maxLength={19}
                />
              </View>

              <View style={styles.halfRow}>
                <View style={[styles.fieldGroup, styles.halfField]}>
                  <Text style={styles.fieldLabel}>CVV</Text>
                  <TextInput
                    style={styles.input}
                    value={cvv}
                    onChangeText={setCvv}
                    placeholder="***"
                    placeholderTextColor="#6B7280"
                    keyboardType="number-pad"
                    maxLength={4}
                    secureTextEntry
                  />
                </View>
                <View style={[styles.fieldGroup, styles.halfField]}>
                  <Text style={styles.fieldLabel}>EXPIRED DATE</Text>
                  <TextInput
                    style={styles.input}
                    value={expiry}
                    onChangeText={setExpiry}
                    placeholder="MM/YY"
                    placeholderTextColor="#6B7280"
                    keyboardType="number-pad"
                    maxLength={5}
                  />
                </View>
              </View>

              <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>Save your card information</Text>
                <Toggle value={saveCard} onValueChange={setSaveCard} />
              </View>
            </View>

            {/* Bottom action */}
            <View style={styles.bottomAction}>
              <View>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalAmount}>{PLAN_TOTALS[planIndex]}</Text>
              </View>
              <Pressable
                style={styles.proceedButton}
                onPress={() => setShowSuccess(true)}
              >
                <LockIcon />
                <Text style={styles.proceedText}>Proceed to pay</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
      {/* Success overlay */}
      <Modal
        visible={showSuccess}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccess(false)}
      >
        <View style={successStyles.overlay}>
          <View style={successStyles.content}>
            {/* Heading + subtitle */}
            <View style={successStyles.textSection}>
              <Text style={successStyles.heading}>Successful</Text>
              <Text style={successStyles.subtitle}>
                {'Enjoy double Eco-Points,priority support,\nand a cleaner tomorrow.'}
              </Text>
            </View>

            {/* Action buttons */}
            <View style={successStyles.buttons}>
              <Pressable
                style={successStyles.primaryButton}
                onPress={() => {
                  setShowSuccess(false);
                  navigation.navigate('PremiumHome');
                }}
              >
                <Text style={successStyles.primaryButtonText}>Proceed to Premium</Text>
              </Pressable>
              <Pressable
                style={successStyles.secondaryButton}
                onPress={() => {
                  setShowSuccess(false);
                  navigation.navigate('Home');
                }}
              >
                <Text style={successStyles.secondaryButtonText}>Set Package expiry alert</Text>
              </Pressable>
            </View>
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

  outerCard: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 24,
    padding: 16,
    gap: 16,
    backgroundColor: '#FFFFFF',
  },

  // Hero card
  heroCard: {
    minHeight: 200,
    borderRadius: 24,
    padding: 24,
    backgroundColor: '#31973D',
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  heroBlobTopRight: {
    position: 'absolute',
    width: 150,
    height: 150,
    right: -30,
    top: -50,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 75,
  },
  heroBlobBottomLeft: {
    position: 'absolute',
    width: 104,
    height: 100,
    left: '20%',
    bottom: -20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 50,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 2,
  },
  heroLabel: { fontSize: 16, color: 'rgba(255,255,255,0.8)', lineHeight: 24 },
  heroName: { fontSize: 16, color: '#FFFFFF', lineHeight: 24 },
  chipArea: {
    width: 48,
    height: 32,
    position: 'relative',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  chipRect: {
    width: 25,
    height: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
    zIndex: 0,
  },
  chipGlow: {
    position: 'absolute',
    width: 32,
    height: 32,
    left: 16,
    top: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 9999,
    zIndex: 1,
  },
  heroNumberRow: { paddingVertical: 16, zIndex: 2 },
  heroNumber: { fontSize: 16, color: '#FFFFFF', letterSpacing: 3.2, lineHeight: 24 },
  heroBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    zIndex: 2,
  },
  heroBalance: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', lineHeight: 24 },
  networkCircles: { flexDirection: 'row', alignItems: 'center' },
  circle1: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  circle2: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    marginLeft: -12,
  },

  // Form
  form: { gap: 16 },
  fieldGroup: { gap: 8 },
  fieldLabel: { fontSize: 16, color: '#1F2A33', paddingHorizontal: 8, lineHeight: 24 },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 999,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1F2A33',
    backgroundColor: '#FFFFFF',
  },
  halfRow: { flexDirection: 'row', gap: 16 },
  halfField: { flex: 1 },

  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  toggleLabel: { fontSize: 16, color: '#1F2A33', lineHeight: 24 },

  // Bottom action
  bottomAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  totalLabel: { fontSize: 13, fontWeight: '500', color: '#1F2A33', lineHeight: 24 },
  totalAmount: { fontSize: 20, fontWeight: '700', color: '#1F2A33', lineHeight: 24 },
  proceedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    flex: 1,
    maxWidth: 210,
    backgroundColor: '#31973D',
    borderRadius: 999,
    paddingHorizontal: 16,
  },
  proceedText: { fontSize: 14, color: '#FFFFFF', lineHeight: 20 },
});

const successStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  content: {
    width: '100%',
    gap: 32,
    alignItems: 'center',
  },
  textSection: {
    alignItems: 'center',
    gap: 12,
  },
  heading: {
    fontSize: 36,
    fontWeight: '500',
    letterSpacing: -0.03 * 36,
    color: '#0F1621',
    textAlign: 'center',
    lineHeight: 44,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: -0.02 * 16,
    color: '#1F2A33',
    textAlign: 'center',
    lineHeight: 20,
  },
  buttons: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    height: 48,
    backgroundColor: '#31973D',
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  secondaryButton: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2A33',
    lineHeight: 20,
  },
});

export default AddCardScreen;
