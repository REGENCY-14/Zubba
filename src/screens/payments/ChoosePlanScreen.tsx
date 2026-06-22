import React from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import type { RootStackScreenProps } from '../../navigation/types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
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
    inactiveColor: 'rgba(254, 130, 53, 0.3)',
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
    inactiveColor: 'rgba(49, 151, 61, 0.3)',
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
    inactiveColor: 'rgba(47, 145, 251, 0.3)',
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
  recommended?: boolean;
  cardHeight: number;
  onPress: () => void;
};

function PlanCard({ plan, isActive, recommended, cardHeight, onPress }: PlanCardProps) {
  return (
    <View style={{ width: CARD_WIDTH, height: cardHeight }}>
      {recommended && (
        <View
          className="absolute bg-[#FFE088] rounded-full px-4 py-[6px] flex-row items-center gap-1"
          style={{ top: 0, right: 0, zIndex: 10 }}
        >
          <Text className="text-[#1F2A33] text-base">✦</Text>
          <Text className="text-base font-normal text-[#1F2A33]">RECOMMENDED</Text>
        </View>
      )}

      <View
        className="flex-1 p-8 gap-6 justify-between"
        style={{
          backgroundColor: isActive ? plan.activeColor : plan.inactiveColor,
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
        }}
      >

      <View className="gap-1">
        <Text className="text-2xl font-extrabold italic uppercase text-white" style={{ letterSpacing: -1.2 }}>{plan.label}</Text>
        <Text className="text-sm leading-5 text-white">{plan.trial}</Text>
      </View>

      <View className="gap-1">
        <Text className="text-xs font-semibold text-white leading-4">{plan.saveLabel}</Text>
        <View className="flex-row items-baseline gap-1">
          <Text className="text-[30px] font-extrabold text-white leading-9">{plan.price}</Text>
          <Text className="text-xl font-bold text-white leading-7">{plan.pricePer}</Text>
        </View>
        <Text className="text-[10px] text-white leading-[15px]">{plan.billing}</Text>
      </View>

      <Pressable
        className="bg-white rounded-full h-[57px] flex-row items-center justify-center gap-3 px-6"
        onPress={onPress}
      >
        <View
          className="w-3 h-3 rounded-full bg-[#38A149]"
          style={{ shadowColor: '#38A149', shadowOpacity: 1, shadowRadius: 6, shadowOffset: { width: 0, height: 0 }, elevation: 4 }}
        />
        <View className="items-center">
          <Text
            className="text-[11px] font-extrabold uppercase text-center"
            style={{ letterSpacing: -0.275, color: isActive ? '#000000' : 'rgba(52, 168, 83, 0.5)' }}
          >
            START MY FREE WEEK TRIAL
          </Text>
          <Text className="text-[9px] font-medium text-[#9CA3AF] text-center">{plan.ctaSub}</Text>
        </View>
      </Pressable>
      </View>
    </View>
  );
}

export function ChoosePlanScreen({ navigation }: RootStackScreenProps<'ChoosePlan'>) {
  const plansRef = React.useRef<ScrollView>(null);
  const [activePlanIndex, setActivePlanIndex] = React.useState(1);
  const [tableHeight, setTableHeight] = React.useState(0);
  const insets = useSafeAreaInsets();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      plansRef.current?.scrollTo({ x: CARD_WIDTH + CARD_GAP, animated: false });
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / (CARD_WIDTH + CARD_GAP));
    const clamped = Math.max(0, Math.min(PLANS.length - 1, index));
    if (clamped !== activePlanIndex) setActivePlanIndex(clamped);
  };

  const accentColor = PLANS[activePlanIndex].accentColor;

  // Cards fill the remaining screen height after the header, safe area and table
  const HEADER = 48;
  const TABLE_TOP_MARGIN = 16;
  const CARDS_TOP_MARGIN = 24;
  const cardsMinHeight = Math.max(
    300,
    SCREEN_HEIGHT - insets.top - insets.bottom - HEADER - TABLE_TOP_MARGIN - tableHeight - CARDS_TOP_MARGIN,
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <View className="flex-1 bg-white">

        {/* Header */}
        <View className="h-12 bg-white flex-row items-center justify-between px-4">
          <Pressable className="w-6 h-6 items-center justify-center" onPress={() => navigation.goBack()}>
            <Text className="text-[28px] text-[#1F2A33] leading-7 -mt-[2px]">‹</Text>
          </Pressable>
          <Text className="text-base font-semibold text-[#1F2A33]">Choose your plan</Text>
          <View className="w-6 h-6" />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>

        {/* Comparison table */}
        <View
          className="border border-[#E2E8F0] rounded-3xl p-4 mx-4 mt-4 bg-white gap-6"
          onLayout={e => setTableHeight(e.nativeEvent.layout.height)}
        >
          <Text className="text-[30px] font-extrabold leading-[38px] tracking-[-0.75px] uppercase text-[#1F2A33] text-center">
            {'START YOUR '}
            <Text style={{ color: '#16CE2C' }}>FREE</Text>
            {'\n'}
            <Text style={{ color: '#16CE2C' }}>WEEK</Text>
            {' TRIAL!'}
          </Text>

          <View className="px-4">
            <View className="flex-row items-center mb-1">
              <View className="flex-1" />
              <View className="w-[72px] items-center">
                <Text className="text-[10px] font-bold tracking-[1px] uppercase text-[#1F2A33]">FREE</Text>
              </View>
              <View className="w-[72px] items-center">
                <Text className="text-[10px] font-bold tracking-[1px] uppercase" style={{ color: accentColor }}>GOLD</Text>
              </View>
            </View>

            {FEATURES.map((f, i) => (
              <View
                key={i}
                className={`flex-row items-center h-[45px] ${i < FEATURES.length - 1 ? 'border-b border-b-black/[0.06]' : ''}`}
              >
                <View className="flex-1">
                  <Text className="text-sm leading-5 text-[#1F2A33]">{f.label}</Text>
                </View>
                <View className="w-[72px] items-center">
                  {f.free && <MaterialCommunityIcons name="check" size={20} color="rgba(0, 0, 0, 0.7)" />}
                </View>
                <View className="w-[72px] items-center">
                  {f.gold && <MaterialCommunityIcons name="check" size={20} color={accentColor} />}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Cards — fills remaining space */}
        <View style={{ minHeight: cardsMinHeight, marginTop: 24 }}>
          <ScrollView
            ref={plansRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={CARD_WIDTH + CARD_GAP}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{ paddingHorizontal: 24, gap: CARD_GAP }}
          >
            {PLANS.map((plan, i) => (
              <PlanCard
                key={plan.label}
                plan={plan}
                isActive={i === activePlanIndex}
                recommended={plan.label === 'MONTHLY'}
                cardHeight={cardsMinHeight}
                onPress={() => navigation.navigate('ConfirmSubscription', { planIndex: i })}
              />
            ))}
          </ScrollView>
        </View>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default ChoosePlanScreen;
