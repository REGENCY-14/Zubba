import { useRef, useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";
import CustomAppBar from "../../components/common/CustomAppBar";
import { AppBottomNav } from "../../components";
import AnimatedSwitch from "../../components/ui/inputs/AnimatedSwitch";

const FREQUENCIES = ["Daily", "Weekly", "Monthly"];

type ToggleRow = {
  key: string;
  title: string;
  subtitle: string;
};

const DELIVERY_METHODS: ToggleRow[] = [
  {
    key: "inApp",
    title: "In-app Notifications",
    subtitle: "Show notifications within the app",
  },
  {
    key: "email",
    title: "Email Notifications",
    subtitle: "Receive notifications in your email",
  },
  {
    key: "sms",
    title: "SMS",
    subtitle: "Receive notifications on your number",
  },
];

const NOTIFICATION_TYPES: ToggleRow[] = [
  {
    key: "wallet",
    title: "Zubba Wallet",
    subtitle: "Get notified on transaction confirmation and wallet infos",
  },
  {
    key: "rewards",
    title: "Reward Milestone",
    subtitle: "Get notified on discounts, reward and advantages",
  },
  {
    key: "subscription",
    title: "Subscription Notifications",
    subtitle: "Get notified when you are close to subscription deadlines",
  },
  {
    key: "scheduledPickups",
    title: "Scheduled Pickups",
    subtitle: "Get notified on your plan for later pickups",
  },
  {
    key: "arrivalPickups",
    title: "Arrival Pickups",
    subtitle: "Get notified on driver arrivals",
  },
];

function ToggleListItem({
  item,
  value,
  onChange,
  isLast,
}: {
  item: ToggleRow;
  value: boolean;
  onChange: (v: boolean) => void;
  isLast: boolean;
}) {
  const { colors } = useTheme();

  return (
    <View
      style={{ borderColor: colors.border }}
      className={`flex-row items-center justify-between px-4 py-4 ${
        !isLast ? "border-b" : ""
      }`}
    >
      <View className="flex-1 gap-1 pr-4">
        <Text className="text-sm font-semibold" style={{ color: colors.text }}>
          {item.title}
        </Text>
        <Text style={{ color: colors.textSub }} className="text-xs">
          {item.subtitle}
        </Text>
      </View>
      <AnimatedSwitch value={value} onChange={onChange} />
    </View>
  );
}

export function NotificationSettingsScreen({
  navigation,
}: RootStackScreenProps<"NotificationSettings">) {
  const { colors, isDark } = useTheme();

  const [frequencyOpen, setFrequencyOpen] = useState(false);
  const [frequency, setFrequency] = useState("Weekly");
  const [anchor, setAnchor] = useState({ top: 0, right: 0, width: 0 });
  const buttonRef = useRef<View>(null);

  const [deliveryValues, setDeliveryValues] = useState<Record<string, boolean>>(
    {
      inApp: false,
      email: false,
      sms: false,
    },
  );

  const [typeValues, setTypeValues] = useState<Record<string, boolean>>({
    wallet: false,
    rewards: true,
    subscription: false,
    scheduledPickups: false,
    arrivalPickups: false,
  });

  const setDeliveryValue = (key: string, value: boolean) =>
    setDeliveryValues((prev) => ({ ...prev, [key]: value }));

  const setTypeValue = (key: string, value: boolean) =>
    setTypeValues((prev) => ({ ...prev, [key]: value }));

  const closeFrequency = () => setFrequencyOpen(false);

  const openFrequency = () => {
    buttonRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({
        top: y + height + 8,
        right: Math.max(16, /* screen right padding fallback */ 16),
        width,
      });
      setFrequencyOpen(true);
    });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.bg }}
      edges={["top", "left", "right"]}
    >
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <CustomAppBar title="Notifications" navigation={navigation} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 100 }}
          onScrollBeginDrag={closeFrequency}
        >
          <View
            style={{ borderColor: colors.border }}
            className="p-4 border gap-4 rounded-3xl"
          >
            <View
              style={{
                backgroundColor: isDark ? colors.card : colors.bg,
                borderColor: colors.border,
              }}
              className="rounded-2xl border px-4 py-4"
            >
              <Pressable
                ref={buttonRef}
                className="flex-row items-center justify-between"
                onPress={() =>
                  frequencyOpen ? closeFrequency() : openFrequency()
                }
              >
                <View className="flex-1 gap-1 pr-4">
                  <Text
                    className="text-sm font-semibold"
                    style={{ color: colors.text }}
                  >
                    Notification Frequency
                  </Text>

                  <Text style={{ color: colors.textSub }} className="text-xs">
                    Choose how often you want to receive notifications
                  </Text>
                </View>

                <View
                  style={{ borderColor: colors.border }}
                  className="flex-row items-center gap-1.5 rounded-full border px-3 py-2"
                >
                  <Text
                    className="text-xs font-medium"
                    style={{ color: colors.text }}
                  >
                    {frequency}
                  </Text>

                  <MaterialCommunityIcons
                    name={frequencyOpen ? "chevron-up" : "chevron-down"}
                    size={14}
                    color={colors.text}
                  />
                </View>
              </Pressable>
            </View>

            <View className="gap-3">
              <Text
                className="px-1 text-base font-bold"
                style={{ color: colors.text }}
              >
                Delivery Method
              </Text>
              <View
                style={{
                  borderColor: colors.border,
                  backgroundColor: isDark ? colors.card : colors.bg,
                }}
                className="rounded-2xl border overflow-hidden"
              >
                {DELIVERY_METHODS.map((item, i) => (
                  <ToggleListItem
                    key={item.key}
                    item={item}
                    value={deliveryValues[item.key]}
                    onChange={(v) => setDeliveryValue(item.key, v)}
                    isLast={i === DELIVERY_METHODS.length - 1}
                  />
                ))}
              </View>
            </View>

            <View className="gap-3">
              <Text
                className="px-1 text-base font-bold"
                style={{ color: colors.text }}
              >
                Notification Types
              </Text>
              <View className="gap-3">
                {NOTIFICATION_TYPES.map((item) => (
                  <View
                    key={item.key}
                    style={{
                      borderColor: colors.border,
                      backgroundColor: isDark ? colors.card : colors.bg,
                    }}
                    className="rounded-2xl border"
                  >
                    <ToggleListItem
                      item={item}
                      value={typeValues[item.key]}
                      onChange={(v) => setTypeValue(item.key, v)}
                      isLast
                    />
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Dropdown rendered in a Modal so it's always above everything, touch order guaranteed */}
        <Modal
          visible={frequencyOpen}
          transparent
          animationType="none"
          onRequestClose={closeFrequency}
        >
          <Pressable style={{ flex: 1 }} onPress={closeFrequency}>
            <View
              style={{
                position: "absolute",
                top: anchor.top,
                right: anchor.right,
                width: 140,
                borderColor: colors.border,
                backgroundColor: isDark ? colors.card : colors.bg,
                elevation: 8,
                shadowColor: "#000",
                shadowOpacity: 0.15,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 4 },
              }}
              className="overflow-hidden rounded-2xl border"
            >
              {FREQUENCIES.map((freq, i) => (
                <Pressable
                  key={freq}
                  style={{
                    backgroundColor:
                      frequency === freq
                        ? isDark
                          ? colors.border
                          : "#F1F5F9"
                        : isDark
                          ? colors.card
                          : colors.bg,
                    borderColor: colors.border,
                  }}
                  className={`px-4 py-3 ${
                    i !== FREQUENCIES.length - 1 ? "border-b" : ""
                  }`}
                  onPress={() => {
                    setFrequency(freq);
                    closeFrequency();
                  }}
                >
                  <Text
                    style={{
                      color: frequency === freq ? colors.text : colors.textSub,
                    }}
                    className={`text-sm text-center ${
                      frequency === freq ? "font-semibold" : "font-normal"
                    }`}
                  >
                    {freq}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Modal>

        <AppBottomNav
          activeTab="settings"
          paddingBottom={0}
          navigation={navigation}
        />
      </View>
    </SafeAreaView>
  );
}

export default NotificationSettingsScreen;
