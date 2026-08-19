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
import { moderateScale } from "../../../utils/scale";
import { callDriver, messageDriver } from "../../../utils/contactDriver";
import { APP_DARK } from "../../../constants/appDarkTheme";

type Props = {
  visible: boolean;
  step: "" | "found_drivers" | "customer_requests" | "driver_accepts" | "on_the_way";
  avatar: any;
  avatarUrl?: string | null;
  name: string;
  rating: number;
  code: string;
  phone?: string | null;
  cost: string;
  distanceLabel?: string;
  etaLabel?: string;
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
  phone,
  cost,
  distanceLabel,
  etaLabel,
  onProceed,
  onCancel,
  onAssignedCancel,
  isPremium,
  animationType,
}: Props) {
  const { isDark, colors } = useTheme();
  const isCompact = step === "on_the_way";

  const content = (
    <View className={`flex-1 justify-end items-center ${isCompact ? "pb-[100px] px-3" : "pb-[130px] px-4"}`}>
      <View
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
          gap: isCompact ? moderateScale(12) : moderateScale(16),
        }}
        className={`border rounded-[22px] w-full p-4 ${isCompact ? "" : "items-center"}`}
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
                <View style={{ backgroundColor: colors.borderLight }} className="rounded-lg">
                  <Text style={{ color: isDark ? APP_DARK.accentGreen : "#31973D" }} className="font-bold text-sm py-1.5 px-3">
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
                        style={{ width: moderateScale(54), height: moderateScale(54) }}
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
                    <View
                      className="absolute -bottom-0.5 -right-0.5 w-[22px] h-[22px] rounded-full bg-[#006B23] border-2 items-center justify-center"
                      style={{ borderColor: colors.card }}
                    >
                      <MaterialCommunityIcons
                        name="check-decagram"
                        size={moderateScale(13)}
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

                  <Text style={{ color: isDark ? APP_DARK.accentGreen : "#31973D" }} className="text-base">
                    GHS {cost} /{" "}
                    <Text style={{ color: colors.textSub }}>distance</Text>
                  </Text>

                  <View className="flex-row items-center">
                    <MaterialCommunityIcons
                      name="star"
                      size={moderateScale(14)}
                      color={isDark ? APP_DARK.statusSuccessText : "#0D631B"}
                    />
                    <Text style={{ color: isDark ? APP_DARK.statusSuccessText : "#0D631B" }} className="text-sm ml-1">
                      {rating <= 0 ? "First Request" : rating} • {code}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex-row items-center gap-3 w-full">
                <Pressable
                  onPress={onCancel}
                  style={{ backgroundColor: isDark ? APP_DARK.statusErrorBg : "#FDE8E8" }}
                  className="w-8 h-8 rounded-xl items-center justify-center"
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={moderateScale(20)}
                    color={isDark ? APP_DARK.statusErrorText : "#DC2626"}
                  />
                </Pressable>

                <Pressable
                  onPress={onProceed}
                  style={{ backgroundColor: isDark ? APP_DARK.buttonPrimaryBg : "#31973D" }}
                  className="flex-1 h-10 rounded-full items-center justify-center"
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
                <View style={{ backgroundColor: colors.borderLight }} className="rounded-lg">
                  <Text style={{ color: isDark ? APP_DARK.accentGreen : "#31973D" }} className="font-bold text-sm py-1.5 px-3">
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
                        style={{ width: moderateScale(54), height: moderateScale(54) }}
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
                    <View
                      className="absolute -bottom-0.5 -right-0.5 w-[22px] h-[22px] rounded-full bg-[#006B23] border-2 items-center justify-center"
                      style={{ borderColor: colors.card }}
                    >
                      <MaterialCommunityIcons
                        name="check-decagram"
                        size={moderateScale(13)}
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

                  <Text style={{ color: isDark ? APP_DARK.accentGreen : "#31973D" }} className="text-base">
                    GHS {cost} /{" "}
                    <Text style={{ color: colors.textSub }}>distance</Text>
                  </Text>

                  <View className="flex-row items-center">
                    <MaterialCommunityIcons
                      name="star"
                      size={moderateScale(14)}
                      color={isDark ? APP_DARK.statusSuccessText : "#0D631B"}
                    />
                    <Text style={{ color: isDark ? APP_DARK.statusSuccessText : "#0D631B" }} className="text-sm ml-1">
                      {rating <= 0 ? "First Request" : rating} • {code}
                    </Text>
                  </View>

                  <View className="flex-row items-center mt-4 gap-2">
                    <ActivityIndicator size="small" color={isDark ? APP_DARK.accentGreen : "#31973D"} />
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
                  style={{
                    borderColor: isDark ? APP_DARK.statusErrorBorder : "#FCA5A5",
                    backgroundColor: isDark ? APP_DARK.statusErrorBg : "#FDF2F8",
                  }}
                  className="flex-1 h-10 border rounded-full items-center justify-center"
                >
                  <Text style={{color: isDark ? APP_DARK.statusErrorText : "#EC4899"}} className="text-sm">Cancel</Text>
                </Pressable>
              </View>
            </View>
          ) : step == "on_the_way" ? (
            <View className="w-full flex-row items-center gap-3">
              <View className="w-12 h-12 rounded-full overflow-hidden bg-[#C7E0C9]">
                <Image
                  source={avatarUrl ? { uri: avatarUrl } : avatar}
                  style={{ width: 48, height: 48 }}
                  resizeMode="cover"
                />
              </View>
              <View className="flex-1 gap-1">
                <Text style={{ color: colors.text }} className="text-sm font-bold" numberOfLines={1}>
                  {name}
                </Text>
                <View className="flex-row items-center gap-3">
                  <Text style={{ color: colors.textSub }} className="text-xs">
                    {distanceLabel ?? "—"}
                  </Text>
                  <Text style={{ color: isDark ? APP_DARK.accentGreen : "#31973D" }} className="text-xs font-semibold">
                    {etaLabel ?? "—"}
                  </Text>
                </View>
              </View>
              <Text style={{ color: colors.text }} className="text-sm font-bold">
                GHS {cost}
              </Text>
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
                  <View style={{ backgroundColor: colors.border }} className="rounded-lg">
                    <Text style={{ color: isDark ? APP_DARK.accentGreen : "#31973D" }} className="font-bold text-sm py-1.5 px-3">
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
                          style={{ width: moderateScale(54), height: moderateScale(54) }}
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
                          size={moderateScale(13)}
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
                        size={moderateScale(14)}
                        color={isDark ? APP_DARK.statusSuccessText : "#0D631B"}
                      />
                      <Text style={{ color: isDark ? APP_DARK.statusSuccessText : "#0D631B" }} className="text-sm ml-1">
                        {rating <= 0 ? "First Request" : rating} • {code}
                      </Text>
                    </View>

                    <View className="flex-row mt-3 items-center gap-6">
                      <Pressable
                        onPress={() => callDriver(phone)}
                        className="flex-row items-center gap-2"
                        style={{ opacity: phone ? 1 : 0.5 }}
                        disabled={!phone}
                      >
                        <MaterialCommunityIcons
                          name="phone-outline"
                          size={moderateScale(16)}
                          color={colors.textSub}
                        />
                        <Text
                          style={{ color: colors.textSub }}
                          className="ml-1 text-sm"
                        >
                          Call
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => messageDriver(phone)}
                        className="flex-row items-center gap-2"
                        style={{ opacity: phone ? 1 : 0.5 }}
                        disabled={!phone}
                      >
                        <MaterialCommunityIcons
                          name="message-outline"
                          size={moderateScale(16)}
                          color={colors.textSub}
                        />
                        <Text
                          style={{ color: colors.textSub }}
                          className="ml-1 text-sm"
                        >
                          Message
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>

                <View className="flex-row items-center gap-3 w-full">
                  <Pressable
                    onPress={onCancel}
                    style={{ backgroundColor: isDark ? APP_DARK.statusErrorBg : "#FDE8E8" }}
                    className="w-8 h-8 rounded-xl items-center justify-center"
                  >
                    <MaterialCommunityIcons
                      name="close"
                      size={moderateScale(20)}
                      color={isDark ? APP_DARK.statusErrorText : "#DC2626"}
                    />
                  </Pressable>

                  <Pressable
                    style={{ backgroundColor: isDark ? APP_DARK.buttonPrimaryBg : "#31973D" }}
                    className="flex-1 h-10 rounded-full items-center justify-center opacity-85"
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
  );

  if (!visible) return null;
  if (isCompact) return content;

  return (
    <Modal visible transparent animationType={animationType ?? "fade"}>
      {content}
    </Modal>
  );
}
