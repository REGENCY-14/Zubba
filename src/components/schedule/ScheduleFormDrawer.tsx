import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { TimePickerColumn } from "./TimePickerColumn";
import { useTheme } from "../../context/ThemeContext";
import { useAppSelector } from "../../hooks/useAppSelector";
import { scheduleService } from "../../api/scheduleService";
import { handleApiError } from "../../utils/handleApiError";
import { toast } from "../../hooks/toast";
import { useCurrentLocation } from "../../hooks/useCurrentLocation";
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

const avatar = require("../../../assets/avatar.jpg");

type ScheduleFormDrawerProps = {
  visible: boolean;
  onClose: () => void;
  scheduleId?: string | null;
};

export function ScheduleFormDrawer({
  visible,
  onClose,
  scheduleId = null,
}: ScheduleFormDrawerProps) {
  const { colors } = useTheme();
  const customer = useAppSelector((state) => state.customer);
  const isPremium = customer.is_premium;
  const { coords } = useCurrentLocation();
  const todayDate = new Date();
  const isEditMode = !!scheduleId;

  const { data: scheduleData } = useSchedules();
  const invalidateSchedules = useInvalidateSchedules();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nearbyDrivers, setNearbyDrivers] = useState<NearbyDriver[]>([]);
  const [driversLoading, setDriversLoading] = useState(false);

  const [driverListOpen, setDriverListOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [frequencyOpen, setFrequencyOpen] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState("One time pickup");

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarYear, setCalendarYear] = useState(todayDate.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(todayDate.getMonth());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const [timePickerFor, setTimePickerFor] = useState<"start" | "end" | null>(
    null,
  );
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const hourRef = useRef(5);
  const minuteRef = useRef(0);
  const periodRef = useRef(0);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [formPopulated, setFormPopulated] = useState(false);

  const getPickupCoordinates = (): [number, number] => {
    if (coords) return [coords.longitude, coords.latitude];
    return [-0.187, 5.6037];
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
    if (visible && coords) {
      fetchNearbyDrivers();
    }
  }, [coords, isPremium, visible]);

  useEffect(() => {
    if (!visible || !isEditMode || !scheduleId || !scheduleData || formPopulated) return;
    const item = scheduleData.find((s: ScheduleItem) => s.id === scheduleId);
    if (!item) return;

    setSelectedDriver(item.driverId ?? null);
    setLocation(item.location);
    setStartTime(item.rawStartTime);
    setEndTime(item.rawEndTime);
    setSelectedFrequency(item.frequency);
    setCalendarYear(item.rawYear);
    setCalendarMonth(item.rawMonth);
    setSelectedDate(item.rawDay);
    setPhone("");
    setNote("");
    setFormPopulated(true);
  }, [isEditMode, scheduleId, scheduleData, formPopulated, visible]);

  const resetForm = () => {
    setSelectedDriver(null);
    setLocation("");
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
    setConfirmOpen(false);
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

  const createSchedule = async () => {
    if (!selectedDriver || !location || !selectedDate) {
      showToast("Please fill all required fields", "warning");
      return;
    }

    setIsSubmitting(true);

    try {
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
        scheduled_date: toLocalDateString(calendarYear, calendarMonth, selectedDate),
        start_time: startTime || null,
        end_time: endTime || null,
        estimated_price: getEstimatedPrice(),
      };

      const response = await scheduleService.createSchedule(payload);

      if (response.success) {
        showToast("Schedule created successfully", "success");
        await invalidateSchedules();
        setConfirmOpen(false);
        resetForm();
        onClose();
      }
    } catch (error: any) {
      console.error("Error creating schedule:", error);
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateSchedule = async () => {
    if (!scheduleId || !selectedDriver || !location || !selectedDate) {
      showToast("Please fill all required fields", "warning");
      return;
    }

    setIsSubmitting(true);

    try {
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
        scheduled_date: toLocalDateString(calendarYear, calendarMonth, selectedDate),
        start_time: startTime || null,
        end_time: endTime || null,
        estimated_price: getEstimatedPrice(),
      };

      const response = await scheduleService.updateSchedule(
        scheduleId,
        payload,
      );

      if (response.success) {
        showToast("Schedule updated successfully", "success");
        await invalidateSchedules();
        resetForm();
        onClose();
      }
    } catch (error: any) {
      console.error("Error updating schedule:", error);
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
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

  const handleClose = () => {
    closeOverlays();
    setDriverListOpen(false);
    onClose();
  };

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

          <SafeAreaView
            edges={["bottom"]}
            style={{ backgroundColor: colors.bg }}
            className="rounded-t-[32px] pt-4 pb-2 h-[82%] justify-between relative"
          >
            <ScrollView
              className="flex-1"
              showsVerticalScrollIndicator={false}
              contentContainerClassName="gap-4 pb-6"
              keyboardShouldPersistTaps="handled"
              scrollEnabled={timePickerFor === null}
            >
              <View
                style={{ backgroundColor: colors.textMuted }}
                className="w-[152px] h-[3px] rounded-[20px] self-center"
              />

              <View className="flex-row justify-between items-center px-6">
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

          <View className="px-6 gap-4 w-full">
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
                    selectedFrequency === freq ? "font-medium" : "font-normal"
                  }`}
                >
                  {freq}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

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
                {calendarDays.slice(row * 7, row * 7 + 7).map((cell, col) => {
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
            <Text
              style={{ color: colors.text }}
              className="text-sm font-medium tracking-[-0.42px] px-1"
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
              className="h-10 bg-[#31973D] rounded-2xl items-center justify-center"
              onPress={applyPickerTime}
              disabled={isSubmitting}
              style={{ opacity: isSubmitting ? 0.8 : 1 }}
            >
              <Text className="text-sm text-white ">Done</Text>
            </Pressable>
          </View>
        )}

        <View className="flex-row items-center px-6 gap-2.5 pb-6">
          <Pressable
            className="w-8 h-8 rounded-xl bg-[#FFE2E2] items-center justify-center"
            onPress={handleClose}
            disabled={isSubmitting}
          >
            <MaterialCommunityIcons name="close" size={16} color="#EF4444" />
          </Pressable>
          <Pressable
            className={`flex-1 h-10 rounded-full items-center justify-center ${
              canSchedule ? "bg-[#31973D]" : "bg-[rgba(52,168,83,0.5)]"
            }`}
            disabled={!canSchedule || isSubmitting}
            style={{ opacity: isSubmitting || !canSchedule ? 0.8 : 1 }}
            onPress={() => {
              if (isEditMode) {
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
                {isEditMode ? "Save" : "Schedule"}
              </Text>
            )}
          </Pressable>
        </View>
          </SafeAreaView>
        </View>
      </Modal>

      <Modal
        visible={confirmOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmOpen(false)}
      >
        <View className="flex-1 bg-[rgba(0,0,0,0.65)] items-center justify-center px-5">
          <View className="w-[335px] rounded-[48px] overflow-hidden bg-[#A2C2E6]">
            <View className="absolute -top-[60px] -left-[60px] w-[240px] h-[240px] rounded-[120px] bg-[#ADCCEB]" />
            <View className="absolute -top-[60px] -right-[60px] w-[240px] h-[240px] rounded-[120px] bg-[#F9AC86]" />
            <View className="absolute -bottom-[60px] -right-[60px] w-[240px] h-[240px] rounded-[120px] bg-[#D5B3E6]" />
            <View className="absolute -bottom-[60px] -left-[60px] w-[240px] h-[240px] rounded-[120px] bg-[#BEEBF4]" />

            <View className="mt-[105px] mx-6 mb-6 bg-white rounded-[40px] p-5 gap-4">
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
    </>
  );
}
