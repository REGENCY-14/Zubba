import React, { useEffect, useRef, useState } from 'react';
import { Animated, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import type { RootStackScreenProps } from '../../navigation/types';
import { AppBottomNav } from '../../components';
import AnimatedSwitch from '../../components/ui/inputs/AnimatedSwitch';
import { useTheme } from '../../context/ThemeContext';

/* ─── constants ─────────────────────────────────────────────── */

const DRIVERS = [
  { name: 'Kwame Mensah', rating: 4.6, premium: true },
  { name: 'Emmanuel',     rating: 4.7, premium: true },
  { name: 'Jeffery',      rating: 4.0, premium: true },
  { name: 'Andy',         rating: 4.9, premium: true },
  { name: 'Manu',         rating: 4.4, premium: true },
  { name: 'Oduro',        rating: 3.9, premium: true },
];

const FREQUENCIES = ['One time pickup', 'Daily', 'Weekly', 'Monthly'];

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const DAY_LABELS = ['S','M','T','W','T','F','S'];

const HOURS   = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const PERIODS = ['AM', 'PM'];

const ITEM_H = 44;

/* ─── helpers ───────────────────────────────────────────────── */

function getCalendarDays(year: number, month: number) {
  const firstDay       = new Date(year, month, 1).getDay();
  const daysInMonth    = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const days: { day: number; currentMonth: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) days.push({ day: daysInPrevMonth - i, currentMonth: false });
  for (let d = 1; d <= daysInMonth; d++)  days.push({ day: d, currentMonth: true });
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++)    days.push({ day: d, currentMonth: false });
  return days;
}

/* ─── TimePickerColumn ──────────────────────────────────────── */

function TimePickerColumn({
  items,
  initialIndex,
  indexRef,
}: {
  items: string[];
  initialIndex: number;
  indexRef: React.MutableRefObject<number>;
}) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    indexRef.current = initialIndex;
    const t = setTimeout(() => {
      scrollRef.current?.scrollTo({ y: initialIndex * ITEM_H, animated: false });
    }, 60);
    return () => clearTimeout(t);
  }, []);

  const getIdx = (y: number) =>
    Math.max(0, Math.min(items.length - 1, Math.round(y / ITEM_H)));

  const commit = (y: number) => {
    const idx = getIdx(y);
    indexRef.current = idx;
    setActiveIndex(idx);
  };

  return (
    <View style={{ flex: 1, height: ITEM_H * 4 }}>
      <View
        pointerEvents="none"
        style={{ position: 'absolute', top: ITEM_H, left: 2, right: 2, height: ITEM_H, backgroundColor: '#F1F5F9', borderRadius: 14 }}
      />
      <ScrollView
        ref={scrollRef}
        style={{ height: ITEM_H * 4, backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingTop: ITEM_H, paddingBottom: ITEM_H * 2 }}
        snapToInterval={ITEM_H}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={e => { indexRef.current = getIdx(e.nativeEvent.contentOffset.y); }}
        onScrollEndDrag={e => commit(e.nativeEvent.contentOffset.y)}
        onMomentumScrollEnd={e => commit(e.nativeEvent.contentOffset.y)}
      >
        {items.map((item, i) => (
          <View key={i} style={{ height: ITEM_H, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{
              fontSize: 16,
              fontWeight: i === activeIndex ? '600' : '500',
              color: i === activeIndex ? '#111826' : '#64748A',
              fontFamily: 'Plus Jakarta Sans',
            }}>
              {item}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

/* ─── ScheduleIllustration ──────────────────────────────────── */

function ScheduleIllustration() {
  return (
    <View style={{ width: 222, height: 152 }}>
      <View style={{ position: 'absolute', left: 0, right: 56, top: 0, bottom: 28, backgroundColor: '#64748A', borderRadius: 6, overflow: 'hidden' }}>
        <View style={{ height: 16, flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 6 }}>
          {[0,1,2].map(k => <View key={k} style={{ width: 5, height: 5, borderRadius: 99, backgroundColor: '#F0F0F0' }} />)}
        </View>
        <View style={{ flex: 1, backgroundColor: '#31973D', margin: 1, borderRadius: 2, paddingTop: 6, gap: 10 }}>
          <View style={{ height: 8, backgroundColor: 'rgba(255,255,255,0.3)', marginHorizontal: 6, borderRadius: 2 }} />
          {[0,1].map(k => (
            <View key={k} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 6 }}>
              <View style={{ width: 14, height: 14, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.5)' }} />
              <View style={{ flex: 1, height: 5, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 2 }} />
            </View>
          ))}
        </View>
      </View>
      <View style={{ position: 'absolute', right: 0, bottom: 0, width: 52, height: 52, borderRadius: 99, backgroundColor: '#FFFFFF', borderWidth: 2.5, borderColor: '#31973D', alignItems: 'center', justifyContent: 'center' }}>
        <MaterialCommunityIcons name="plus" size={26} color="#31973D" />
      </View>
    </View>
  );
}

/* ─── ScheduleItem type ─────────────────────────────────────── */

type ScheduleItem = {
  id: string;
  driver: string;
  date: string;
  timeRange: string;
  location: string;
  rawYear: number;
  rawMonth: number;
  rawDay: number | null;
  rawStartTime: string;
  rawEndTime: string;
  frequency: string;
};

/* ─── ScheduleCard ──────────────────────────────────────────── */

function ScheduleCard({
  item,
  menuOpen,
  onMenuOpen,
  onMenuClose,
  onEdit,
  onDelete,
}: {
  item: ScheduleItem;
  menuOpen: boolean;
  onMenuOpen: () => void;
  onMenuClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 12, height: 128 }}>

      {/* Main section */}
      <View style={{ flex: 1, paddingTop: 4, paddingRight: 16, paddingBottom: 4, gap: 10, justifyContent: 'center', height: '100%' }}>

        {/* Status badge */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FEF3C7', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 }}>
            <MaterialCommunityIcons name="moon-waning-crescent" size={14} color="#92400E" />
            <Text style={{ fontSize: 12, color: '#92400E', fontFamily: 'Plus Jakarta Sans' }}>Scheduled</Text>
          </View>
        </View>

        {/* Date / time / location */}
        <View style={{ gap: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ paddingHorizontal: 4, paddingVertical: 4, borderRightWidth: 1, borderRightColor: '#D2CACA' }}>
              <Text style={{ fontSize: 12, fontWeight: '500', fontFamily: 'Poppins' }}>{item.date}</Text>
            </View>
            <View style={{ paddingHorizontal: 4, paddingVertical: 4 }}>
              <Text style={{ fontSize: 12, fontWeight: '500', fontFamily: 'Poppins' }}>{item.timeRange || '—'}</Text>
            </View>
          </View>
          <View style={{ paddingHorizontal: 4 }}>
            <Text style={{ fontSize: 13, fontWeight: '500', fontFamily: 'Poppins' }} numberOfLines={1}>{item.location || 'No location set'}</Text>
          </View>
        </View>

        {/* Estimated cost */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 13, fontWeight: '500', color: '#64748A', fontFamily: 'Poppins' }}>Estimated cost</Text>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#1F2A33', fontFamily: 'Poppins' }}>GHS 15.00</Text>
        </View>

      </View>

      {/* Three-dot menu column */}
      <View style={{ width: 35, alignItems: 'center', paddingTop: 8 }}>
        <Pressable
          style={{ width: 32, height: 32, borderRadius: 1000, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' }}
          onPress={menuOpen ? onMenuClose : onMenuOpen}
        >
          <MaterialCommunityIcons name="dots-vertical" size={20} color="#000000" />
        </Pressable>

        {/* Dropdown */}
        {menuOpen && (
          <View style={{ position: 'absolute', top: 40, right: 0, width: 145, backgroundColor: 'rgba(250,250,250,0.96)', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 16, zIndex: 50 }}>
            <Pressable
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, height: 44 }}
              onPress={() => { onEdit(); onMenuClose(); }}
            >
              <Text style={{ fontSize: 14, color: '#1F2A33', fontFamily: 'Plus Jakarta Sans' }}>Edit</Text>
              <MaterialCommunityIcons name="pencil-outline" size={18} color="#475568" />
            </Pressable>
            <View style={{ height: 1, backgroundColor: '#E2E8F0', marginHorizontal: 12 }} />
            <Pressable
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, height: 44 }}
              onPress={() => { onDelete(); onMenuClose(); }}
            >
              <Text style={{ fontSize: 14, color: '#EF4444', fontFamily: 'Plus Jakarta Sans' }}>Delete</Text>
              <MaterialCommunityIcons name="trash-can-outline" size={18} color="#EF4444" />
            </Pressable>
          </View>
        )}
      </View>

    </View>
  );
}

/* ─── ScheduleScreen ────────────────────────────────────────── */

export function ScheduleScreen({ navigation }: RootStackScreenProps<'Schedule'>) {
  const { colors } = useTheme();
  const todayDate = new Date();

  // Screen
  const [isBinFull, setIsBinFull] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Form
  const [driverListOpen, setDriverListOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [location, setLocation]             = useState('');
  const [phone, setPhone]                   = useState('');
  const [note, setNote]                     = useState('');
  const [searchMode, setSearchMode]         = useState(false);
  const [searchQuery, setSearchQuery]       = useState('');

  // Frequency
  const [frequencyOpen, setFrequencyOpen]         = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState('Daily');

  // Calendar
  const [calendarOpen, setCalendarOpen]   = useState(false);
  const [calendarYear, setCalendarYear]   = useState(todayDate.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(todayDate.getMonth());
  const [selectedDate, setSelectedDate]   = useState<number | null>(null);

  // Time picker
  const [timePickerFor, setTimePickerFor] = useState<'start' | 'end' | null>(null);
  const [startTime, setStartTime]         = useState('');
  const [endTime, setEndTime]             = useState('');
  const hourRef   = useRef(5);
  const minuteRef = useRef(0);
  const periodRef = useRef(0);

  // Confirmation card
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Schedule list
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [editTargetId, setEditTargetId] = useState<string | null>(null);

  // Date filter
  const [filterOpen, setFilterOpen]         = useState(false);
  const [filterYear, setFilterYear]         = useState(todayDate.getFullYear());
  const [filterMonth, setFilterMonth]       = useState(todayDate.getMonth());
  const [filterPickDate, setFilterPickDate] = useState<number | null>(null);
  const [activeFilter, setActiveFilter]     = useState<{ year: number; month: number; day: number } | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastAnim = useRef(new Animated.Value(-80)).current;
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastMessage(message);
    Animated.spring(toastAnim, { toValue: 0, useNativeDriver: true, damping: 18, stiffness: 220 }).start();
    toastTimer.current = setTimeout(hideToast, 3000);
  };

  const hideToast = () => {
    Animated.timing(toastAnim, { toValue: -80, duration: 220, useNativeDriver: true }).start(() => setToastMessage(null));
    if (toastTimer.current) { clearTimeout(toastTimer.current); toastTimer.current = null; }
  };

  const canSchedule = !!selectedDriver;

  const closeOverlays = () => {
    setFrequencyOpen(false);
    setCalendarOpen(false);
    setTimePickerFor(null);
  };

  const openTimePicker = (which: 'start' | 'end') => {
    const timeStr = which === 'start' ? startTime : endTime;
    if (timeStr) {
      const [timePart, period] = timeStr.split(' ');
      const [h, m] = timePart.split(':');
      hourRef.current   = parseInt(h) - 1;
      minuteRef.current = parseInt(m);
      periodRef.current = period === 'AM' ? 0 : 1;
    } else {
      hourRef.current   = 5;
      minuteRef.current = 0;
      periodRef.current = 0;
    }
    setFrequencyOpen(false);
    setCalendarOpen(false);
    setDriverListOpen(false);
    setTimePickerFor(which);
  };

  const applyPickerTime = () => {
    const timeStr = `${HOURS[hourRef.current]}:${MINUTES[minuteRef.current]} ${PERIODS[periodRef.current]}`;
    if (timePickerFor === 'start') setStartTime(timeStr);
    else setEndTime(timeStr);
    setTimePickerFor(null);
  };

  const openSheet = () => {
    setEditTargetId(null);
    setSelectedDriver(null);
    setStartTime('');
    setEndTime('');
    setLocation('');
    setPhone('');
    setNote('');
    setDriverListOpen(false);
    setSearchMode(false);
    setSearchQuery('');
    setFrequencyOpen(false);
    setCalendarOpen(false);
    setTimePickerFor(null);
    setSelectedDate(null);
    setCalendarYear(todayDate.getFullYear());
    setCalendarMonth(todayDate.getMonth());
    setSheetOpen(true);
  };

  const openEditSheet = (item: ScheduleItem) => {
    setEditTargetId(item.id);
    setSelectedDriver(item.driver);
    setLocation(item.location);
    setStartTime(item.rawStartTime);
    setEndTime(item.rawEndTime);
    setSelectedFrequency(item.frequency);
    setCalendarYear(item.rawYear);
    setCalendarMonth(item.rawMonth);
    setSelectedDate(item.rawDay);
    setPhone('');
    setNote('');
    setDriverListOpen(false);
    setSearchMode(false);
    setSearchQuery('');
    setFrequencyOpen(false);
    setCalendarOpen(false);
    setTimePickerFor(null);
    setSheetOpen(true);
  };

  const prevMonth = () => {
    if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(y => y - 1); }
    else setCalendarMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(y => y + 1); }
    else setCalendarMonth(m => m + 1);
  };

  const filterPrevMonth = () => {
    if (filterMonth === 0) { setFilterMonth(11); setFilterYear(y => y - 1); }
    else setFilterMonth(m => m - 1);
  };
  const filterNextMonth = () => {
    if (filterMonth === 11) { setFilterMonth(0); setFilterYear(y => y + 1); }
    else setFilterMonth(m => m + 1);
  };

  const openFilterSheet = () => {
    if (activeFilter) {
      setFilterYear(activeFilter.year);
      setFilterMonth(activeFilter.month);
      setFilterPickDate(activeFilter.day);
    } else {
      setFilterYear(todayDate.getFullYear());
      setFilterMonth(todayDate.getMonth());
      setFilterPickDate(null);
    }
    setFilterOpen(true);
  };

  const dateLabel    = selectedDate ? `${MONTH_NAMES[calendarMonth].slice(0,3)} ${selectedDate}` : 'Today';
  const calendarDays = getCalendarDays(calendarYear, calendarMonth);
  const todayDay   = todayDate.getDate();
  const todayMonth = todayDate.getMonth();
  const todayYear  = todayDate.getFullYear();

  const confirmDate = (() => {
    const d = selectedDate ? new Date(calendarYear, calendarMonth, selectedDate) : new Date();
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    return `${days[d.getDay()]}, ${d.getDate()} ${MONTH_NAMES[d.getMonth()].slice(0,3)} ${d.getFullYear()}`;
  })();

  const fmtTime = (t: string) => {
    if (!t) return '';
    const [tp, period] = t.split(' ');
    const [h, m] = tp.split(':');
    return `${parseInt(h)}:${m}${period.toLowerCase()}`;
  };

  const confirmTimeRange = startTime || endTime
    ? [startTime && fmtTime(startTime), endTime && fmtTime(endTime)].filter(Boolean).join(' - ')
    : '';

  const driverInitials = (selectedDriver ?? '').split(' ').map(w => w[0]).join('');
  const driverRating   = DRIVERS.find(d => d.name === selectedDriver)?.rating ?? '';

  const filterCalendarDays = getCalendarDays(filterYear, filterMonth);
  const filterLabel = activeFilter
    ? `${MONTH_NAMES[activeFilter.month].slice(0, 3)} ${activeFilter.day}`
    : 'Today';
  const visibleSchedules = activeFilter
    ? schedules.filter(s => s.rawYear === activeFilter.year && s.rawMonth === activeFilter.month && s.rawDay === activeFilter.day)
    : schedules;

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

      {/* Lavender sub-header */}
      <View style={{ height: 44, backgroundColor: '#EDE9FE', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: '#000000', fontFamily: 'Plus Jakarta Sans' }}>{filterLabel}</Text>
          <Pressable
            style={{ width: 28, height: 28, borderRadius: 12, backgroundColor: '#DDD6FE', alignItems: 'center', justifyContent: 'center' }}
            onPress={openFilterSheet}
          >
            <MaterialCommunityIcons name="calendar" size={16} color="#6D28D9" />
          </Pressable>
        </View>
        <Pressable onPress={() => setActiveFilter(null)}>
          <MaterialCommunityIcons name="refresh" size={16} color="#64748A" />
        </Pressable>
      </View>

      {/* Empty state / schedule list */}
      {visibleSchedules.length === 0 ? (
        <View style={{ flex: 1, padding: 20 }}>
          <View style={{ borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 20, height: 360, alignItems: 'center', justifyContent: 'flex-end', paddingHorizontal: 24, paddingBottom: 40, gap: 20 }}>
            <ScheduleIllustration />
            <View style={{ alignItems: 'center', gap: 5 }}>
              <Text style={{ fontSize: 16, fontWeight: '500', color: '#0F1621', fontFamily: 'Plus Jakarta Sans' }}>No Schedules</Text>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#64748A', textAlign: 'center', fontFamily: 'Plus Jakarta Sans' }}>Hit the plus icon to plan for later</Text>
            </View>
          </View>
        </View>
      ) : (
        <Pressable style={{ flex: 1, padding: 20 }} onPress={() => setOpenMenuId(null)}>
          <View style={{ borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, backgroundColor: '#FFFFFF', overflow: 'hidden', flex: 1 }}>
            {/* Header */}
            <View style={{ height: 48, backgroundColor: '#F1F5F9', justifyContent: 'center', paddingHorizontal: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: '500', fontFamily: 'Plus Jakarta Sans', color: '#000000' }}>Schedules</Text>
            </View>
            {/* List */}
            <ScrollView showsVerticalScrollIndicator={false}>
              {visibleSchedules.map((item, index) => (
                <React.Fragment key={item.id}>
                  {index > 0 && <View style={{ height: 1, backgroundColor: '#E2E8F0', marginHorizontal: 12 }} />}
                  <ScheduleCard
                    item={item}
                    menuOpen={openMenuId === item.id}
                    onMenuOpen={() => setOpenMenuId(item.id)}
                    onMenuClose={() => setOpenMenuId(null)}
                    onEdit={() => { setOpenMenuId(null); openEditSheet(item); }}
                    onDelete={() => { setOpenMenuId(null); setDeleteTargetId(item.id); }}
                  />
                </React.Fragment>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      )}

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
        showCalendar
        onHomePress={() => navigation.navigate('PremiumHome')}
        onCalendarPress={() => {}}
        onSavedPress={() => navigation.navigate('Details', { itemId: 'saved', title: 'Saved' })}
        onSettingsPress={() => navigation.navigate('Settings')}
      />

      {/* ══ Schedule details bottom sheet ══ */}
      <Modal visible={sheetOpen} transparent animationType="slide" onRequestClose={() => setSheetOpen(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(69,71,69,0.15)', justifyContent: 'flex-end' }}>
          <Pressable style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onPress={() => setSheetOpen(false)} />

          <View style={{ backgroundColor: '#FFFFFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingTop: 16, paddingBottom: 8, height: '82%', justifyContent: 'space-between' }}>

            {/* Scrollable form */}
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingBottom: 24 }} keyboardShouldPersistTaps="handled" scrollEnabled={timePickerFor === null}>

              {/* Handle */}
              <View style={{ width: 152, height: 3, backgroundColor: '#334154', borderRadius: 20, alignSelf: 'center' }} />

              {/* Header */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24 }}>
                <Text style={{ fontSize: 18, fontWeight: '500', color: '#000000', letterSpacing: -0.54, fontFamily: 'Plus Jakarta Sans' }}>Schedule details</Text>
                <Pressable
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 9999 }}
                  onPress={() => { setFrequencyOpen(v => !v); setCalendarOpen(false); setDriverListOpen(false); setTimePickerFor(null); }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '500', fontFamily: 'Poppins' }}>{selectedFrequency}</Text>
                  <MaterialCommunityIcons name="chevron-down" size={12} color="#000" />
                </Pressable>
              </View>

              {/* Form fields */}
              <View style={{ paddingHorizontal: 24, gap: 16, width: '100%' }}>

                {/* Driver pill / select button */}
                {selectedDriver ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', height: 40, backgroundColor: '#F1F5F9', borderRadius: 12, paddingHorizontal: 12, gap: 8 }}>
                    <MaterialCommunityIcons name="star" size={16} color="#FEC002" />
                    <Text style={{ fontSize: 12, color: '#939393', fontFamily: 'Inter' }}>{DRIVERS.find(d => d.name === selectedDriver)?.rating}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: '500', color: '#101010', fontFamily: 'Inter' }}>{selectedDriver}</Text>
                      <MaterialCommunityIcons name="medal" size={13} color="#D4AF37" />
                    </View>
                    <Pressable onPress={() => setSelectedDriver(null)}>
                      <MaterialCommunityIcons name="close-circle-outline" size={16} color="#EF4444" />
                    </Pressable>
                  </View>
                ) : (
                  <Pressable
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 40, backgroundColor: '#31973D', borderRadius: 16 }}
                    onPress={() => { setDriverListOpen(true); closeOverlays(); }}
                  >
                    <MaterialCommunityIcons name="plus-circle-outline" size={16} color="#FFFFFF" />
                    <Text style={{ fontSize: 14, color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans' }}>Select available driver</Text>
                  </Pressable>
                )}

                {/* Driver dropdown */}
                {driverListOpen && (
                  <View style={{ position: 'absolute', left: 24, right: 24, top: 48, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 24, padding: 8, shadowColor: 'rgba(69,71,69,0.15)', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 20, elevation: 12, zIndex: 20 }}>
                    {searchMode ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: 'rgba(0,0,0,0.11)', borderRadius: 999, paddingHorizontal: 10, height: 27, marginBottom: 6 }}>
                        <MaterialCommunityIcons name="magnify" size={11} color="#000" />
                        <TextInput
                          style={{ flex: 1, fontSize: 13, color: '#333333', padding: 0, fontFamily: 'Plus Jakarta Sans' }}
                          placeholder="search driver by name, unique...."
                          placeholderTextColor="#94A3B7"
                          value={searchQuery}
                          onChangeText={setSearchQuery}
                          autoFocus
                        />
                      </View>
                    ) : (
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 3, paddingHorizontal: 4, marginBottom: 4, borderBottomWidth: 1, borderBottomColor: 'rgba(184,184,184,0.2)' }}>
                        <Text style={{ fontSize: 14, fontWeight: '500', color: '#1F2A33', fontFamily: 'Poppins' }}>Recommended</Text>
                        <Pressable onPress={() => setSearchMode(true)}>
                          <Text style={{ fontSize: 11, fontWeight: '500', color: 'rgba(14,90,142,0.7)', textDecorationLine: 'underline', fontFamily: 'Inter' }}>Search</Text>
                        </Pressable>
                      </View>
                    )}
                    <ScrollView style={{ maxHeight: 224 }} showsVerticalScrollIndicator={false}>
                      {DRIVERS.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase())).map((driver) => (
                        <Pressable
                          key={driver.name}
                          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 8, height: 34, borderRadius: 16, backgroundColor: selectedDriver === driver.name ? '#F1F5F9' : 'transparent', marginBottom: 4 }}
                          onPress={() => { setSelectedDriver(driver.name); setDriverListOpen(false); setSearchMode(false); setSearchQuery(''); }}
                        >
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Text style={{ fontSize: 14, fontWeight: '500', color: '#101010', fontFamily: 'Inter' }}>{driver.name}</Text>
                            {driver.premium && <MaterialCommunityIcons name="medal" size={13} color="#D4AF37" />}
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

                {/* Location */}
                <View style={{ gap: 4 }}>
                  <Text style={{ fontSize: 14, color: '#94A3B7', fontFamily: 'Plus Jakarta Sans' }}>Location</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', height: 48, backgroundColor: '#F1F5F9', borderRadius: 24, paddingHorizontal: 12, gap: 8 }}>
                    <TextInput
                      style={{ flex: 1, fontSize: 14, color: '#1F2A33', padding: 0, fontFamily: 'Plus Jakarta Sans' }}
                      placeholder="Tarkwa, UMaT Campus, Hall 3"
                      placeholderTextColor="#94A3B7"
                      value={location}
                      onChangeText={setLocation}
                      onFocus={closeOverlays}
                    />
                    {location.length > 0 && (
                      <Pressable onPress={() => setLocation('')}>
                        <MaterialCommunityIcons name="close-circle-outline" size={16} color="#EF4444" />
                      </Pressable>
                    )}
                  </View>
                </View>

                {/* Phone Number */}
                <View style={{ gap: 4 }}>
                  <Text style={{ fontSize: 14, color: '#94A3B7', fontFamily: 'Plus Jakarta Sans' }}>Phone Number</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', height: 48, backgroundColor: '#F1F5F9', borderRadius: 24, paddingHorizontal: 12, gap: 8 }}>
                    <TextInput
                      style={{ flex: 1, fontSize: 14, color: '#1F2A33', padding: 0, fontFamily: 'Plus Jakarta Sans' }}
                      placeholder="0243 50 8595"
                      placeholderTextColor="#94A3B7"
                      keyboardType="phone-pad"
                      value={phone}
                      onChangeText={setPhone}
                      onFocus={closeOverlays}
                    />
                    {phone.length > 0 && (
                      <Pressable onPress={() => setPhone('')}>
                        <MaterialCommunityIcons name="close-circle-outline" size={16} color="#EF4444" />
                      </Pressable>
                    )}
                  </View>
                </View>

                {/* Additional note */}
                <View style={{ gap: 4 }}>
                  <Text style={{ fontSize: 14, color: '#1F2A33', fontFamily: 'Plus Jakarta Sans' }}>Additional note</Text>
                  <TextInput
                    style={{ height: 108, borderWidth: 1, borderColor: '#CBD5E0', borderRadius: 24, paddingHorizontal: 12, paddingTop: 14, fontSize: 14, color: '#1F2A33', fontFamily: 'Plus Jakarta Sans', textAlignVertical: 'top' }}
                    placeholder="Call before arrival, waste is behind the gate etc.."
                    placeholderTextColor="#94A3B7"
                    multiline
                    value={note}
                    onChangeText={setNote}
                    onFocus={closeOverlays}
                  />
                </View>

                {/* Date row */}
                <Pressable
                  style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 48, backgroundColor: '#F1F5F9', borderRadius: 12 }}
                  onPress={() => { setCalendarOpen(v => !v); setFrequencyOpen(false); setDriverListOpen(false); setTimePickerFor(null); }}
                >
                  <MaterialCommunityIcons name="calendar" size={16} color="#94A3B7" />
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#94A3B7', fontFamily: 'Plus Jakarta Sans' }}>{dateLabel}</Text>
                  <MaterialCommunityIcons name="refresh" size={16} color="#94A3B7" />
                </Pressable>

                {/* Start / End time — Pressable displays */}
                <View style={{ gap: 4 }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ flex: 1, fontSize: 14, color: '#94A3B7', fontFamily: 'Plus Jakarta Sans' }}>Start Time</Text>
                    <Text style={{ flex: 1, fontSize: 14, color: '#94A3B7', fontFamily: 'Plus Jakarta Sans' }}>End Time</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, width: '100%' }}>
                    <Pressable
                      style={{ flex: 1, minWidth: 0, height: 48, borderWidth: 1, borderColor: '#CBD5E0', borderRadius: 24, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' }}
                      onPress={() => openTimePicker('start')}
                    >
                      <Text style={{ fontSize: 14, color: startTime ? '#1F2A33' : '#94A3B7', fontFamily: 'Plus Jakarta Sans' }}>
                        {startTime || '00:00'}
                      </Text>
                    </Pressable>
                    <View style={{ width: 24, height: 24, flexShrink: 0, borderRadius: 12, backgroundColor: '#31973D', alignItems: 'center', justifyContent: 'center' }}>
                      <MaterialCommunityIcons name="arrow-right" size={16} color="#FFFFFF" />
                    </View>
                    <Pressable
                      style={{ flex: 1, minWidth: 0, height: 48, borderWidth: 1, borderColor: '#CBD5E0', borderRadius: 24, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' }}
                      onPress={() => openTimePicker('end')}
                    >
                      <Text style={{ fontSize: 14, color: endTime ? '#1F2A33' : '#94A3B7', fontFamily: 'Plus Jakarta Sans' }}>
                        {endTime || '00:00'}
                      </Text>
                    </Pressable>
                  </View>
                </View>

              </View>
            </ScrollView>

            {/* ── Frequency dropdown overlay ── */}
            {frequencyOpen && (
              <View style={{ position: 'absolute', right: 24, top: 56, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 20, paddingVertical: 6, paddingHorizontal: 4, minWidth: 160, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 20, zIndex: 30 }}>
                {FREQUENCIES.map(freq => (
                  <Pressable
                    key={freq}
                    style={{ paddingHorizontal: 12, paddingVertical: 9, borderRadius: 14, backgroundColor: selectedFrequency === freq ? 'rgba(184,184,184,0.2)' : 'transparent' }}
                    onPress={() => { setSelectedFrequency(freq); setFrequencyOpen(false); }}
                  >
                    <Text style={{ fontSize: 14, fontWeight: selectedFrequency === freq ? '500' : '400', color: selectedFrequency === freq ? '#1F2A33' : '#64748A', fontFamily: 'Plus Jakarta Sans' }}>
                      {freq}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}

            {/* ── Calendar overlay ── */}
            {calendarOpen && (
              <View style={{ position: 'absolute', left: 24, right: 24, top: 62, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 24, padding: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 18, zIndex: 25 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 6 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#111826', fontFamily: 'Plus Jakarta Sans' }}>{MONTH_NAMES[calendarMonth]} {calendarYear}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={16} color="#475568" />
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Pressable onPress={prevMonth} style={{ padding: 4 }}><MaterialCommunityIcons name="chevron-left" size={16} color="#475568" /></Pressable>
                    <Pressable onPress={nextMonth} style={{ padding: 4 }}><MaterialCommunityIcons name="chevron-right" size={16} color="#475568" /></Pressable>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                  {DAY_LABELS.map((lbl, i) => (
                    <View key={i} style={{ flex: 1, alignItems: 'center', paddingVertical: 4 }}>
                      <Text style={{ fontSize: 11, color: '#475568', fontFamily: 'Plus Jakarta Sans' }}>{lbl}</Text>
                    </View>
                  ))}
                </View>
                {Array.from({ length: 6 }).map((_, row) => (
                  <View key={row} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    {calendarDays.slice(row * 7, row * 7 + 7).map((cell, col) => {
                      const isToday    = cell.currentMonth && cell.day === todayDay && calendarMonth === todayMonth && calendarYear === todayYear;
                      const isSelected = cell.currentMonth && cell.day === selectedDate && !isToday;
                      const isFuture   = cell.currentMonth && (calendarYear > todayYear || (calendarYear === todayYear && calendarMonth > todayMonth) || (calendarYear === todayYear && calendarMonth === todayMonth && cell.day > todayDay));
                      const textColor  = !cell.currentMonth ? '#E2E8F0' : isToday || isSelected ? '#FFFFFF' : isFuture ? '#111826' : '#475568';
                      return (
                        <Pressable
                          key={col}
                          style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 32, borderRadius: 7, backgroundColor: isToday || isSelected ? '#31973D' : 'transparent' }}
                          onPress={() => { if (!cell.currentMonth) return; setSelectedDate(cell.day); setCalendarOpen(false); }}
                        >
                          <Text style={{ fontSize: 12, fontWeight: isFuture || isToday || isSelected ? '700' : '400', color: textColor, fontFamily: 'Plus Jakarta Sans' }}>
                            {cell.day}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                ))}
              </View>
            )}

            {/* ── Time picker overlay ── */}
            {timePickerFor !== null && (
              <View style={{ position: 'absolute', ...(timePickerFor === 'start' ? { left: 24 } : { right: 24 }), bottom: 56, width: 196, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 24, padding: 8, gap: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 22, zIndex: 35 }}>

                {/* Title */}
                <Text style={{ fontSize: 14, fontWeight: '500', color: '#000000', letterSpacing: -0.42, fontFamily: 'Plus Jakarta Sans', paddingHorizontal: 4 }}>
                  Select time
                </Text>

                {/* Scroll columns */}
                <View style={{ flexDirection: 'row', alignItems: 'center', height: ITEM_H * 4 }}>
                  <TimePickerColumn items={HOURS}   initialIndex={hourRef.current}   indexRef={hourRef}   />
                  <TimePickerColumn items={MINUTES} initialIndex={minuteRef.current} indexRef={minuteRef} />
                  <TimePickerColumn items={PERIODS} initialIndex={periodRef.current} indexRef={periodRef} />
                </View>

                {/* Done button */}
                <Pressable
                  style={{ height: 40, backgroundColor: '#31973D', borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}
                  onPress={applyPickerTime}
                >
                  <Text style={{ fontSize: 14, color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans' }}>Done</Text>
                </Pressable>

              </View>
            )}

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
                onPress={() => {
                  if (editTargetId) {
                    setSchedules(prev => prev.map(s => s.id === editTargetId ? { ...s, driver: selectedDriver!, date: confirmDate, timeRange: confirmTimeRange, location, rawYear: calendarYear, rawMonth: calendarMonth, rawDay: selectedDate, rawStartTime: startTime, rawEndTime: endTime, frequency: selectedFrequency } : s));
                    setEditTargetId(null);
                    setSheetOpen(false);
                    showToast('Schedule successfully edited');
                  } else {
                    setConfirmOpen(true);
                  }
                }}
              >
                <Text style={{ fontSize: 14, color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans' }}>{editTargetId ? 'Save' : 'Schedule'}</Text>
              </Pressable>
            </View>

          </View>
        </View>
      </Modal>

      {/* ══ Confirmation card ══ */}
      <Modal visible={confirmOpen} transparent animationType="fade" onRequestClose={() => setConfirmOpen(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}>

          {/* Gradient card */}
          <View style={{ width: 335, borderRadius: 48, overflow: 'hidden', backgroundColor: '#A2C2E6' }}>

            {/* Corner radial blobs */}
            <View style={{ position: 'absolute', top: -60, left: -60,  width: 240, height: 240, borderRadius: 120, backgroundColor: '#ADCCEB' }} />
            <View style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: 120, backgroundColor: '#F9AC86' }} />
            <View style={{ position: 'absolute', bottom: -60, right: -60, width: 240, height: 240, borderRadius: 120, backgroundColor: '#D5B3E6' }} />
            <View style={{ position: 'absolute', bottom: -60, left: -60,  width: 240, height: 240, borderRadius: 120, backgroundColor: '#BEEBF4' }} />

            {/* White content card */}
            <View style={{ marginTop: 105, marginHorizontal: 24, marginBottom: 24, backgroundColor: '#FFFFFF', borderRadius: 40, padding: 20, gap: 16 }}>

              {/* Name + badges */}
              <View style={{ gap: 2 }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: '#000000', fontFamily: 'Poppins', letterSpacing: -0.6, lineHeight: 32 }}>
                  {selectedDriver}
                </Text>
                <View style={{ flexDirection: 'row', gap: 4 }}>
                  <View style={{ backgroundColor: '#FEF3C7', borderRadius: 9999, paddingHorizontal: 12, paddingVertical: 4 }}>
                    <Text style={{ fontSize: 12, fontWeight: '500', color: '#A16207', fontFamily: 'Poppins' }}>Driver assigned</Text>
                  </View>
                  <View style={{ backgroundColor: '#E0E7FF', borderRadius: 9999, paddingHorizontal: 12, paddingVertical: 4 }}>
                    <Text style={{ fontSize: 12, fontWeight: '500', color: '#4338CA', fontFamily: 'Poppins' }}>{driverRating} stars</Text>
                  </View>
                </View>
              </View>

              {/* Date / time / location */}
              <View style={{ gap: 2 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, fontWeight: '500', fontFamily: 'Poppins', paddingRight: 8, marginRight: 8, borderRightWidth: 0.5, borderRightColor: 'rgba(0,0,0,0.5)' }}>
                    {confirmDate}
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: '500', fontFamily: 'Poppins' }}>{confirmTimeRange}</Text>
                </View>
                {location ? (
                  <Text style={{ fontSize: 12, fontWeight: '500', fontFamily: 'Poppins', paddingLeft: 4 }}>{location}</Text>
                ) : null}
              </View>

              {/* Action bar */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ gap: 2 }}>
                  <Text style={{ fontSize: 10, fontWeight: '500', color: '#64748A', fontFamily: 'Poppins', lineHeight: 24 }}>Estimated cost</Text>
                  <Text style={{ fontSize: 20, fontWeight: '700', color: '#1F2A33', fontFamily: 'Poppins', lineHeight: 24 }}>GHS 15.00</Text>
                </View>
                <Pressable
                  style={{ backgroundColor: '#31973D', borderRadius: 16, paddingHorizontal: 24, paddingVertical: 10 }}
                  onPress={() => {
                    setSchedules(prev => [...prev, { id: Date.now().toString(), driver: selectedDriver!, date: confirmDate, timeRange: confirmTimeRange, location, rawYear: calendarYear, rawMonth: calendarMonth, rawDay: selectedDate, rawStartTime: startTime, rawEndTime: endTime, frequency: selectedFrequency }]);
                    setConfirmOpen(false);
                    setSheetOpen(false);
                  }}
                >
                  <Text style={{ fontSize: 14, color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans' }}>Schedule</Text>
                </Pressable>
              </View>

            </View>

            {/* Profile picture — overlaps gradient / white card boundary */}
            <View style={{ position: 'absolute', top: 40, left: 39, width: 90, height: 90, borderRadius: 45, borderWidth: 4, borderColor: '#FFFFFF', elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12 }}>
              <View style={{ flex: 1, borderRadius: 41, borderWidth: 2, borderColor: '#90FA96', overflow: 'hidden', backgroundColor: '#475568', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 26, fontWeight: '700', color: '#FFFFFF', fontFamily: 'Poppins' }}>{driverInitials}</Text>
              </View>
            </View>

            {/* Pending schedule badge */}
            <View style={{ position: 'absolute', top: 97, left: 115, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#9CA3AF', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 2, elevation: 4 }}>
              <MaterialCommunityIcons name="clock-outline" size={14} color="#FFFFFF" />
              <Text style={{ fontSize: 12, color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans' }}>pending schedule</Text>
            </View>

            {/* Close button */}
            <Pressable
              style={{ position: 'absolute', top: 44, right: 24, width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}
              onPress={() => setConfirmOpen(false)}
            >
              <MaterialCommunityIcons name="close" size={14} color="#FFFFFF" />
            </Pressable>

          </View>
        </View>
      </Modal>

      {/* ══ Delete confirmation modal ══ */}
      <Modal visible={deleteTargetId !== null} transparent animationType="fade" onRequestClose={() => setDeleteTargetId(null)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}>
          <View style={{ width: 296, backgroundColor: '#FFFFFF', borderRadius: 24, paddingVertical: 12, paddingHorizontal: 20, alignItems: 'center', gap: 20 }}>

            {/* Trash illustration */}
            <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center' }}>
              <MaterialCommunityIcons name="trash-can" size={32} color="#F87171" />
            </View>

            {/* Text block */}
            <View style={{ gap: 8, alignItems: 'center', width: 256 }}>
              <Text style={{ fontSize: 18, fontWeight: '500', color: '#0F1621', fontFamily: 'Plus Jakarta Sans', letterSpacing: -0.54, lineHeight: 20, textAlign: 'center' }}>
                Delete your Schedule
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#0F1621', fontFamily: 'Plus Jakarta Sans', lineHeight: 24, textAlign: 'center' }}>
                Are you sure you want to delete your timesheet?
              </Text>
            </View>

            {/* Buttons */}
            <View style={{ flexDirection: 'row', gap: 8, width: 256 }}>
              <Pressable
                style={{ flex: 1, height: 40, backgroundColor: '#EF4444', borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}
                onPress={() => setDeleteTargetId(null)}
              >
                <Text style={{ fontSize: 14, fontWeight: '400', color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans' }}>Cancel</Text>
              </Pressable>
              <Pressable
                style={{ flex: 1, height: 40, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CBD5E0', borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}
                onPress={() => {
                  setSchedules(prev => prev.filter(s => s.id !== deleteTargetId));
                  setDeleteTargetId(null);
                  showToast('Schedule successfully deleted');
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: '500', color: '#EF4444', fontFamily: 'Plus Jakarta Sans' }}>Delete</Text>
              </Pressable>
            </View>

          </View>
        </View>
      </Modal>

      {/* ══ Date filter bottom sheet ══ */}
      <Modal visible={filterOpen} transparent animationType="slide" onRequestClose={() => setFilterOpen(false)}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <Pressable style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onPress={() => setFilterOpen(false)} />

          <View style={{ backgroundColor: '#FFFFFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingTop: 16, paddingHorizontal: 20, paddingBottom: 32, gap: 24 }}>

            {/* Handle */}
            <View style={{ width: 152, height: 3, backgroundColor: '#334154', borderRadius: 20, alignSelf: 'center' }} />

            {/* Month navigation */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 8 }}>
              <Pressable onPress={filterPrevMonth} style={{ padding: 8 }}>
                <MaterialCommunityIcons name="chevron-left" size={20} color="#1A1C1E" />
              </Pressable>
              <Text style={{ fontSize: 20, fontWeight: '600', color: '#1A1C1E', fontFamily: 'Plus Jakarta Sans' }}>
                {MONTH_NAMES[filterMonth]} {filterYear}
              </Text>
              <Pressable onPress={filterNextMonth} style={{ padding: 8 }}>
                <MaterialCommunityIcons name="chevron-right" size={20} color="#1A1C1E" />
              </Pressable>
            </View>

            {/* Calendar grid */}
            <View>
              {/* Day labels */}
              <View style={{ flexDirection: 'row' }}>
                {['Su','Mo','Tu','We','Th','Fr','Sa'].map((lbl, i) => (
                  <View key={i} style={{ flex: 1, alignItems: 'center', paddingVertical: 7 }}>
                    <Text style={{ fontSize: 12, fontWeight: '500', color: '#3F4A3D', fontFamily: 'Plus Jakarta Sans', letterSpacing: 0.48 }}>{lbl}</Text>
                  </View>
                ))}
              </View>

              {/* Day rows */}
              {Array.from({ length: 6 }).map((_, row) => (
                <View key={row} style={{ flexDirection: 'row' }}>
                  {filterCalendarDays.slice(row * 7, row * 7 + 7).map((cell, col) => {
                    const isToday    = cell.currentMonth && cell.day === todayDay && filterMonth === todayMonth && filterYear === todayYear;
                    const isSelected = cell.currentMonth && cell.day === filterPickDate;
                    return (
                      <Pressable
                        key={col}
                        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 52, opacity: cell.currentMonth ? 1 : 0.3 }}
                        onPress={() => { if (!cell.currentMonth) return; setFilterPickDate(cell.day); }}
                      >
                        <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: isSelected ? '#31973D' : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={{ fontSize: 16, color: isSelected ? '#FFFFFF' : '#1A1C1E', fontFamily: 'Plus Jakarta Sans' }}>
                            {cell.day}
                          </Text>
                        </View>
                        {isToday && (
                          <View style={{ position: 'absolute', bottom: 5, width: 4, height: 4, borderRadius: 2, backgroundColor: '#BA1A1A' }} />
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              ))}
            </View>

            {/* Bottom actions */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Pressable
                style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFE2E2', alignItems: 'center', justifyContent: 'center' }}
                onPress={() => setFilterOpen(false)}
              >
                <MaterialCommunityIcons name="close" size={16} color="#EF4444" />
              </Pressable>
              <Pressable
                style={{ flex: 1, height: 40, backgroundColor: filterPickDate ? '#31973D' : 'rgba(49,151,61,0.5)', borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}
                disabled={!filterPickDate}
                onPress={() => {
                  if (filterPickDate) {
                    setActiveFilter({ year: filterYear, month: filterMonth, day: filterPickDate });
                  }
                  setFilterOpen(false);
                }}
              >
                <Text style={{ fontSize: 14, color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans' }}>Apply change</Text>
              </Pressable>
            </View>

          </View>
        </View>
      </Modal>

      {/* ══ Success toast ══ */}
      {toastMessage !== null && (
        <Animated.View
          style={{ position: 'absolute', top: 46, left: 0, right: 0, alignItems: 'center', zIndex: 200, transform: [{ translateY: toastAnim }] }}
          pointerEvents="box-none"
        >
          <View style={{ width: 357, height: 51, backgroundColor: '#F0FDFA', borderWidth: 1, borderColor: '#14B8A6', borderRadius: 999, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
              <MaterialCommunityIcons name="check-circle" size={24} color="#14B8A6" />
              <Text style={{ fontSize: 13, fontWeight: '500', color: '#0F766E', fontFamily: 'Plus Jakarta Sans', lineHeight: 28 }}>
                {toastMessage}
              </Text>
            </View>
            <Pressable onPress={hideToast}>
              <MaterialCommunityIcons name="close" size={20} color="#0D9488" />
            </Pressable>
          </View>
        </Animated.View>
      )}

    </SafeAreaView>
  );
}

export default ScheduleScreen;
