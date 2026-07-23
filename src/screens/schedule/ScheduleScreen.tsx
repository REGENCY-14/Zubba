import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { RootStackScreenProps } from "../../navigation/types";
import { AppBottomNav } from "../../components";
import AnimatedSwitch from "../../components/ui/inputs/AnimatedSwitch";
import { ThemeColors, useTheme } from "../../context/ThemeContext";
import { useAppSelector } from "../../hooks/useAppSelector";
import {
  scheduleService,
  Schedule as ApiSchedule,
} from "../../api/scheduleService";
import { handleApiError } from "../../utils/handleApiError";
import { toast } from "../../hooks/toast";
import { useCurrentLocation } from "../../hooks/useCurrentLocation";
import { driverService } from "../../api/driverService";
import { binFullService } from "../../api/binFullService";
import { NearbyDriver } from "../../types/driver.types";
import * as Location from "expo-location";

const avatar = require("../../../assets/avatar.jpg");

const SERVICE_FEE = 5;

const FREQUENCIES = ["One time pickup", "Daily", "Weekly", "Monthly"];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

const HOURS = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0"),
);
const MINUTES = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0"),
);
const PERIODS = ["AM", "PM"];

const ITEM_H = 44;

/* ─── helpers ───────────────────────────────────────────────── */

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const days: { day: number; currentMonth: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--)
    days.push({ day: daysInPrevMonth - i, currentMonth: false });
  for (let d = 1; d <= daysInMonth; d++)
    days.push({ day: d, currentMonth: true });
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++)
    days.push({ day: d, currentMonth: false });
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
      scrollRef.current?.scrollTo({
        y: initialIndex * ITEM_H,
        animated: false,
      });
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
    <View className="flex-1 h-44">
      <View
        pointerEvents="none"
        className="absolute top-11 left-0.5 right-0.5 h-11 bg-[#F1F5F9] rounded-[14px]"
      />
      <ScrollView
        ref={scrollRef}
        className="h-44 bg-transparent"
        contentContainerClassName="pt-11 pb-22"
        snapToInterval={ITEM_H}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(e) => {
          indexRef.current = getIdx(e.nativeEvent.contentOffset.y);
        }}
        onScrollEndDrag={(e) => commit(e.nativeEvent.contentOffset.y)}
        onMomentumScrollEnd={(e) => commit(e.nativeEvent.contentOffset.y)}
      >
        {items.map((item, i) => (
          <View key={i} className="h-11 items-center justify-center">
            <Text
              className={`text-base  ${
                i === activeIndex
                  ? "font-semibold text-[#111826]"
                  : "font-medium text-[#64748A]"
              }`}
            >
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
  const { colors } = useTheme();
  return (
    <View className="w-[222px] h-[152px]">
      <View className="absolute left-0 right-14 top-0 bottom-7 bg-[#64748A] rounded-md overflow-hidden">
        <View className="h-4 flex-row items-center gap-[3px] px-1.5">
          {[0, 1, 2].map((k) => (
            <View
              key={k}
              className="w-[5px] h-[5px] rounded-full bg-[#F0F0F0]"
            />
          ))}
        </View>
        <View className="flex-1 bg-[#31973D] m-px rounded-sm pt-1.5 gap-2.5">
          <View className="h-2 bg-white/30 mx-1.5 rounded-sm" />
          {[0, 1].map((k) => (
            <View key={k} className="flex-row items-center gap-1.5 px-1.5">
              <View className="w-3.5 h-3.5 rounded-full" />
              <View className="flex-1 h-[5px] bg-white/40 rounded-sm" />
            </View>
          ))}
        </View>
      </View>
      <View
        style={{ backgroundColor: colors.bg }}
        className="absolute right-0 bottom-0 w-[62px] h-[62px] p-2.5 rounded-full border-[2.5px] border-[#31973D] items-center justify-center"
      >
        <View
          style={{ backgroundColor: colors.iconBg }}
          className="w-10 h-10 rounded-full flex items-center justify-center"
        >
          <MaterialCommunityIcons
            name="plus"
            size={26}
            color={colors.iconColor}
          />
        </View>
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
  status: 'scheduled' | 'completed' | 'cancelled' | 'processing' | 'failed';
  retryCount?: number;
  estimatedPrice?: number;
  lastError?: string;
};

/* ─── ScheduleCard ──────────────────────────────────────────── */

function ScheduleCard({
  item,
  menuOpen,
  onMenuOpen,
  onMenuClose,
  onEdit,
  onDelete,
  onRetry,
}: {
  item: ScheduleItem;
  menuOpen: boolean;
  onMenuOpen: () => void;
  onMenuClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onRetry?: () => void;
}) {
  const { colors } = useTheme();

  // Determine status badge styling
  const getStatusBadge = () => {
    switch (item.status) {
      case 'scheduled':
        return {
          bg: '#FEF3C7',
          text: '#92400E',
          icon: 'moon-waning-crescent',
          label: 'Scheduled',
        };
      case 'completed':
        return {
          bg: '#DCFCE7',
          text: '#166534',
          icon: 'check-circle',
          label: 'Completed',
        };
      case 'cancelled':
        return {
          bg: '#FEE2E2',
          text: '#991B1B',
          icon: 'close-circle',
          label: 'Cancelled',
        };
      case 'processing':
        return {
          bg: '#DBEAFE',
          text: '#1E40AF',
          icon: 'clock-outline',
          label: 'Processing',
        };
      case 'failed':
        return {
          bg: '#FEF3C7',
          text: '#92400E',
          icon: 'alert-circle',
          label: 'Retrying...',
        };
      default:
        return {
          bg: '#F1F5F9',
          text: '#475569',
          icon: 'moon-waning-crescent',
          label: 'Scheduled',
        };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <View className="flex-row items-start px-3 h-32">
      {/* Main section */}
      <View className="flex-1 pt-1 pr-4 pb-1 gap-2.5 justify-center h-full">
        {/* Status badge */}
        <View className="flex-row items-center gap-2">
          <View
            className="flex-row items-center gap-1.5 rounded-xl px-2 py-1"
            style={{ backgroundColor: statusBadge.bg }}
          >
            <MaterialCommunityIcons
              name={statusBadge.icon as any}
              size={14}
              color={statusBadge.text}
            />
            <Text
              className="text-xs font-medium"
              style={{ color: statusBadge.text }}
            >
              {statusBadge.label}
            </Text>
          </View>

          {/* Retry badge - only show if status is 'failed' and retryCount < 3 */}
          {item.status === 'failed' && 
           item.retryCount !== undefined && 
           item.retryCount > 0 && 
           item.retryCount < 3 && (
            <View className="flex-row items-center gap-1.5 bg-[#FEF3C7] rounded-xl px-2 py-1">
              <MaterialCommunityIcons
                name="refresh"
                size={12}
                color="#92400E"
              />
              <Text className="text-xs text-[#92400E] font-medium">
                Retry {item.retryCount}/3
              </Text>
            </View>
          )}

          {/* Max retries reached */}
          {item.status === 'failed' && 
           item.retryCount !== undefined && 
           item.retryCount >= 3 && (
            <View className="flex-row items-center gap-1.5 bg-[#FEE2E2] rounded-xl px-2 py-1">
              <MaterialCommunityIcons
                name="close-circle"
                size={12}
                color="#991B1B"
              />
              <Text className="text-xs text-[#991B1B] font-medium">
                Max retries
              </Text>
            </View>
          )}
        </View>

        {/* Date / time / location */}
        <View className="gap-px">
          <View className="flex-row items-center">
            <View className="px-1 py-1">
              <Text
                style={{ color: colors.text }}
                className="text-xs font-medium"
              >
                {item.date}
              </Text>
            </View>
            <View
              style={{ backgroundColor: colors.border }}
              className="w-px h-4"
            />
            <View className="px-1 py-1">
              <Text
                style={{ color: colors.text }}
                className="text-xs font-medium"
              >
                {item.timeRange || '-'}
              </Text>
            </View>
          </View>
          <View className="px-1">
            <Text
              style={{ color: colors.text }}
              className="text-[13px] font-medium"
              numberOfLines={1}
            >
              {item.location || 'No location set'}
            </Text>
          </View>
        </View>

        {/* Estimated cost */}
        <View className="flex-row justify-between items-center">
          <Text
            style={{ color: colors.textSub }}
            className="text-[13px] font-medium"
          >
            Estimated cost
          </Text>
          <Text
            style={{ color: colors.textMuted }}
            className="text-xl font-bold"
          >
            GHS {item.estimatedPrice || '15.00'}
          </Text>
        </View>
      </View>

      {/* Three-dot menu column */}
      <View className="w-[35px] items-center pt-2">
        <Pressable
          style={{ backgroundColor: colors.iconBg }}
          className="w-8 h-8 rounded-full items-center justify-center"
          onPress={menuOpen ? onMenuClose : onMenuOpen}
        >
          <MaterialCommunityIcons
            name="dots-horizontal"
            size={20}
            color={colors.iconColor}
          />
        </Pressable>

        {/* Dropdown */}
        {menuOpen && (
          <View
            className="absolute top-10 right-0 w-[165px] bg-[rgba(250,250,250,0.96)] border border-[#E2E8F0] rounded-2xl overflow-hidden z-50"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.12,
              shadowRadius: 12,
              elevation: 16,
            }}
          >
            {/* Edit - only show for scheduled or failed schedules */}
            {(item.status === 'scheduled' || item.status === 'failed') && (
              <>
                <Pressable
                  className="flex-row items-center justify-between px-5 h-11"
                  onPress={() => {
                    onEdit();
                    onMenuClose();
                  }}
                >
                  <Text className="text-sm text-[#1F2A33]">Edit</Text>
                  <MaterialCommunityIcons
                    name="pencil-outline"
                    size={18}
                    color="#475568"
                  />
                </Pressable>
                <View className="h-px bg-[#E2E8F0] mx-3" />
              </>
            )}

            {/* Retry - only show for failed schedules with retryCount < 3 */}
            {item.status === 'failed' && 
             item.retryCount !== undefined && 
             item.retryCount < 3 && 
             onRetry && (
              <>
                <Pressable
                  className="flex-row items-center justify-between px-5 h-11"
                  onPress={() => {
                    onRetry();
                    onMenuClose();
                  }}
                >
                  <Text className="text-sm text-[#2563EB]">Retry</Text>
                  <MaterialCommunityIcons
                    name="refresh"
                    size={18}
                    color="#2563EB"
                  />
                </Pressable>
                <View className="h-px bg-[#E2E8F0] mx-3" />
              </>
            )}

            {/* Delete - always show */}
            <Pressable
              className="flex-row items-center justify-between px-5 h-11"
              onPress={() => {
                onDelete();
                onMenuClose();
              }}
            >
              <Text className="text-sm text-[#EF4444]">Delete</Text>
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={18}
                color="#EF4444"
              />
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

/* ─── ScheduleScreen ────────────────────────────────────────── */

export function ScheduleScreen({
  navigation,
}: RootStackScreenProps<"Schedule">) {
  const { colors } = useTheme();
  const customer = useAppSelector((state) => state.customer);
  const isPremium = customer.is_premium;
  const { coords } = useCurrentLocation();
  const todayDate = new Date();

  const getPickupCoordinates = (): [number, number] => {
    if (coords) return [coords.longitude, coords.latitude];
    return [-0.187, 5.6037];
  };

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Screen
  const [isBinFull, setIsBinFull] = useState(false);
  const [binFullLoading, setBinFullLoading] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [nearbyDrivers, setNearbyDrivers] = useState<NearbyDriver[]>([]);
  const [driversLoading, setDriversLoading] = useState(false);

  // Form
  const [driverListOpen, setDriverListOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Frequency
  const [frequencyOpen, setFrequencyOpen] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState("One time pickup");

  // Calendar
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarYear, setCalendarYear] = useState(todayDate.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(todayDate.getMonth());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  // Time picker
  const [timePickerFor, setTimePickerFor] = useState<"start" | "end" | null>(
    null,
  );
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const hourRef = useRef(5);
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
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterYear, setFilterYear] = useState(todayDate.getFullYear());
  const [filterMonth, setFilterMonth] = useState(todayDate.getMonth());
  const [filterPickDate, setFilterPickDate] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<{
    year: number;
    month: number;
    day: number;
  } | null>(null);

  // Toast animation
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastAnim = useRef(new Animated.Value(-80)).current;
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Toast helpers ────────────────────────────────────────────

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'warning':
        toast.warning(message);
        break;
      case 'info':
        toast.info(message);
        break;
    }
  };

  const getDriverById = (id: string | null) =>
    nearbyDrivers.find((driver) => driver.id === id) ?? null;

  const getEstimatedPrice = () => {
    const driver = getDriverById(selectedDriver);
    return (driver?.cost ?? 10) + SERVICE_FEE;
  };

  const fetchNearbyDrivers = async () => {
    if (!coords) return;
    setDriversLoading(true);
    try {
      const res = await driverService.getNearbyDrivers({
        lat: coords.latitude,
        lng: coords.longitude,
        isPremium,
      });
      if (res.success) {
        setNearbyDrivers(res.data.drivers);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setDriversLoading(false);
    }
  };

  useEffect(() => {
    if (!isPremium) return;
    binFullService
      .getStatus()
      .then((res) => {
        if (res.success) setIsBinFull(res.data.is_active);
      })
      .catch(() => {});
  }, [isPremium]);

  useEffect(() => {
    if (coords && sheetOpen) {
      fetchNearbyDrivers();
    }
  }, [coords, sheetOpen, isPremium]);

  const handleBinFullToggle = async (value: boolean) => {
    if (!isPremium || binFullLoading) return;
    setBinFullLoading(true);
    try {
      let pickupLocation: { type: "Point"; coordinates: [number, number] } | undefined;
      let pickupAddress = location || "Scheduled pickup";

      if (value) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const loc = await Location.getCurrentPositionAsync({});
          pickupLocation = {
            type: "Point",
            coordinates: [loc.coords.longitude, loc.coords.latitude],
          };
        } else if (coords) {
          pickupLocation = {
            type: "Point",
            coordinates: [coords.longitude, coords.latitude],
          };
        }
      }

      await binFullService.setSignal({
        isActive: value,
        pickupAddress,
        pickupLocation,
      });
      setIsBinFull(value);
      showToast(
        value ? "Bin-full signal enabled" : "Bin-full signal disabled",
        "success",
      );
    } catch {
      showToast("Unable to update bin-full signal", "error");
    } finally {
      setBinFullLoading(false);
    }
  };

  // ─── Handle Retry ─────────────────────────────────────────────

  const handleRetrySchedule = async (scheduleId: string) => {
    try {
      setIsSubmitting(true);
      const response = await scheduleService.retrySchedule(scheduleId);

      if (response.success) {
        showToast("Retrying schedule...", 'info');
        await fetchSchedules(
          activeFilter?.year,
          activeFilter?.month,
          activeFilter?.day,
        );
      }
    } catch (error: any) {
      console.error("Error retrying schedule:", error);
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Fetch Schedules ──────────────────────────────────────────

  const fetchSchedules = async (year?: number, month?: number, day?: number) => {
    try {
      setIsFetching(true);
      const params: any = {};
      if (year !== undefined && month !== undefined && day !== undefined) {
        params.year = year;
        params.month = month;
        params.day = day;
      }

      const response = await scheduleService.getSchedules(params);

      if (response.success && response.data) {
        const items = response.data.items.map((s: ApiSchedule) => {
          const date = new Date(s.scheduled_date);
          const driver = nearbyDrivers.find((d) => d.id === s.driver_id);

          // Map status from API
          let status: ScheduleItem['status'] = 'scheduled';
          if (s.status === 'completed') status = 'completed';
          else if (s.status === 'cancelled') status = 'cancelled';
          else if (s.processed_at && s.status === 'scheduled') status = 'processing';
          else if (s.last_error && s.retry_count && s.retry_count > 0) status = 'failed';

          return {
            id: s.id,
            driver: driver?.name || "Assigned driver",
            date: date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
            timeRange:
              s.start_time && s.end_time
                ? `${s.start_time} - ${s.end_time}`
                : s.start_time || s.end_time || '',
            location: s.pickup_address || 'No location set',
            rawYear: date.getFullYear(),
            rawMonth: date.getMonth(),
            rawDay: date.getDate(),
            rawStartTime: s.start_time || '',
            rawEndTime: s.end_time || '',
            frequency: s.frequency || 'One time pickup',
            status: status,
            retryCount: s.retry_count || 0,
            estimatedPrice: s.estimated_price || 15,
            lastError: s.last_error || undefined,
          };
        });
        setSchedules(items);
      }
    } catch (error: any) {
      console.error('Error fetching schedules:', error);
      handleApiError(error);
    } finally {
      setIsFetching(false);
    }
  };

  // ─── Load schedules on mount ──────────────────────────────────

  useEffect(() => {
    fetchSchedules();
  }, []);

  // ─── Create Schedule ──────────────────────────────────────────

  const createSchedule = async () => {
    if (!selectedDriver || !location || !selectedDate) {
      showToast("Please fill all required fields", 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      const scheduledDate = new Date(calendarYear, calendarMonth, selectedDate);

      const frequencyMap: Record<string, "one_time" | "daily" | "weekly" | "monthly"> = {
        "One time pickup": "one_time",
        Daily: "daily",
        Weekly: "weekly",
        Monthly: "monthly",
      };

      const payload = {
        driver_id: selectedDriver,
        pickup_address: location,
        pickup_location: {
          type: "Point" as const,
          coordinates: getPickupCoordinates(),
        },
        phone: phone || null,
        note: note || null,
        frequency: frequencyMap[selectedFrequency] || "one_time",
        scheduled_date: scheduledDate.toISOString().split("T")[0],
        start_time: startTime || null,
        end_time: endTime || null,
        estimated_price: getEstimatedPrice(),
      };

      const response = await scheduleService.createSchedule(payload);

      if (response.success) {
        showToast("Schedule created successfully", 'success');
        await fetchSchedules(
          activeFilter?.year,
          activeFilter?.month,
          activeFilter?.day,
        );
        setConfirmOpen(false);
        setSheetOpen(false);
        resetForm();
      }
    } catch (error: any) {
      console.error("Error creating schedule:", error);
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Update Schedule ──────────────────────────────────────────

  const updateSchedule = async () => {
    if (!editTargetId || !selectedDriver || !location || !selectedDate) {
      showToast("Please fill all required fields", 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      const scheduledDate = new Date(calendarYear, calendarMonth, selectedDate);

      const frequencyMap: Record<string, "one_time" | "daily" | "weekly" | "monthly"> = {
        "One time pickup": "one_time",
        Daily: "daily",
        Weekly: "weekly",
        Monthly: "monthly",
      };

      const payload = {
        driver_id: selectedDriver,
        pickup_address: location,
        pickup_location: {
          type: "Point" as const,
          coordinates: getPickupCoordinates(),
        },
        phone: phone || null,
        note: note || null,
        frequency: frequencyMap[selectedFrequency] || "one_time",
        scheduled_date: scheduledDate.toISOString().split("T")[0],
        start_time: startTime || null,
        end_time: endTime || null,
        estimated_price: getEstimatedPrice(),
      };

      const response = await scheduleService.updateSchedule(
        editTargetId,
        payload,
      );

      if (response.success) {
        showToast("Schedule updated successfully", 'success');
        await fetchSchedules(
          activeFilter?.year,
          activeFilter?.month,
          activeFilter?.day,
        );
        setEditTargetId(null);
        setSheetOpen(false);
        resetForm();
      }
    } catch (error: any) {
      console.error("Error updating schedule:", error);
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Delete Schedule ──────────────────────────────────────────

  const deleteSchedule = async () => {
    if (!deleteTargetId) return;

    setIsDeleting(true);

    try {
      const response = await scheduleService.deleteSchedule(deleteTargetId);

      if (response.success) {
        showToast("Schedule deleted successfully", 'success');
        setSchedules((prev) => prev.filter((s) => s.id !== deleteTargetId));
        setDeleteTargetId(null);
        await fetchSchedules(
          activeFilter?.year,
          activeFilter?.month,
          activeFilter?.day,
        );
      }
    } catch (error: any) {
      console.error("Error deleting schedule:", error);
      handleApiError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  // ─── Reset Form ──────────────────────────────────────────────

  const resetForm = () => {
    setSelectedDriver(null);
    setLocation("");
    setPhone("");
    setNote("");
    setStartTime("");
    setEndTime("");
    setSelectedDate(null);
    setSelectedFrequency("One time pickup");
    setEditTargetId(null);
  };

  const canSchedule = !!selectedDriver && !!location && !!selectedDate;

  const closeOverlays = () => {
    setFrequencyOpen(false);
    setCalendarOpen(false);
    setTimePickerFor(null);
  };

  const openTimePicker = (which: "start" | "end") => {
    const timeStr = which === "start" ? startTime : endTime;
    if (timeStr) {
      const [timePart, period] = timeStr.split(" ");
      const [h, m] = timePart.split(":");
      hourRef.current = parseInt(h) - 1;
      minuteRef.current = parseInt(m);
      periodRef.current = period === "AM" ? 0 : 1;
    } else {
      hourRef.current = 5;
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
    if (timePickerFor === "start") setStartTime(timeStr);
    else setEndTime(timeStr);
    setTimePickerFor(null);
  };

  const openSheet = () => {
    resetForm();
    setDriverListOpen(false);
    setSearchMode(false);
    setSearchQuery("");
    setFrequencyOpen(false);
    setCalendarOpen(false);
    setTimePickerFor(null);
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
    setPhone("");
    setNote("");
    setDriverListOpen(false);
    setSearchMode(false);
    setSearchQuery("");
    setFrequencyOpen(false);
    setCalendarOpen(false);
    setTimePickerFor(null);
    setSheetOpen(true);
  };

  const prevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((y) => y - 1);
    } else setCalendarMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((y) => y + 1);
    } else setCalendarMonth((m) => m + 1);
  };

  const filterPrevMonth = () => {
    if (filterMonth === 0) {
      setFilterMonth(11);
      setFilterYear((y) => y - 1);
    } else setFilterMonth((m) => m - 1);
  };
  const filterNextMonth = () => {
    if (filterMonth === 11) {
      setFilterMonth(0);
      setFilterYear((y) => y + 1);
    } else setFilterMonth((m) => m + 1);
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

  const dateLabel = selectedDate
    ? `${MONTH_NAMES[calendarMonth].slice(0, 3)} ${selectedDate}`
    : "Today";
  const calendarDays = getCalendarDays(calendarYear, calendarMonth);
  const todayDay = todayDate.getDate();
  const todayMonth = todayDate.getMonth();
  const todayYear = todayDate.getFullYear();

  const confirmDate = (() => {
    const d = selectedDate
      ? new Date(calendarYear, calendarMonth, selectedDate)
      : new Date();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return `${days[d.getDay()]}, ${d.getDate()} ${MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`;
  })();

  const fmtTime = (t: string) => {
    if (!t) return "";
    const [tp, period] = t.split(" ");
    const [h, m] = tp.split(":");
    return `${parseInt(h)}:${m}${period.toLowerCase()}`;
  };

  const confirmTimeRange =
    startTime || endTime
      ? [startTime && fmtTime(startTime), endTime && fmtTime(endTime)]
          .filter(Boolean)
          .join(" - ")
      : "";

  const selectedDriverInfo = getDriverById(selectedDriver);
  const driverRating = selectedDriverInfo?.rating ?? "";

  const filterCalendarDays = getCalendarDays(filterYear, filterMonth);
  const filterLabel = activeFilter
    ? `${MONTH_NAMES[activeFilter.month].slice(0, 3)} ${activeFilter.day}`
    : "Today";
  const visibleSchedules = activeFilter
    ? schedules.filter(
        (s) =>
          s.rawYear === activeFilter.year &&
          s.rawMonth === activeFilter.month &&
          s.rawDay === activeFilter.day,
      )
    : schedules;

  if (isFetching) {
    return (
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: colors.bg }}
        edges={["top", "left", "right"]}
      >
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#31973D" />
          <Text style={{ color: colors.textSub, marginTop: 16 }}>
            Loading schedules...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.bg }}
      edges={["top", "left", "right"]}
    >
      {/* Top bar */}
      <View className="w-full h-12 flex-row items-center justify-between px-4 z-10">
        <Pressable className="w-8 h-8 items-center justify-center">
          <MaterialCommunityIcons
            name="menu"
            size={20}
            color={colors.iconColor}
          />
        </Pressable>

        <View className="flex-row gap-2 items-center justify-center">
          {isPremium && (
            <View className="flex-row gap-2 items-center justify-center">
              <Text className="text-xs" style={{ color: colors.textSub }}>
                Bin Full?
              </Text>
              <AnimatedSwitch
                value={isBinFull}
                onChange={handleBinFullToggle}
              />
            </View>
          )}
          <Pressable
            onPress={() => {
              navigation.navigate("NotificationsList");
            }}
            className="w-10 h-10 p-1 border rounded-lg items-center justify-center"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.iconBg,
            }}
          >
            <MaterialCommunityIcons
              name="bell-outline"
              size={20}
              color={colors.iconColor}
            />
          </Pressable>
        </View>
      </View>

      {/* Lavender sub-header */}
      <View
        className="h-11 flex-row items-center justify-between px-5"
        style={{ backgroundColor: colors.surface }}
      >
        <View className="flex-row items-center gap-2">
          <Text className="text-sm font-medium" style={{ color: colors.text }}>
            {filterLabel}
          </Text>
          <Pressable
            style={{ backgroundColor: colors.iconBg }}
            className="w-7 h-7 rounded-xl items-center justify-center"
            onPress={openFilterSheet}
          >
            <MaterialCommunityIcons
              name="calendar"
              size={16}
              color={"#31973D"}
            />
          </Pressable>
          <Pressable onPress={() => setActiveFilter(null)}>
            <MaterialCommunityIcons
              name="refresh"
              size={16}
              color={colors.iconColor}
            />
          </Pressable>
        </View>
      </View>

      {/* Empty state / schedule list */}
      {visibleSchedules.length === 0 ? (
        <View className="flex-1 p-5">
          <View
            style={{ borderColor: colors.border }}
            className="border rounded-[20px] h-[360px] items-center justify-end px-6 pb-10 gap-5"
          >
            <ScheduleIllustration />
            <View className="items-center gap-[5px]">
              <Text
                style={{ color: colors.text }}
                className="text-base font-medium"
              >
                No Schedules
              </Text>
              <Text
                style={{ color: colors.textMuted }}
                className="text-sm font-normal text-center "
              >
                Hit the plus icon to plan for later
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <Pressable className="flex-1 p-5" onPress={() => setOpenMenuId(null)}>
          <View
            style={{ borderColor: colors.border, backgroundColor: colors.bg }}
            className="border rounded-2xl overflow-hidden flex-1"
          >
            {/* Header */}
            <View
              style={{ backgroundColor: colors.surface }}
              className="h-12 justify-center px-3"
            >
              <Text
                style={{ color: colors.text }}
                className="text-base font-medium"
              >
                Schedules
              </Text>
            </View>
            {/* List */}
            <ScrollView showsVerticalScrollIndicator={false}>
              {visibleSchedules.map((item, index) => (
                <React.Fragment key={item.id}>
                  {index > 0 && (
                    <View
                      style={{ borderColor: colors.border }}
                      className="border mx-3 m-2"
                    />
                  )}
                  <ScheduleCard
                    item={item}
                    menuOpen={openMenuId === item.id}
                    onMenuOpen={() => setOpenMenuId(item.id)}
                    onMenuClose={() => setOpenMenuId(null)}
                    onEdit={() => {
                      setOpenMenuId(null);
                      openEditSheet(item);
                    }}
                    onDelete={() => {
                      setOpenMenuId(null);
                      setDeleteTargetId(item.id);
                    }}
                    onRetry={() => {
                      setOpenMenuId(null);
                      handleRetrySchedule(item.id);
                    }}
                  />
                </React.Fragment>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      )}

      {/* FAB */}
      <Pressable
        className="absolute right-5 bottom-[102px] w-12 h-12 rounded-full bg-[#31973D] items-center justify-center"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: -1, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 6,
        }}
        onPress={openSheet}
      >
        <MaterialCommunityIcons name="plus" size={16} color="#FFFFFF" />
      </Pressable>

      {/* Bottom nav */}
      <AppBottomNav
        activeTab="calendar"
        paddingBottom={0}
        navigation={navigation}
      />

      {/* ══ Schedule details bottom sheet ══ */}
      <Modal
        visible={sheetOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setSheetOpen(false)}
      >
        <View className="flex-1 bg-[rgba(69,71,69,0.15)] justify-end">
          <Pressable
            className="absolute top-0 left-0 right-0 bottom-0"
            onPress={() => setSheetOpen(false)}
          />

          <View
            style={{ backgroundColor: colors.bg }}
            className="rounded-t-[32px] pt-4 pb-2 h-[82%] justify-between"
          >
            {/* Scrollable form */}
            <ScrollView
              className="flex-1"
              showsVerticalScrollIndicator={false}
              contentContainerClassName="gap-4 pb-6"
              keyboardShouldPersistTaps="handled"
              scrollEnabled={timePickerFor === null}
            >
              {/* Handle */}
              <View
                style={{ backgroundColor: colors.textMuted }}
                className="w-[152px] h-[3px] rounded-[20px] self-center"
              />

              {/* Header */}
              <View className="flex-row justify-between items-center px-6">
                <Text
                  style={{ color: colors.text }}
                  className="text-lg font-medium tracking-[-0.54px] "
                >
                  Schedule details
                </Text>
                <Pressable
                  style={{ borderColor: colors.border }}
                  className="flex-row items-center gap-2 px-3 py-1.5 border rounded-full"
                  onPress={() => {
                    setFrequencyOpen((v) => !v);
                    setCalendarOpen(false);
                    setDriverListOpen(false);
                    setTimePickerFor(null);
                  }}
                  disabled={isSubmitting}
                >
                  <Text
                    style={{ color: colors.text }}
                    className="text-xs font-medium"
                  >
                    {selectedFrequency}
                  </Text>
                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={12}
                    color={colors.iconColor}
                  />
                </Pressable>
              </View>

              {/* Form fields */}
              <View className="px-6 gap-4 w-full">
                {/* Driver pill / select button */}
                {selectedDriver ? (
                  <View
                    style={{ backgroundColor: colors.surface }}
                    className="flex-row items-center h-10 rounded-xl px-3 gap-2"
                  >
                    <MaterialCommunityIcons
                      name="star"
                      size={16}
                      color="#FEC002"
                    />
                    <Text
                      style={{ color: colors.textMuted }}
                      className="text-xs"
                    >
                      {selectedDriverInfo?.rating ?? "—"}
                    </Text>
                    <View className="flex-row items-center gap-1 flex-1">
                      <Text
                        style={{ color: colors.text }}
                        className="text-sm font-medium"
                      >
                        {selectedDriverInfo?.name ?? "Driver"}
                      </Text>
                      {selectedDriverInfo?.isPremium && (
                        <MaterialCommunityIcons
                          name="check-decagram"
                          size={13}
                          color="#D4AF37"
                        />
                      )}
                    </View>
                    <Pressable
                      onPress={() => setSelectedDriver(null)}
                      disabled={isSubmitting}
                    >
                      <MaterialCommunityIcons
                        name="close-circle-outline"
                        size={16}
                        color="#EF4444"
                      />
                    </Pressable>
                  </View>
                ) : (
                  <Pressable
                    className="flex-row items-center justify-center gap-2 h-10 bg-[#31973D] rounded-2xl"
                    onPress={() => {
                      setDriverListOpen(true);
                      closeOverlays();
                    }}
                    disabled={isSubmitting}
                    style={{ opacity: isSubmitting ? 0.8 : 1 }}
                  >
                    <MaterialCommunityIcons
                      name="plus-circle-outline"
                      size={16}
                      color="#FFFFFF"
                    />
                    <Text className="text-sm text-white ">
                      Select available driver
                    </Text>
                  </Pressable>
                )}

                {/* Driver dropdown */}
                {driverListOpen && (
                  <View
                    className="absolute left-6 right-6 top-12 border rounded-3xl p-2 z-20"
                    style={{
                      borderColor: colors.border,
                      backgroundColor: colors.bg,
                      shadowColor: "rgba(69,71,69,0.15)",
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 1,
                      shadowRadius: 20,
                      elevation: 12,
                    }}
                  >
                    {searchMode ? (
                      <View
                        style={{ borderColor: colors.borderLight }}
                        className="flex-row items-center gap-2 border rounded-full px-2.5 h-[27px] mb-1.5"
                      >
                        <MaterialCommunityIcons
                          name="magnify"
                          size={11}
                          color={colors.iconColor}
                        />
                        <TextInput
                          style={{ color: colors.textSub }}
                          className="flex-1 text-[13px] p-0 outline-none"
                          placeholder="search driver by name, unique...."
                          placeholderTextColor="#94A3B7"
                          value={searchQuery}
                          onChangeText={setSearchQuery}
                          autoFocus
                        />
                      </View>
                    ) : (
                      <View
                        style={{ borderColor: colors.borderLight }}
                        className="flex-row justify-between items-center py-[3px] px-1 mb-1 border-b"
                      >
                        <Text
                          style={{ color: colors.textSub }}
                          className="text-sm font-medium"
                        >
                          Recommended
                        </Text>
                        <Pressable onPress={() => setSearchMode(true)}>
                          <Text className="text-[11px] font-medium text-[rgba(14,90,142,0.7)] underline">
                            Search
                          </Text>
                        </Pressable>
                      </View>
                    )}
                    <ScrollView
                      className="max-h-56"
                      showsVerticalScrollIndicator={false}
                    >
                      {driversLoading ? (
                        <View className="py-6 items-center">
                          <ActivityIndicator color="#31973D" />
                        </View>
                      ) : nearbyDrivers.length === 0 ? (
                        <Text
                          style={{ color: colors.textSub }}
                          className="text-sm text-center py-4"
                        >
                          No drivers nearby. Try again later.
                        </Text>
                      ) : (
                        nearbyDrivers
                          .filter((driver) =>
                            driver.name
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()),
                          )
                          .map((driver) => (
                            <Pressable
                              key={driver.id}
                              className={`flex-row items-center justify-between px-3 py-2 h-[34px] rounded-2xl mb-1 ${
                                selectedDriver === driver.id
                                  ? "bg-[#F1F5F9]"
                                  : "bg-transparent"
                              }`}
                              onPress={() => {
                                setSelectedDriver(driver.id);
                                setDriverListOpen(false);
                                setSearchMode(false);
                                setSearchQuery("");
                              }}
                            >
                              <View className="flex-row items-center gap-1">
                                <Text
                                  style={{ color: colors.text }}
                                  className="text-sm font-medium"
                                >
                                  {driver.name}
                                </Text>
                                {driver.isPremium && (
                                  <MaterialCommunityIcons
                                    name="check-decagram"
                                    size={13}
                                    color="#D4AF37"
                                  />
                                )}
                              </View>
                              <View className="flex-row items-center gap-[5px]">
                                <MaterialCommunityIcons
                                  name="star"
                                  size={16}
                                  color="#FEC002"
                                />
                                <Text
                                  style={{ color: colors.textSub }}
                                  className="text-xs"
                                >
                                  {driver.rating}
                                </Text>
                              </View>
                            </Pressable>
                          ))
                      )}
                    </ScrollView>
                  </View>
                )}

                {/* Location */}
                <View className="gap-1">
                  <Text style={{ color: colors.textSub }} className="text-sm">
                    Location
                  </Text>
                  <View
                    style={{ backgroundColor: colors.surface }}
                    className="flex-row items-center h-12 rounded-3xl px-3 gap-2"
                  >
                    <TextInput
                      style={{ color: colors.textSub }}
                      className="flex-1 text-sm text-[#1F2A33] p-0  outline-none"
                      placeholder="Tarkwa, UMaT Campus, Hall 3"
                      placeholderTextColor="#94A3B7"
                      value={location}
                      onChangeText={setLocation}
                      onFocus={closeOverlays}
                      editable={!isSubmitting}
                    />
                    {location.length > 0 && (
                      <Pressable onPress={() => setLocation("")}>
                        <MaterialCommunityIcons
                          name="close-circle-outline"
                          size={16}
                          color="#EF4444"
                        />
                      </Pressable>
                    )}
                  </View>
                </View>

                {/* Phone Number */}
                <View className="gap-1">
                  <Text style={{ color: colors.textSub }} className="text-sm">
                    Phone Number
                  </Text>
                  <View
                    style={{ backgroundColor: colors.surface }}
                    className="flex-row items-center h-12 rounded-3xl px-3 gap-2"
                  >
                    <TextInput
                      style={{ color: colors.textSub }}
                      className="flex-1 text-sm p-0 outline-none"
                      placeholder="0243 50 8595"
                      placeholderTextColor="#94A3B7"
                      keyboardType="phone-pad"
                      value={phone}
                      onChangeText={setPhone}
                      onFocus={closeOverlays}
                      editable={!isSubmitting}
                    />
                    {phone.length > 0 && (
                      <Pressable onPress={() => setPhone("")}>
                        <MaterialCommunityIcons
                          name="close-circle-outline"
                          size={16}
                          color="#EF4444"
                        />
                      </Pressable>
                    )}
                  </View>
                </View>

                {/* Additional note */}
                <View className="gap-1">
                  <Text style={{ color: colors.textSub }} className="text-sm">
                    Additional note
                  </Text>
                  <TextInput
                    style={{
                      color: colors.textSub,
                      borderColor: colors.border,
                      backgroundColor: colors.surface,
                    }}
                    className="h-[108px] border rounded-3xl px-3 pt-3.5 text-sm"
                    placeholder="Call before arrival, waste is behind the gate etc.."
                    placeholderTextColor="#94A3B7"
                    multiline
                    textAlignVertical="top"
                    value={note}
                    onChangeText={setNote}
                    onFocus={closeOverlays}
                    editable={!isSubmitting}
                  />
                </View>

                {/* Date row */}
                <Pressable
                  style={{
                    backgroundColor: colors.card,
                    opacity: isSubmitting ? 0.8 : 1,
                  }}
                  className="flex-row items-center justify-center gap-2 h-12 rounded-xl"
                  onPress={() => {
                    setCalendarOpen((v) => !v);
                    setFrequencyOpen(false);
                    setDriverListOpen(false);
                    setTimePickerFor(null);
                  }}
                  disabled={isSubmitting}
                >
                  <MaterialCommunityIcons
                    name="calendar"
                    size={16}
                    color={colors.iconColor}
                  />
                  <Text
                    style={{ color: colors.textSub }}
                    className="text-base font-bold"
                  >
                    {dateLabel}
                  </Text>
                  <MaterialCommunityIcons
                    name="refresh"
                    size={16}
                    color={colors.iconColor}
                  />
                </Pressable>

                {/* Start / End time — Pressable displays */}
                <View className="gap-1">
                  <View className="flex-row">
                    <Text
                      style={{ color: colors.textSub }}
                      className="flex-1 text-sm"
                    >
                      Start Time
                    </Text>
                    <Text
                      style={{ color: colors.textSub }}
                      className="flex-1 text-sm"
                    >
                      End Time
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2 w-full">
                    <Pressable
                      style={{
                        borderColor: colors.border,
                        opacity: isSubmitting ? 0.8 : 1,
                      }}
                      className="flex-1 min-w-0 h-12 border rounded-3xl px-4 flex-row items-center"
                      onPress={() => openTimePicker("start")}
                      disabled={isSubmitting}
                    >
                      <Text
                        className={`text-sm  ${
                          startTime ? "text-[#1F2A33]" : "text-[#94A3B7]"
                        }`}
                      >
                        {startTime || "00:00"}
                      </Text>
                    </Pressable>
                    <View className="w-6 h-6 shrink-0 rounded-xl bg-[#31973D] items-center justify-center">
                      <MaterialCommunityIcons
                        name="arrow-right"
                        size={16}
                        color="#FFFFFF"
                      />
                    </View>
                    <Pressable
                      style={{
                        borderColor: colors.border,
                        opacity: isSubmitting ? 0.8 : 1,
                      }}
                      className="flex-1 min-w-0 h-12 border rounded-3xl px-4 flex-row items-center"
                      onPress={() => openTimePicker("end")}
                      disabled={isSubmitting}
                    >
                      <Text
                        className={`text-sm  ${
                          endTime ? "text-[#1F2A33]" : "text-[#94A3B7]"
                        }`}
                      >
                        {endTime || "00:00"}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* ── Frequency dropdown overlay ── */}
            {frequencyOpen && (
              <View
                className="absolute right-6 top-14 border rounded-[20px] py-1.5 px-1 min-w-[160px] z-30"
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.08,
                  shadowRadius: 16,
                  elevation: 20,
                }}
              >
                {FREQUENCIES.map((freq) => (
                  <Pressable
                    key={freq}
                    style={{
                      backgroundColor:
                        selectedFrequency === freq ? colors.surface : "",
                    }}
                    className={`px-3 py-[9px] rounded-[14px]`}
                    onPress={() => {
                      setSelectedFrequency(freq);
                      setFrequencyOpen(false);
                    }}
                    disabled={isSubmitting}
                  >
                    <Text
                      style={{
                        color:
                          selectedFrequency === freq
                            ? colors.text
                            : colors.textMuted,
                      }}
                      className={`text-sm  ${
                        selectedFrequency === freq
                          ? "font-medium"
                          : "font-normal"
                      }`}
                    >
                      {freq}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}

            {/* ── Calendar overlay ── */}
            {calendarOpen && (
              <View
                className="absolute left-6 right-6 top-[62px] border rounded-3xl p-3 z-[25]"
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.08,
                  shadowRadius: 16,
                  elevation: 18,
                }}
              >
                <View className="flex-row justify-between items-center px-2 py-1.5">
                  <View className="flex-row items-center gap-1">
                    <Text
                      style={{ color: colors.text }}
                      className="text-sm font-semibold"
                    >
                      {MONTH_NAMES[calendarMonth]} {calendarYear}
                    </Text>
                    <MaterialCommunityIcons
                      name="chevron-down"
                      size={16}
                      color={colors.iconColor}
                    />
                  </View>
                  <View className="flex-row items-center gap-1">
                    <Pressable onPress={prevMonth} className="p-1">
                      <MaterialCommunityIcons
                        name="chevron-left"
                        size={16}
                        color={colors.iconColor}
                      />
                    </Pressable>
                    <Pressable onPress={nextMonth} className="p-1">
                      <MaterialCommunityIcons
                        name="chevron-right"
                        size={16}
                        color={colors.iconColor}
                      />
                    </Pressable>
                  </View>
                </View>
                <View className="flex-row justify-between mb-0.5">
                  {DAY_LABELS.map((lbl, i) => (
                    <View key={i} className="flex-1 items-center py-1">
                      <Text
                        style={{ color: colors.textMuted }}
                        className="text-[11px]"
                      >
                        {lbl}
                      </Text>
                    </View>
                  ))}
                </View>
                {Array.from({ length: 6 }).map((_, row) => (
                  <View key={row} className="flex-row justify-between">
                    {calendarDays
                      .slice(row * 7, row * 7 + 7)
                      .map((cell, col) => {
                        const isToday =
                          cell.currentMonth &&
                          cell.day === todayDay &&
                          calendarMonth === todayMonth &&
                          calendarYear === todayYear;
                        const isSelected =
                          cell.currentMonth &&
                          cell.day === selectedDate &&
                          !isToday;
                        const isFuture =
                          cell.currentMonth &&
                          (calendarYear > todayYear ||
                            (calendarYear === todayYear &&
                              calendarMonth > todayMonth) ||
                            (calendarYear === todayYear &&
                              calendarMonth === todayMonth &&
                              cell.day > todayDay));
                        return (
                          <Pressable
                            key={col}
                            className={`flex-1 items-center justify-center h-8 rounded-[7px] ${
                              isToday || isSelected
                                ? "bg-[#31973D]"
                                : "bg-transparent"
                            }`}
                            onPress={() => {
                              if (!cell.currentMonth) return;
                              setSelectedDate(cell.day);
                              setCalendarOpen(false);
                            }}
                            disabled={isSubmitting}
                          >
                            <Text
                              style={{
                                color: !cell.currentMonth
                                  ? colors.textMuted
                                  : isToday || isSelected
                                    ? colors.text
                                    : isFuture
                                      ? colors.card
                                      : colors.textSub,
                              }}
                              className={`text-xs ${
                                isFuture || isToday || isSelected
                                  ? "font-bold"
                                  : "font-normal"
                              }`}
                            >
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
              <View
                className={`absolute ${
                  timePickerFor === "start" ? "left-6" : "right-6"
                } bottom-14 w-[196px] border rounded-3xl p-2 gap-1 z-[35]`}
                style={{
                  shadowColor: "#000",
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.15,
                  shadowRadius: 20,
                  elevation: 22,
                }}
              >
                {/* Title */}
                <Text
                  style={{ color: colors.text }}
                  className="text-sm font-medium tracking-[-0.42px] px-1"
                >
                  Select time
                </Text>

                {/* Scroll columns */}
                <View className="flex-row items-center h-44">
                  <TimePickerColumn
                    items={HOURS}
                    initialIndex={hourRef.current}
                    indexRef={hourRef}
                  />
                  <TimePickerColumn
                    items={MINUTES}
                    initialIndex={minuteRef.current}
                    indexRef={minuteRef}
                  />
                  <TimePickerColumn
                    items={PERIODS}
                    initialIndex={periodRef.current}
                    indexRef={periodRef}
                  />
                </View>

                {/* Done button */}
                <Pressable
                  className="h-10 bg-[#31973D] rounded-2xl items-center justify-center"
                  onPress={applyPickerTime}
                  disabled={isSubmitting}
                  style={{ opacity: isSubmitting ? 0.8 : 1 }}
                >
                  <Text className="text-sm text-white ">Done</Text>
                </Pressable>
              </View>
            )}

            {/* Bottom action row */}
            <View className="flex-row items-center px-6 gap-2.5">
              <Pressable
                className="w-8 h-8 rounded-xl bg-[#FFE2E2] items-center justify-center"
                onPress={() => setSheetOpen(false)}
                disabled={isSubmitting}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={16}
                  color="#EF4444"
                />
              </Pressable>
              <Pressable
                className={`flex-1 h-10 rounded-full items-center justify-center ${
                  canSchedule ? "bg-[#31973D]" : "bg-[rgba(52,168,83,0.5)]"
                }`}
                disabled={!canSchedule || isSubmitting}
                style={{ opacity: isSubmitting || !canSchedule ? 0.8 : 1 }}
                onPress={() => {
                  if (editTargetId) {
                    updateSchedule();
                  } else {
                    setConfirmOpen(true);
                  }
                }}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text className="text-sm text-white ">
                    {editTargetId ? "Save" : "Schedule"}
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ══ Confirmation card ══ */}
      <Modal
        visible={confirmOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmOpen(false)}
      >
        <View className="flex-1 bg-[rgba(0,0,0,0.65)] items-center justify-center px-5">
          {/* Gradient card */}
          <View className="w-[335px] rounded-[48px] overflow-hidden bg-[#A2C2E6]">
            {/* Corner radial blobs */}
            <View className="absolute -top-[60px] -left-[60px] w-[240px] h-[240px] rounded-[120px] bg-[#ADCCEB]" />
            <View className="absolute -top-[60px] -right-[60px] w-[240px] h-[240px] rounded-[120px] bg-[#F9AC86]" />
            <View className="absolute -bottom-[60px] -right-[60px] w-[240px] h-[240px] rounded-[120px] bg-[#D5B3E6]" />
            <View className="absolute -bottom-[60px] -left-[60px] w-[240px] h-[240px] rounded-[120px] bg-[#BEEBF4]" />

            {/* White content card */}
            <View className="mt-[105px] mx-6 mb-6 bg-white rounded-[40px] p-5 gap-4">
              {/* Name + badges */}
              <View className="gap-0.5">
                <Text className="text-xl font-bold text-black font-['Poppins'] tracking-[-0.6px] leading-8">
                  {selectedDriverInfo?.name ?? "Driver"}
                </Text>
                <View className="flex-row gap-1">
                  <View className="bg-[#FEF3C7] rounded-full px-3 py-1">
                    <Text className="text-xs font-medium text-[#A16207] font-['Poppins']">
                      Driver assigned
                    </Text>
                  </View>
                  <View className="bg-[#E0E7FF] rounded-full px-3 py-1">
                    <Text className="text-xs font-medium text-[#4338CA] font-['Poppins']">
                      {driverRating} stars
                    </Text>
                  </View>
                </View>
              </View>

              {/* Date / time / location */}
              <View className="gap-0.5">
                <View className="flex-row items-center">
                  <Text className="text-xs font-medium font-['Poppins'] pr-2 mr-2 border-r-[0.5px] border-r-[rgba(0,0,0,0.5)]">
                    {confirmDate}
                  </Text>
                  <Text className="text-xs font-medium font-['Poppins']">
                    {confirmTimeRange}
                  </Text>
                </View>
                {location ? (
                  <Text className="text-xs font-medium font-['Poppins'] pl-1">
                    {location}
                  </Text>
                ) : null}
              </View>

              {/* Action bar */}
              <View className="flex-row justify-between items-center">
                <View className="gap-0.5">
                  <Text className="text-[10px] font-medium text-[#64748A] font-['Poppins'] leading-6">
                    Estimated cost
                  </Text>
                  <Text className="text-xl font-bold text-[#1F2A33] font-['Poppins'] leading-6">
                    GHS 15.00
                  </Text>
                </View>
                <Pressable
                  className="bg-[#31973D] rounded-2xl px-6 py-2.5"
                  onPress={createSchedule}
                  disabled={isSubmitting}
                  style={{ opacity: isSubmitting ? 0.8 : 1 }}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Text className="text-sm text-white ">Schedule</Text>
                  )}
                </Pressable>
              </View>
            </View>

            {/* Profile picture — overlaps gradient / white card boundary */}
            <View
              className="absolute top-10 left-[39px] w-[90px] h-[90px] rounded-[45px] border-4 border-white items-center justify-center"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
                elevation: 6,
              }}
            >
              <Image
                source={avatar}
                style={{ width: 82, height: 82 }}
                className="rounded-[41px] border-2 border-[#90FA96]"
                resizeMode="cover"
              />
            </View>

            {/* Pending schedule badge */}
            <View
              className="absolute top-[97px] left-[115px] flex-row items-center gap-1.5 bg-[#9CA3AF] rounded-xl px-2 py-1"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 2,
                elevation: 4,
              }}
            >
              <MaterialCommunityIcons
                name="clock-outline"
                size={14}
                color="#FFFFFF"
              />
              <Text className="text-xs text-white ">pending schedule</Text>
            </View>

            {/* Close button */}
            <Pressable
              className="absolute top-11 right-6 w-7 h-7 rounded-[14px] border-[1.5px] border-white items-center justify-center"
              onPress={() => setConfirmOpen(false)}
              disabled={isSubmitting}
            >
              <MaterialCommunityIcons name="close" size={14} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ══ Delete confirmation modal ══ */}
      <Modal
        visible={deleteTargetId !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteTargetId(null)}
      >
        <View className="flex-1 bg-[rgba(0,0,0,0.65)] items-center justify-center px-5">
          <View className="w-[296px] bg-white rounded-3xl py-3 px-5 items-center gap-5">
            {/* Trash illustration */}
            <View className="w-[60px] h-[60px] rounded-[30px] bg-[#FEE2E2] items-center justify-center">
              <MaterialCommunityIcons
                name="trash-can"
                size={32}
                color="#F87171"
              />
            </View>

            {/* Text block */}
            <View className="gap-2 items-center w-64">
              <Text className="text-lg font-medium text-[#0F1621]  tracking-[-0.54px] leading-5 text-center">
                Delete your Schedule
              </Text>
              <Text className="text-sm font-normal text-[#0F1621]  leading-6 text-center">
                Are you sure you want to delete your timesheet?
              </Text>
            </View>

            {/* Buttons */}
            <View className="flex-row gap-2 w-64">
              <Pressable
                className="flex-1 h-10 bg-[#EF4444] rounded-2xl items-center justify-center"
                onPress={() => setDeleteTargetId(null)}
                disabled={isDeleting}
              >
                <Text className="text-sm font-normal text-white ">Cancel</Text>
              </Pressable>
              <Pressable
                className="flex-1 h-10 bg-white border border-[#CBD5E0] rounded-2xl items-center justify-center"
                onPress={deleteSchedule}
                disabled={isDeleting}
                style={{ opacity: isDeleting ? 0.8 : 1 }}
              >
                {isDeleting ? (
                  <ActivityIndicator color="#EF4444" size="small" />
                ) : (
                  <Text className="text-sm font-medium text-[#EF4444] ">
                    Delete
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ══ Date filter bottom sheet ══ */}
      <Modal
        visible={filterOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterOpen(false)}
      >
        <View className="flex-1 justify-end bg-[rgba(0,0,0,0.3)]">
          <Pressable
            className="absolute top-0 left-0 right-0 bottom-0"
            onPress={() => setFilterOpen(false)}
          />

          <View className="bg-white rounded-t-[32px] pt-4 px-5 pb-8 gap-6">
            {/* Handle */}
            <View className="w-[152px] h-[3px] bg-[#334154] rounded-[20px] self-center" />

            {/* Month navigation */}
            <View className="flex-row justify-between items-center px-2">
              <Pressable onPress={filterPrevMonth} className="p-2">
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={20}
                  color="#1A1C1E"
                />
              </Pressable>
              <Text className="text-xl font-semibold text-[#1A1C1E] ">
                {MONTH_NAMES[filterMonth]} {filterYear}
              </Text>
              <Pressable onPress={filterNextMonth} className="p-2">
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={20}
                  color="#1A1C1E"
                />
              </Pressable>
            </View>

            {/* Calendar grid */}
            <View>
              {/* Day labels */}
              <View className="flex-row">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((lbl, i) => (
                  <View key={i} className="flex-1 items-center py-[7px]">
                    <Text className="text-xs font-medium text-[#3F4A3D]  tracking-[0.48px]">
                      {lbl}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Day rows */}
              {Array.from({ length: 6 }).map((_, row) => (
                <View key={row} className="flex-row">
                  {filterCalendarDays
                    .slice(row * 7, row * 7 + 7)
                    .map((cell, col) => {
                      const isToday =
                        cell.currentMonth &&
                        cell.day === todayDay &&
                        filterMonth === todayMonth &&
                        filterYear === todayYear;
                      const isSelected =
                        cell.currentMonth && cell.day === filterPickDate;
                      return (
                        <Pressable
                          key={col}
                          className={`flex-1 items-center justify-center h-[52px] ${
                            cell.currentMonth ? "opacity-100" : "opacity-30"
                          }`}
                          onPress={() => {
                            if (!cell.currentMonth) return;
                            setFilterPickDate(cell.day);
                          }}
                        >
                          <View
                            className={`w-9 h-9 rounded-[18px] items-center justify-center ${
                              isSelected ? "bg-[#31973D]" : "bg-transparent"
                            }`}
                          >
                            <Text
                              className={`text-base  ${
                                isSelected ? "text-white" : "text-[#1A1C1E]"
                              }`}
                            >
                              {cell.day}
                            </Text>
                          </View>
                          {isToday && (
                            <View className="absolute bottom-[5px] w-1 h-1 rounded-sm bg-[#BA1A1A]" />
                          )}
                        </Pressable>
                      );
                    })}
                </View>
              ))}
            </View>

            {/* Bottom actions */}
            <View className="flex-row items-center gap-2.5">
              <Pressable
                className="w-10 h-10 rounded-xl bg-[#FFE2E2] items-center justify-center"
                onPress={() => setFilterOpen(false)}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={16}
                  color="#EF4444"
                />
              </Pressable>
              <Pressable
                className={`flex-1 h-10 rounded-2xl items-center justify-center ${
                  filterPickDate ? "bg-[#31973D]" : "bg-[rgba(49,151,61,0.5)]"
                }`}
                disabled={!filterPickDate}
                onPress={() => {
                  if (filterPickDate) {
                    setActiveFilter({
                      year: filterYear,
                      month: filterMonth,
                      day: filterPickDate,
                    });
                  }
                  setFilterOpen(false);
                  fetchSchedules(
                    filterYear,
                    filterMonth,
                    filterPickDate || undefined,
                  );
                }}
              >
                <Text className="text-sm text-white ">Apply change</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default ScheduleScreen;
