import React from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-[rgba(0,0,0,0.65)] items-center justify-center px-5">
        <View className="w-[296px] bg-white rounded-3xl py-3 px-5 items-center gap-5">
          <View className="w-[60px] h-[60px] rounded-[30px] bg-[#FEE2E2] items-center justify-center">
            <MaterialCommunityIcons
              name="trash-can"
              size={32}
              color="#F87171"
            />
          </View>

          <View className="gap-2 items-center w-64">
            <Text className="text-lg font-medium text-[#0F1621]  tracking-[-0.54px] leading-5 text-center">
              Delete your Schedule
            </Text>
            <Text className="text-sm font-normal text-[#0F1621]  leading-6 text-center">
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
              className="flex-1 h-10 bg-white border border-[#CBD5E0] rounded-2xl items-center justify-center"
              onPress={onConfirm}
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
  );
}
