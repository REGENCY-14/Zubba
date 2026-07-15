import {
  Modal,
  View,
  Text,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../../context/ThemeContext";

type Props = {
  visible: boolean;
  step: "" | "found_drivers" | "customer_requests" | "driver_accepts";
  avatar: any;
  avatarUrl?: string | null;
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
  avatarUrl,
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
  const { isDark, colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType={animationType ? animationType : "fade"}
    >
      <View className="flex-1 justify-end items-center pb-[130px] px-4">
        <View
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
            gap: 20,
          }}
          className={`border rounded-[22px] items-center p-6 w-full`}
        >
          {step == "found_drivers" ? (
            <View className="w-full items-center gap-4">
              <View className="flex justify-between flex-row w-full">
                <Text
                  style={{ color: colors.text }}
                  className="text-base font-medium"
                >
                  Driver Selected
                </Text>
                <View className="rounded-lg bg-[#E2E8F0]">
                  <Text className="text-[#31973D] font-bold text-sm py-1.5 px-3">
                    • Live View
                  </Text>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: colors.border,
                  borderColor: colors.border,
                }}
                className="border w-full"
              />
              <View className="w-full gap-4 rounded-3xl p-6 items-center justify-center">
                <View
                  style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    boxShadow: [
                      {
                        offsetX: 0,
                        offsetY: 0,
                        blurRadius: 0,
                        spreadDistance: 2,
                        color: colors.border,
                      },
                    ],
                  }}
                  className="w-16 h-16 rounded-xl items-center justify-center"
                >
                  <View className="w-[54px] h-[54px] rounded-full border-2 border-[#90FA96] overflow-hidden items-center justify-center bg-[#C7E0C9]">
                    {avatar ? (
                      <Image
                        source={avatarUrl ? { uri: avatarUrl } : avatar}
                        style={{ width: 54, height: 54 }}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text
                        style={{ color: colors.text }}
                        className="text-sm font-bold uppercase"
                      >
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
                    style={{ color: colors.text }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    className="mt-3 text-base font-bold uppercase"
                  >
                    {name}
                  </Text>

                  <Text className="text-[#31973D] text-base">
                    GHS {cost} /{" "}
                    <Text style={{ color: colors.textSub }}>distance</Text>
                  </Text>

                  <View className="flex-row items-center">
                    <MaterialCommunityIcons
                      name="star"
                      size={14}
                      color="#0D631B"
                    />
                    <Text className="text-sm text-[#0D631B] ml-1">
                      {rating <= 0 ? "First Request" : rating} • {code}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex-row items-center gap-3 w-full">
                <Pressable
                  onPress={onCancel}
                  className="w-8 h-8 rounded-xl bg-[#FDE8E8] items-center justify-center"
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={20}
                    color="#DC2626"
                  />
                </Pressable>

                <Pressable
                  onPress={onProceed}
                  className="flex-1 h-10 bg-[#31973D] rounded-full items-center justify-center"
                >
                  <Text className="text-white text-sm">Continue</Text>
                </Pressable>
              </View>
            </View>
          ) : step == "customer_requests" ? (
            <View className="w-full items-center gap-4">
              <View className="flex justify-between flex-row w-full">
                <Text
                  style={{ color: colors.text }}
                  className="text-base font-medium"
                >
                  Sending request
                </Text>
                <View className="rounded-lg bg-[#E2E8F0]">
                  <Text className="text-[#31973D] font-bold text-sm py-1.5 px-3">
                    • Live View
                  </Text>
                </View>
              </View>
              <View className="w-full gap-4 rounded-3xl p-6 items-center justify-center">
                <View
                  style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    boxShadow: [
                      {
                        offsetX: 0,
                        offsetY: 0,
                        blurRadius: 0,
                        spreadDistance: 2,
                        color: colors.border,
                      },
                    ],
                  }}
                  className="w-16 h-16 rounded-xl items-center justify-center"
                >
                  <View className="w-[54px] h-[54px] rounded-full border-2 border-[#90FA96] overflow-hidden items-center justify-center bg-[#C7E0C9]">
                    {avatar ? (
                      <Image
                        source={avatarUrl ? { uri: avatarUrl } : avatar}
                        style={{ width: 54, height: 54 }}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text
                        style={{ color: colors.text }}
                        className="text-sm font-bold uppercase"
                      >
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
                    style={{ color: colors.text }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    className="mt-3 text-base font-bold uppercase"
                  >
                    {name}
                  </Text>

                  <Text className="text-[#31973D] text-base">
                    GHS {cost} /{" "}
                    <Text style={{ color: colors.textSub }}>distance</Text>
                  </Text>

                  <View className="flex-row items-center">
                    <MaterialCommunityIcons
                      name="star"
                      size={14}
                      color="#0D631B"
                    />
                    <Text className="text-sm text-[#0D631B] ml-1">
                      {rating <= 0 ? "First Request" : rating} • {code}
                    </Text>
                  </View>

                  <View className="flex-row items-center mt-4 gap-2">
                    <ActivityIndicator size="small" color="#31973D" />
                    <Text
                      style={{ color: colors.textMuted }}
                      className="text-sm"
                    >
                      Waiting for driver to accept...
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex-row items-center gap-3 w-full">
                <Pressable
                  onPress={onCancel}
                  className="flex-1 h-10 border border-red-300 bg-[#FDF2F8] rounded-full items-center justify-center"
                >
                  <Text style={{color: "#EC4899"}} className="text-sm">Cancel</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            step == "driver_accepts" && (
              <View className="w-full items-center gap-4">
                <View className="flex justify-between flex-row w-full">
                  <Text
                    style={{ color: colors.text }}
                    className="text-base font-medium"
                  >
                    Driver Selected
                  </Text>
                  <View className="rounded-lg bg-[#E2E8F0]">
                    <Text className="text-[#31973D] font-bold text-sm py-1.5 px-3">
                      • Live View
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    backgroundColor: colors.border,
                    borderColor: colors.border,
                  }}
                  className="border w-full"
                />
                <View className="w-full gap-4 rounded-3xl p-6 items-center justify-center">
                  <View
                    style={{
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      boxShadow: [
                        {
                          offsetX: 0,
                          offsetY: 0,
                          blurRadius: 0,
                          spreadDistance: 2,
                          color: colors.border,
                        },
                      ],
                    }}
                    className="w-16 h-16 rounded-xl items-center justify-center"
                  >
                    <View className="w-[54px] h-[54px] rounded-full border-2 border-[#90FA96] overflow-hidden items-center justify-center bg-[#C7E0C9]">
                      {avatar ? (
                        <Image
                          source={avatarUrl ? { uri: avatarUrl } : avatar}
                          style={{ width: 54, height: 54 }}
                          resizeMode="cover"
                        />
                      ) : (
                        <Text
                          style={{ color: colors.text }}
                          className="text-sm font-bold uppercase"
                        >
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
                      style={{ color: colors.text }}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      className="mt-3 text-base font-bold uppercase"
                    >
                      {name}
                    </Text>

                    <View className="flex-row items-center">
                      <MaterialCommunityIcons
                        name="star"
                        size={14}
                        color="#0D631B"
                      />
                      <Text className="text-sm text-[#0D631B] ml-1">
                        {rating <= 0 ? "First Request" : rating} • {code}
                      </Text>
                    </View>

                    <View className="flex-row mt-3 items-center gap-6">
                      <View className="flex-row items-center gap-2">
                        <MaterialCommunityIcons
                          name="phone-outline"
                          size={16}
                          color={colors.textSub}
                        />
                        <Text
                          style={{ color: colors.textSub }}
                          className="ml-1 text-sm"
                        >
                          Call
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <MaterialCommunityIcons
                          name="message-outline"
                          size={16}
                          color={colors.textSub}
                        />
                        <Text
                          style={{ color: colors.textSub }}
                          className="ml-1 text-sm"
                        >
                          Message
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View className="flex-row items-center gap-3 w-full">
                  <Pressable
                    onPress={onCancel}
                    className="w-8 h-8 rounded-xl bg-[#FDE8E8] items-center justify-center"
                  >
                    <MaterialCommunityIcons
                      name="close"
                      size={20}
                      color="#DC2626"
                    />
                  </Pressable>

                  <Pressable
                    className="flex-1 h-10 bg-[#31973D] rounded-full items-center justify-center opacity-85"
                    disabled={true}
                  >
                    <Text className="text-white text-sm">Proceed</Text>
                  </Pressable>
                </View>
              </View>
            )
          )}
        </View>
      </View>
    </Modal>
  );
}
