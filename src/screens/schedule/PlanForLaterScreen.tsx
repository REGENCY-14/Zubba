import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBottomNav } from '../../components';
import AnimatedSwitch from '../../components/ui/inputs/AnimatedSwitch';
import type { RootStackScreenProps } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';
import { scale, verticalScale, moderateScale } from '../../utils/scale';

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
  const { colors } = useTheme()
  const [frequency, setFrequency] = React.useState('Weekly');
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [binFull, setBinFull] = React.useState(false);
  const [startTime, setStartTime] = React.useState('');
  const [endTime, setEndTime] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');

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
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
      <View className="flex-1 bg-white">

        {/* Header */}
        <View className="h-12 flex-row items-center justify-between px-4 bg-white">
          <MaterialCommunityIcons name="menu" size={moderateScale(20)} color="#0F1621" />

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: moderateScale(8) }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: moderateScale(4) }}>
              <Text style={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: moderateScale(9), color: '#3F4A3D' }}>Bin Full?</Text>
              <AnimatedSwitch value={binFull} onChange={setBinFull} />
            </View>
            <Pressable
              onPress={() => navigation.navigate('NotificationsList')}
              style={{ width: moderateScale(40), height: moderateScale(40), borderRadius: moderateScale(12), backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' }}
            >
              <MaterialCommunityIcons name="bell-outline" size={moderateScale(20)} color="#374151" />
              <View style={{ position: 'absolute', top: verticalScale(9), right: scale(9), width: moderateScale(8), height: moderateScale(8), borderRadius: moderateScale(4), backgroundColor: '#EF4444' }} />
            </Pressable>
          </View>
        </View>

        {/* Tab bar */}
        <View style={{ paddingHorizontal: scale(12), paddingVertical: verticalScale(8), borderBottomWidth: 1, borderBottomColor: '#E2E8F0', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', backgroundColor: '#E2E8F0', borderRadius: moderateScale(12), padding: moderateScale(2), width: scale(335) }}>
            {(['plan', 'schedules'] as const).map(tab => (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={{
                  flex: 1, paddingVertical: verticalScale(4), paddingHorizontal: scale(12), borderRadius: moderateScale(10), alignItems: 'center',
                  backgroundColor: activeTab === tab ? '#31973D' : 'transparent',
                  elevation: activeTab === tab ? 2 : 0,
                }}
              >
                <Text style={{ fontFamily: 'Poppins', fontWeight: activeTab === tab ? '500' : '400', fontSize: moderateScale(12), color: activeTab === tab ? '#FFFFFF' : colors.textSub }}>
                  {tab === 'plan' ? 'Plan for later' : 'Schedules'}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: moderateScale(12), gap: moderateScale(16), paddingBottom: verticalScale(120) }}>

          {/* Outer card */}
          <View style={{ backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: moderateScale(24) }}>
            <View style={{ padding: moderateScale(16), gap: moderateScale(16) }}>

              {/* Section header — elevated so dropdown floats above calendar card */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 10, elevation: 10 }}>
                <Text style={{ fontFamily: 'Poppins', fontWeight: '700', fontSize: moderateScale(24), lineHeight: moderateScale(28), color: '#1F2A33' }}>
                  Scheduling Activity
                </Text>
                <View style={{ position: 'relative' }}>
                  <Pressable
                    onPress={() => setShowDropdown(v => !v)}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: moderateScale(8), backgroundColor: '#31973D', borderRadius: 9999, paddingVertical: verticalScale(6), paddingHorizontal: scale(12) }}
                  >
                    <Text style={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: moderateScale(12), color: '#FFFFFF' }}>{frequency}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={moderateScale(12)} color="#FFFFFF" />
                  </Pressable>

                  {showDropdown && (
                    <View style={{ position: 'absolute', top: verticalScale(32), right: scale(0), zIndex: 20, elevation: 20, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: moderateScale(24), padding: moderateScale(8), gap: moderateScale(4), shadowColor: '#454745', shadowOpacity: 0.15, shadowRadius: 20, minWidth: scale(88) }}>
                      {['Daily', 'Weekly', 'Monthly'].map(opt => (
                        <Pressable
                          key={opt}
                          onPress={() => { setFrequency(opt); setShowDropdown(false); }}
                          style={{ paddingHorizontal: scale(8), paddingVertical: verticalScale(6), borderRadius: moderateScale(16), backgroundColor: frequency === opt ? 'rgba(52,168,83,0.5)' : 'transparent' }}
                        >
                          <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: moderateScale(14), color: colors.text }}>{opt}</Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
              </View>

              {/* White calendar card */}
              <View style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: moderateScale(24), padding: moderateScale(16), gap: moderateScale(16), zIndex: 1 }}>

                {/* Month navigation */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Pressable onPress={() => stepMonth(-1)} hitSlop={8} style={{ width: moderateScale(28), height: moderateScale(28), borderRadius: moderateScale(14), backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialCommunityIcons name="chevron-left" size={moderateScale(18)} color="#1F2A33" />
                  </Pressable>
                  <Text style={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: moderateScale(13), color: '#1F2A33' }}>
                    {MONTH_NAMES[calMonth]} {calYear}
                  </Text>
                  <Pressable onPress={() => stepMonth(1)} hitSlop={8} style={{ width: moderateScale(28), height: moderateScale(28), borderRadius: moderateScale(14), backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialCommunityIcons name="chevron-right" size={moderateScale(18)} color="#1F2A33" />
                  </Pressable>
                </View>

                {/* Day labels */}
                <View style={{ flexDirection: 'row' }}>
                  {DAY_LABELS.map(d => (
                    <View key={d} style={{ flex: 1, alignItems: 'center' }}>
                      <Text style={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: moderateScale(10), color: '#64748A' }}>{d}</Text>
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
                          <View key={col} style={{ flex: 1, alignItems: 'center', paddingVertical: verticalScale(8) }}>
                            {day !== null && (
                              <View style={{ width: moderateScale(28), height: moderateScale(28), borderRadius: 9999, alignItems: 'center', justifyContent: 'center', backgroundColor: special ? special.bg : 'transparent' }}>
                                <Text style={{ fontFamily: 'Poppins', fontWeight: special ? '600' : '400', fontSize: moderateScale(12), color: special ? special.text : '#1F2A33' }}>
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
                <View style={{ gap: moderateScale(4) }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ flex: 1, fontFamily: 'Poppins', fontWeight: '400', fontSize: moderateScale(14), color: colors.text }}>Start Time</Text>
                    <View style={{ width: scale(40) }} />
                    <Text style={{ flex: 1, fontFamily: 'Poppins', fontWeight: '400', fontSize: moderateScale(14), color: colors.text }}>End Time</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: moderateScale(8) }}>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <TextInput
                        value={startTime}
                        onChangeText={setStartTime}
                        placeholder="00:00"
                        placeholderTextColor={colors.textMuted}
                        style={{ height: verticalScale(48), paddingHorizontal: scale(12), borderWidth: 1, borderColor: colors.border, borderRadius: moderateScale(16), fontFamily: 'Poppins', fontSize: moderateScale(14), color: colors.text, backgroundColor: colors.card }}
                      />
                    </View>
                    <View style={{ width: moderateScale(24), height: moderateScale(24), borderRadius: moderateScale(12), backgroundColor: '#31973D', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <MaterialCommunityIcons name="arrow-right" size={moderateScale(16)} color="#FFFFFF" />
                    </View>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <TextInput
                        value={endTime}
                        onChangeText={setEndTime}
                        placeholder="00:00"
                        placeholderTextColor={colors.textMuted}
                        style={{ height: verticalScale(48), paddingHorizontal: scale(12), borderWidth: 1, borderColor: colors.border, borderRadius: moderateScale(16), fontFamily: 'Poppins', fontSize: moderateScale(14), color: colors.text, backgroundColor: colors.card }}
                      />
                    </View>
                  </View>
                </View>

                {/* Legend */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: moderateScale(6), paddingHorizontal: scale(4) }}>
                  <View style={{ width: moderateScale(10), height: moderateScale(10), borderRadius: moderateScale(5), backgroundColor: '#8DE9FF' }} />
                  <View style={{ width: moderateScale(10), height: moderateScale(10), borderRadius: moderateScale(5), backgroundColor: '#ADFF70' }} />
                  <View style={{ width: moderateScale(10), height: moderateScale(10), borderRadius: moderateScale(5), backgroundColor: '#FF70C1' }} />
                  <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: moderateScale(12), color: colors.textSub }}>Scheduled dates</Text>
                </View>
              </View>

            </View>
          </View>

          {/* Recommended drivers */}
          <View style={{ gap: moderateScale(12) }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: moderateScale(16), color: colors.text }}>Recommended  drivers</Text>
              <Text style={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: moderateScale(14), color: '#31973D' }}>See all</Text>
            </View>

            {/* Search */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: moderateScale(8), paddingHorizontal: scale(12), height: verticalScale(48), backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 9999 }}>
              <MaterialCommunityIcons name="magnify" size={moderateScale(20)} color="#64748A" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="search driver by name, unique...."
                placeholderTextColor={colors.textMuted}
                style={{ flex: 1, fontFamily: 'Poppins', fontSize: moderateScale(14), color: colors.text }}
              />
            </View>

            {/* Driver rows */}
            {DRIVERS.map(driver => (
              <Pressable
                key={driver.id}
                style={{ flexDirection: 'row', alignItems: 'center', gap: moderateScale(12), backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 9999, paddingHorizontal: scale(12), paddingVertical: verticalScale(8) }}
              >
                <View style={{ position: 'relative' }}>
                  <View style={{ width: moderateScale(48), height: moderateScale(48), borderRadius: moderateScale(24), backgroundColor: '#C7E0C9', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontFamily: 'Poppins', fontWeight: '700', fontSize: moderateScale(14), color: '#1F2A33' }}>KM</Text>
                  </View>
                  <View style={{ position: 'absolute', bottom: verticalScale(-2), right: scale(-2), width: moderateScale(18), height: moderateScale(18), borderRadius: moderateScale(9), backgroundColor: '#006B23', borderWidth: 2, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialCommunityIcons name="check" size={moderateScale(9)} color="#FFFFFF" />
                  </View>
                </View>

                <View style={{ flex: 1, gap: moderateScale(2) }}>
                  <Text style={{ fontFamily: 'Poppins', fontWeight: '500', fontSize: moderateScale(14), color: '#1F2A33' }}>{driver.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: moderateScale(3) }}>
                    <MaterialCommunityIcons name="star-outline" size={moderateScale(12)} color={colors.textSub} />
                    <Text style={{ fontFamily: 'Poppins', fontWeight: '400', fontSize: moderateScale(12), color: colors.textSub }}>{driver.rating}</Text>
                  </View>
                </View>

                <MaterialCommunityIcons name="chevron-right" size={moderateScale(20)} color="#64748A" />
              </Pressable>
            ))}
          </View>

        </ScrollView>

        <AppBottomNav
          activeTab="settings"
          paddingBottom={14}
          bottomOffset={8}
          navigation={navigation}
        />
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default PlanForLaterScreen;
