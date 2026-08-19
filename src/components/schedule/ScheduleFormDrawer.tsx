import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/types";

import { TimePickerColumn } from "./TimePickerColumn";
import { useTheme } from "../../context/ThemeContext";
import { APP_DARK } from "../../constants/appDarkTheme";
import { useAppSelector } from "../../hooks/useAppSelector";
import { scheduleService } from "../../api/scheduleService";
import { handleApiError } from "../../utils/handleApiError";
import { toast } from "../../hooks/toast";
import { useCurrentLocation } from "../../hooks/useCurrentLocation";
import { useLocationSearch } from "../../hooks/useLocationSearch";
import { LocationSearchDropdown } from "../../components/location/LocationSearchDropdown";
import type { PickupLocation } from "../../types/location.types";
import { driverService } from "../../api/driverService";
import { NearbyDriver } from "../../types/driver.types";
import {
  useSchedules,
  useInvalidateSchedules,
  type ScheduleItem,
} from "../../hooks/useSchedules";
import {
  DAY_LABELS,
  FREQUENCIES,
  frequencyMap,
  getCalendarDays,
  HOURS,
  MINUTES,
  MONTH_NAMES,
  PERIODS,
  SERVICE_FEE,
  toLocalDateString,
} from "../../constants/scheduleConstants";

type ScheduleFormDrawerProps = {
  visible: boolean;
  onClose: () => void;
  scheduleId?: string | null;
};

type SelectedDate = { year: number; month: number; day: number };

const TIME_PICKER_HOVER_OFFSET = 108;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const DRAG_DISMISS_DISTANCE = 120;
const DRAG_DISMISS_VELOCITY = 0.8;

export function ScheduleFormDrawer({
  visible,
  onClose,
  scheduleId = null,
}: ScheduleFormDrawerProps) {
  const { colors, isDark } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const customer = useAppSelector((state) => state.customer);
  const isPremium = customer.is_premium;
  const { coords } = useCurrentLocation();
  const todayDate = new Date();
  const todayYear = todayDate.getFullYear();
  const todayMonth = todayDate.getMonth();
  const todayDay = todayDate.getDate();
  const todayStart = new Date(todayYear, todayMonth, todayDay, 0, 0, 0, 0);
  const isEditMode = !!scheduleId;

  const { data: scheduleData } = useSchedules();
  const invalidateSchedules = useInvalidateSchedules();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nearbyDrivers, setNearbyDrivers] = useState<NearbyDriver[]>([]);
  const [driversLoading, setDriversLoading] = useState(false);

  const [driverListOpen, setDriverListOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedPickup, setSelectedPickup] = useState<PickupLocation | null>(
    null,
  );
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [frequencyOpen, setFrequencyOpen] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState("One time pickup");

  // The calendar is rendered as a centered overlay (see render below)
  // rather than a popup anchored to the date button's measured on-screen
  // position — anchored positioning depended on a one-off
  // `.measureInWindow()` call plus a hardcoded pixel offset tuned for one
  // screen size, which could put the popup somewhere unexpected on a
  // different device (and, since it floats outside the ScrollView, could
  // end up visually covering fields like Start Time/End Time). A centered
  // overlay has no such positioning to get wrong.
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarYear, setCalendarYear] = useState(todayDate.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(todayDate.getMonth());
  const [selectedDate, setSelectedDate] = useState<SelectedDate | null>(null);

  const canPrevMonth =
    calendarYear > todayYear ||
    (calendarYear === todayYear && calendarMonth > todayMonth);

  const [timePickerFor, setTimePickerFor] = useState<"start" | "end" | null>(
    null,
  );
  const [pickerAnchor, setPickerAnchor] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const hourRef = useRef(5);
  const minuteRef = useRef(0);
  const periodRef = useRef(0);

  const [formPopulated, setFormPopulated] = useState(false);

  const sheetRef = useRef<any>(null);
  const startTimeButtonRef = useRef<any>(null);
  const endTimeButtonRef = useRef<any>(null);
  const translateY = useRef(new Animated.Value(0)).current;

  const {
    results: locationResults,
    isLoading: locationLoading,
    error: locationError,
  } = useLocationSearch(locationQuery, visible);
  const showLocationDropdown =
    locationQuery.trim().length >= 3 && !selectedPickup;
  // Position of the Location field within the fields column, used to place
  // the dropdown as the LAST child of that column (see render below) so it
  // paints on top of every field after it — Android draws overlapping
  // siblings in document order regardless of zIndex/elevation once a
  // native TextInput is involved, so a dropdown nested right after the
  // Location input still renders behind fields further down like Phone
  // Number unless it's moved to the end of the sibling list.
  const [locationFieldLayout, setLocationFieldLayout] = useState<{
    y: number;
    height: number;
  } | null>(null);

  const getPickupCoordinates = (): [number, number] => {
    if (selectedPickup) {
      return [selectedPickup.longitude, selectedPickup.latitude];
    }
    if (coords) return [coords.longitude, coords.latitude];
    return [-0.187, 5.6037];
  };

  const handleLocationSelect = (result: {
    label: string;
    latitude: number;
    longitude: number;
  }) => {
    const pickup: PickupLocation = {
      label: result.label,
      latitude: result.latitude,
      longitude: result.longitude,
    };
    setSelectedPickup(pickup);
    setLocation(result.label);
    setLocationQuery(result.label);
  };

  const handleLocationQueryChange = (text: string) => {
    setLocationQuery(text);
    setLocation(text);
    if (selectedPickup && text !== selectedPickup.label) {
      setSelectedPickup(null);
    }
  };

  const showToast = (
    message: string,
    type: "success" | "error" | "warning" | "info" = "success",
  ) => {
    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      case "warning":
        toast.warning(message);
        break;
      case "info":
        toast.info(message);
        break;
    }
  };

  const to24Hour = (hour: number, period: string) =>
    period === "PM" ? (hour === 12 ? 12 : hour + 12) : hour === 12 ? 0 : hour;

  const getScheduleDateTime = (date: Date, timeStr: string) => {
    const [timePart, period] = timeStr.split(" ");
    const [hourStr, minuteStr] = timePart.split(":");
    const hour = to24Hour(Number(hourStr), period);
    const minute = Number(minuteStr);
    const dateTime = new Date(date);
    dateTime.setHours(hour, minute, 0, 0);
    return dateTime;
  };

  const isSameLocalDate = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const getDriverById = (id: string | null) =>
    nearbyDrivers.find((driver) => driver.id === id) ?? null;

  const getEstimatedPrice = () => {
    const driver = getDriverById(selectedDriver);
    return (driver?.cost ?? 10) + SERVICE_FEE;
  };

  const fetchNearbyDrivers = async () => {
    const searchCoords = selectedPickup ?? coords;
    if (!searchCoords) return;
    setDriversLoading(true);
    try {
      const res = await driverService.getNearbyDrivers({
        lat: searchCoords.latitude,
        lng: searchCoords.longitude,
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
    if (visible) {
      translateY.setValue(0);
    }
  }, [visible]);

  useEffect(() => {
    if (visible && (selectedPickup || coords)) {
      fetchNearbyDrivers();
    }
  }, [coords, selectedPickup, isPremium, visible]);

  useEffect(() => {
    if (!visible || !isEditMode || !scheduleId || formPopulated) return;

    const populateForm = async () => {
      const item = scheduleData?.find((s: ScheduleItem) => s.id === scheduleId);
      if (item) {
        const rawYear = item.rawYear ?? todayDate.getFullYear();
        const rawMonth = item.rawMonth ?? todayDate.getMonth();

        setSelectedDriver(item.driverId ?? null);
        setLocation(item.location ?? "");
        setLocationQuery(item.location ?? "");
        setStartTime(item.rawStartTime ?? "");
        setEndTime(item.rawEndTime ?? "");
        setSelectedFrequency(item.frequency ?? "One time pickup");
        setCalendarYear(rawYear);
        setCalendarMonth(rawMonth);
        setSelectedDate(
          item.rawDay != null
            ? { year: rawYear, month: rawMonth, day: item.rawDay }
            : null,
        );
        setPhone("");
        setNote("");
      }

      try {
        const response = await scheduleService.getSchedule(scheduleId);
        const schedule = response?.data?.schedule;
        const coordinates = schedule?.pickup_location?.coordinates;
        if (schedule) {
          if (coordinates?.length === 2) {
            setSelectedPickup({
              label: schedule.pickup_address ?? "",
              longitude: coordinates[0],
              latitude: coordinates[1],
            });
            setLocation(schedule.pickup_address ?? "");
            setLocationQuery(schedule.pickup_address ?? "");
          }

          if (schedule.start_time) {
            setStartTime(schedule.start_time);
          }
          if (schedule.end_time) {
            setEndTime(schedule.end_time);
          }
        }
      } catch (error) {
        console.error("Failed to load schedule location:", error);
      }

      setFormPopulated(true);
    };

    populateForm();
  }, [isEditMode, scheduleId, scheduleData, formPopulated, visible]);

  const resetForm = () => {
    setSelectedDriver(null);
    setLocation("");
    setLocationQuery("");
    setSelectedPickup(null);
    setPhone("");
    setNote("");
    setStartTime("");
    setEndTime("");
    setSelectedDate(null);
    setSelectedFrequency("One time pickup");
    setFormPopulated(false);
    setDriverListOpen(false);
    setSearchMode(false);
    setSearchQuery("");
    setFrequencyOpen(false);
    setCalendarOpen(false);
    setTimePickerFor(null);
    setPickerAnchor(null);
    setCalendarYear(todayDate.getFullYear());
    setCalendarMonth(todayDate.getMonth());
  };

  useEffect(() => {
    if (!visible) {
      setFormPopulated(false);
      return;
    }
    if (!scheduleId) {
      resetForm();
    }
  }, [visible, scheduleId]);

  const updateSchedule = async () => {
    if (
      !scheduleId ||
      !selectedDriver ||
      !location ||
      !selectedDate ||
      !selectedPickup
    ) {
      showToast(
        "Please select a pickup location from the suggestions",
        "warning",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const scheduleDateObj = new Date(
        selectedDate.year,
        selectedDate.month,
        selectedDate.day,
      );
      const now = new Date();
      const startDateTime = startTime
        ? getScheduleDateTime(scheduleDateObj, startTime)
        : null;
      const endDateTime = endTime
        ? getScheduleDateTime(scheduleDateObj, endTime)
        : null;

      if (scheduleDateObj < todayStart) {
        showToast("Scheduled date cannot be in the past.", "warning");
        return;
      }

      if (
        startDateTime &&
        isSameLocalDate(scheduleDateObj, todayStart) &&
        startDateTime < now
      ) {
        showToast("Start time cannot be in the past.", "warning");
        return;
      }

      if (
        endDateTime &&
        isSameLocalDate(scheduleDateObj, todayStart) &&
        endDateTime < now
      ) {
        showToast("End time cannot be in the past.", "warning");
        return;
      }

      if (startDateTime && endDateTime && endDateTime <= startDateTime) {
        showToast("End time must be after start time.", "warning");
        return;
      }

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
        scheduled_date: toLocalDateString(
          selectedDate.year,
          selectedDate.month,
          selectedDate.day,
        ),
        start_time: startTime || null,
        end_time: endTime || null,
        estimated_price: getEstimatedPrice(),
      };

      const response = await scheduleService.updateSchedule(
        scheduleId,
        payload,
      );

      if (response.success) {
        resetForm();
        onClose();
        showToast("Schedule updated successfully", "success");
        void invalidateSchedules();
      }
    } catch (error: any) {
      console.error("Error updating schedule:", error);
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSchedule =
    !!selectedDriver && !!location && !!selectedDate && !!selectedPickup;

  const closeOverlays = () => {
    setFrequencyOpen(false);
    setCalendarOpen(false);
    setTimePickerFor(null);
    setPickerAnchor(null);
    setDriverListOpen(false);
  };

  const openCalendar = () => {
    setFrequencyOpen(false);
    setDriverListOpen(false);
    setTimePickerFor(null);
    setPickerAnchor(null);
    setCalendarOpen(true);
  };

  const measureAnchor = (
    targetRef: React.RefObject<any>,
    onDone: (anchor: { top: number; left: number; width: number }) => void,
  ) => {
    if (!targetRef.current || !sheetRef.current) return;
    targetRef.current.measureInWindow((x: number, y: number, width: number) => {
      sheetRef.current?.measureInWindow((sx: number, sy: number) => {
        onDone({ top: y - sy, left: x - sx, width });
      });
    });
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

    const targetRef = which === "start" ? startTimeButtonRef : endTimeButtonRef;
    measureAnchor(targetRef, (anchor) => {
      setPickerAnchor(anchor);
      setTimePickerFor(which);
    });
  };

  const applyPickerTime = () => {
    const timeStr = `${HOURS[hourRef.current]}:${MINUTES[minuteRef.current]} ${PERIODS[periodRef.current]}`;
    if (timePickerFor === "start") setStartTime(timeStr);
    else setEndTime(timeStr);
    setTimePickerFor(null);
    setPickerAnchor(null);
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

  const dateLabel = selectedDate
    ? `${MONTH_NAMES[selectedDate.month].slice(0, 3)} ${selectedDate.day}`
    : "Today";
  const calendarDays = getCalendarDays(calendarYear, calendarMonth);

  const selectedDriverInfo = getDriverById(selectedDriver);
  const driverRating = selectedDriverInfo?.rating ?? "";

  const handleClose = () => {
    closeOverlays();
    setDriverListOpen(false);
    onClose();
  };

  const snapSheetBack = () => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 4,
    }).start();
  };

  const dismissSheetByDrag = () => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      handleClose();
    });
  };

  const dragPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: (_, gesture) =>
      !isSubmitting &&
      gesture.dy > 6 &&
      Math.abs(gesture.dy) > Math.abs(gesture.dx),
    onPanResponderMove: (_, gesture) => {
      if (gesture.dy > 0) {
        translateY.setValue(gesture.dy);
      }
    },
    onPanResponderRelease: (_, gesture) => {
      if (
        gesture.dy > DRAG_DISMISS_DISTANCE ||
        gesture.vy > DRAG_DISMISS_VELOCITY
      ) {
        dismissSheetByDrag();
      } else {
        snapSheetBack();
      }
    },
    onPanResponderTerminate: snapSheetBack,
  });

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={handleClose}
      >
        <View className="flex-1 bg-[rgba(69,71,69,0.15)] justify-end">
          <Pressable
            className="absolute top-0 left-0 right-0 bottom-0"
            onPress={handleClose}
          />

          <Animated.View
            style={{ transform: [{ translateY }], maxHeight: "82%" }}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flexShrink: 1, minHeight: 0 }}
            >
              <SafeAreaView
                ref={sheetRef}
                edges={["bottom"]}
                style={{ backgroundColor: colors.bg, flexShrink: 1, minHeight: 0 }}
                className="rounded-t-[32px] pt-4 pb-2 relative"
              >
                <View {...dragPanResponder.panHandlers}>
                  <View
                    style={{ backgroundColor: colors.textMuted }}
                    className="w-[152px] h-[3px] rounded-[20px] self-center"
                  />

                  <View className="flex-row justify-between items-center px-6 mt-6">
                    <Text
                      style={{ color: colors.text }}
                      className="text-lg font-medium tracking-[-0.54px]"
                    >
                      {isEditMode ? "Edit schedule" : "Schedule details"}
                    </Text>
                    <Pressable
                      style={{ borderColor: colors.border }}
                      className="flex-row items-center gap-2 px-3 py-1.5 border rounded-full"
                      onPress={() => {
                        setFrequencyOpen((v) => !v);
                        setCalendarOpen(false);
                        setDriverListOpen(false);
                        setTimePickerFor(null);
                        setPickerAnchor(null);
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
                </View>

                  <ScrollView
                    className="shrink"
                    style={{ minHeight: 0 }}
                    showsVerticalScrollIndicator={false}
                    contentContainerClassName="gap-4 pb-6 pt-4"
                    keyboardShouldPersistTaps="handled"
                    onScrollBeginDrag={closeOverlays}
                  >
                    <View className="px-6 gap-4 w-full" style={{ position: "relative" }}>
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
                              color={isDark ? APP_DARK.statusErrorText : "#EF4444"}
                            />
                          </Pressable>
                        </View>
                      ) : (
                        <Pressable
                          className="flex-row items-center justify-center gap-2 h-12 rounded-full"
                          style={{
                            backgroundColor: isDark
                              ? APP_DARK.buttonPrimaryBg
                              : "#31973D",
                            opacity: isSubmitting ? 0.8 : 1,
                          }}
                          onPress={() => {
                            closeOverlays();
                            setDriverListOpen(true);
                          }}
                          disabled={isSubmitting}
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

                      {driverListOpen && (
                        <Pressable
                          style={{
                            position: "absolute",
                            top: -1000,
                            left: -1000,
                            right: -1000,
                            bottom: -1000,
                            zIndex: 40,
                          }}
                          onPress={() => setDriverListOpen(false)}
                        />
                      )}

                      {driverListOpen && (
                        <View
                          className="absolute left-6 right-6 top-12 border rounded-3xl p-2 z-50"
                          style={{
                            borderColor: colors.border,
                            backgroundColor: colors.bg,
                            shadowColor: "rgba(69,71,69,0.15)",
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 1,
                            shadowRadius: 20,
                            elevation: 24,
                            zIndex: 100,
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
                                style={{ color: colors.text }}
                                className="flex-1 text-[13px] p-0 outline-none"
                                placeholder="search driver by name, unique...."
                                placeholderTextColor={
                                  isDark ? APP_DARK.textMuted : "#94A3B7"
                                }
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
                                <Text
                                  style={{
                                    color: isDark
                                      ? APP_DARK.statusInfoText
                                      : "rgba(14,90,142,0.7)",
                                  }}
                                  className="text-[11px] font-medium underline"
                                >
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
                                <ActivityIndicator
                                  color={
                                    isDark ? APP_DARK.accentGreen : "#31973D"
                                  }
                                />
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
                                    style={{
                                      backgroundColor:
                                        selectedDriver === driver.id
                                          ? colors.borderLight
                                          : "transparent",
                                    }}
                                    className="flex-row items-center justify-between px-3 py-2 h-[34px] rounded-2xl mb-1"
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

                      <View
                        className="gap-1"
                        onLayout={(e) =>
                          setLocationFieldLayout({
                            y: e.nativeEvent.layout.y,
                            height: e.nativeEvent.layout.height,
                          })
                        }
                      >
                        <Text
                          style={{ color: colors.textSub }}
                          className="text-sm"
                        >
                          Location
                        </Text>
                        <View
                          style={{ backgroundColor: colors.surface }}
                          className="flex-row items-center h-12 rounded-3xl px-3 gap-2"
                        >
                          <MaterialCommunityIcons
                            name="magnify"
                            size={16}
                            color={colors.iconColor}
                          />
                          <TextInput
                            style={{ color: colors.text }}
                            className="flex-1 text-sm text-[#1F2A33] p-0 outline-none"
                            placeholder="Tarkwa, UMaT Campus, Hall 3"
                            placeholderTextColor={
                              isDark ? APP_DARK.textMuted : "#94A3B7"
                            }
                            value={locationQuery}
                            onChangeText={handleLocationQueryChange}
                            onFocus={closeOverlays}
                            editable={!isSubmitting}
                          />
                          {locationQuery.length > 0 && (
                            <Pressable
                              onPress={() => {
                                setLocationQuery("");
                                setLocation("");
                                setSelectedPickup(null);
                              }}
                            >
                              <MaterialCommunityIcons
                                name="close-circle-outline"
                                size={16}
                                color={isDark ? APP_DARK.statusErrorText : "#EF4444"}
                              />
                            </Pressable>
                          )}
                        </View>
                      </View>

                      <View className="gap-1">
                        <Text
                          style={{ color: colors.textSub }}
                          className="text-sm"
                        >
                          Phone Number
                        </Text>
                        <View
                          style={{ backgroundColor: colors.surface }}
                          className="flex-row items-center h-12 rounded-3xl px-3 gap-2"
                        >
                          <TextInput
                            style={{ color: colors.text }}
                            className="flex-1 text-sm p-0 outline-none"
                            placeholder="0243 50 8595"
                            placeholderTextColor={
                              isDark ? APP_DARK.textMuted : "#94A3B7"
                            }
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
                                color={isDark ? APP_DARK.statusErrorText : "#EF4444"}
                              />
                            </Pressable>
                          )}
                        </View>
                      </View>

                      <View className="gap-1">
                        <Text
                          style={{ color: colors.textSub }}
                          className="text-sm"
                        >
                          Additional note
                        </Text>
                        <TextInput
                          style={{
                            color: colors.text,
                            borderColor: colors.border,
                            backgroundColor: colors.surface,
                          }}
                          className="h-[108px] border rounded-3xl px-3 pt-3.5 text-sm"
                          placeholder="Call before arrival, waste is behind the gate etc.."
                          placeholderTextColor={
                            isDark ? APP_DARK.textMuted : "#94A3B7"
                          }
                          multiline
                          textAlignVertical="top"
                          value={note}
                          onChangeText={setNote}
                          onFocus={closeOverlays}
                          editable={!isSubmitting}
                        />
                      </View>

                      <View>
                        <Pressable
                          style={{
                            backgroundColor: colors.card,
                            opacity: isSubmitting ? 0.8 : 1,
                          }}
                          className="flex-row items-center justify-center gap-2 h-12 rounded-xl"
                          onPress={openCalendar}
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
                      </View>

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
                          <View style={{ flex: 1 }}>
                            <Pressable
                              ref={startTimeButtonRef}
                              style={{
                                borderColor: colors.border,
                                opacity: isSubmitting ? 0.8 : 1,
                              }}
                              className="min-w-0 h-12 border rounded-3xl px-4 flex-row items-center"
                              onPress={() => openTimePicker("start")}
                              disabled={isSubmitting}
                            >
                              <Text
                                style={{color: startTime ? colors.text : colors.textSub}}
                                className={`text-sm`}
                              >
                                {startTime || "00:00"}
                              </Text>
                            </Pressable>
                          </View>
                          <View
                            style={{
                              backgroundColor: isDark
                                ? APP_DARK.accentGreen
                                : "#31973D",
                            }}
                            className="w-6 h-6 shrink-0 rounded-xl items-center justify-center"
                          >
                            <MaterialCommunityIcons
                              name="arrow-right"
                              size={16}
                              color="#FFFFFF"
                            />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Pressable
                              ref={endTimeButtonRef}
                              style={{
                                borderColor: colors.border,
                                opacity: isSubmitting ? 0.8 : 1,
                              }}
                              className="min-w-0 h-12 border rounded-3xl px-4 flex-row items-center"
                              onPress={() => openTimePicker("end")}
                              disabled={isSubmitting}
                            >
                              <Text
                                style={{color: startTime ? colors.text : colors.textSub}}
                                className={`text-sm`}
                              >
                                {endTime || "00:00"}
                              </Text>
                            </Pressable>
                          </View>
                        </View>
                      </View>

                      {/* Rendered as the LAST child of this fields column
                          (not nested right after the Location input) so it
                          paints on top of every field below it — Android
                          draws overlapping siblings in document order once
                          a native TextInput is involved, regardless of
                          zIndex/elevation. Only mounted while it should
                          actually be visible, since an always-mounted
                          absolute+elevated View (even rendering nothing)
                          risks swallowing touch/scroll gestures. */}
                      {locationFieldLayout && showLocationDropdown && (
                        <View
                          style={{
                            pointerEvents: "box-none",
                            position: "absolute",
                            left: 0,
                            right: 0,
                            top: locationFieldLayout.y + locationFieldLayout.height + 4,
                            height: 0,
                            overflow: "visible",
                            zIndex: 50,
                            elevation: 20,
                          }}
                        >
                          <LocationSearchDropdown
                            visible={showLocationDropdown}
                            results={locationResults}
                            loading={locationLoading}
                            error={locationError}
                            onSelect={handleLocationSelect}
                          />
                        </View>
                      )}
                    </View>
                  </ScrollView>

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
                        className="px-3 py-[9px] rounded-[14px]"
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

                {timePickerFor !== null && pickerAnchor && (
                  <>
                    <Pressable
                      style={{
                        position: "absolute",
                        top: -1000,
                        left: -1000,
                        right: -1000,
                        bottom: -1000,
                        zIndex: 200,
                      }}
                      onPress={() => {
                        setTimePickerFor(null);
                        setPickerAnchor(null);
                      }}
                    />
                    <View
                      style={{
                        position: "absolute",
                        top: pickerAnchor.top - TIME_PICKER_HOVER_OFFSET,
                        left: pickerAnchor.left,
                        width: pickerAnchor.width,
                        borderWidth: 1,
                        borderColor: colors.border,
                        borderRadius: 24,
                        backgroundColor: colors.card,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.08,
                        shadowRadius: 16,
                        elevation: 220,
                        zIndex: 201,
                      }}
                      className="p-3"
                    >
                      <Text
                        style={{ color: colors.text }}
                        className="text-sm font-medium tracking-[-0.42px] pb-2"
                      >
                        Select time
                      </Text>
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
                      <Pressable
                        className="h-10 rounded-2xl items-center justify-center mt-2"
                        onPress={applyPickerTime}
                        disabled={isSubmitting}
                        style={{
                          backgroundColor: isDark
                            ? APP_DARK.buttonPrimaryBg
                            : "#31973D",
                          opacity: isSubmitting ? 0.8 : 1,
                        }}
                      >
                        <Text className="text-sm text-white">Done</Text>
                      </Pressable>
                    </View>
                  </>
                )}

                <View className="flex-row items-center px-6 gap-2.5 pb-6">
                  <Pressable
                    className="w-9 h-9 rounded-xl items-center justify-center"
                    style={{
                      backgroundColor: isDark
                        ? APP_DARK.statusErrorBg
                        : "#FFE2E2",
                    }}
                    onPress={handleClose}
                    disabled={isSubmitting}
                  >
                    <MaterialCommunityIcons
                      name="close"
                      size={16}
                      color={isDark ? APP_DARK.statusErrorText : "#EF4444"}
                    />
                  </Pressable>
                  <Pressable
                    className="flex-1 h-12 rounded-full items-center justify-center"
                    disabled={!canSchedule || isSubmitting}
                    style={{
                      backgroundColor: isDark
                        ? APP_DARK.buttonPrimaryBg
                        : canSchedule
                          ? "#31973D"
                          : "rgba(52,168,83,0.5)",
                      opacity: isSubmitting || !canSchedule ? 0.8 : 1,
                    }}
                    onPress={() => {
                      if (isEditMode) {
                        updateSchedule();
                        return;
                      }
                      if (!selectedDriver || !selectedDate) return;
                      const params = {
                        driverId: selectedDriver,
                        driverName: selectedDriverInfo?.name ?? "Driver",
                        driverRating,
                        pickupAddress: location,
                        pickupCoordinates: getPickupCoordinates(),
                        phone: phone || null,
                        note: note || null,
                        frequency: frequencyMap[selectedFrequency] || "one_time",
                        year: selectedDate.year,
                        month: selectedDate.month,
                        day: selectedDate.day,
                        startTime: startTime || null,
                        endTime: endTime || null,
                        estimatedPrice: getEstimatedPrice(),
                      };
                      onClose();
                      navigation.navigate("ConfirmSchedule", params);
                    }}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <Text className="text-sm text-white ">
                        {isEditMode ? "Save" : "Schedule"}
                      </Text>
                    )}
                  </Pressable>
                </View>
              </SafeAreaView>
            </KeyboardAvoidingView>
          </Animated.View>

          {/* Calendar — a plain overlay rendered INSIDE this same Modal
              (not a separate native Modal) so it can't trigger the
              multi-Modal-stacking issues on Android that made the whole
              sheet unresponsive; centered on screen instead of anchored to
              the date button's measured position. */}
          {calendarOpen && (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 24,
              }}
            >
              <Pressable
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0,0,0,0.4)",
                }}
                onPress={() => setCalendarOpen(false)}
              />
              <View
            style={{
              width: "100%",
              maxWidth: 360,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 24,
              backgroundColor: colors.bg,
            }}
            className="p-4"
          >
            <View className="flex-row justify-between items-center pb-3">
              <Text
                style={{ color: colors.text }}
                className="text-base font-semibold"
              >
                {MONTH_NAMES[calendarMonth]} {calendarYear}
              </Text>
              <View className="flex-row items-center gap-1">
                <Pressable
                  onPress={canPrevMonth ? prevMonth : undefined}
                  className={`p-1 ${!canPrevMonth ? "opacity-40" : ""}`}
                  disabled={!canPrevMonth}
                >
                  <MaterialCommunityIcons
                    name="chevron-left"
                    size={20}
                    color={colors.iconColor}
                  />
                </Pressable>
                <Pressable onPress={nextMonth} className="p-1">
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color={colors.iconColor}
                  />
                </Pressable>
              </View>
            </View>
            <View className="flex-row justify-between mb-1">
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
                      !!selectedDate &&
                      selectedDate.year === calendarYear &&
                      selectedDate.month === calendarMonth &&
                      cell.day === selectedDate.day;
                    const isPastDate =
                      cell.currentMonth &&
                      (calendarYear < todayYear ||
                        (calendarYear === todayYear &&
                          calendarMonth < todayMonth) ||
                        (calendarYear === todayYear &&
                          calendarMonth === todayMonth &&
                          cell.day < todayDay));
                    const isDisabled = !cell.currentMonth || isPastDate;
                    const isSelectable = cell.currentMonth && !isDisabled;
                    return (
                      <Pressable
                        key={col}
                        className="flex-1 items-center justify-center h-9 rounded-[7px]"
                        onPress={() => {
                          if (isDisabled) return;
                          setSelectedDate({
                            year: calendarYear,
                            month: calendarMonth,
                            day: cell.day,
                          });
                          setCalendarOpen(false);
                        }}
                        disabled={isDisabled || isSubmitting}
                        style={{
                          backgroundColor: isSelected
                            ? isDark
                              ? APP_DARK.buttonPrimaryBg
                              : "#31973D"
                            : "transparent",
                          opacity: isDisabled ? 0.4 : 1,
                          borderWidth: isToday && !isSelected ? 1 : 0,
                          borderColor:
                            isToday && !isSelected
                              ? isDark
                                ? APP_DARK.accentGreen
                                : "#31973D"
                              : "transparent",
                        }}
                      >
                        <Text
                          style={{
                            color: isSelected
                              ? "#FFFFFF"
                              : isSelectable
                                ? colors.text
                                : colors.textSub,
                          }}
                          className={`text-sm ${
                            isSelectable || isSelected
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
            </View>
          )}

        </View>
      </Modal>
    </>
  );
}
