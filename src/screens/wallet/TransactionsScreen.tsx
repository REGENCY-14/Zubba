import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import type { RootStackScreenProps } from '../../navigation/types';

type TxStatus = 'SUCCESS' | 'CREDITED' | 'PENDING' | 'FAILED';
type FilterKey = 'All' | 'Incoming' | 'Expenses' | 'Success' | 'Failed';

type Transaction = {
  id: string;
  title: string;
  date: string;
  amount: string;
  amountColor: string;
  status: TxStatus;
  type: 'incoming' | 'expense';
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

const ALL_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    title: 'Weekly Pickup Fee',
    date: 'Oct 24, 2023 • 08:45 AM',
    amount: '- GHS 45.00',
    amountColor: '#FF383C',
    status: 'SUCCESS',
    type: 'expense',
    iconBg: 'rgba(0, 107, 35, 0.1)',
    iconName: 'receipt-text-outline',
    iconColor: '#31973D',
  },
  {
    id: '2',
    title: 'MoMo Top-up',
    date: 'Oct 20, 2023 • 11:30 AM',
    amount: '+ GHS 200.00',
    amountColor: '#31973D',
    status: 'PENDING',
    type: 'incoming',
    iconBg: 'rgba(20, 135, 50, 0.1)',
    iconName: 'cellphone',
    iconColor: '#31973D',
  },
  {
    id: '3',
    title: 'MoMo Top-up',
    date: 'Oct 20, 2023 • 11:30 AM',
    amount: '+ GHS 200.00',
    amountColor: '#31973D',
    status: 'PENDING',
    type: 'incoming',
    iconBg: 'rgba(20, 135, 50, 0.1)',
    iconName: 'cellphone',
    iconColor: '#31973D',
  },
  {
    id: '4',
    title: 'MoMo Top-up',
    date: 'Oct 20, 2023 • 11:30 AM',
    amount: '+ GHS 200.00',
    amountColor: '#31973D',
    status: 'PENDING',
    type: 'incoming',
    iconBg: 'rgba(20, 135, 50, 0.1)',
    iconName: 'cellphone',
    iconColor: '#31973D',
  },
  {
    id: '5',
    title: 'MoMo Top-up',
    date: 'Oct 20, 2023 • 11:30 AM',
    amount: '+ GHS 200.00',
    amountColor: '#31973D',
    status: 'PENDING',
    type: 'incoming',
    iconBg: 'rgba(20, 135, 50, 0.1)',
    iconName: 'cellphone',
    iconColor: '#31973D',
  },
  {
    id: '6',
    title: 'MoMo Top-up',
    date: 'Oct 20, 2023 • 11:30 AM',
    amount: '+ GHS 200.00',
    amountColor: '#31973D',
    status: 'PENDING',
    type: 'incoming',
    iconBg: 'rgba(20, 135, 50, 0.1)',
    iconName: 'cellphone',
    iconColor: '#31973D',
  },
  {
    id: '7',
    title: 'MoMo Top-up',
    date: 'Oct 20, 2023 • 11:30 AM',
    amount: '+ GHS 200.00',
    amountColor: '#31973D',
    status: 'PENDING',
    type: 'incoming',
    iconBg: 'rgba(20, 135, 50, 0.1)',
    iconName: 'cellphone',
    iconColor: '#31973D',
  },
];

const FILTERS: FilterKey[] = ['All', 'Incoming', 'Expenses', 'Success', 'Failed'];

function applyFilter(txs: Transaction[], filter: FilterKey): Transaction[] {
  switch (filter) {
    case 'Incoming': return txs.filter((t) => t.type === 'incoming');
    case 'Expenses': return txs.filter((t) => t.type === 'expense');
    case 'Success':  return txs.filter((t) => t.status === 'SUCCESS' || t.status === 'CREDITED');
    case 'Failed':   return txs.filter((t) => t.status === 'FAILED');
    default:         return txs;
  }
}

function TransactionRow({ tx, isLast }: { tx: Transaction; isLast: boolean }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 16,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: 'rgba(111, 122, 108, 0.05)',
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 9999,
          backgroundColor: tx.iconBg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MaterialCommunityIcons name={tx.iconName} size={20} color={tx.iconColor} />
      </View>

      <View style={{ flex: 1, gap: 4 }}>
        <Text style={{ fontSize: 14, fontWeight: '500', letterSpacing: 0.28, color: '#1F2A33', lineHeight: 17 }}>
          {tx.title}
        </Text>
        <Text style={{ fontSize: 13, fontWeight: '400', color: '#ACB5BB', lineHeight: 21 }}>
          {tx.date}
        </Text>
      </View>

      <View style={{ alignItems: 'flex-end', gap: 4 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', letterSpacing: 0.28, color: tx.amountColor, lineHeight: 17 }}>
          {tx.amount}
        </Text>
        <Text
          style={{
            fontSize: 10,
            fontWeight: '600',
            letterSpacing: -0.5,
            textTransform: 'uppercase',
            color: STATUS_COLOR[tx.status],
            lineHeight: 15,
          }}
        >
          {tx.status}
        </Text>
      </View>
    </View>
  );
}

export function TransactionsScreen({ navigation }: RootStackScreenProps<'Transactions'>) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('All');
  const [showFilter, setShowFilter] = useState(false);

  const filtered = applyFilter(ALL_TRANSACTIONS, activeFilter);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top', 'left', 'right']}>

      {/* Header */}
      <View
        style={{
          height: 48,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          backgroundColor: '#FFFFFF',
        }}
      >
        <Pressable
          style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="chevron-left" size={24} color="#0F1621" />
        </Pressable>

        <Text style={{ fontSize: 16, fontWeight: '600', color: '#1F2A33', lineHeight: 24 }}>
          Transactions
        </Text>

        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 12, paddingBottom: 40 }}
      >
        {/* Main card */}
        <View
          style={{
            backgroundColor: '#F8FAFC',
            borderWidth: 1,
            borderColor: '#E2E8F0',
            borderRadius: 24,
            paddingVertical: 11,
            paddingHorizontal: 11,
            gap: 16,
          }}
        >
          {/* Section header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 5 }}>
            <Text style={{ fontSize: 20, fontWeight: '500', color: '#1A1C1E', lineHeight: 28 }}>
              Recent Activity
            </Text>
            <Pressable
              onPress={() => setShowFilter((v) => !v)}
              style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}
            >
              <MaterialCommunityIcons name="tune-variant" size={18} color="#ACB5BB" />
            </Pressable>
          </View>

          {/* Transactions list */}
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderWidth: 1,
              borderColor: '#E2E8F0',
              borderRadius: 24,
              overflow: 'hidden',
            }}
          >
            {filtered.length > 0 ? (
              filtered.map((tx, i) => (
                <TransactionRow key={tx.id + i} tx={tx} isLast={i === filtered.length - 1} />
              ))
            ) : (
              <View style={{ padding: 32, alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: '#ACB5BB', textAlign: 'center' }}>
                  No transactions found
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Filter dropdown overlay */}
      {showFilter && (
        <>
          {/* Tap-outside backdrop */}
          <Pressable
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            onPress={() => setShowFilter(false)}
          />

          {/* Dropdown panel */}
          <View
            style={{
              position: 'absolute',
              top: 154,
              right: 16,
              width: 161,
              backgroundColor: '#FFFFFF',
              borderWidth: 1,
              borderColor: '#E2E8F0',
              borderRadius: 24,
              padding: 8,
              gap: 4,
              shadowColor: 'rgba(69, 71, 69, 0.15)',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 1,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            {FILTERS.map((filter) => {
              const isActive = filter === activeFilter;
              return (
                <Pressable
                  key={filter}
                  onPress={() => {
                    setActiveFilter(filter);
                    setShowFilter(false);
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 8,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: isActive ? 'rgba(184, 184, 184, 0.2)' : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '400',
                      color: isActive ? '#1F2A33' : '#64748A',
                      lineHeight: 20,
                    }}
                  >
                    {filter}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </>
      )}

    </SafeAreaView>
  );
}

export default TransactionsScreen;
