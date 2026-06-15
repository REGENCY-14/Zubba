import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../../navigation/types';
import { AppBottomNav } from '../../components';

const PLANS = [
  {
    label: 'FAMILY',
    displayName: 'Family',
    price: 'GHS 800.00',
    pricePer: '/year',
    pillText: 'GHS 800.00/year (Family)',
  },
  {
    label: 'MONTHLY',
    displayName: 'Monthly',
    price: 'GHS 50.00',
    pricePer: '/month',
    pillText: 'GHS 50.00/month',
  },
  {
    label: 'YEARLY',
    displayName: 'Yearly',
    price: 'GHS 550.00',
    pricePer: '/year',
    pillText: 'GHS 550.00/year',
  },
] as const;

type PaymentMethod = { id: string; name: string };

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'mtn', name: 'MTN MoMo' },
  { id: 'telecel', name: 'Telecel cash' },
  { id: 'airtel', name: 'Airtel money' },
  { id: 'credit', name: 'Credit Card' },
];

function PaymentBadge({ id }: { id: string }) {
  if (id === 'mtn') {
    return (
      <View style={[styles.payBadge, { backgroundColor: '#FFCC00' }]}>
        <Text style={styles.mtnText}>MTN</Text>
      </View>
    );
  }
  if (id === 'telecel') {
    return (
      <View style={[styles.payBadge, { backgroundColor: '#DC2626' }]}>
        <Text style={styles.telecelText}>T.cash</Text>
      </View>
    );
  }
  if (id === 'airtel') {
    return (
      <View style={[styles.payBadge, { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0' }]}>
        <Text style={styles.airtelText}>
          <Text style={{ color: '#0062A3' }}>a</Text>
          <Text style={{ color: '#EF4444' }}>t</Text>
        </Text>
      </View>
    );
  }
  // Credit Card
  return (
    <View style={[styles.payBadge, { backgroundColor: '#FFF7ED' }]}>
      <View style={styles.creditCardIcon}>
        <View style={styles.creditCardStripe} />
      </View>
    </View>
  );
}

export function ConfirmSubscriptionScreen({ navigation, route }: RootStackScreenProps<'ConfirmSubscription'>) {
  const [selectedIndex, setSelectedIndex] = React.useState(route.params?.planIndex ?? 1);
  const [showPaymentSheet, setShowPaymentSheet] = React.useState(false);
  const [selectedPayment, setSelectedPayment] = React.useState('credit');

  const selected = PLANS[selectedIndex];
  const alternates = PLANS.filter((_, i) => i !== selectedIndex);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <Text style={styles.title}>Payment</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.main} contentContainerStyle={styles.mainContent} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.heading}>Confirm Subscription</Text>

            <Text style={styles.description}>
              {'You selected the '}
              <Text style={styles.descBold}>{selected.displayName} Subscription</Text>
              {'. Enjoy a '}
              <Text style={styles.descBold}>free 7-day trial.</Text>
              {" You won't be charged until your trial ends. Confirm the amount and continue."}
            </Text>

            {/* Price display card */}
            <View style={styles.priceCard}>
              <View style={[styles.glowBlob, styles.glowBlobTopLeft]} />
              <View style={[styles.glowBlob, styles.glowBlobBottomRight]} />
              <Text style={styles.priceAmount}>
                {selected.price}
                <Text style={styles.pricePer}>{selected.pricePer}</Text>
              </Text>
              <Text style={styles.priceCaption}>Enjoy a 7-day free trial and pay afterward.</Text>
            </View>

            {/* Choose another plan */}
            <View style={styles.alternatesSection}>
              <Text style={styles.chooseAnotherLabel}>Choose another plan</Text>
              <View style={styles.alternatePills}>
                {alternates.map((plan) => (
                  <Pressable
                    key={plan.label}
                    style={styles.alternatePill}
                    onPress={() => setSelectedIndex(PLANS.findIndex((p) => p.label === plan.label))}
                  >
                    <Text style={styles.alternatePillText}>{plan.pillText}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Action row */}
            <View style={styles.actionRow}>
              <Pressable style={styles.cancelButton} onPress={() => navigation.goBack()}>
                <Text style={styles.cancelIcon}>✕</Text>
              </Pressable>
              <Pressable
                style={styles.confirmButton}
                onPress={() => setShowPaymentSheet(true)}
              >
                <Text style={styles.confirmText}>Confirm Subscription</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>

        <AppBottomNav
          activeTab="home"
          onHomePress={() => navigation.navigate('LocationSharing')}
          onSavedPress={() => navigation.navigate('Details', { itemId: 'save', title: 'Saved' })}
          onSettingsPress={() => navigation.navigate('Settings')}
        />
      </View>

      {/* Payment method bottom sheet */}
      <Modal
        visible={showPaymentSheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPaymentSheet(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setShowPaymentSheet(false)}>
          <Pressable style={styles.bottomSheet} onPress={() => {}}>
            {/* drag handle */}
            <View style={styles.sheetHandle} />

            {/* title */}
            <View style={styles.sheetTitleRow}>
              <Text style={styles.sheetTitle}>Select  a transfer method</Text>
            </View>

            {/* payment method rows */}
            <View style={styles.methodsList}>
              {PAYMENT_METHODS.map((method) => {
                const isSelected = method.id === selectedPayment;
                return (
                  <Pressable
                    key={method.id}
                    style={styles.methodRow}
                    onPress={() => setSelectedPayment(method.id)}
                  >
                    <View style={styles.methodLeft}>
                      <PaymentBadge id={method.id} />
                      <Text style={styles.methodName}>{method.name}</Text>
                    </View>
                    <View style={[styles.radio, isSelected && styles.radioSelected]}>
                      {isSelected && <View style={styles.radioDot} />}
                    </View>
                  </Pressable>
                );
              })}
            </View>

            {/* sheet action row */}
            <View style={styles.sheetActionRow}>
              <Pressable style={styles.sheetCancelButton} onPress={() => setShowPaymentSheet(false)}>
                <Text style={styles.sheetCancelIcon}>✕</Text>
              </Pressable>
              <Pressable
                style={styles.continueButton}
                onPress={() => {
                  setShowPaymentSheet(false);
                  navigation.navigate('AddCard', { planIndex: selectedIndex });
                }}
              >
                <Text style={styles.continueText}>Continue</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    height: 48,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 28, color: '#1F2A33', lineHeight: 28, marginTop: -2 },
  title: { fontSize: 16, fontWeight: '600', color: '#1F2A33' },
  headerSpacer: { width: 24, height: 24 },
  main: { flex: 1 },
  mainContent: { paddingHorizontal: 12, paddingTop: 16, paddingBottom: 100 },

  card: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 24,
    padding: 16,
    gap: 24,
    backgroundColor: '#FFFFFF',
  },
  heading: { fontSize: 24, fontWeight: '500', color: '#1F2A33', lineHeight: 32 },
  description: { fontSize: 14, lineHeight: 26, color: '#64748A', fontWeight: '400' },
  descBold: { fontWeight: '700', color: '#1F2A33' },

  priceCard: {
    height: 196,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    gap: 8,
  },
  glowBlob: {
    position: 'absolute',
    width: 140,
    height: 120,
    borderRadius: 70,
    backgroundColor: 'rgba(89, 247, 138, 0.45)',
  },
  glowBlobTopLeft: { left: -40, top: -30 },
  glowBlobBottomRight: { right: -10, bottom: -10 },
  priceAmount: { fontSize: 32, fontWeight: '600', color: '#1F2A33', letterSpacing: -2, zIndex: 2 },
  pricePer: { fontSize: 18, fontWeight: '500', color: '#1F2A33', letterSpacing: 0 },
  priceCaption: { fontSize: 10, fontWeight: '600', color: '#64748A', textAlign: 'center', zIndex: 2 },

  alternatesSection: { gap: 6 },
  chooseAnotherLabel: { fontSize: 14, fontWeight: '500', color: '#31973D', lineHeight: 20 },
  alternatePills: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  alternatePill: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 53,
    paddingHorizontal: 10,
    paddingVertical: 4,
    height: 48,
    justifyContent: 'center',
  },
  alternatePillText: { fontSize: 16, fontWeight: '600', color: '#1F2A33', letterSpacing: -1 },

  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cancelButton: {
    width: 40,
    height: 40,
    backgroundColor: '#FFE2E2',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelIcon: { fontSize: 14, color: '#EF4444', fontWeight: '700' },
  confirmButton: {
    flex: 1,
    height: 40,
    backgroundColor: '#31973D',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: { fontSize: 14, fontWeight: '400', color: '#FFFFFF', lineHeight: 20 },

  // Modal overlay
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },

  // Bottom sheet panel
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingBottom: 32,
    paddingTop: 16,
    gap: 16,
  },
  sheetHandle: {
    width: 152,
    height: 3,
    backgroundColor: '#334154',
    borderRadius: 20,
    alignSelf: 'center',
  },
  sheetTitleRow: { paddingHorizontal: 24 },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    lineHeight: 28,
    letterSpacing: -0.03 * 16,
  },

  // Payment method rows
  methodsList: { paddingHorizontal: 20 },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  methodLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },

  // Payment badge (42×26)
  payBadge: {
    width: 42,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mtnText: { fontSize: 12, fontWeight: '600', color: '#000000', fontFamily: 'Inter' },
  telecelText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF', fontFamily: 'Inter' },
  airtelText: { fontSize: 14, fontWeight: '700' },

  // Credit card icon inside badge
  creditCardIcon: {
    width: 20,
    height: 14,
    backgroundColor: '#31973D',
    borderRadius: 3,
    justifyContent: 'flex-start',
    paddingTop: 3,
  },
  creditCardStripe: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.6)',
    marginHorizontal: 2,
  },

  methodName: { fontSize: 14, fontWeight: '400', color: '#1C1B1B', lineHeight: 24 },

  // Radio button
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#8E7164',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    backgroundColor: '#31973D',
    borderColor: '#31973D',
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFFFFF' },

  // Sheet action row
  sheetActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 24,
  },
  sheetCancelButton: {
    width: 40,
    height: 40,
    backgroundColor: '#FFE2E2',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetCancelIcon: { fontSize: 14, color: '#EF4444', fontWeight: '700' },
  continueButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#31973D',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: { fontSize: 14, fontWeight: '400', color: '#FFFFFF', lineHeight: 20 },
});

export default ConfirmSubscriptionScreen;
