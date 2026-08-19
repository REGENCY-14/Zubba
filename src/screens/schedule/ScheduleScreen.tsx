import React, { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";

import type { RootStackScreenProps } from "../../navigation/types";
import { AppBottomNav } from "../../components";
import AnimatedSwitch from "../../components/ui/inputs/AnimatedSwitch";
import { useTheme } from "../../context/ThemeContext";
import { APP_DARK } from "../../constants/appDarkTheme";
import { useAppSelector } from "../../hooks/useAppSelector";
import { scheduleService } from "../../api/scheduleService";
import { handleApiError } from "../../utils/handleApiError";
import { toast } from "../../hooks/toast";
import { moderateScale } from "../../utils/scale";
import { useCurrentLocation } from "../../hooks/useCurrentLocation";
import { binFullService, normalizeBinFullStatus } from "../../api/binFullService";
import { ScheduleListSkeleton } from "../../components/schedule/ScheduleCardSkeleton";
import { ScheduleIllustration } from "../../components/schedule/ScheduleIllustration";
import { ScheduleCard } from "../../components/schedule/ScheduleCard";
import { ScheduleFilterModal } from "../../components/schedule/ScheduleFilterModal";
import { DeleteScheduleModal } from "../../components/schedule/DeleteScheduleModal";
import { ScheduleFormDrawer } from "../../components/schedule/ScheduleFormDrawer";
import {
  useSchedules,
  useInvalidateSchedules,
  type ScheduleItem,
} from "../../hooks/useSchedules";
import { MONTH_NAMES } from "../../constants/scheduleConstants";

export function ScheduleScreen({
  navigation,
}: RootStackScreenProps<"Schedule">) {
  const { colors, isDark } = useTheme();
  const customer = useAppSelector((state) => state.customer);
  const isPremium = customer.is_premium;
  const { coords } = useCurrentLocation();
  const todayDate = new Date();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    data: scheduleData,
    isLoading: isSchedulesLoading,
    isRefetching,
    refetch,
  } = useSchedules();
  const schedules: ScheduleItem[] = scheduleData ?? [];
  const invalidateSchedules = useInvalidateSchedules();

  const [isBinFull, setIsBinFull] = useState(false);
  const [binFullLoading, setBinFullLoading] = useState(false);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editScheduleId, setEditScheduleId] = useState<string | null>(null);

  const [filterOpen, setFilterOpen] = useState(false);
  const [filterYear, setFilterYear] = useState(todayDate.getFullYear());
  const [filterMonth, setFilterMonth] = useState(todayDate.getMonth());
  const [filterPickDate, setFilterPickDate] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<{
    year: number;
    month: number;
    day: number;
  } | null>(null);

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

  useEffect(() => {
    if (!isPremium) return;
    binFullService
      .getStatus()
      .then((res) => {
        if (res.success) {
          setIsBinFull(normalizeBinFullStatus(res.data).is_active);
        }
      })
      .catch(() => {});
  }, [isPremium]);

  const handleBinFullToggle = async (value: boolean) => {
    if (!isPremium || binFullLoading) return;

    const previousValue = isBinFull;
    setIsBinFull(value);
    setBinFullLoading(true);
    try {
      let pickupLocation:
        | { type: "Point"; coordinates: [number, number] }
        | undefined;
      let pickupAddress = "Scheduled pickup";

      if (value) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const loc = await Location.getCurrentPositionAsync({});
          const longitude = loc?.coords?.longitude;
          const latitude = loc?.coords?.latitude;
          if (typeof longitude === "number" && typeof latitude === "number") {
            pickupLocation = {
              type: "Point",
              coordinates: [longitude, latitude],
            };
          }
        } else if (coords) {
          pickupLocation = {
            type: "Point",
            coordinates: [coords.longitude, coords.latitude],
          };
        }

        if (
          !pickupLocation ||
          pickupLocation.coordinates.length !== 2 ||
          pickupLocation.coordinates.some(
            (coord) => typeof coord !== "number" || Number.isNaN(coord),
          )
        ) {
          throw new Error(
            "Unable to determine your location. Please try again later.",
          );
        }
      }

      const res = await binFullService.setSignal({
        isActive: value,
        pickupAddress,
        pickupLocation,
      });

      if (!res.success) {
        throw new Error("Unable to update bin-full signal.");
      }

      const status = normalizeBinFullStatus(res.data);
      setIsBinFull(status.is_active);

      if (value) {
        if (res.data.immediateResult?.assigned) {
          showToast("Driver found! A driver has been assigned.", "success");
        } else if (status.is_active) {
          showToast("Bin-full signal enabled", "success");
        }
      } else {
        showToast("Bin-full signal disabled", "success");
      }
    } catch (err: any) {
      setIsBinFull(previousValue);
      showToast(err?.message || "Unable to update bin-full signal", "error");
    } finally {
      setBinFullLoading(false);
    }
  };

  const handleRetrySchedule = async (scheduleId: string) => {
    try {
      setIsSubmitting(true);
      const response = await scheduleService.retrySchedule(scheduleId);

      if (response.success) {
        showToast("Retrying schedule...", "info");
        await invalidateSchedules();
      }
    } catch (error: any) {
      console.error("Error retrying schedule:", error);
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = useCallback(async () => {
    setActiveFilter(null);
    await refetch();
  }, [refetch]);

  const deleteSchedule = async () => {
    if (!deleteTargetId) return;

    setIsDeleting(true);

    try {
      const response = await scheduleService.deleteSchedule(deleteTargetId);

      if (response.success) {
        showToast("Schedule deleted successfully", "success");
        setDeleteTargetId(null);
        await invalidateSchedules();
      }
    } catch (error: any) {
      console.error("Error deleting schedule:", error);
      handleApiError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const openCreateSheet = () => {
    setEditScheduleId(null);
    setSheetOpen(true);
  };

  const openEditSheet = (scheduleId: string) => {
    setEditScheduleId(scheduleId);
    setSheetOpen(true);
  };

  const closeSheet = () => {
    setSheetOpen(false);
    setEditScheduleId(null);
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

  const todayDay = todayDate.getDate();
  const todayMonth = todayDate.getMonth();
  const todayYear = todayDate.getFullYear();

  const filterLabel = activeFilter
    ? `${MONTH_NAMES[activeFilter.month].slice(0, 3)} ${activeFilter.day}`
    : "Today";

  const visibleSchedules: ScheduleItem[] = activeFilter
    ? schedules.filter(
        (s: ScheduleItem) =>
          s.rawYear === activeFilter.year &&
          s.rawMonth === activeFilter.month &&
          s.rawDay === activeFilter.day,
      )
    : schedules;

  const showSkeleton = isSchedulesLoading && schedules.length === 0;
  const showEmpty = !isSchedulesLoading && visibleSchedules.length === 0;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.bg }}
      edges={["top", "left", "right", "bottom"]}
    >
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <View className="w-full h-12 flex-row items-center justify-between px-4 z-10">
          <Pressable
            onPress={() => navigation.goBack()}
            className="w-8 h-8 items-center justify-center"
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={moderateScale(20)}
              color={colors.iconColor}
            />
          </Pressable>

          <View className="flex-row gap-2 items-center justify-center">
            {isPremium && (
              <View className="flex-row gap-2 items-center justify-center">
                <Text style={{ fontSize: moderateScale(12), color: colors.textSub }}>
                  Bin Full?
                </Text>
                <AnimatedSwitch
                  value={isBinFull}
                  onChange={handleBinFullToggle}
                  disabled={binFullLoading}
                />
              </View>
            )}
            <Pressable
              onPress={() => {
                navigation.navigate("NotificationsList");
              }}
              style={{
                width: moderateScale(40),
                height: moderateScale(40),
                padding: moderateScale(4),
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.iconBg,
                borderRadius: moderateScale(8),
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialCommunityIcons
                name="bell-outline"
                size={moderateScale(20)}
                color={colors.iconColor}
              />
            </Pressable>
          </View>
        </View>

        <View
          className="h-11 flex-row items-center justify-between px-5"
          style={{ backgroundColor: colors.surface }}
        >
          <View className="flex-row items-center gap-2">
            <Text
              className="text-sm font-medium"
              style={{ color: colors.text }}
            >
              {filterLabel}
            </Text>
            <Pressable
              style={{ backgroundColor: colors.iconBg }}
              className="w-7 h-7 rounded-xl items-center justify-center"
              onPress={openFilterSheet}
            >
              <MaterialCommunityIcons
                name="calendar"
                size={moderateScale(16)}
                color={isDark ? APP_DARK.accentGreen : "#31973D"}
              />
            </Pressable>
            <Pressable onPress={handleRefresh}>
              <MaterialCommunityIcons
                name="refresh"
                size={moderateScale(16)}
                color={colors.iconColor}
              />
            </Pressable>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            padding: 20,
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
              colors={[isDark ? APP_DARK.accentGreen : "#31973D"]}
              tintColor={isDark ? APP_DARK.accentGreen : "#31973D"}
            />
          }
          keyboardShouldPersistTaps="handled"
        >
          {showSkeleton ? (
            <ScheduleListSkeleton />
          ) : showEmpty ? (
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
          ) : (
            <Pressable onPress={() => setOpenMenuId(null)}>
              <View
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.bg,
                }}
                className="border rounded-2xl overflow-hidden"
              >
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
                <View className="gap-3 py-4">
                  {visibleSchedules.map((item: ScheduleItem, index: number) => (
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
                          openEditSheet(item.id);
                        }}
                        onDelete={() => {
                          setOpenMenuId(null);
                          setDeleteTargetId(item.id);
                        }}
                        onRetry={() => {
                          setOpenMenuId(null);
                          handleRetrySchedule(item.id);
                        }}
                        onCardPress={() => {
                          setOpenMenuId(null);
                          openEditSheet(item.id);
                        }}
                      />
                    </React.Fragment>
                  ))}
                </View>
              </View>
            </Pressable>
          )}
        </ScrollView>

        <Pressable
          className="absolute right-5 bottom-[102px] w-12 h-12 rounded-full items-center justify-center"
          style={{
            backgroundColor: isDark ? APP_DARK.buttonPrimaryBg : "#31973D",
            shadowColor: "#000",
            shadowOffset: { width: -1, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 6,
          }}
          onPress={openCreateSheet}
        >
          <MaterialCommunityIcons
            name="plus"
            size={moderateScale(16)}
            color="#FFFFFF"
          />
        </Pressable>

        <AppBottomNav
          activeTab="calendar"
          paddingBottom={0}
          navigation={navigation}
        />
      </View>

      <ScheduleFormDrawer
        visible={sheetOpen}
        onClose={closeSheet}
        scheduleId={editScheduleId}
      />

      <DeleteScheduleModal
        visible={deleteTargetId !== null}
        isDeleting={isDeleting}
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={deleteSchedule}
      />

      <ScheduleFilterModal
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
        filterYear={filterYear}
        filterMonth={filterMonth}
        filterPickDate={filterPickDate}
        onPrevMonth={filterPrevMonth}
        onNextMonth={filterNextMonth}
        onSelectDate={setFilterPickDate}
        todayDay={todayDay}
        todayMonth={todayMonth}
        todayYear={todayYear}
        navigation={navigation}
      />
    </SafeAreaView>
  );
}

export default ScheduleScreen;
