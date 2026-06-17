import React from "react";
import { Modal, View, Text, Pressable, Image } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  step: "request" | "assigned";
  avatar: any;
  onProceed: () => void;
  onCancel: () => void;
  onAssignedCancel: () => void;
};

export default function PickupRequestModal({
  visible,
  step,
  avatar,
  onProceed,
  onCancel,
  onAssignedCancel,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 justify-end items-center pb-[130px]">
        <View
          className={`bg-white rounded-[22px] items-center px-3 py-4 w-[375px] max-w-[96%] ${
            step === "request" ? "h-[372px]" : "h-[324px]"
          }`}
          style={{ gap: 20 }}
        >
          {step === "request" ? (
            <View
              className="w-[366px] max-w-full items-center"
              style={{ gap: 20 }}
            >
              <View className="w-[358px] max-w-full h-[212px] border border-[#E2E8F0] rounded-3xl bg-white p-6 items-center justify-center">
                <View className="w-16 h-16 rounded-xl bg-[#F4F4F5] items-center justify-center">
                  <View className="w-[54px] h-[54px] rounded-full border-2 border-[#90FA96] overflow-hidden">
                    <Image
                      source={avatar}
                      style={{ width: 54, height: 54 }}
                      resizeMode="cover"
                    />
                  </View>
                </View>

                <Text className="mt-3 text-base font-bold text-[#1F2A33] uppercase">
                  MARCUS CHEN
                </Text>

                <Text className="text-[#31973D] text-base">
                  GHS 10.00 / distance
                </Text>

                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="star"
                    size={14}
                    color="#0D631B"
                  />
                  <Text className="text-sm text-[#0D631B] ml-1">4.9 • ZB-0248</Text>
                </View>
              </View>

              <Pressable
                className="h-12 bg-[#31973D] rounded-full items-center justify-center w-full"
                onPress={onProceed}
              >
                <Text className="text-white">Proceed to request</Text>
              </Pressable>

              <Pressable
                className="h-12 rounded-full border border-[#E2E8F0] items-center justify-center w-full flex-row"
                onPress={onCancel}
              >
                <View className="w-4 h-4 rounded-full bg-[#EF4444] items-center justify-center mr-2">
                  <MaterialIcons name="close" size={10} color="#fff" />
                </View>
                <Text className="text-[#EF4444]">Cancel pickup</Text>
              </Pressable>
            </View>
          ) : (
            <View
              className="w-[366px] max-w-full items-center"
              style={{ gap: 20 }}
            >
              <View className="w-[358px] h-[224px] border border-[#E2E8F0] rounded-2xl bg-white p-6 items-center justify-center">
                <View className="w-16 h-16 rounded-xl bg-[#F4F4F5] items-center justify-center">
                  <View className="w-[54px] h-[54px] rounded-full border-2 border-[#90FA96] overflow-hidden">
                    <Image
                      source={avatar}
                      style={{ width: 54, height: 54 }}
                      resizeMode="cover"
                    />
                  </View>
                </View>

                <Text className="mt-3 text-base font-bold uppercase">
                  MARCUS CHEN
                </Text>

                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="star"
                    size={14}
                    color="#0D631B"
                  />
                  <Text className="text-sm text-[#0D631B] ml-1">4.9 • ZB-0248</Text>
                </View>

                <View className="flex-row mt-3 items-center gap-6">
                  <View className="flex-row items-center gap-2">
                    <MaterialCommunityIcons
                      name="phone-outline"
                      size={16}
                      color="#1F2A33"
                    />
                    <Text className="ml-1 text-[#1F2A33] text-sm">Call</Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <MaterialCommunityIcons
                      name="message-outline"
                      size={16}
                      color="#1F2A33"
                    />
                    <Text className="ml-1 text-[#1F2A33] text-sm">Message</Text>
                  </View>
                </View>
              </View>

              <Pressable
                className="h-12 border border-[#E2E8F0] rounded-full items-center justify-center w-full flex-row"
                onPress={onAssignedCancel}
              >
                <View className="w-4 h-4 rounded-full bg-[#EF4444] items-center justify-center mr-2">
                  <MaterialIcons name="close" size={10} color="#fff" />
                </View>
                <Text className="text-[#EF4444]">Cancel pickup</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
