import React from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../navigation/types';
import { AppBottomNav } from '../components';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH - 48;
const CARD_GAP = 16;

const PLANS = [
  {
    label: 'FAMILY',
    trial: '7-Day Free Trial',
    saveLabel: 'Save 10%',
    price: 'GHS 800.00',
    pricePer: '/year',
    billing: 'Billed annually after trial',
    ctaSub: 'after 7 days Ghs 800/year',
    activeColor: '#FE8235',
    accentColor: '#FE8235',
  },
  {
    label: 'MONTHLY',
    trial: '7-Day Free Trial',
    saveLabel: 'Unlock your gold',
    price: 'GHS 50.00',
    pricePer: '/month',
    billing: 'Billed monthly after trial',
    ctaSub: 'after 7 days Ghs 50/month',
    activeColor: '#31973D',
    accentColor: '#16CE2C',
  },
  {
    label: 'YEARLY',
    trial: '7-Day Free Trial',
    saveLabel: 'Save 25%',
    price: 'GHS 550.00',
    pricePer: '/year',
    billing: 'Billed annually after trial',
    ctaSub: 'after 7 days Ghs 550/year',
    activeColor: '#2F91FB',
    accentColor: '#2F91FB',
  },
] as const;

const FEATURES = [
  { label: 'Advanced Scheduling', free: false, gold: true },
  { label: 'Double Eco-Points', free: false, gold: true },
  { label: 'Priority 24/7 Support', free: false, gold: true },
  { label: 'Faster matching', free: false, gold: true },
  { label: 'Basic pickup', free: true, gold: true },
  { label: 'Community Support', free: true, gold: true },
];

type PlanCardProps = {
  plan: (typeof PLANS)[number];
  isActive: boolean;
  onPress: () => void;
};

function PlanCard({ plan, isActive, onPress }: PlanCardProps) {
  return (
    <View style={[styles.planCard, { backgroundColor: plan.activeColor, opacity: isActive ? 1 : 0.4 }]}>
      <Text style={styles.planLabel}>{plan.label}</Text>
      <Text style={styles.planTrialText}>{plan.trial}</Text>

      <View style={styles.planPriceBlock}>
        <Text style={styles.planSaveLabel}>{plan.saveLabel}</Text>
        <View style={styles.planPriceRow}>
          <Text style={styles.planPrice}>{plan.price}</Text>
          <Text style={styles.planPricePer}>{plan.pricePer}</Text>
        </View>
        <Text style={styles.planBilling}>{plan.billing}</Text>
      </View>

      <Pressable style={styles.planCta} onPress={onPress}>
        <View style={styles.ctaDot} />
        <View>
          <Text style={styles.ctaMainLabel}>START MY FREE WEEK TRIAL</Text>
          <Text style={styles.ctaSub}>{plan.ctaSub}</Text>
        </View>
      </Pressable>
    </View>
  );
}

export function ChoosePlanScreen({ navigation }: RootStackScreenProps<'ChoosePlan'>) {
  const plansRef = React.useRef<ScrollView>(null);
  const [activePlanIndex, setActivePlanIndex] = React.useState(1);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      plansRef.current?.scrollTo({ x: CARD_WIDTH + CARD_GAP, animated: false });
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / (CARD_WIDTH + CARD_GAP));
    setActivePlanIndex(Math.max(0, Math.min(PLANS.length - 1, index)));
  };

  const handleScrollEndDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / (CARD_WIDTH + CARD_GAP));
    setActivePlanIndex(Math.max(0, Math.min(PLANS.length - 1, index)));
  };

  const accentColor = PLANS[activePlanIndex].accentColor;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <Text style={styles.title}>Choose your plan</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.main} contentContainerStyle={styles.mainContent} showsVerticalScrollIndicator={false}>
          {/* Comparison card */}
          <View style={styles.comparisonCard}>
            <Text style={styles.heading}>
              {'START YOUR '}
              <Text style={styles.headingGreen}>FREE</Text>
              {'\n'}
              <Text style={styles.headingGreen}>WEEK</Text>
              {' TRIAL!'}
            </Text>

            <View style={styles.tableSection}>
              <View style={styles.tableHeaderRow}>
                <View style={styles.featureCol} />
                <View style={styles.checkCol}>
                  <Text style={styles.colHeaderFree}>FREE</Text>
                </View>
                <View style={styles.checkCol}>
                  <Text style={[styles.colHeaderGold, { color: accentColor }]}>GOLD</Text>
                </View>
              </View>

              {FEATURES.map((f, i) => (
                <View key={i} style={[styles.featureRow, i < FEATURES.length - 1 && styles.featureRowBorder]}>
                  <View style={styles.featureCol}>
                    <Text style={styles.featureLabel}>{f.label}</Text>
                  </View>
                  <View style={styles.checkCol}>
                    {f.free && <Text style={styles.checkDark}>✓</Text>}
                  </View>
                  <View style={styles.checkCol}>
                    {f.gold && <Text style={[styles.checkGold, { color: accentColor }]}>✓</Text>}
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Plan cards */}
          <View style={styles.plansSection}>
            <View style={styles.recommendedBadgeRow}>
              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedBadgeText}>⊕ RECOMMENDED</Text>
              </View>
            </View>

            <ScrollView
              ref={plansRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              snapToInterval={CARD_WIDTH + CARD_GAP}
              onMomentumScrollEnd={handleScrollEnd}
              onScrollEndDrag={handleScrollEndDrag}
              contentContainerStyle={styles.plansScrollContent}
            >
              {PLANS.map((plan, i) => (
                <PlanCard
                  key={plan.label}
                  plan={plan}
                  isActive={i === activePlanIndex}
                  onPress={() => navigation.navigate('ConfirmSubscription', { planIndex: i })}
                />
              ))}
            </ScrollView>
          </View>
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
  mainContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100, gap: 24 },

  // Comparison card
  comparisonCard: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 24,
    padding: 16,
    backgroundColor: '#FFFFFF',
    gap: 24,
  },
  heading: {
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 38,
    letterSpacing: -0.75,
    textTransform: 'uppercase',
    color: '#1F2A33',
    textAlign: 'center',
  },
  headingGreen: { color: '#16CE2C' },

  tableSection: { gap: 0, paddingHorizontal: 16 },
  tableHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  featureCol: { flex: 1 },
  checkCol: { width: 72, alignItems: 'center' },
  colHeaderFree: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#1F2A33',
  },
  colHeaderGold: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  featureRow: { flexDirection: 'row', alignItems: 'center', height: 45 },
  featureRowBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(0, 0, 0, 0.06)' },
  featureLabel: { fontSize: 14, lineHeight: 20, color: '#1F2A33', fontWeight: '400' },
  checkDark: { fontSize: 16, color: 'rgba(0, 0, 0, 0.7)', fontWeight: '700' },
  checkGold: { fontSize: 16, fontWeight: '700' },

  // Plan cards section
  plansSection: { marginHorizontal: -16 },
  recommendedBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 32,
    marginBottom: -14,
    zIndex: 10,
  },
  recommendedBadge: {
    backgroundColor: '#FED65B',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  recommendedBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: '#574500',
    textTransform: 'uppercase',
  },
  plansScrollContent: { paddingHorizontal: 24, gap: CARD_GAP },

  // Plan card
  planCard: {
    width: CARD_WIDTH,
    height: 342,
    borderRadius: 32,
    padding: 32,
    gap: 4,
    justifyContent: 'space-between',
  },
  planLabel: {
    fontSize: 24,
    fontWeight: '800',
    fontStyle: 'italic',
    lineHeight: 32,
    letterSpacing: -1.2,
    textTransform: 'uppercase',
    color: '#FFFFFF',
  },
  planTrialText: { fontSize: 14, lineHeight: 20, color: '#FFFFFF', fontWeight: '400' },
  planPriceBlock: { gap: 4 },
  planSaveLabel: { fontSize: 12, fontWeight: '600', color: '#FFFFFF', lineHeight: 16 },
  planPriceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  planPrice: { fontSize: 30, fontWeight: '800', color: '#FFFFFF', lineHeight: 36 },
  planPricePer: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', lineHeight: 28 },
  planBilling: { fontSize: 10, fontWeight: '400', color: '#FFFFFF', lineHeight: 15 },

  // CTA inside card
  planCta: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    height: 57,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 24,
  },
  ctaDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#38A149' },
  ctaMainLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: -0.275,
    textTransform: 'uppercase',
    color: '#0D631B',
    textAlign: 'center',
  },
  ctaSub: { fontSize: 9, fontWeight: '500', color: '#9CA3AF', textAlign: 'center' },
});

export default ChoosePlanScreen;
