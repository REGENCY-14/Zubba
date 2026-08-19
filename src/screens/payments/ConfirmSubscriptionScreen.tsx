import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';
import { APP_DARK } from '../../constants/appDarkTheme';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useSubscriptionPaystackCheckout } from '../../hooks/useSubscriptionPaystackCheckout';
import { useSubscriptionPlans } from '../../hooks/useSubscription';
import CustomAppBar from '../../components/common/CustomAppBar';
import { ConfirmSubscriptionSkeleton } from '../../components/payments/ConfirmSubscriptionSkeleton';
import { scale, verticalScale, moderateScale } from '../../utils/scale';

export function ConfirmSubscriptionScreen({ navigation, route }: RootStackScreenProps<'ConfirmSubscription'>) {
  const { colors, isDark } = useTheme();
  const user = useAppSelector((state) => state.auth.user);
  const { startCheckout, isLoading } = useSubscriptionPaystackCheckout();
  const { data: plansData, isPending } = useSubscriptionPlans();
  const plans = plansData ?? [];
  const showSkeleton = isPending && plans.length === 0;
  const [selectedIndex, setSelectedIndex] = useState(route.params?.planIndex ?? 0);

  useEffect(() => {
    if (plans.length && route.params?.planIndex !== undefined) {
      setSelectedIndex(Math.min(route.params.planIndex, plans.length - 1));
    }
  }, [plans, route.params?.planIndex]);

  const selected = plans[selectedIndex];

  const handleSubscribe = async () => {
    if (!selected || !user?.email) return;
    await startCheckout({
      planCode: selected.plan_code,
      email: user.email,
      amount: Number(selected.amount),
    });
  };

  if (showSkeleton) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right']}>
        <CustomAppBar title="Confirm Subscription" navigation={navigation} />
        <ConfirmSubscriptionSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right']}>
      <CustomAppBar title="Confirm Subscription" navigation={navigation} />
      <ScrollView contentContainerStyle={{ padding: moderateScale(16), gap: verticalScale(16) }}>
        {!selected ? (
          <Text style={{ color: colors.textSub }}>No subscription plans available.</Text>
        ) : (
          <>
            <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: moderateScale(24), padding: moderateScale(16), backgroundColor: colors.card, gap: verticalScale(12) }}>
              <Text style={{ fontSize: moderateScale(24), fontWeight: '600', color: colors.text }}>{selected.name}</Text>
              <Text style={{ color: colors.textSub }}>
                {selected.description?.features?.join(' • ') ?? 'Premium benefits included'}
              </Text>
              <Text style={{ fontSize: moderateScale(28), fontWeight: '700', color: colors.text }}>
                GHS {Number(selected.amount).toFixed(2)}
                <Text style={{ fontSize: moderateScale(16), fontWeight: '500' }}> / {selected.interval}</Text>
              </Text>
              {selected.amount_saved ? (
                <Text style={{ color: isDark ? APP_DARK.accentGreen : '#31973D' }}>Save GHS {selected.amount_saved}</Text>
              ) : null}
            </View>

            {plans.length > 1 && (
              <View style={{ gap: verticalScale(8) }}>
                <Text style={{ color: colors.text, fontWeight: '600' }}>Choose another plan</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: scale(8) }}>
                  {plans.map((plan, index) => (
                    <Pressable
                      key={plan.id}
                      onPress={() => setSelectedIndex(index)}
                      style={{
                        borderWidth: 1,
                        borderColor: index === selectedIndex ? (isDark ? APP_DARK.statusSuccessBorder : '#31973D') : colors.border,
                        borderRadius: 999,
                        paddingHorizontal: scale(12),
                        paddingVertical: verticalScale(8),
                      }}
                    >
                      <Text style={{ color: colors.text }}>{plan.name} · GHS {plan.amount}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            <Pressable
              onPress={handleSubscribe}
              disabled={isLoading || !user?.email}
              style={{
                height: verticalScale(48),
                borderRadius: 999,
                backgroundColor: isDark ? APP_DARK.buttonPrimaryBg : (isLoading ? 'rgba(49,151,61,0.6)' : '#31973D'),
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: '#fff', fontWeight: '600' }}>Subscribe with Paystack</Text>
              )}
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default ConfirmSubscriptionScreen;
