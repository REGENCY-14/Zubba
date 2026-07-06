import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import type { RootStackScreenProps } from '../../navigation/types';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useTheme } from '../../context/ThemeContext';

const zubbaText = require('../../../assets/zubbaText.png');

type PaymentKey = 'mtn' | 'telecel' | 'airtel' | 'card';

const PAYMENT_METHODS: {
  key: PaymentKey;
  name: string;
  badgeBg: string;
  badgeLabel: string;
  badgeLabelColor: string;
  badgeFontWeight: '600' | '700';
  badgeIcon?: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  badgeIconColor?: string;
}[] = [
  { key: 'mtn',     name: 'MTN MoMo',    badgeBg: '#FFCC00', badgeLabel: 'MTN',    badgeLabelColor: '#000000', badgeFontWeight: '600' },
  { key: 'telecel', name: 'Telecel Cash', badgeBg: '#DC2626', badgeLabel: 'T.cash', badgeLabelColor: '#FFFFFF', badgeFontWeight: '700' },
  { key: 'airtel',  name: 'Airtel Money', badgeBg: '#FFFFFF', badgeLabel: 'Airtel', badgeLabelColor: '#EF0000', badgeFontWeight: '700' },
  { key: 'card',    name: 'Credit Card',  badgeBg: '#FFF7ED', badgeLabel: '',       badgeLabelColor: '#000000', badgeFontWeight: '600', badgeIcon: 'credit-card-outline', badgeIconColor: '#31973D' },
];

type TxStatus = 'SUCCESS' | 'CREDITED' | 'PENDING' | 'FAILED';

type Transaction = {
  id: string;
  title: string;
  date: string;
  amount: string;
  amountColor: string;
  status: TxStatus;
  iconBg: string;
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  iconColor: string;
};

const STATUS_COLOR: Record<TxStatus, string> = {
  SUCCESS: '#31973D',
  CREDITED: '#31973D',
  PENDING: '#555E59',
  FAILED: '#FF383C',
};

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', title: 'Weekly Pickup Fee',  date: 'Oct 24, 2023 • 08:45 AM', amount: '- GHS 45.00',  amountColor: '#FF383C', status: 'SUCCESS',  iconBg: 'rgba(0, 107, 35, 0.1)', iconName: 'receipt-text-outline', iconColor: '#31973D' },
  { id: '2', title: 'Eco-Reward',         date: 'Oct 22, 2023 • 02:15 PM', amount: '+ 250 pts',    amountColor: '#31973D', status: 'CREDITED', iconBg: '#FFE088',               iconName: 'leaf',                iconColor: '#735C00' },
  { id: '3', title: 'MoMo Top-up',        date: 'Oct 20, 2023 • 11:30 AM', amount: '+ GHS 200.00', amountColor: '#31973D', status: 'PENDING',  iconBg: 'rgba(20, 135, 50, 0.1)',iconName: 'cellphone',           iconColor: '#31973D' },
];

function TransactionRow({ tx, isLast, colors }: { tx: Transaction; isLast: boolean; colors: ReturnType<typeof useTheme>['colors'] }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, gap: 16, borderBottomWidth: isLast ? 0 : 1, borderBottomColor: colors.borderLight }}>
      <View style={{ width: 40, height: 40, borderRadius: 9999, backgroundColor: tx.iconBg, alignItems: 'center', justifyContent: 'center' }}>
        <MaterialCommunityIcons name={tx.iconName} size={20} color={tx.iconColor} />
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={{ fontSize: 14, fontWeight: '500', letterSpacing: 0.28, color: colors.text, lineHeight: 17 }}>{tx.title}</Text>
        <Text style={{ fontSize: 13, fontWeight: '400', color: colors.textMuted, lineHeight: 21 }}>{tx.date}</Text>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 4 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', letterSpacing: 0.28, color: tx.amountColor, lineHeight: 17 }}>{tx.amount}</Text>
        <Text style={{ fontSize: 10, fontWeight: '600', letterSpacing: -0.5, textTransform: 'uppercase', color: STATUS_COLOR[tx.status], lineHeight: 15 }}>{tx.status}</Text>
      </View>
    </View>
  );
}

export function ZubbaWalletScreen({ navigation, route }: RootStackScreenProps<'ZubbaWallet'>) {
  const customer = useAppSelector((state) => state.customer);
  const { colors } = useTheme();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [activeSheet, setActiveSheet] = useState<'topup' | 'withdraw'>('topup');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentKey>('mtn');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const toastAnim = useRef(new Animated.Value(-80)).current;
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismissToast = () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    Animated.timing(toastAnim, { toValue: -80, duration: 260, useNativeDriver: true }).start(() => setToastVisible(false));
  };

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    toastAnim.setValue(-80);
    Animated.timing(toastAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
    toastTimer.current = setTimeout(dismissToast, 3500);
  };

  useEffect(() => {
    if (route.params?.credited) triggerToast('Zubba account credited successfully');
    return () => { if (toastTimer.current) clearTimeout(toastTimer.current); };
  }, [route.params?.credited]);

  useEffect(() => {
    if (route.params?.debited) triggerToast('Withdrawal successful');
    return () => { if (toastTimer.current) clearTimeout(toastTimer.current); };
  }, [route.params?.debited]);

  const ecoPoints = customer.points.toLocaleString();
  const hasTransactions = MOCK_TRANSACTIONS.length > 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right']}>

      {/* Header */}
      <View style={{ height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, backgroundColor: colors.bg }}>
        <Pressable style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-left" size={24} color={colors.text} />
        </Pressable>
        <View style={{ alignItems: 'center', gap: 1 }}>
          <Image source={zubbaText} style={{ width: 38, height: 17 }} resizeMode="contain" tintColor="#31973D" />
          <Text style={{ fontSize: 12, fontWeight: '600', letterSpacing: 0.6, textTransform: 'uppercase', color: colors.text, lineHeight: 14 }}>Account</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 12, paddingBottom: 40 }}>

        {/* Main card container */}
        <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingVertical: 11, gap: 24, alignItems: 'center' }}>

          {/* Balance card */}
          <View style={{ width: '95%', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 24, padding: 24, gap: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ gap: 4, flex: 1 }}>
                <Text style={{ fontSize: 12, fontWeight: '500', letterSpacing: 0.6, textTransform: 'uppercase', color: colors.textSub, lineHeight: 14 }}>Available Balance</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Text style={{ fontSize: 32, fontWeight: '600', color: colors.text, lineHeight: 38 }}>
                    {balanceVisible ? 'GHS 500.00' : 'GHS XXXXX'}
                  </Text>
                  <Pressable onPress={() => setBalanceVisible((v) => !v)}>
                    <MaterialCommunityIcons name={balanceVisible ? 'eye-outline' : 'eye-off-outline'} size={16} color={colors.textMuted} />
                  </Pressable>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFE088', borderRadius: 39, paddingHorizontal: 12, paddingVertical: 3 }}>
                <MaterialCommunityIcons name="star" size={11} color="#574500" />
                <Text style={{ fontSize: 10, fontWeight: '400', letterSpacing: 0.48, color: '#574500', lineHeight: 14 }}>Premium</Text>
              </View>
            </View>

            {/* Eco-Points row */}
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 40, backgroundColor: colors.surface, borderRadius: 8, gap: 8 }}>
              <MaterialCommunityIcons name="leaf" size={17} color="#31973D" />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, fontWeight: '500', letterSpacing: 0.48, color: colors.textSub }}>Eco-Points</Text>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
                  <Text style={{ fontSize: 20, fontWeight: '400', color: '#31973D', lineHeight: 28 }}>{ecoPoints}</Text>
                  <Text style={{ fontSize: 12, fontWeight: '400', color: '#31973D', opacity: 0.8 }}>pts</Text>
                </View>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={12} color={colors.textMuted} />
            </View>
          </View>

          {/* Action buttons */}
          <View style={{ width: '95%', flexDirection: 'row', gap: 10 }}>
            <Pressable
              style={{ flex: 1, height: 91, backgroundColor: activeSheet === 'withdraw' ? colors.card : '#31973D', borderWidth: activeSheet === 'withdraw' ? 1 : 0, borderColor: colors.border, borderRadius: 24, alignItems: 'center', justifyContent: 'center', gap: 7 }}
              onPress={() => { setActiveSheet('topup'); setSheetOpen(true); }}
            >
              <MaterialCommunityIcons name="plus-circle-outline" size={20} color={activeSheet === 'withdraw' ? '#31973D' : '#FFFFFF'} />
              <Text style={{ fontSize: 14, fontWeight: '500', color: activeSheet === 'withdraw' ? '#31973D' : '#FFFFFF', letterSpacing: 0.28 }}>Top Up</Text>
            </Pressable>

            <Pressable
              style={{ flex: 1, height: 91, backgroundColor: activeSheet === 'withdraw' ? '#31973D' : colors.card, borderWidth: activeSheet === 'withdraw' ? 0 : 1, borderColor: colors.border, borderRadius: 24, alignItems: 'center', justifyContent: 'center', gap: 7 }}
              onPress={() => { setActiveSheet('withdraw'); setSheetOpen(true); }}
            >
              <MaterialCommunityIcons name="send-outline" size={18} color={activeSheet === 'withdraw' ? '#FFFFFF' : '#31973D'} />
              <Text style={{ fontSize: 14, fontWeight: '500', color: activeSheet === 'withdraw' ? '#FFFFFF' : '#31973D', letterSpacing: 0.28 }}>Withdraw</Text>
            </Pressable>
          </View>

          {/* Recent Activity */}
          <View style={{ width: '95%', gap: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 20, fontWeight: '500', color: colors.text, lineHeight: 28 }}>Recent Activity</Text>
              <MaterialCommunityIcons name="tune-variant" size={18} color={colors.textMuted} />
            </View>

            {hasTransactions ? (
              <View>
                <View style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 24, overflow: 'hidden' }}>
                  {MOCK_TRANSACTIONS.map((tx, i) => (
                    <TransactionRow key={tx.id} tx={tx} isLast={i === MOCK_TRANSACTIONS.length - 1} colors={colors} />
                  ))}
                </View>
                <Pressable style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 8 }} onPress={() => navigation.navigate('Transactions')}>
                  <Text style={{ fontSize: 14, fontWeight: '500', color: colors.text, letterSpacing: 0.28 }}>View All Transactions</Text>
                </Pressable>
              </View>
            ) : (
              <View style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 24, paddingVertical: 26, alignItems: 'center', gap: 24 }}>
                <View style={{ alignItems: 'center', gap: 24 }}>
                  <View style={{ width: 60, height: 60, borderRadius: 9999, backgroundColor: colors.iconBg, alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialCommunityIcons name="cash-multiple" size={30} color="#31973D" />
                  </View>
                  <View style={{ alignItems: 'center', gap: 4, paddingHorizontal: 24 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, textAlign: 'center', lineHeight: 24 }}>No transaction yet</Text>
                    <Text style={{ fontSize: 14, fontWeight: '400', color: colors.textSub, textAlign: 'center', lineHeight: 20 }}>
                      Your accounts are linked, but there's been no activity in the last 30 days
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>

        </View>
      </ScrollView>

      {/* Top Up / Withdraw bottom sheet */}
      <Modal visible={sheetOpen} transparent animationType="slide" onRequestClose={() => setSheetOpen(false)} statusBarTranslucent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
          <Pressable style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onPress={() => setSheetOpen(false)} />

          <View style={{ backgroundColor: colors.card, borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingTop: 16, paddingBottom: 24, gap: 16, alignItems: 'center' }}>
            <View style={{ width: 152, height: 3, backgroundColor: colors.textMuted, borderRadius: 20 }} />

            <View style={{ width: '100%', paddingHorizontal: 24 }}>
              <Text style={{ fontSize: 16, fontWeight: '500', letterSpacing: -0.48, color: colors.text, lineHeight: 28 }}>
                {activeSheet === 'withdraw' ? 'Select withdrawal method' : 'Select a payment method'}
              </Text>
            </View>

            <View style={{ width: '100%', paddingHorizontal: 20 }}>
              {PAYMENT_METHODS.map((method, i) => {
                const isSelected = selectedPayment === method.key;
                const isLast = i === PAYMENT_METHODS.length - 1;
                return (
                  <Pressable
                    key={method.key}
                    onPress={() => setSelectedPayment(method.key)}
                    style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16, backgroundColor: colors.card, borderBottomWidth: isLast ? 0 : 1, borderBottomColor: colors.border }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                      <View style={{ width: 42, height: 26, backgroundColor: method.badgeBg, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: method.key === 'airtel' ? 1 : 0, borderColor: method.key === 'airtel' ? colors.border : 'transparent' }}>
                        {method.badgeIcon ? (
                          <MaterialCommunityIcons name={method.badgeIcon} size={14} color={method.badgeIconColor} />
                        ) : (
                          <Text style={{ fontSize: 12, fontWeight: method.badgeFontWeight, color: method.badgeLabelColor, lineHeight: 15 }}>{method.badgeLabel}</Text>
                        )}
                      </View>
                      <Text style={{ fontSize: 14, fontWeight: '400', color: colors.text, lineHeight: 24 }}>{method.name}</Text>
                    </View>

                    {isSelected ? (
                      <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#31973D', alignItems: 'center', justifyContent: 'center' }}>
                        <MaterialCommunityIcons name="check" size={14} color="#FFFFFF" />
                      </View>
                    ) : (
                      <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }} />
                    )}
                  </Pressable>
                );
              })}
            </View>

            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: 24, gap: 10 }}>
              <Pressable onPress={() => setSheetOpen(false)} style={{ width: 32, height: 32, backgroundColor: '#FFE2E2', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
                <MaterialCommunityIcons name="close" size={16} color="#EF4444" />
              </Pressable>
              <Pressable
                style={{ flex: 1, height: 40, backgroundColor: '#31973D', borderRadius: 999, alignItems: 'center', justifyContent: 'center' }}
                onPress={() => {
                  const dest = activeSheet === 'withdraw' ? 'Withdraw' : 'CreditAccount';
                  setSheetOpen(false);
                  navigation.navigate(dest);
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: '400', color: '#FFFFFF', lineHeight: 20 }}>Proceed</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success toast */}
      {toastVisible && (
        <Animated.View
          style={{
            position: 'absolute', top: 52, left: 16, right: 16,
            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
            backgroundColor: '#F0FDFA', borderWidth: 1, borderColor: '#14B8A6',
            borderRadius: 999, paddingVertical: 8, paddingHorizontal: 20, gap: 12,
            transform: [{ translateY: toastAnim }], zIndex: 999,
            shadowColor: 'rgba(69,71,69,0.25)', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 8, elevation: 8,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
            <MaterialCommunityIcons name="check-circle" size={24} color="#14B8A6" />
            <Text style={{ fontSize: 13, fontWeight: '500', color: '#0F766E', lineHeight: 28, flex: 1 }}>{toastMessage}</Text>
          </View>
          <Pressable onPress={dismissToast} hitSlop={8}>
            <MaterialCommunityIcons name="close" size={18} color="#0D9488" />
          </Pressable>
        </Animated.View>
      )}

    </SafeAreaView>
  );
}

export default ZubbaWalletScreen;
