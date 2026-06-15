import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../../navigation/types';
import { AppBottomNav } from '../../components';

type PaymentMethodId = 'momo' | 'telecel' | 'airtel';

type PaymentOptionProps = {
  selected: boolean;
  title: string;
  subtitle: string;
  badge: string;
  badgeStyle: object;
  badgeTextStyle: object;
  iconStyle: object;
  onPress: () => void;
};

function PaymentOption({ selected, title, subtitle, badge, badgeStyle, badgeTextStyle, iconStyle, onPress }: PaymentOptionProps) {
  return (
    <Pressable style={[styles.optionCard, selected && styles.optionCardSelected]} onPress={onPress}>
      <View style={styles.optionLeftGroup}>
        <View style={[styles.optionBadge, iconStyle]}>
          <Text style={[styles.optionBadgeText, badgeTextStyle]}>{badge}</Text>
        </View>
        <View style={styles.optionTextBlock}>
          <Text style={styles.optionTitle}>{title}</Text>
          <Text style={styles.optionSubtitle}>{subtitle}</Text>
        </View>
      </View>

      <View style={[styles.radio, selected && styles.radioActive]}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
    </Pressable>
  );
}

export function PaymentScreen({ navigation }: RootStackScreenProps<'Payment'>) {
  const [selectedMethod, setSelectedMethod] = React.useState<PaymentMethodId>('momo');

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

        <ScrollView style={styles.main} contentContainerStyle={styles.mainContent}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryTopRow}>
              <View style={styles.summaryTextBlock}>
                <Text style={styles.summaryLabel}>ESTIMATED COST</Text>
                <Text style={styles.summaryAmount}>GHS 45.00</Text>
              </View>

              <View style={styles.ecoBadge}>
                <Text style={styles.ecoBadgeText}>Standard</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.lineRow}>
              <Text style={styles.lineLabel}>Pickup - Organic Waste</Text>
              <Text style={styles.lineValue}>GHS 35.00</Text>
            </View>

            <View style={styles.lineRow}>
              <Text style={styles.lineLabel}>Service Fee</Text>
              <Text style={styles.lineValue}>GHS 10.00</Text>
            </View>
          </View>

          <View style={styles.optionsBlock}>
            <Text style={styles.sectionTitle}>Select Payment Method</Text>

            <PaymentOption
              selected={selectedMethod === 'momo'}
              title="MTN MoMo"
              subtitle=""
              badge="MTN"
              badgeStyle={styles.mtnBadge}
              badgeTextStyle={styles.mtnBadgeText}
              iconStyle={styles.mtnBadge}
              onPress={() => setSelectedMethod('momo')}
            />

            <PaymentOption
              selected={selectedMethod === 'telecel'}
              title="Telecel Cash"
              subtitle=""
              badge="Telecel Cash"
              badgeStyle={styles.telecelBadge}
              badgeTextStyle={styles.telecelBadgeText}
              iconStyle={styles.telecelBadge}
              onPress={() => setSelectedMethod('telecel')}
            />

            <PaymentOption
              selected={selectedMethod === 'airtel'}
              title="Airtel money"
              subtitle=""
              badge="at"
              badgeStyle={styles.airtelBadge}
              badgeTextStyle={styles.airtelBadgeText}
              iconStyle={styles.airtelBadge}
              onPress={() => setSelectedMethod('airtel')}
            />
          </View>

          <Pressable style={styles.payButton} onPress={() => navigation.navigate('PaymentMethod')}>
            <Text style={styles.payButtonText}>Continue</Text>
          </Pressable>
        </ScrollView>

        <AppBottomNav
          activeTab="home"
          onHomePress={() => navigation.navigate('LocationSharing')}
          onSavedPress={() => navigation.navigate('Details', { itemId: 'save', title: 'Saved' })}
          onSettingsPress={() => navigation.navigate('Settings')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9F9F9' },
  screen: { flex: 1, backgroundColor: '#F9F9F9' },
  header: {
    height: 90,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderBottomWidth: 0,
  },
  backButton: { width: 24, height: 24, alignItems: 'flex-start', justifyContent: 'center' },
  backText: { fontSize: 28, color: '#1F2A33', lineHeight: 28, marginTop: -2 },
  title: { fontSize: 16, fontWeight: '600', color: '#1F2A33' },
  headerSpacer: { width: 24, height: 24 },
  main: { flex: 1 },
  mainContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 120, gap: 24 },
  summaryCard: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 24, padding: 24, backgroundColor: '#FFFFFF', gap: 16 },
  summaryTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  summaryTextBlock: { gap: 4 },
  summaryLabel: { fontSize: 16, lineHeight: 24, letterSpacing: 1.6, textTransform: 'uppercase', color: '#1F2A33', fontWeight: '400' },
  summaryAmount: { fontSize: 14, lineHeight: 24, color: '#006B23', fontWeight: '400' },
  ecoBadge: { backgroundColor: '#E8F2E8', borderRadius: 999, borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 16, paddingVertical: 6 },
  ecoBadgeText: { color: '#31973D', fontSize: 13, lineHeight: 20, fontWeight: '400' },
  divider: { borderTopWidth: 1, borderTopColor: 'rgba(190, 202, 185, 0.3)' },
  lineRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lineLabel: { fontSize: 15, lineHeight: 24, color: '#1F2A33', fontWeight: '400' },
  lineValue: { fontSize: 15, lineHeight: 24, color: '#64748A', fontWeight: '400' },
  optionsBlock: { gap: 16 },
  sectionTitle: { fontSize: 16, lineHeight: 24, color: '#1F2A33', fontWeight: '700' },
  optionCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, gap: 16, borderRadius: 24, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF', minHeight: 82 },
  optionCardSelected: { backgroundColor: 'rgba(49,151,61,0.11)', borderColor: '#31973D' },
  optionLeftGroup: { flexDirection: 'row', alignItems: 'center', gap: 16, flex: 1, minWidth: 0 },
  optionBadge: { width: 48, height: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  mtnBadge: { backgroundColor: '#FFCC00' },
  telecelBadge: { backgroundColor: '#DC2626' },
  airtelBadge: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#FFFFFF' },
  optionBadgeText: { fontSize: 12, fontWeight: '700', textAlign: 'center' },
  mtnBadgeText: { color: '#000000' },
  telecelBadgeText: { color: '#FFFFFF', lineHeight: 15 },
  airtelBadgeText: { color: '#1E3A8A', fontSize: 18, fontWeight: '700' },
  optionTextBlock: { flex: 1, minWidth: 0 },
  optionTitle: { fontSize: 16, lineHeight: 24, color: '#1C1B1B', fontWeight: '500' },
  optionSubtitle: { display: 'none' as never },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#8E7164', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  radioActive: { borderColor: '#31973D', backgroundColor: '#31973D' },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFFFFF' },
  payButton: { height: 48, borderRadius: 999, backgroundColor: '#31973D', alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  payButtonText: { color: '#FFFFFF', fontSize: 14, lineHeight: 20, fontWeight: '400' },
});

export default PaymentScreen;
