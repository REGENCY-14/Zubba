import React from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBottomNav } from '../../components';
import AnimatedSwitch from '../../components/ui/inputs/AnimatedSwitch';
import type { RootStackScreenProps } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const SPECIAL_DATES: Record<number, { bg: string; text: string }> = {
  15: { bg: '#8DE9FF', text: '#1F2A33' },
  24: { bg: '#ADFF70', text: '#1F2A33' },
  30: { bg: '#FF70C1', text: '#FFFFFF' },
};

const DRIVERS = [
  { id: '1', name: 'Kwame Mensah', rating: '4.6' },
  { id: '2', name: 'Kwame Mensah', rating: '4.6' },
  { id: '3', name: 'Kwame Mensah', rating: '4.6' },
  { id: '4', name: 'Kwame Mensah', rating: '4.6' },
];

function buildCalendarCells(year: number, month: number): (number | null)[] {
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0=Sun
  const startOffset = (firstDayOfWeek + 6) % 7; // shift so Mon=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(startOffset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function PlanForLaterScreen({ navigation }: RootStackScreenProps<'PlanForLater'>) {
  const [activeTab, setActiveTab] = React.useState<'plan' | 'schedules'>('plan');
  const [frequency, setFrequency] = React.useState('Weekly');
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [binFull, setBinFull] = React.useState(false);
  const [startTime, setStartTime] = React.useState('');
  const [endTime, setEndTime] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const { colors } = useTheme();

  const [calYear, setCalYear] = React.useState(2026);
  const [calMonth, setCalMonth] = React.useState(5); // June (0-indexed)
  const calendarCells = buildCalendarCells(calYear, calMonth);

  function stepMonth(delta: number) {
    setCalMonth(prev => {
      const next = prev + delta;
      if (next < 0) { setCalYear(y => y - 1); return 11; }
      if (next > 11) { setCalYear(y => y + 1); return 0; }
      return next;
    });
  }

  const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right']}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>

        {/* Header */}
        <View style={{ height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, backgroundColor: colors.bg }}>
          <MaterialCommunityIcons name="menu" size={20} color={colors.text} />

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: 9, color: colors.textSub }}>Bin Full?</Text>
              <AnimatedSwitch value={binFull} onChange={setBinFull} />
            </View>
            <Pressable
              onPress={() => navigation.navigate('Notifications')}
              style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.iconBg, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' }}
            >
              <MaterialCommunityIcons name="bell-outline" size={20} color={colors.iconColor} />
              <View style={{ position: 'absolute', top: 9, right: 9, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' }} />
            </Pressable>
          </View>
        </View>

        {/* Tab bar */}
        <View style={{ paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border, alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', backgroundColor: colors.border, borderRadius: 12, padding: 2, width: 335 }}>
            {(['plan', 'schedules'] as const).map(tab => (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={{
                  flex: 1, paddingVertical: 4, paddingHorizontal: 12, borderRadius: 10, alignItems: 'center',
                  backgroundColor: activeTab === tab ? '#31973D' : 'transparent',
                  elevation: activeTab === tab ? 2 : 0,
                }}
              >
                <Text style={{ fontFamily: 'Poppins', fontWeight: activeTab === tab ? '500' : '400', fontSize: 12, color: activeTab === tab ? '#FFFFFF' : colors.textSub }}>
                  {tab === 'plan' ? 'Plan for later' : 'Schedules'}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 12, gap: 16, paddingBottom: 120 }}>

          {/* Outer card */}
          <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 24 }}>
            <View style={{ padding: 16, gap: 16 }}>

              {/* Section header — elevated so dropdown floats above calendar card */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 10, elevation: 10 }}>
                <Text style={{ fontFamily: 'Poppins', fontWeight: '700', fontSize: 24, lineHeight: 28, color: colors.text }}>
                  Scheduling Activity
                </Text>
                <View style={{ position: 'relative' }}>
                  <Pressable
                    onPress={() => setShowDropdown(v => !v)}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#31973D', borderRadius: 9999, paddingVertical: 6, paddingHorizontal: 12 }}
                  >
                    <Text style={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: 12, color: '#FFFFFF' }}>{frequency}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={12} color="#FFFFFF" />
                  </Pressable>

                  {showDropdown && (
                    <View style={{ position: 'absolute', top: 32, right: 0, zIndex: 20, elevation: 20, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 24, padding: 8, gap: 4, shadowColor: '#454745', shadowOpacity: 0.15, shadowRadius: 20, minWidth: 88 }}>
                      {['Daily', 'Weekly', 'Monthly'].map(opt => (
                        <Pressable
                          key={opt}
                          onPress={() => { setFrequency(opt); setShowDropdown(false); }}
                          style={{ paddingHorizontal: 8, paddingVertical: 6, borderRadius: 16, backgroundColor: frequency === opt ? 'rgba(52,168,83,0.5)' : 'transparent' }}
                        >
                          <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: 14, color: colors.text }}>{opt}</Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
              </View>

              {/* Calendar card */}
              <View style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 24, padding: 16, gap: 16, zIndex: 1 }}>

                {/* Month navigation */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Pressable onPress={() => stepMonth(-1)} hitSlop={8} style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.iconBg, alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialCommunityIcons name="chevron-left" size={18} color={colors.text} />
                  </Pressable>
                  <Text style={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: 13, color: colors.text }}>
                    {MONTH_NAMES[calMonth]} {calYear}
                  </Text>
                  <Pressable onPress={() => stepMonth(1)} hitSlop={8} style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.iconBg, alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialCommunityIcons name="chevron-right" size={18} color={colors.text} />
                  </Pressable>
                </View>

                {/* Day labels */}
                <View style={{ flexDirection: 'row' }}>
                  {DAY_LABELS.map(d => (
                    <View key={d} style={{ flex: 1, alignItems: 'center' }}>
                      <Text style={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: 10, color: colors.textSub }}>{d}</Text>
                    </View>
                  ))}
                </View>

                {/* Calendar grid */}
                <View>
                  {Array.from({ length: calendarCells.length / 7 }, (_, row) => (
                    <View key={row} style={{ flexDirection: 'row' }}>
                      {calendarCells.slice(row * 7, row * 7 + 7).map((day, col) => {
                        const special = (day && calYear === 2026 && calMonth === 5) ? SPECIAL_DATES[day] : undefined;
                        return (
                          <View key={col} style={{ flex: 1, alignItems: 'center', paddingVertical: 8 }}>
                            {day !== null && (
                              <View style={{ width: 28, height: 28, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', backgroundColor: special ? special.bg : 'transparent' }}>
                                <Text style={{ fontFamily: 'Poppins', fontWeight: special ? '600' : '400', fontSize: 12, color: special ? special.text : colors.text }}>
                                  {day}
                                </Text>
                              </View>
                            )}
                          </View>
                        );
                      })}
                    </View>
                  ))}
                </View>

                {/* Start / End time */}
                <View style={{ gap: 4 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ flex: 1, fontFamily: 'Poppins', fontWeight: '400', fontSize: 14, color: colors.text }}>Start Time</Text>
                    <View style={{ width: 40 }} />
                    <Text style={{ flex: 1, fontFamily: 'Poppins', fontWeight: '400', fontSize: 14, color: colors.text }}>End Time</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <TextInput
                        value={startTime}
                        onChangeText={setStartTime}
                        placeholder="00:00"
                        placeholderTextColor={colors.textMuted}
                        style={{ height: 48, paddingHorizontal: 12, borderWidth: 1, borderColor: colors.border, borderRadius: 16, fontFamily: 'Poppins', fontSize: 14, color: colors.text, backgroundColor: colors.card }}
                      />
                    </View>
                    <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#31973D', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <MaterialCommunityIcons name="arrow-right" size={16} color="#FFFFFF" />
                    </View>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <TextInput
                        value={endTime}
                        onChangeText={setEndTime}
                        placeholder="00:00"
                        placeholderTextColor={colors.textMuted}
                        style={{ height: 48, paddingHorizontal: 12, borderWidth: 1, borderColor: colors.border, borderRadius: 16, fontFamily: 'Poppins', fontSize: 14, color: colors.text, backgroundColor: colors.card }}
                      />
                    </View>
                  </View>
                </View>

                {/* Legend */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 4 }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#8DE9FF' }} />
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#ADFF70' }} />
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF70C1' }} />
                  <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: 12, color: colors.textSub }}>Scheduled dates</Text>
                </View>
              </View>

            </View>
          </View>

          {/* Recommended drivers */}
          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: 16, color: colors.text }}>Recommended  drivers</Text>
              <Text style={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: 14, color: '#31973D' }}>See all</Text>
            </View>

            {/* Search */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, height: 48, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 9999 }}>
              <MaterialCommunityIcons name="magnify" size={20} color={colors.textSub} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="search driver by name, unique...."
                placeholderTextColor={colors.textMuted}
                style={{ flex: 1, fontFamily: 'Poppins', fontSize: 14, color: colors.text }}
              />
            </View>

            {/* Driver rows */}
            {DRIVERS.map(driver => (
              <Pressable
                key={driver.id}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 9999, paddingHorizontal: 12, paddingVertical: 8 }}
              >
                <View style={{ position: 'relative' }}>
                  <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#C7E0C9', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontFamily: 'Poppins', fontWeight: '700', fontSize: 14, color: '#1F2A33' }}>KM</Text>
                  </View>
                  <View style={{ position: 'absolute', bottom: -2, right: -2, width: 18, height: 18, borderRadius: 9, backgroundColor: '#006B23', borderWidth: 2, borderColor: colors.card, alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialCommunityIcons name="check" size={9} color="#FFFFFF" />
                  </View>
                </View>

                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: 14, color: colors.text }}>{driver.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                    <MaterialCommunityIcons name="star-outline" size={12} color={colors.textSub} />
                    <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: 12, color: colors.textSub }}>{driver.rating}</Text>
                  </View>
                </View>

                <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSub} />
              </Pressable>
            ))}
          </View>

        </ScrollView>

        <AppBottomNav
          activeTab="settings"
          paddingBottom={14}
          bottomOffset={8}
          showCalendar
          onHomePress={() => navigation.navigate('PremiumHome')}
          onSavedPress={() => navigation.navigate('Details', { itemId: 'saved', title: 'Saved' })}
          onSettingsPress={() => navigation.navigate('Settings')}
          onCalendarPress={() => navigation.navigate('Schedule')}
        />
      </View>
    </SafeAreaView>
  );
}

export default PlanForLaterScreen;
