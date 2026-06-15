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
import type { RootStackScreenProps } from '../../navigation/types';
import { AppBottomNav } from '../../components';

export function WalletCheckoutScreen({ navigation }: RootStackScreenProps<'WalletCheckout'>) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.screen}>

        {/* Top white hero card */}
        <View style={styles.topCard}>
          <View style={styles.header}>
            <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.chevron}>‹</Text>
            </Pressable>
            <Text style={styles.headerTitle}>Payment</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.amountSection}>
            {/* "Total to pay  GHS" label row */}
            <View style={styles.totalLabelWrap}>
              <View style={styles.totalPill}>
                <Text style={styles.totalPillText}>Total to pay</Text>
              </View>
              <Text style={styles.ghsLabel}>GHS</Text>
            </View>

            {/* Big amount */}
            <Text style={styles.amountText}>GHS 45.00</Text>

            {/* 2X Eco-Points badge */}
            <View style={styles.ecoBadge}>
              <MaterialCommunityIcons name="trending-up" size={12} color="#FFFFFF" />
              <Text style={styles.ecoBadgeText}>2X Eco-Points</Text>
            </View>
          </View>
        </View>

        {/* Action row: X cancel + Pay */}
        <View style={styles.actionRow}>
          <Pressable
            style={styles.xBtn}
            onPress={() => navigation.navigate('PremiumHome')}
          >
            <MaterialCommunityIcons name="close" size={16} color="#EF4444" />
          </Pressable>
          <Pressable
            style={styles.payBtn}
            onPress={() => navigation.navigate('PaymentSuccess')}
          >
            <Text style={styles.payBtnText}>Pay</Text>
          </Pressable>
        </View>

        {/* Scrollable cards */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Fee breakdown card */}
          <View style={styles.feeCard}>
            <View style={[styles.feeRow, styles.feeRowDivider]}>
              <Text style={styles.feeLabel}>EStimated Cost</Text>
              <Text style={styles.feeValue}>GHS 45.00</Text>
            </View>
            <View style={[styles.feeRow, styles.feeRowDivider]}>
              <Text style={styles.feeLabel}>Pickup - Organic Waste</Text>
              <Text style={styles.feeValue}>GHS 35.00</Text>
            </View>
            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>Service Fee</Text>
              <Text style={styles.feeValue}>GHS 10.00</Text>
            </View>
          </View>

          {/* Outer card: wallet balance + eco-points */}
          <View style={styles.outerCard}>
            {/* Wallet balance inner card */}
            <View style={styles.walletCard}>
              <View style={styles.walletLeft}>
                <Text style={styles.walletTitle}>Zubba Wallet Balance</Text>
                <Text style={styles.walletBalance}>GHS 124.50</Text>
              </View>
              <View style={styles.readyRow}>
                <Text style={styles.readyText}>READY</Text>
                <View style={styles.readyDot} />
              </View>
            </View>

            {/* Eco-points inner card */}
            <View style={styles.ecoCard}>
              <View style={styles.ecoRow}>
                <Text style={styles.ecoLabel}>Base Points</Text>
                <Text style={styles.ecoValue}>45 XP</Text>
              </View>
              <View style={styles.ecoRow}>
                <View style={styles.ecoLabelWithIcon}>
                  <Text style={styles.ecoLabel}>Premium Multiplier</Text>
                  <MaterialCommunityIcons name="lightning-bolt" size={10} color="#1F2A33" />
                </View>
                <Text style={styles.ecoValue}>x 2</Text>
              </View>
              <View style={styles.ecoRow}>
                <Text style={styles.ecoLabelDark}>Total Reward</Text>
                <Text style={styles.ecoValueGreen}>90 Eco-Points</Text>
              </View>
            </View>
          </View>
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
  screen: { flex: 1, backgroundColor: '#F8FAFC' },

  /* Top hero card */
  topCard: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderColor: '#E2E8F0',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingBottom: 24,
  },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backBtn: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  chevron: { fontSize: 28, color: '#1F2A33', lineHeight: 30 },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#1F2A33' },
  headerSpacer: { width: 24, height: 24 },

  amountSection: { alignItems: 'center', gap: 10 },

  totalLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  totalPill: {
    backgroundColor: 'rgba(0,107,35,0.10)',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  totalPillText: { fontSize: 13, color: '#31973D', lineHeight: 20 },
  ghsLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#1F2A33',
  },

  amountText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1F2A33',
    letterSpacing: -1.2,
    lineHeight: 56,
  },

  ecoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#31973D',
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  ecoBadgeText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF', lineHeight: 16 },

  /* Action row */
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 10,
    backgroundColor: '#F8FAFC',
  },
  xBtn: {
    width: 32,
    height: 32,
    backgroundColor: '#FFE2E2',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payBtn: {
    flex: 1,
    height: 40,
    backgroundColor: '#31973D',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payBtnText: { fontSize: 14, color: '#FFFFFF', fontWeight: '400', lineHeight: 20 },

  /* Scroll */
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 120,
    gap: 12,
  },

  /* Fee breakdown card */
  feeCard: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 24,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  feeRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  feeLabel: { fontSize: 16, color: '#64748A', fontWeight: '400', lineHeight: 24 },
  feeValue: { fontSize: 16, color: '#1F2A33', fontWeight: '700', lineHeight: 24 },

  /* Outer card wrapping wallet + eco */
  outerCard: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 24,
    padding: 16,
    gap: 16,
    backgroundColor: '#FFFFFF',
  },

  /* Wallet balance inner card */
  walletCard: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  walletLeft: { gap: 4 },
  walletTitle: { fontSize: 16, fontWeight: '500', color: '#1F2A33', lineHeight: 24 },
  walletBalance: { fontSize: 16, fontWeight: '500', color: '#64748A', lineHeight: 24 },
  readyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  readyText: { fontSize: 16, fontWeight: '700', color: '#31973D', lineHeight: 24 },
  readyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#31973D',
  },

  /* Eco-points inner card */
  ecoCard: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 24,
    padding: 20,
    gap: 12,
    backgroundColor: '#FFFFFF',
  },
  ecoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ecoLabelWithIcon: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ecoLabel: { fontSize: 16, color: '#64748A', fontWeight: '400', lineHeight: 24 },
  ecoLabelDark: { fontSize: 16, color: '#1F2A33', fontWeight: '400', lineHeight: 24 },
  ecoValue: { fontSize: 16, color: '#1F2A33', fontWeight: '400', lineHeight: 24 },
  ecoValueGreen: { fontSize: 16, color: '#31973D', fontWeight: '400', lineHeight: 24 },
});

export default WalletCheckoutScreen;
