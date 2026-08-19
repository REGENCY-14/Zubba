import React from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { APP_DARK } from "../../constants/appDarkTheme";

type Props = {
  visible: boolean;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteScheduleModal({
  visible,
  isDeleting,
  onCancel,
  onConfirm,
}: Props) {
  const { colors, isDark } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-[rgba(0,0,0,0.65)] items-center justify-center px-5">
        <View
          style={{ backgroundColor: colors.card }}
          className="w-[296px] rounded-3xl py-3 px-5 items-center gap-5"
        >
          <View
            style={{
              backgroundColor: isDark ? APP_DARK.statusErrorBg : "#FEE2E2",
            }}
            className="w-[60px] h-[60px] rounded-[30px] items-center justify-center"
          >
            <MaterialCommunityIcons
              name="trash-can"
              size={32}
              color={isDark ? APP_DARK.statusErrorText : "#F87171"}
            />
          </View>

          <View className="gap-2 items-center w-64">
            <Text style={{ color: colors.text }} className="text-lg font-medium tracking-[-0.54px] leading-5 text-center">
              Delete your Schedule
            </Text>
            <Text style={{ color: colors.textSub }} className="text-sm font-normal leading-6 text-center">
              Are you sure you want to delete your timesheet?
            </Text>
          </View>

          <View className="flex-row gap-2 w-64">
            <Pressable
              className="flex-1 h-10 bg-[#EF4444] rounded-2xl items-center justify-center"
              onPress={onCancel}
              disabled={isDeleting}
            >
              <Text className="text-sm font-normal text-white ">Cancel</Text>
            </Pressable>
            <Pressable
              className="flex-1 h-10 border rounded-2xl items-center justify-center"
              onPress={onConfirm}
              disabled={isDeleting}
              style={{ opacity: isDeleting ? 0.8 : 1, backgroundColor: colors.card, borderColor: colors.border }}
            >
              {isDeleting ? (
                <ActivityIndicator
                  color={isDark ? APP_DARK.statusErrorText : "#EF4444"}
                  size="small"
                />
              ) : (
                <Text
                  style={{
                    color: isDark ? APP_DARK.statusErrorText : "#EF4444",
                  }}
                  className="text-sm font-medium"
                >
                  Delete
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
