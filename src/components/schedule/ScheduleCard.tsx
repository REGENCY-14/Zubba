import React from "react";
import { Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { APP_DARK } from "../../constants/appDarkTheme";
import type { ScheduleItem } from "../../hooks/useSchedules";

type Props = {
  item: ScheduleItem;
  menuOpen: boolean;
  onMenuOpen: () => void;
  onMenuClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onRetry?: () => void;
  onCardPress?: () => void;
};

export function ScheduleCard({
  item,
  menuOpen,
  onMenuOpen,
  onMenuClose,
  onEdit,
  onDelete,
  onRetry,
  onCardPress,
}: Props) {
  const { colors, isDark } = useTheme();

  const getStatusBadge = () => {
    switch (item.status) {
      case "scheduled":
        return {
          bg: isDark ? APP_DARK.statusWarningBg : "#FEF3C7",
          text: isDark ? APP_DARK.statusWarningText : "#92400E",
          icon: "clock-time-three",
          label: "Scheduled",
        };
      case "completed":
        return {
          bg: isDark ? APP_DARK.statusSuccessBg : "#DCFCE7",
          text: isDark ? APP_DARK.statusSuccessText : "#166534",
          icon: "check-circle",
          label: "Completed",
        };
      case "cancelled":
        return {
          bg: isDark ? APP_DARK.statusErrorBg : "#FEE2E2",
          text: isDark ? APP_DARK.statusErrorText : "#991B1B",
          icon: "close-circle",
          label: "Cancelled",
        };
      case "processing":
        return {
          bg: isDark ? APP_DARK.statusInfoBg : "#DBEAFE",
          text: isDark ? APP_DARK.statusInfoText : "#1E40AF",
          icon: "clock-outline",
          label: "Processing",
        };
      case "failed":
        return {
          bg: isDark ? APP_DARK.statusWarningBg : "#FEF3C7",
          text: isDark ? APP_DARK.statusWarningText : "#92400E",
          icon: "alert-circle",
          label: "Retrying...",
        };
      default:
        return {
          bg: isDark ? APP_DARK.statusNeutralBg : "#F1F5F9",
          text: isDark ? APP_DARK.statusNeutralText : "#475569",
          icon: "clock-time-three",
          label: "Scheduled",
        };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <View className="flex-row items-start px-3 h-32">
      <Pressable
        className="flex-1 pt-1 pr-4 pb-1 gap-2.5 justify-center h-full"
        onPress={() => {
          onMenuClose();
          onCardPress?.();
        }}
      >
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

          {item.status === "failed" &&
            item.retryCount !== undefined &&
            item.retryCount > 0 &&
            item.retryCount < 3 && (
              <View
                style={{
                  backgroundColor: isDark
                    ? APP_DARK.statusWarningBg
                    : "#FEF3C7",
                }}
                className="flex-row items-center gap-1.5 rounded-xl px-2 py-1"
              >
                <MaterialCommunityIcons
                  name="refresh"
                  size={12}
                  color={isDark ? APP_DARK.statusWarningText : "#92400E"}
                />
                <Text
                  style={{
                    color: isDark ? APP_DARK.statusWarningText : "#92400E",
                  }}
                  className="text-xs font-medium"
                >
                  Retry {item.retryCount}/3
                </Text>
              </View>
            )}

          {item.status === "failed" &&
            item.retryCount !== undefined &&
            item.retryCount >= 3 && (
              <View
                style={{
                  backgroundColor: isDark ? APP_DARK.statusErrorBg : "#FEE2E2",
                }}
                className="flex-row items-center gap-1.5 rounded-xl px-2 py-1"
              >
                <MaterialCommunityIcons
                  name="close-circle"
                  size={12}
                  color={isDark ? APP_DARK.statusErrorText : "#991B1B"}
                />
                <Text
                  style={{
                    color: isDark ? APP_DARK.statusErrorText : "#991B1B",
                  }}
                  className="text-xs font-medium"
                >
                  Max retries
                </Text>
              </View>
            )}
        </View>

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
                {item.timeRange || "-"}
              </Text>
            </View>
          </View>
          <View className="px-1">
            <Text
              style={{ color: colors.text }}
              className="text-[13px] font-medium"
              numberOfLines={1}
            >
              {item.location || "No location set"}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between items-center">
          <Text
            style={{ color: colors.textSub }}
            className="text-[13px] font-medium"
          >
            Estimated cost
          </Text>
          <Text
            style={{ color: colors.text }}
            className="text-xl font-bold"
          >
            GHS {item.estimatedPrice || "15.00"}
          </Text>
        </View>
      </Pressable>

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

        {menuOpen && (
          <View
            className="absolute top-10 right-0 w-[165px] rounded-2xl overflow-hidden z-50"
            style={{
              backgroundColor: colors.card,
              borderWidth: 1,
              borderColor: colors.border,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.12,
              shadowRadius: 12,
              elevation: 16,
            }}
          >
            {(item.status === "scheduled" || item.status === "failed") && (
              <>
                <Pressable
                  className="flex-row items-center justify-between px-5 h-11"
                  onPress={() => {
                    onEdit();
                    onMenuClose();
                  }}
                >
                  <Text style={{ color: colors.text }} className="text-sm">Edit</Text>
                  <MaterialCommunityIcons
                    name="pencil-outline"
                    size={18}
                    color={colors.textSub}
                  />
                </Pressable>
                <View style={{ backgroundColor: colors.borderLight }} className="h-px mx-3" />
              </>
            )}

            {item.status === "failed" &&
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
                    <Text
                      style={{
                        color: isDark ? APP_DARK.statusInfoText : "#2563EB",
                      }}
                      className="text-sm"
                    >
                      Retry
                    </Text>
                    <MaterialCommunityIcons
                      name="refresh"
                      size={18}
                      color={isDark ? APP_DARK.statusInfoText : "#2563EB"}
                    />
                  </Pressable>
                  <View style={{ backgroundColor: colors.borderLight }} className="h-px mx-3" />
                </>
              )}

            <Pressable
              className="flex-row items-center justify-between px-5 h-11"
              onPress={() => {
                onDelete();
                onMenuClose();
              }}
            >
              <Text
                style={{ color: isDark ? APP_DARK.statusErrorText : "#EF4444" }}
                className="text-sm"
              >
                Delete
              </Text>
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={18}
                color={isDark ? APP_DARK.statusErrorText : "#EF4444"}
              />
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}
