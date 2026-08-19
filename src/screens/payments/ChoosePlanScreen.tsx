import React from 'react';
import {
  Animated,
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
import { useTheme } from '../../context/ThemeContext';
import CustomAppBar from '../../components/common/CustomAppBar';
import { scale, verticalScale, moderateScale } from '../../utils/scale';
import { type SubscriptionPlan } from '../../api/subscriptionService';
import { ChoosePlanSkeleton } from '../../components/payments/ChoosePlanSkeleton';
import { useSubscriptionPlans } from '../../hooks/useSubscription';
import { APP_DARK } from '../../constants/appDarkTheme';

const ACCENT_COLORS = ['#FE8235', '#31973D', '#2F91FB'];
// Dark-mode equivalents (Figma nodes 5494-31086 + 5494-29708). The
// recommended plan (index 1, green) is a permanent translucent-green
// "signature" regardless of active/inactive state. The other two plans
// render as a vivid SOLID color when active (swiped into focus) — same
// treatment a light-mode card gets — and a muted translucent tint when
// inactive/peeking.
const ACCENT_COLORS_DARK_ACTIVE = ['#FE8235', 'rgba(96,217,109,0.5)', '#489FFB'];
const ACCENT_COLORS_DARK_INACTIVE = ['rgba(254,146,78,0.3)', 'rgba(96,217,109,0.25)', 'rgba(72,159,251,0.3)'];

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const CARD_WIDTH = SCREEN_WIDTH - 48;
const CARD_GAP = 16;

const INACTIVE_SHRINK = 52;

function buildPlanFeatureRows(plans: SubscriptionPlan[], activePlanIndex: number) {
  if (!plans.length) return [];

  const planFeatures = plans.map((plan) => new Set(plan.description?.features ?? []));
  const allFeatures = [
    ...new Set(plans.flatMap((plan) => plan.description?.features ?? [])),
  ];
  const commonFeatures = new Set(
    allFeatures.filter((feature) => planFeatures.every((set) => set.has(feature))),
  );
  const activeFeatures = planFeatures[activePlanIndex] ?? new Set<string>();

  return allFeatures.map((label) => ({
    label,
    free: commonFeatures.has(label),
    gold: activeFeatures.has(label),
  }));
}

type PlanCardProps = {
  plan: SubscriptionPlan;
  planIndex: number;
  isActive: boolean;
  recommended?: boolean;
  cardHeight: Animated.AnimatedInterpolation<number>;
  cardMarginTop: Animated.AnimatedInterpolation<number>;
  onPress: () => void;
};

function PlanCard({ plan, planIndex, isActive, recommended, cardHeight, cardMarginTop, onPress }: PlanCardProps) {
  const { isDark } = useTheme();
  const idx = planIndex % ACCENT_COLORS.length;
  const isGreenAccent = idx === 1;
  const activeColor = isDark ? ACCENT_COLORS_DARK_ACTIVE[idx] : ACCENT_COLORS[idx];
  const inactiveColor = isDark ? ACCENT_COLORS_DARK_INACTIVE[idx] : `${ACCENT_COLORS[idx]}4D`;
  const price = `GHS ${Number(plan.amount).toFixed(2)}`;
  const pricePer = `/${plan.interval}`;
  // Dark mode text: the recommended (green) card's active bg is a muted
  // translucent tint, so its heading stays light. The other two plans'
  // active bg is a vivid solid color, so their heading needs to go dark
  // for contrast — everything else (subtitle/price/billing/mini-label)
  // follows the same rule across all three per Figma.
  const cardTextColor = isDark && isActive ? APP_DARK.text : '#FFFFFF';
  const cardHeadingColor = isDark && isActive ? (isGreenAccent ? APP_DARK.text : '#0D0D0D') : '#FFFFFF';
  const cardLabelColor = isDark && isActive ? '#0D0D0D' : '#FFFFFF';

  return (
    <Animated.View
      style={{
        width: CARD_WIDTH,
        height: cardHeight,
        marginTop: cardMarginTop,
        position: 'relative',
        overflow: 'visible',
        paddingTop: 4,
      }}
    >
      {recommended && (
        <View
          className="absolute rounded-full px-4 py-[6px] flex-row items-center gap-1"
          style={{
            top: -15,
            right: 0,
            zIndex: 20,
            elevation: 10,
            backgroundColor: isDark ? APP_DARK.premiumButtonBg : '#FFE088',
            borderWidth: isDark ? 1 : 0,
            borderColor: '#0D0D0D',
          }}
        >
          <Text className="text-base" style={{ color: isDark ? APP_DARK.text : '#1F2A33' }}>✦</Text>
          <Text className="text-base font-normal" style={{ color: isDark ? APP_DARK.premiumButtonText : '#1F2A33' }}>RECOMMENDED</Text>
        </View>
      )}

      <View
        className="flex-1 p-8 gap-6 justify-between"
        style={{
          backgroundColor: isActive ? activeColor : inactiveColor,
          borderTopLeftRadius: moderateScale(32),
          borderTopRightRadius: moderateScale(32),
          overflow: 'hidden',
        }}
      >
      <View className="gap-1">
        <Text className="text-2xl font-extrabold italic uppercase" style={{ letterSpacing: -1.2, color: cardHeadingColor }}>{plan.name}</Text>
        <Text className="text-sm leading-5" style={{ color: cardTextColor }}>{plan.description?.features?.[0] ?? 'Premium access'}</Text>
      </View>

      <View className="gap-1">
        {plan.amount_saved ? (
          <Text className="text-xs font-semibold leading-4" style={{ color: cardLabelColor }}>Save GHS {plan.amount_saved}</Text>
        ) : null}
        <View className="flex-row items-baseline gap-1">
          <Text className="text-[30px] font-extrabold leading-9" style={{ color: cardTextColor }}>{price}</Text>
          <Text className="text-xl font-bold leading-7" style={{ color: cardTextColor }}>{pricePer}</Text>
        </View>
      </View>

      <Pressable
        className="rounded-full h-[57px] flex-row items-center justify-center gap-3 px-6 mb-4"
        style={{ backgroundColor: isDark ? '#0D0D0D' : '#FFFFFF' }}
        onPress={onPress}
      >
        <View
          className="w-3 h-3 rounded-full"
          style={{
            backgroundColor: isDark ? (isActive && isGreenAccent ? APP_DARK.buttonPrimaryBg : '#3FB452') : '#38A149',
            shadowColor: '#38A149',
            shadowOpacity: 1,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 0 },
            elevation: 4,
          }}
        />
        <View className="items-center">
          <Text
            className="text-[11px] font-extrabold uppercase text-center"
            style={{
              letterSpacing: -0.275,
              color: isDark
                ? isActive
                  ? '#FFFFFF'
                  : 'rgba(58,187,93,0.5)'
                : isActive
                ? '#000000'
                : 'rgba(52, 168, 83, 0.5)',
            }}
          >
            START MY FREE WEEK TRIAL
          </Text>
          <Text
            className="text-[9px] font-medium text-center"
            style={{ color: isDark && isActive ? APP_DARK.text : '#9CA3AF' }}
          >
            after 7-days {price}{pricePer}
          </Text>
        </View>
      </Pressable>
      </View>
    </Animated.View>
  );
}

export function ChoosePlanScreen({ navigation }: RootStackScreenProps<'ChoosePlan'>) {
  const { colors, isDark } = useTheme();
  const plansRef = React.useRef<ScrollView>(null);
  const { data: plansData, isPending } = useSubscriptionPlans();
  const plans = plansData ?? [];
  const showSkeleton = isPending && plans.length === 0;
  const [activePlanIndex, setActivePlanIndex] = React.useState(0);
  const [tableHeight, setTableHeight] = React.useState(0);
  const insets = useSafeAreaInsets();
  const scrollX = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (!plans.length) return;
    const timer = setTimeout(() => {
      const index = Math.min(1, plans.length - 1);
      plansRef.current?.scrollTo({ x: index * (CARD_WIDTH + CARD_GAP), animated: false });
      setActivePlanIndex(index);
    }, 50);
    return () => clearTimeout(timer);
  }, [plans.length]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const x = e.nativeEvent.contentOffset.x;
        const index = Math.round(x / (CARD_WIDTH + CARD_GAP));
        const clamped = Math.max(0, Math.min(plans.length - 1, index));
        setActivePlanIndex(clamped);
      },
    },
  );

  const HEADER = 48;
  const TABLE_TOP_MARGIN = 16;
  const CARDS_TOP_MARGIN = 24;
  const cardsMinHeight = Math.max(
    300,
    SCREEN_HEIGHT - insets.top - insets.bottom - HEADER - TABLE_TOP_MARGIN - tableHeight - CARDS_TOP_MARGIN,
  );

  const getCardHeight = (index: number) =>
    scrollX.interpolate({
      inputRange: [
        (index - 1) * (CARD_WIDTH + CARD_GAP),
        index * (CARD_WIDTH + CARD_GAP),
        (index + 1) * (CARD_WIDTH + CARD_GAP),
      ],
      outputRange: [cardsMinHeight - INACTIVE_SHRINK, cardsMinHeight, cardsMinHeight - INACTIVE_SHRINK],
      extrapolate: 'clamp',
    });

  const getCardMarginTop = (index: number) =>
    scrollX.interpolate({
      inputRange: [
        (index - 1) * (CARD_WIDTH + CARD_GAP),
        index * (CARD_WIDTH + CARD_GAP),
        (index + 1) * (CARD_WIDTH + CARD_GAP),
      ],
      outputRange: [INACTIVE_SHRINK, 0, INACTIVE_SHRINK],
      extrapolate: 'clamp',
    });

  const activeIdx = activePlanIndex % ACCENT_COLORS.length;
  const accentColor = isDark ? ACCENT_COLORS_DARK_ACTIVE[activeIdx] : ACCENT_COLORS[activeIdx];
  const featureRows = buildPlanFeatureRows(plans, activePlanIndex);
  const activePlanLabel = plans[activePlanIndex]?.name ?? 'GOLD';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right']}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <CustomAppBar title="Choose your plan" navigation={navigation} />

        {showSkeleton ? (
          <ChoosePlanSkeleton />
        ) : !plans.length ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <Text style={{ color: colors.textSub, textAlign: 'center' }}>
              No subscription plans are available right now. Please try again later.
            </Text>
          </View>
        ) : (
        <ScrollView showsVerticalScrollIndicator={false}>

        {/* Comparison table */}
        <View
          style={{
            borderWidth: 1,
            borderColor: isDark ? APP_DARK.border : colors.border,
            borderRadius: moderateScale(24),
            padding: moderateScale(16),
            marginHorizontal: scale(16),
            marginTop: verticalScale(16),
            backgroundColor: isDark ? APP_DARK.card : colors.card,
            gap: verticalScale(24),
          }}
          onLayout={e => setTableHeight(e.nativeEvent.layout.height)}
        >
          <Text style={{ fontSize: moderateScale(30), fontWeight: '800', lineHeight: moderateScale(38), letterSpacing: -0.75, textTransform: 'uppercase', color: colors.text, textAlign: 'center' }}>
            {'START YOUR '}
            <Text style={{ color: isDark ? APP_DARK.buttonPrimaryBg : '#16CE2C' }}>FREE</Text>
            {'\n'}
            <Text style={{ color: isDark ? APP_DARK.buttonPrimaryBg : '#16CE2C' }}>WEEK</Text>
            {' TRIAL!'}
          </Text>

          <View className="px-4">
            <View className="flex-row items-center mb-1">
              <View className="flex-1" />
              <View className="w-[72px] items-center">
                <Text style={{ fontSize: moderateScale(10), fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', color: colors.text }}>FREE</Text>
              </View>
              <View className="w-[72px] items-center">
                <Text style={{ fontSize: moderateScale(10), fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', color: accentColor }} numberOfLines={1}>
                  {activePlanLabel}
                </Text>
              </View>
            </View>

            {featureRows.map((f, i) => (
              <View
                key={f.label}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: verticalScale(45),
                  borderBottomWidth: i < featureRows.length - 1 ? 1 : 0,
                  borderBottomColor: isDark ? APP_DARK.border : colors.borderLight,
                }}
              >
                <View className="flex-1">
                  <Text style={{ fontSize: moderateScale(14), lineHeight: moderateScale(20), color: colors.text }}>{f.label}</Text>
                </View>
                <View className="w-[72px] items-center">
                  {f.free && (
                    <MaterialCommunityIcons
                      name="check"
                      size={moderateScale(20)}
                      color={isDark ? 'rgba(255,255,255,0.7)' : colors.iconColor}
                    />
                  )}
                </View>
                <View className="w-[72px] items-center">
                  {f.gold && <MaterialCommunityIcons name="check" size={moderateScale(20)} color={accentColor} />}
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
            contentContainerStyle={{ paddingHorizontal: 24, gap: CARD_GAP, paddingTop: 20, paddingBottom: 14 }}
          >
            {plans.map((plan, i) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                planIndex={i}
                isActive={i === activePlanIndex}
                recommended={i === 1}
                cardHeight={getCardHeight(i)}
                cardMarginTop={getCardMarginTop(i)}
                onPress={() => navigation.navigate('ConfirmSubscription', { planIndex: i })}
              />
            ))}
          </ScrollView>
        </View>

        </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

export default ChoosePlanScreen;
