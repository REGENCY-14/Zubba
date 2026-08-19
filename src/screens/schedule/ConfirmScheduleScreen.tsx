import { useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";
import { APP_DARK } from "../../constants/appDarkTheme";
import { scale, verticalScale, moderateScale } from "../../utils/scale";
import { MONTH_NAMES } from "../../constants/scheduleConstants";
import { scheduleService } from "../../api/scheduleService";
import { handleApiError } from "../../utils/handleApiError";
import { toast } from "../../hooks/toast";
import { useInvalidateSchedules } from "../../hooks/useSchedules";

const avatar = require("../../../assets/avatar.jpg");

const to24Hour = (hour: number, period: string) =>
  period === "PM" ? (hour === 12 ? 12 : hour + 12) : hour === 12 ? 0 : hour;

function getScheduleDateTime(date: Date, timeStr: string) {
  const [timePart, period] = timeStr.split(" ");
  const [hourStr, minuteStr] = timePart.split(":");
  const hour = to24Hour(Number(hourStr), period);
  const minute = Number(minuteStr);
  const dateTime = new Date(date);
  dateTime.setHours(hour, minute, 0, 0);
  return dateTime;
}

function isSameLocalDate(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function fmtTime(t?: string | null) {
  if (!t) return "";
  const normalized = t.trim();
  const hasSpace = normalized.includes(" ");
  const [timePart, period] = hasSpace ? normalized.split(/\s+/) : [normalized, ""];
  const [h, m] = timePart.split(":");
  if (!h || !m) return normalized;
  const hour = Number.parseInt(h, 10);
  if (!Number.isFinite(hour)) return normalized;
  return `${hour}:${m}${period ? period.toLowerCase() : ""}`;
}

function toLocalDateString(year: number, month: number, day: number) {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

export function ConfirmScheduleScreen({
  route,
  navigation,
}: RootStackScreenProps<"ConfirmSchedule">) {
  const { colors, isDark } = useTheme();
  const invalidateSchedules = useInvalidateSchedules();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    driverId,
    driverName,
    driverRating,
    pickupAddress,
    pickupCoordinates,
    phone,
    note,
    frequency,
    year,
    month,
    day,
    startTime,
    endTime,
    estimatedPrice,
  } = route.params;

  const scheduleDateObj = new Date(year, month, day);
  const confirmDate = (() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return `${days[scheduleDateObj.getDay()]}, ${scheduleDateObj.getDate()} ${MONTH_NAMES[scheduleDateObj.getMonth()].slice(0, 3)} ${scheduleDateObj.getFullYear()}`;
  })();
  const confirmTimeRange =
    startTime || endTime
      ? [startTime && fmtTime(startTime), endTime && fmtTime(endTime)]
          .filter(Boolean)
          .join(" - ")
      : "";

  const handleConfirm = async () => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startDateTime = startTime ? getScheduleDateTime(scheduleDateObj, startTime) : null;
    const endDateTime = endTime ? getScheduleDateTime(scheduleDateObj, endTime) : null;

    if (scheduleDateObj < todayStart) {
      toast.warning("Scheduled date cannot be in the past.");
      return;
    }
    if (startDateTime && isSameLocalDate(scheduleDateObj, todayStart) && startDateTime < now) {
      toast.warning("Start time cannot be in the past.");
      return;
    }
    if (endDateTime && isSameLocalDate(scheduleDateObj, todayStart) && endDateTime < now) {
      toast.warning("End time cannot be in the past.");
      return;
    }
    if (startDateTime && endDateTime && endDateTime <= startDateTime) {
      toast.warning("End time must be after start time.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await scheduleService.createSchedule({
        driver_id: driverId,
        pickup_address: pickupAddress,
        pickup_location: { type: "Point", coordinates: pickupCoordinates },
        phone,
        note,
        frequency,
        scheduled_date: toLocalDateString(year, month, day),
        start_time: startTime,
        end_time: endTime,
        estimated_price: estimatedPrice,
      });

      if (response.success) {
        toast.success("Schedule created successfully");
        void invalidateSchedules();
        navigation.navigate("Schedule");
      }
    } catch (error) {
      console.error("Error creating schedule:", error);
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: isDark ? APP_DARK.bg : colors.bg }}
      edges={["top", "left", "right", "bottom"]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: scale(16),
          height: verticalScale(48),
        }}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          style={{ width: moderateScale(32), height: moderateScale(32), alignItems: "center", justifyContent: "center" }}
        >
          <MaterialCommunityIcons name="chevron-left" size={moderateScale(24)} color={colors.text} />
        </Pressable>
        <Text
          style={{ flex: 1, textAlign: "center", marginRight: moderateScale(32), color: colors.text }}
          className="text-base font-semibold"
        >
          Confirm schedule
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: moderateScale(20), gap: verticalScale(20) }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="items-center gap-2 pt-2">
          <View
            className="w-16 h-16 rounded-full items-center justify-center"
            style={{
              backgroundColor: isDark ? APP_DARK.statusSuccessBg : "rgba(49,151,61,0.1)",
            }}
          >
            <MaterialCommunityIcons
              name="calendar-clock-outline"
              size={30}
              color={isDark ? APP_DARK.accentGreen : "#31973D"}
            />
          </View>
          <Text
            className="text-xl font-bold font-['Poppins'] text-center"
            style={{ color: colors.text }}
          >
            Confirm your schedule
          </Text>
          <Text
            className="text-sm text-center font-['Poppins']"
            style={{ color: colors.textSub }}
          >
            Review the details below before you confirm
          </Text>
        </View>

        {/* Driver row */}
        <View
          className="flex-row items-center gap-3 rounded-2xl border p-3"
          style={{
            backgroundColor: isDark ? APP_DARK.card : colors.surface,
            borderColor: isDark ? APP_DARK.border : colors.borderLight,
          }}
        >
          <Image
            source={avatar}
            style={{
              width: 44,
              height: 44,
              borderColor: isDark ? APP_DARK.accentGreen : "#90FA96",
            }}
            className="rounded-full border-2"
            resizeMode="cover"
          />
          <View className="flex-1 gap-0.5">
            <Text className="text-sm font-semibold font-['Poppins']" style={{ color: colors.text }}>
              {driverName}
            </Text>
            <View className="flex-row items-center gap-1">
              <MaterialCommunityIcons name="star" size={12} color="#FEC002" />
              <Text className="text-xs font-['Poppins']" style={{ color: colors.textSub }}>
                {driverRating || "—"} rating
              </Text>
            </View>
          </View>
          <Text className="text-base font-bold font-['Poppins']" style={{ color: colors.text }}>
            GHS {estimatedPrice.toFixed(2)}
          </Text>
        </View>

        {/* Schedule summary */}
        <View
          className="rounded-2xl border overflow-hidden"
          style={{ borderColor: isDark ? APP_DARK.border : colors.borderLight }}
        >
          <Text
            className="text-xs font-semibold font-['Poppins'] px-4 pt-3 pb-2"
            style={{ color: colors.textSub }}
          >
            Schedule Summary
          </Text>
          <View
            className="flex-row justify-between items-center px-4 py-2.5"
            style={{ borderTopWidth: 1, borderTopColor: isDark ? APP_DARK.border : colors.borderLight }}
          >
            <Text className="text-xs font-['Poppins']" style={{ color: colors.textSub }}>Date</Text>
            <Text className="text-xs font-medium font-['Poppins']" style={{ color: colors.text }}>{confirmDate}</Text>
          </View>
          <View
            className="flex-row justify-between items-center px-4 py-2.5"
            style={{ borderTopWidth: 1, borderTopColor: isDark ? APP_DARK.border : colors.borderLight }}
          >
            <Text className="text-xs font-['Poppins']" style={{ color: colors.textSub }}>Time</Text>
            <Text className="text-xs font-medium font-['Poppins']" style={{ color: colors.text }}>{confirmTimeRange}</Text>
          </View>
          {pickupAddress ? (
            <View
              className="flex-row justify-between items-center px-4 py-2.5"
              style={{ borderTopWidth: 1, borderTopColor: isDark ? APP_DARK.border : colors.borderLight }}
            >
              <Text className="text-xs font-['Poppins']" style={{ color: colors.textSub }}>Location</Text>
              <Text
                className="text-xs font-medium font-['Poppins'] flex-1 text-right"
                numberOfLines={2}
                style={{ color: colors.text }}
              >
                {pickupAddress}
              </Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={{ paddingHorizontal: moderateScale(20), paddingBottom: verticalScale(16), gap: verticalScale(8) }}>
        <Pressable
          className="h-12 rounded-full items-center justify-center"
          onPress={handleConfirm}
          disabled={isSubmitting}
          style={{
            backgroundColor: isDark ? APP_DARK.buttonPrimaryBg : "#31973D",
            opacity: isSubmitting ? 0.8 : 1,
          }}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text className="text-sm font-semibold text-white">Schedule</Text>
          )}
        </Pressable>
        <Text
          className="text-xs text-center font-['Poppins']"
          style={{ color: isDark ? APP_DARK.accentGreen : "#31973D" }}
        >
          You can cancel or reschedule anytime before pickup
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default ConfirmScheduleScreen;
