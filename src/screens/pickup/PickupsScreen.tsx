import React, { useState } from 'react';
import { Pressable, SectionList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AppBottomNav } from '../../components';
import { useTheme, ThemeColors } from '../../context/ThemeContext';
import { useAppSelector } from '../../hooks/useAppSelector';
import type { RootStackScreenProps } from '../../navigation/types';

type PickupStatus = 'Completed' | 'Cancelled';

type Pickup = {
  id: string;
  date: string;
  status: PickupStatus;
  location: string;
  amount: string;
};

type PickupSection = {
  title: string | null;
  data: Pickup[];
};

const COMPLETED_SECTIONS: PickupSection[] = [
  {
    title: null,
    data: [
      { id: '1', date: '21 July', status: 'Completed', location: 'Komfo Anokye Hospital, Kumasi', amount: 'GHS 45.00' },
      { id: '2', date: '21 July', status: 'Cancelled', location: 'Adum Central Market, Kumasi', amount: 'GHS 0.00' },
      { id: '3', date: '20 July', status: 'Completed', location: 'KNUST Campus, Kumasi', amount: 'GHS 45.00' },
    ],
  },
  {
    title: '7 Days Ago',
    data: [
      { id: '4', date: '14 July', status: 'Completed', location: 'Suame Roundabout, Kumasi', amount: 'GHS 45.00' },
      { id: '5', date: '14 July', status: 'Completed', location: 'Bantama Market, Kumasi', amount: 'GHS 45.00' },
      { id: '6', date: '13 July', status: 'Cancelled', location: 'Asafo Market, Kumasi', amount: 'GHS 0.00' },
      { id: '7', date: '13 July', status: 'Completed', location: 'Ahodwo Roundabout, Kumasi', amount: 'GHS 45.00' },
    ],
  },
];

const PENDING_SECTIONS: PickupSection[] = [
  {
    title: null,
    data: [
      { id: 'p1', date: 'Today', status: 'Completed', location: 'Tech Junction, Kumasi', amount: 'GHS 45.00' },
    ],
  },
];

type TabKey = 'completed' | 'pending';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'completed', label: 'Completed' },
  { key: 'pending', label: 'Pending' },
];

function TabBar({
  active,
  onChange,
  colors,
}: {
  active: TabKey;
  onChange: (tab: TabKey) => void;
  colors: ThemeColors;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 20,
        paddingHorizontal: 20,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={{
              paddingVertical: 12,
              borderBottomWidth: 2,
              borderBottomColor: isActive ? '#31973D' : 'transparent',
            }}
          >
            <Text
              style={{
                fontFamily: 'Poppins',
                fontSize: 14,
                fontWeight: '500',
                color: isActive ? colors.text : colors.textSub,
              }}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function PickupRow({ pickup, isLast, colors }: { pickup: Pickup; isLast: boolean; colors: ThemeColors }) {
  const isCancelled = pickup.status === 'Cancelled';

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: colors.borderLight,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: colors.iconBg,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isCancelled ? 0.5 : 1,
        }}
      >
        <MaterialCommunityIcons name="truck-outline" size={20} color={colors.iconColor} />
      </View>

      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ fontFamily: 'Poppins', fontSize: 11, color: colors.textMuted }}>
          {pickup.date} . {pickup.status}
        </Text>
        <Text style={{ fontFamily: 'Poppins', fontSize: 14, color: colors.text }}>
          {pickup.location}
        </Text>
        <Text style={{ fontFamily: 'Poppins', fontSize: 14, fontWeight: '600', color: colors.text }}>
          {pickup.amount}
        </Text>
      </View>

      <Pressable
        hitSlop={8}
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.border,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MaterialCommunityIcons name="refresh" size={18} color={colors.textSub} />
      </Pressable>
    </View>
  );
}

export function PickupsScreen({ navigation }: RootStackScreenProps<'Pickups'>) {
  const { colors } = useTheme();
  const isPremium = useAppSelector((state) => state.customer.is_premium);
  const [activeTab, setActiveTab] = useState<TabKey>('completed');

  const sections = activeTab === 'completed' ? COMPLETED_SECTIONS : PENDING_SECTIONS;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right']}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>

        {/* Header */}
        <View
          style={{
            height: 48,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: colors.bg,
          }}
        >
          <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
            <MaterialCommunityIcons name="chevron-left" size={24} color={colors.text} />
          </Pressable>
          <Text style={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: 16, lineHeight: 24, color: colors.text }}>
            Pickups
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <TabBar active={activeTab} onChange={setActiveTab} colors={colors} />

        <View style={{ flex: 1, padding: 20 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 24,
              overflow: 'hidden',
            }}
          >
            <SectionList
              sections={sections}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 11, paddingBottom: 140 }}
              stickySectionHeadersEnabled={false}
              renderSectionHeader={({ section }) =>
                section.title ? (
                  <Text
                    style={{
                      fontFamily: 'Poppins',
                      fontSize: 14,
                      fontWeight: '500',
                      color: colors.textSub,
                      paddingHorizontal: 16,
                      paddingTop: 12,
                      paddingBottom: 4,
                    }}
                  >
                    {section.title}
                  </Text>
                ) : null
              }
              renderItem={({ item, index, section }) => (
                <PickupRow pickup={item} isLast={index === section.data.length - 1} colors={colors} />
              )}
              ListEmptyComponent={
                <View style={{ padding: 32, alignItems: 'center' }}>
                  <Text style={{ fontFamily: 'Poppins', fontSize: 14, color: colors.textSub, textAlign: 'center' }}>
                    No pickups yet
                  </Text>
                </View>
              }
            />
          </View>
        </View>

        <AppBottomNav
          activeTab="saved"
          showCalendar={isPremium}
          navigation={navigation}
        />
      </View>
    </SafeAreaView>
  );
}

export default PickupsScreen;
