import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import type { RootStackScreenProps } from '../../navigation/types';
import { AppBottomNav } from '../../components';
import AnimatedSwitch from '../../components/ui/inputs/AnimatedSwitch';
import { useTheme } from '../../context/ThemeContext';

const DRIVERS = [
  { name: 'Kwame Mensah', rating: 4.6, premium: true },
  { name: 'Emmanuel',     rating: 4.7, premium: true },
  { name: 'Jeffery',      rating: 4.0, premium: false },
  { name: 'Andy',         rating: 4.9, premium: true },
  { name: 'Manu',         rating: 4.4, premium: false },
  { name: 'Oduro',        rating: 3.9, premium: false },
];

function ScheduleIllustration() {
  return (
    <View style={{ width: 222, height: 152 }}>
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 56,
          top: 0,
          bottom: 28,
          backgroundColor: '#64748A',
          borderRadius: 6,
          overflow: 'hidden',
        }}
      >
        <View style={{ height: 16, flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 6 }}>
          <View style={{ width: 5, height: 5, borderRadius: 99, backgroundColor: '#F0F0F0' }} />
          <View style={{ width: 5, height: 5, borderRadius: 99, backgroundColor: '#F0F0F0' }} />
          <View style={{ width: 5, height: 5, borderRadius: 99, backgroundColor: '#F0F0F0' }} />
        </View>
        <View style={{ flex: 1, backgroundColor: '#31973D', margin: 1, borderRadius: 2, paddingTop: 6, gap: 10 }}>
          <View style={{ height: 8, backgroundColor: 'rgba(255,255,255,0.3)', marginHorizontal: 6, borderRadius: 2 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 6 }}>
            <View style={{ width: 14, height: 14, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.5)' }} />
            <View style={{ flex: 1, height: 5, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 2 }} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 6 }}>
            <View style={{ width: 14, height: 14, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.5)' }} />
            <View style={{ flex: 1, height: 5, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 2 }} />
          </View>
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: 52,
          height: 52,
          borderRadius: 99,
          backgroundColor: '#FFFFFF',
          borderWidth: 2.5,
          borderColor: '#31973D',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MaterialCommunityIcons name="plus" size={26} color="#31973D" />
      </View>
    </View>
  );
}

export function ScheduleScreen({ navigation }: RootStackScreenProps<'Schedule'>) {
  const { colors } = useTheme();
  const [isBinFull, setIsBinFull]         = useState(false);
  const [sheetOpen, setSheetOpen]         = useState(false);
  const [driverListOpen, setDriverListOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [startTime, setStartTime]         = useState('');
  const [endTime, setEndTime]             = useState('');

  const canSchedule = !!selectedDriver;

  const openSheet = () => {
    setSelectedDriver(null);
    setStartTime('');
    setEndTime('');
    setDriverListOpen(false);
    setSheetOpen(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top', 'left', 'right']}>

      {/* Top bar */}
      <View style={{ height: 48, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 }}>
        <Pressable style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
          <MaterialCommunityIcons name="menu" size={20} color={colors.iconColor} />
        </Pressable>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={{ fontSize: 9, fontWeight: '600', color: '#3F4A3D', fontFamily: 'Poppins' }}>Bin Full?</Text>
            <AnimatedSwitch value={isBinFull} onChange={setIsBinFull} />
          </View>
          <View style={{ position: 'relative' }}>
            <Pressable style={{ width: 40, height: 40, borderRadius: 12, borderWidth: 1, borderColor: '#F3F4F6', backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center' }}>
              <MaterialCommunityIcons name="bell-outline" size={20} color="#374151" />
            </Pressable>
            <View style={{ position: 'absolute', width: 8, height: 8, borderRadius: 99, backgroundColor: '#EF4444', right: 9, top: 9 }} />
          </View>
        </View>
      </View>

      {/* Lavender date sub-header */}
      <View style={{ height: 44, backgroundColor: '#EDE9FE', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: '#000000', fontFamily: 'Plus Jakarta Sans' }}>Today</Text>
          <Pressable style={{ width: 28, height: 28, borderRadius: 12, backgroundColor: '#DDD6FE', alignItems: 'center', justifyContent: 'center' }}>
            <MaterialCommunityIcons name="calendar" size={16} color="#6D28D9" />
          </Pressable>
        </View>
        <Pressable>
          <MaterialCommunityIcons name="refresh" size={16} color="#64748A" />
        </Pressable>
      </View>

      {/* Empty state card */}
      <View style={{ flex: 1, padding: 20 }}>
        <View style={{ borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 20, height: 360, alignItems: 'center', justifyContent: 'flex-end', paddingHorizontal: 24, paddingBottom: 40, gap: 20 }}>
          <ScheduleIllustration />
          <View style={{ alignItems: 'center', gap: 5 }}>
            <Text style={{ fontSize: 16, fontWeight: '500', color: '#0F1621', fontFamily: 'Plus Jakarta Sans' }}>No Schedules</Text>
            <Text style={{ fontSize: 14, fontWeight: '400', color: '#64748A', textAlign: 'center', fontFamily: 'Plus Jakarta Sans' }}>Hit the plus icon to plan for later</Text>
          </View>
        </View>
      </View>

      {/* FAB */}
      <Pressable
        style={{ position: 'absolute', right: 20, bottom: 102, width: 48, height: 48, borderRadius: 99, backgroundColor: '#31973D', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: -1, height: 2 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 6 }}
        onPress={openSheet}
      >
        <MaterialCommunityIcons name="plus" size={16} color="#FFFFFF" />
      </Pressable>

      {/* Bottom nav */}
      <AppBottomNav
        activeTab="calendar"
        paddingBottom={0}
        onHomePress={() => navigation.navigate('PremiumHome')}
        onCalendarPress={() => {}}
        onSavedPress={() => navigation.navigate('Details', { itemId: 'saved', title: 'Saved' })}
        onSettingsPress={() => navigation.navigate('Settings')}
      />

      {/* Schedule details bottom sheet */}
      <Modal visible={sheetOpen} transparent animationType="slide" onRequestClose={() => setSheetOpen(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(69,71,69,0.15)', justifyContent: 'flex-end' }}>
          <Pressable style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onPress={() => setSheetOpen(false)} />

          <View style={{ backgroundColor: '#FFFFFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingTop: 16, paddingBottom: 40, height: '82%', justifyContent: 'space-between' }}>

            {/* Top section */}
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>

            {/* Handle */}
            <View style={{ width: 152, height: 3, backgroundColor: '#334154', borderRadius: 20, alignSelf: 'center' }} />

            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24 }}>
              <Text style={{ fontSize: 18, fontWeight: '500', color: '#000000', letterSpacing: -0.54, fontFamily: 'Plus Jakarta Sans' }}>
                Schedule details
              </Text>
              <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 9999 }}>
                <Text style={{ fontSize: 12, fontWeight: '500', fontFamily: 'Poppins' }}>Daily</Text>
                <MaterialCommunityIcons name="chevron-down" size={12} color="#000" />
              </Pressable>
            </View>

            {/* Content */}
            <View style={{ paddingHorizontal: 24, gap: 16, width: '100%' }}>

              {/* Select driver button */}
              <Pressable
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 40, backgroundColor: '#31973D', borderRadius: 16 }}
                onPress={() => setDriverListOpen((v) => !v)}
              >
                <MaterialCommunityIcons name="plus-circle-outline" size={16} color="#FFFFFF" />
                <Text style={{ fontSize: 14, color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans' }}>
                  {selectedDriver ?? 'Select available driver'}
                </Text>
              </Pressable>

              {/* Driver dropdown — floats over content below */}
              {driverListOpen && (
                <View
                  style={{
                    position: 'absolute',
                    left: 24,
                    right: 24,
                    top: 48,
                    backgroundColor: '#FFFFFF',
                    borderWidth: 1,
                    borderColor: '#E2E8F0',
                    borderRadius: 24,
                    padding: 8,
                    shadowColor: 'rgba(69,71,69,0.15)',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 1,
                    shadowRadius: 20,
                    elevation: 12,
                    zIndex: 20,
                  }}
                >
                  {/* Dropdown header */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 3, paddingHorizontal: 4, marginBottom: 4, borderBottomWidth: 1, borderBottomColor: 'rgba(184,184,184,0.2)' }}>
                    <Text style={{ fontSize: 14, fontWeight: '500', color: '#1F2A33', fontFamily: 'Poppins' }}>Recommended</Text>
                    <Text style={{ fontSize: 11, fontWeight: '500', color: 'rgba(14,90,142,0.7)', textDecorationLine: 'underline', fontFamily: 'Inter' }}>Search</Text>
                  </View>

                  {/* Driver list */}
                  <ScrollView style={{ maxHeight: 224 }} showsVerticalScrollIndicator={false}>
                    {DRIVERS.map((driver) => (
                      <Pressable
                        key={driver.name}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          height: 34,
                          borderRadius: 16,
                          backgroundColor: selectedDriver === driver.name ? '#F1F5F9' : 'transparent',
                          marginBottom: 4,
                        }}
                        onPress={() => { setSelectedDriver(driver.name); setDriverListOpen(false); }}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <Text style={{ fontSize: 14, fontWeight: '500', color: '#101010', fontFamily: 'Inter' }}>{driver.name}</Text>
                          {driver.premium && (
                            <MaterialCommunityIcons name="medal" size={13} color="#D4AF37" />
                          )}
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                          <MaterialCommunityIcons name="star" size={16} color="#FEC002" />
                          <Text style={{ fontSize: 12, color: '#939393', fontFamily: 'Inter' }}>{driver.rating}</Text>
                        </View>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Date picker row */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 48, backgroundColor: '#F1F5F9', borderRadius: 12 }}>
                <MaterialCommunityIcons name="calendar" size={16} color="#94A3B7" />
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#94A3B7', fontFamily: 'Plus Jakarta Sans' }}>Today</Text>
                <MaterialCommunityIcons name="refresh" size={16} color="#94A3B7" />
              </View>

              {/* Start / End time */}
              <View style={{ gap: 4 }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ flex: 1, fontSize: 14, color: '#94A3B7', fontFamily: 'Plus Jakarta Sans' }}>Start Time</Text>
                  <Text style={{ flex: 1, fontSize: 14, color: '#94A3B7', fontFamily: 'Plus Jakarta Sans' }}>End Time</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, width: '100%' }}>
                  <TextInput
                    style={{ flex: 1, minWidth: 0, height: 48, borderWidth: 1, borderColor: '#CBD5E0', borderRadius: 24, paddingHorizontal: 12, fontSize: 14, color: '#1F2A33', fontFamily: 'Plus Jakarta Sans' }}
                    placeholder="00:00"
                    placeholderTextColor="#94A3B7"
                    keyboardType="numeric"
                    value={startTime}
                    onChangeText={setStartTime}
                  />
                  <Pressable style={{ width: 24, height: 24, flexShrink: 0, borderRadius: 12, backgroundColor: '#31973D', alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialCommunityIcons name="arrow-right" size={16} color="#FFFFFF" />
                  </Pressable>
                  <TextInput
                    style={{ flex: 1, minWidth: 0, height: 48, borderWidth: 1, borderColor: '#CBD5E0', borderRadius: 24, paddingHorizontal: 12, fontSize: 14, color: '#1F2A33', fontFamily: 'Plus Jakarta Sans' }}
                    placeholder="00:00"
                    placeholderTextColor="#94A3B7"
                    keyboardType="numeric"
                    value={endTime}
                    onChangeText={setEndTime}
                  />
                </View>
              </View>

            </View>

            </ScrollView>{/* end top section */}

            {/* Bottom action row */}
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, gap: 10 }}>
              <Pressable
                style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#FFE2E2', alignItems: 'center', justifyContent: 'center' }}
                onPress={() => setSheetOpen(false)}
              >
                <MaterialCommunityIcons name="close" size={16} color="#EF4444" />
              </Pressable>

              <Pressable
                style={{ flex: 1, height: 40, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: canSchedule ? '#31973D' : 'rgba(52,168,83,0.5)' }}
                disabled={!canSchedule}
              >
                <Text style={{ fontSize: 14, color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans' }}>Schedule</Text>
              </Pressable>
            </View>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

export default ScheduleScreen;
