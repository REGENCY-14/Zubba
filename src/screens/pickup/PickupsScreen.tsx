import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  RefreshControl,
  SectionList,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { AppBottomNav } from "../../components";
import { useTheme, ThemeColors } from "../../context/ThemeContext";
import { useAppSelector } from "../../hooks/useAppSelector";
import type { RootStackScreenProps } from "../../navigation/types";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { customerService } from "../../api/customerService";
import { setRequest } from "../../slices/request/requestSlice";
import { CustomerRequestItem } from "../../types/request.types";
import { handleApiError } from "../../utils/handleApiError";

type Pickup = {
  id: string;
  date: string;
  status: string;
  location: string;
  amount: string;
  raw: CustomerRequestItem;
};

type PickupSection = {
  title: string | null;
  data: Pickup[];
};

type TabKey = "completed" | "pending";

const TABS: { key: TabKey; label: string }[] = [
  { key: "completed", label: "Completed" },
  { key: "pending", label: "Pending" },
];

const COMPLETED_STATUSES = new Set(["completed", "cancelled"]);

function formatStatusLabel(status: string) {
  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatShortDate(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
}

function formatAmount(item: CustomerRequestItem) {
  if (item.status === "cancelled") return "GHS 0.00";
  const total =
    Number(item.pickup_price ?? 0) + Number(item.service_price ?? 0);
  return `GHS ${total.toFixed(2)}`;
}

function mapRequestToPickup(item: CustomerRequestItem): Pickup {
  const dateSource = item.completed_at ?? item.cancelled_at ?? item.created_at;
  return {
    id: item.id,
    date: formatShortDate(dateSource),
    status: formatStatusLabel(item.status),
    location: item.pickup_address,
    amount: formatAmount(item),
    raw: item,
  };
}

function TabBar({
  active,
  onChange,
  colors,
}: {
  active: TabKey;
  onChange: (tab: TabKey) => void;
  colors: ThemeColors;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 20,
        paddingHorizontal: 20,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={{
              paddingVertical: 12,
              borderBottomWidth: 2,
              borderBottomColor: isActive ? "#31973D" : "transparent",
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins",
                fontSize: 14,
                fontWeight: "500",
                color: isActive ? colors.text : colors.textSub,
              }}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function PickupRow({
  pickup,
  isLast,
  colors,
  onPress,
}: {
  pickup: Pickup;
  isLast: boolean;
  colors: ThemeColors;
  onPress?: () => void;
}) {
  const isCancelled = pickup.raw.status === "cancelled";

  const content = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: colors.borderLight,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: colors.iconBg,
          alignItems: "center",
          justifyContent: "center",
          opacity: isCancelled ? 0.5 : 1,
        }}
      >
        <MaterialCommunityIcons
          name="truck-outline"
          size={20}
          color={colors.iconColor}
        />
      </View>

      <View style={{ flex: 1, gap: 2 }}>
        <Text
          style={{
            fontFamily: "Poppins",
            fontSize: 11,
            color: colors.textMuted,
          }}
        >
          {pickup.date} . {pickup.status}
        </Text>
        <Text
          style={{ fontFamily: "Poppins", fontSize: 14, color: colors.text }}
        >
          {pickup.location}
        </Text>
        <Text
          style={{
            fontFamily: "Poppins",
            fontSize: 14,
            fontWeight: "600",
            color: colors.text,
          }}
        >
          {pickup.amount}
        </Text>
      </View>

      <Pressable
        hitSlop={8}
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.border,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialCommunityIcons
          name="refresh"
          size={18}
          color={colors.textSub}
        />
      </Pressable>
    </View>
  );

  if (!onPress) return content;

  return <Pressable onPress={onPress}>{content}</Pressable>;
}

export function PickupsScreen({ navigation }: RootStackScreenProps<"Pickups">) {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const [requests, setRequests] = useState<CustomerRequestItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const isPremium = useAppSelector((state) => state.customer.is_premium);
  const [activeTab, setActiveTab] = useState<TabKey>("completed");
  const [refreshing, setRefreshing] = useState(false);

  const fetchCustomerRequests = useCallback(async () => {
    try {
      const result = await customerService.getCustomerRequests({
        limit: 1000,
        current_page: 1,
        offset: 0,
      });
      const customerRequests = result.data.items;
      console.log("customer requests: ", customerRequests);
      setRequests(customerRequests);
      setTotal(result.data.metadata.total);
    } catch (err: any) {
      console.error("this is an error: ", err);
      handleApiError(err);
    }
  }, []);

  useEffect(() => {
    fetchCustomerRequests();
  }, [fetchCustomerRequests]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCustomerRequests();
    setRefreshing(false);
  }, [fetchCustomerRequests]);

  const { completedSections, pendingSections } = useMemo(() => {
    const completed = requests
      .filter((r) => COMPLETED_STATUSES.has(r.status))
      .map(mapRequestToPickup);
    const pending = requests
      .filter((r) => !COMPLETED_STATUSES.has(r.status))
      .map(mapRequestToPickup);

    return {
      completedSections: (completed.length
        ? [{ title: null, data: completed }]
        : []) as PickupSection[],
      pendingSections: (pending.length
        ? [{ title: null, data: pending }]
        : []) as PickupSection[],
    };
  }, [requests]);

  const sections =
    activeTab === "completed" ? completedSections : pendingSections;

  const buildRequestStateFromItem = (item: CustomerRequestItem) => ({
    customer_id: item.customer_id,
    driver: {
      driver_id: item.driver?.id ?? "",
      name: item.driver
        ? [item.driver.firstname, item.driver.lastname]
            .filter(Boolean)
            .join(" ")
        : "",
      avatar: item.driver?.profile_picture ?? "",
      code: item.driver?.vehicle_plate ?? "",
      rating: item.driver?.rating ?? 0,
    },
    pickup_location:
      typeof item.pickup_location === "string"
        ? item.pickup_location
        : JSON.stringify(item.pickup_location),
    pickup_address: item.pickup_address,
    status: item.status,
    payment_method: item.payment_method ?? "",
    bags: Number(item.bags ?? 0),
    distance_m: item.distance_m,
    pickup_price: Number(item.pickup_price),
    service_price: Number(item.service_price),
    date_created: new Date(item.created_at),
    collection_code: item.collection_code,
    scheduleRequest: !!item.schedule_id,
  });

  const handlePickupPress = (pickup: Pickup) => {
    const { raw } = pickup;

    if (activeTab === "pending" && raw.status === "arrived") {
      dispatch(setRequest(buildRequestStateFromItem(raw)));
      navigation.navigate("DriverArrives");
      return;
    }

    if (activeTab === "completed" && raw.status === "completed") {
      dispatch(setRequest(buildRequestStateFromItem(raw)));
      navigation.navigate("PaymentSuccess", {
        phone: raw.payment_method ?? "",
      });
      return;
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.bg }}
      edges={["top", "left", "right"]}
    >
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        {/* Header */}
        <View
          style={{
            height: 48,
            paddingHorizontal: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: colors.bg,
          }}
        >
          <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
            <MaterialCommunityIcons
              name="chevron-left"
              size={24}
              color={colors.text}
            />
          </Pressable>
          <Text
            style={{
              fontFamily: "Poppins",
              fontWeight: "600",
              fontSize: 16,
              lineHeight: 24,
              color: colors.text,
            }}
          >
            Pickups
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <TabBar active={activeTab} onChange={setActiveTab} colors={colors} />

        <View style={{ flex: 1, padding: 20 }}>
          <View style={{ flex: 1 }}>
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 24,
              }}
            />
            <SectionList
              sections={sections}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              style={{ borderRadius: 24 }}
              contentContainerStyle={{
                paddingVertical: 11,
                paddingBottom: 140,
              }}
              stickySectionHeadersEnabled={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  tintColor="#31973D"
                  colors={["#31973D"]}
                  progressBackgroundColor={colors.surface}
                  progressViewOffset={Platform.OS === "android" ? 20 : 0}
                />
              }
              renderSectionHeader={({ section }) =>
                section.title ? (
                  <Text
                    style={{
                      fontFamily: "Poppins",
                      fontSize: 14,
                      fontWeight: "500",
                      color: colors.textSub,
                      paddingHorizontal: 16,
                      paddingTop: 12,
                      paddingBottom: 4,
                    }}
                  >
                    {section.title}
                  </Text>
                ) : null
              }
              renderItem={({ item, index, section }) => (
                <PickupRow
                  pickup={item}
                  isLast={index === section.data.length - 1}
                  colors={colors}
                  onPress={() => handlePickupPress(item)}
                />
              )}
              ListEmptyComponent={
                <View style={{ padding: 32, alignItems: "center" }}>
                  <Text
                    style={{
                      fontFamily: "Poppins",
                      fontSize: 14,
                      color: colors.textSub,
                      textAlign: "center",
                    }}
                  >
                    No pickups yet
                  </Text>
                </View>
              }
            />
          </View>
        </View>

        <AppBottomNav
          activeTab="saved"
          showCalendar={isPremium}
          navigation={navigation}
        />
      </View>
    </SafeAreaView>
  );
}

export default PickupsScreen;
