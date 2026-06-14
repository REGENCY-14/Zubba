import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackScreenProps } from '../navigation/types';
import { AppBottomNav } from '../components';

type MethodId = 'wallet' | 'mtn' | 'telecel' | 'airtel';

export function PremiumPaymentScreen({ navigation }: RootStackScreenProps<'PremiumPayment'>) {
  const [selected, setSelected] = React.useState<MethodId>('wallet');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.chevron}>‹</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Payment</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Summary Card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryTopRow}>
              <View style={styles.summaryLeft}>
                <Text style={styles.estimatedLabel}>ESTIMATED COST</Text>
                <Text style={styles.estimatedAmount}>GHS 45.00</Text>
              </View>
              <View style={styles.premiumPill}>
                <Text style={styles.premiumPillText}>Premium</Text>
              </View>
            </View>

            <View style={styles.dashedDivider} />

            <View style={styles.lineItemsGroup}>
              <View style={styles.lineItem}>
                <Text style={styles.lineItemLabel}>Pickup - Organic Waste</Text>
                <Text style={styles.lineItemValue}>GHS 35.00</Text>
              </View>
              <View style={styles.lineItem}>
                <Text style={styles.lineItemLabel}>Service Fee</Text>
                <Text style={styles.lineItemValue}>GHS 10.00</Text>
              </View>
            </View>
          </View>

          {/* Payment Options */}
          <View style={styles.paymentSection}>
            <Text style={styles.sectionTitle}>Select Payment Method</Text>

            <View style={styles.methodsList}>
              {/* Zubba Wallet — premium only */}
              <Pressable
                style={[styles.methodRow, selected === 'wallet' && styles.methodRowSelected]}
                onPress={() => setSelected('wallet')}
              >
                <View style={styles.methodLeft}>
                  <View style={styles.walletIconBox}>
                    <MaterialCommunityIcons name="wallet-outline" size={20} color="#FFFFFF" />
                  </View>
                  <Text style={styles.methodLabel}>Zubba Wallet</Text>
                </View>
                <View style={selected === 'wallet' ? styles.radioOn : styles.radioOff}>
                  {selected === 'wallet' && <View style={styles.radioDot} />}
                </View>
              </Pressable>

              {/* MTN MoMo */}
              <Pressable
                style={[styles.methodRow, selected === 'mtn' && styles.methodRowSelected]}
                onPress={() => setSelected('mtn')}
              >
                <View style={styles.methodLeft}>
                  <View style={styles.mtnIconBox}>
                    <Text style={styles.mtnText}>MTN</Text>
                  </View>
                  <Text style={styles.methodLabel}>MTN MoMo</Text>
                </View>
                <View style={selected === 'mtn' ? styles.radioOn : styles.radioOff}>
                  {selected === 'mtn' && <View style={styles.radioDot} />}
                </View>
              </Pressable>

              {/* Telecel Cash */}
              <Pressable
                style={[styles.methodRow, selected === 'telecel' && styles.methodRowSelected]}
                onPress={() => setSelected('telecel')}
              >
                <View style={styles.methodLeft}>
                  <View style={styles.telecelIconBox}>
                    <Text style={styles.telecelText}>{'Telecel\nCash'}</Text>
                  </View>
                  <Text style={styles.methodLabel}>Telecel Cash</Text>
                </View>
                <View style={selected === 'telecel' ? styles.radioOn : styles.radioOff}>
                  {selected === 'telecel' && <View style={styles.radioDot} />}
                </View>
              </Pressable>

              {/* Airtel money */}
              <Pressable
                style={[styles.methodRow, selected === 'airtel' && styles.methodRowSelected]}
                onPress={() => setSelected('airtel')}
              >
                <View style={styles.methodLeft}>
                  <View style={styles.airtelIconBox}>
                    <Text style={styles.airtelText}>
                      <Text style={{ color: '#0062A3', fontSize: 16, fontWeight: '700' }}>a</Text>
                      <Text style={{ color: '#EF4444', fontSize: 16, fontWeight: '700' }}>t</Text>
                    </Text>
                  </View>
                  <Text style={styles.methodLabel}>Airtel money</Text>
                </View>
                <View style={selected === 'airtel' ? styles.radioOn : styles.radioOff}>
                  {selected === 'airtel' && <View style={styles.radioDot} />}
                </View>
              </Pressable>
            </View>
          </View>

          {/* Continue */}
          <Pressable
            style={styles.continueBtn}
            onPress={() =>
            selected === 'wallet'
              ? navigation.navigate('WalletCheckout')
              : navigation.navigate('WalletNumber')
          }
          >
            <Text style={styles.continueBtnText}>Continue</Text>
          </Pressable>
        </ScrollView>

        <AppBottomNav
          activeTab="home"
          paddingBottom={14}
          onHomePress={() => navigation.navigate('PremiumHome')}
          onSavedPress={() => navigation.navigate('Details', { itemId: 'saved', title: 'Saved' })}
          onSettingsPress={() => navigation.navigate('Settings')}
          onCalendarPress={() => navigation.navigate('Details', { itemId: 'calendar', title: 'Calendar' })}
        />
      </View>
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
    backgroundColor: '#FFFFFF',
  },
  backBtn: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  chevron: { fontSize: 28, color: '#1F2A33', lineHeight: 30 },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#1F2A33' },
  headerSpacer: { width: 24, height: 24 },

  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 120,
    gap: 24,
  },

  /* Summary Card */
  summaryCard: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 24,
    padding: 24,
    gap: 16,
    backgroundColor: '#FFFFFF',
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  summaryLeft: { gap: 4 },
  estimatedLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: '#1F2A33',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  estimatedAmount: {
    fontSize: 14,
    fontWeight: '400',
    color: '#006B23',
    lineHeight: 24,
  },
  premiumPill: {
    backgroundColor: 'rgba(0,107,35,0.10)',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  premiumPillText: { fontSize: 13, color: '#31973D', fontWeight: '400', lineHeight: 20 },

  dashedDivider: {
    height: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(190,202,185,0.3)',
    borderStyle: 'dashed',
    marginTop: 4,
  },

  lineItemsGroup: { gap: 8 },
  lineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lineItemLabel: { fontSize: 15, color: '#1F2A33', fontWeight: '400', lineHeight: 24 },
  lineItemValue: { fontSize: 15, color: '#64748A', fontWeight: '400', lineHeight: 24 },

  /* Payment section */
  paymentSection: { gap: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1F2A33', lineHeight: 24 },
  methodsList: { gap: 16 },

  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    minHeight: 82,
  },
  methodRowSelected: {
    backgroundColor: 'rgba(49,151,61,0.11)',
    borderColor: '#31973D',
  },
  methodLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  methodLabel: { fontSize: 16, fontWeight: '500', color: '#1C1B1B', lineHeight: 24 },

  /* Icon boxes */
  walletIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#31973D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mtnIconBox: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#FFCC00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mtnText: { fontSize: 12, fontWeight: '600', color: '#000000' },
  telecelIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  telecelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 15,
  },
  airtelIconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  airtelText: { fontSize: 16 },

  /* Radio buttons */
  radioOn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#31973D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOff: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#8E7164',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },

  /* Continue button */
  continueBtn: {
    height: 48,
    backgroundColor: '#31973D',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnText: { fontSize: 14, color: '#FFFFFF', fontWeight: '400', lineHeight: 20 },
});

export default PremiumPaymentScreen;
