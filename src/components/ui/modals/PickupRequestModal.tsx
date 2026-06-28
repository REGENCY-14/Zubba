import { Modal, View, Text, Pressable, Image } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  step: "request" | "assigned";
  avatar: any;
  name: string;
  rating: number;
  code: string;
  cost: string;
  onProceed: () => void;
  onCancel: () => void;
  onAssignedCancel: () => void;
  isPremium?: boolean;
  animationType?: "fade" | "none" | "slide";
};

export default function PickupRequestModal({
  visible,
  step,
  avatar,
  name,
  rating,
  code,
  cost,
  onProceed,
  onCancel,
  onAssignedCancel,
  isPremium,
  animationType,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType={animationType ? animationType : "fade"}
    >
      <View className="flex-1 justify-end items-center pb-[130px] px-4">
        <View
          className={`bg-white rounded-[22px] items-center px-3 py-4 w-full`}
          style={{ gap: 20 }}
        >
          {step == "request" ? (
            <View className="w-full items-center" style={{ gap: 20 }}>
              <View className="w-full gap-4 border border-[#E2E8F0] rounded-3xl bg-white p-6 items-center justify-center">
                <View
                  className="w-16 h-16 rounded-xl bg-[#F4F4F5] items-center justify-center"
                  style={{
                    boxShadow: [
                      {
                        offsetX: 0,
                        offsetY: 0,
                        blurRadius: 0,
                        spreadDistance: 2,
                        color: "#FAFAFA",
                      },
                    ],
                  }}
                >
                  <View className="w-[54px] h-[54px] rounded-full border-2 border-[#90FA96] overflow-hidden items-center justify-center bg-[#C7E0C9]">
                    {avatar ? (
                      <Image
                        source={avatar}
                        style={{ width: 54, height: 54 }}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text className="text-sm font-bold text-[#1A1C1E] uppercase">
                        {name
                          .split(" ")
                          .map((part) => part.charAt(0))
                          .join("")}
                      </Text>
                    )}
                  </View>
                  {isPremium && (
                    <View className="absolute -bottom-0.5 -right-0.5 w-[22px] h-[22px] rounded-full bg-[#006B23] border-2 border-white items-center justify-center">
                      <MaterialCommunityIcons
                        name="check-decagram"
                        size={13}
                        color="#FFFFFF"
                      />
                    </View>
                  )}
                </View>

                <View className="flex-col items-center gap-1">
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    className="mt-3 text-base font-bold text-[#1F2A33] uppercase"
                  >
                    {name}
                  </Text>

                  <Text className="text-[#31973D] text-base">
                    GHS {cost} / distance
                  </Text>

                  <View className="flex-row items-center">
                    <MaterialCommunityIcons
                      name="star"
                      size={14}
                      color="#0D631B"
                    />
                    <Text className="text-sm text-[#0D631B] ml-1">
                      {rating} • {code}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex gap-3 w-full context-stretch">
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
            </View>
          ) : (
            <View className="w-full items-center" style={{ gap: 20 }}>
              <View className="w-full border border-[#E2E8F0] rounded-2xl bg-white p-6 gap-4 items-center justify-center">
                <View className="w-16 h-16 rounded-xl bg-[#F4F4F5] items-center justify-center">
                  <View className="w-[54px] h-[54px] rounded-full border-2 border-[#90FA96] overflow-hidden">
                    <Image
                      source={avatar}
                      style={{ width: 54, height: 54 }}
                      resizeMode="cover"
                    />
                  </View>
                </View>

                <View className="flex-col gap-1 items-center">
                  <Text className="mt-3 text-base font-bold uppercase">
                    {name}
                  </Text>

                  <View className="flex-row items-center">
                    <MaterialCommunityIcons
                      name="star"
                      size={14}
                      color="#0D631B"
                    />
                    <Text className="text-sm text-[#0D631B] ml-1">
                      {rating} • {code}
                    </Text>
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
                      <Text className="ml-1 text-[#1F2A33] text-sm">
                        Message
                      </Text>
                    </View>
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
