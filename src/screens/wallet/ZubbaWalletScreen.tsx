import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { RootStackScreenProps } from "../../navigation/types";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useTheme } from "../../context/ThemeContext";
import PaymentMethodDrawer from "../../components/payment/PaymentDrawer";
import { toast } from "../../hooks/toast";

const zubbaText = require("../../../assets/zubbaText.png");
const activitesImage = require("../../../assets/activities.png");

type PaymentKey = "mtn" | "telecel" | "airtel" | "card";

const PAYMENT_METHODS: {
  key: PaymentKey;
  name: string;
  badgeBg: string;
  badgeLabel: string;
  badgeLabelColor: string;
  badgeFontWeight: "600" | "700";
  badgeIcon?: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  badgeIconColor?: string;
}[] = [
  {
    key: "mtn",
    name: "MTN MoMo",
    badgeBg: "#FFCC00",
    badgeLabel: "MTN",
    badgeLabelColor: "#000000",
    badgeFontWeight: "600",
  },
  {
    key: "telecel",
    name: "Telecel Cash",
    badgeBg: "#DC2626",
    badgeLabel: "T.cash",
    badgeLabelColor: "#FFFFFF",
    badgeFontWeight: "700",
  },
  {
    key: "airtel",
    name: "Airtel Money",
    badgeBg: "#FFFFFF",
    badgeLabel: "Airtel",
    badgeLabelColor: "#EF0000",
    badgeFontWeight: "700",
  },
  {
    key: "card",
    name: "Credit Card",
    badgeBg: "#FFF7ED",
    badgeLabel: "",
    badgeLabelColor: "#000000",
    badgeFontWeight: "600",
    badgeIcon: "credit-card-outline",
    badgeIconColor: "#31973D",
  },
];

type TxStatus = "SUCCESS" | "CREDITED" | "PENDING" | "FAILED";

type Transaction = {
  id: string;
  title: string;
  date: string;
  amount: string;
  amountColor: string;
  status: TxStatus;
  iconBg: string;
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  iconColor: string;
};

const STATUS_COLOR: Record<TxStatus, string> = {
  SUCCESS: "#31973D",
  CREDITED: "#31973D",
  PENDING: "#555E59",
  FAILED: "#FF383C",
};

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    title: "Weekly Pickup Fee",
    date: "Oct 24, 2023 • 08:45 AM",
    amount: "- GHS 45.00",
    amountColor: "#FF383C",
    status: "SUCCESS",
    iconBg: "rgba(0, 107, 35, 0.1)",
    iconName: "receipt-text-outline",
    iconColor: "#31973D",
  },
  {
    id: "2",
    title: "Eco-Reward",
    date: "Oct 22, 2023 • 02:15 PM",
    amount: "+ 250 pts",
    amountColor: "#31973D",
    status: "CREDITED",
    iconBg: "#FFE088",
    iconName: "leaf",
    iconColor: "#735C00",
  },
  {
    id: "3",
    title: "MoMo Top-up",
    date: "Oct 20, 2023 • 11:30 AM",
    amount: "+ GHS 200.00",
    amountColor: "#31973D",
    status: "PENDING",
    iconBg: "rgba(20, 135, 50, 0.1)",
    iconName: "cellphone",
    iconColor: "#31973D",
  },
];

function TransactionRow({ tx, isLast }: { tx: Transaction; isLast: boolean }) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 16,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: colors.borderLight,
      }}
    >
      {/* Icon */}
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 9999,
          backgroundColor: tx.iconBg,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialCommunityIcons
          name={tx.iconName}
          size={20}
          color={tx.iconColor}
        />
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "500",
            letterSpacing: 0.28,
            color: colors.textMuted,
            lineHeight: 17,
          }}
        >
          {tx.title}
        </Text>
        <Text
          style={{
            fontSize: 13,
            fontWeight: "400",
            color: "#ACB5BB",
            lineHeight: 21,
          }}
        >
          {tx.date}
        </Text>
      </View>

      {/* Amount + status */}
      <View style={{ alignItems: "flex-end", gap: 4 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            letterSpacing: 0.28,
            color: tx.amountColor,
            lineHeight: 17,
          }}
        >
          {tx.amount}
        </Text>
        <Text
          style={{
            fontSize: 10,
            fontWeight: "600",
            letterSpacing: -0.5,
            textTransform: "uppercase",
            color: STATUS_COLOR[tx.status],
            lineHeight: 15,
          }}
        >
          {tx.status}
        </Text>
      </View>
    </View>
  );
}

export function ZubbaWalletScreen({
  navigation,
  route,
}: RootStackScreenProps<"ZubbaWallet">) {
  const customer = useAppSelector((state) => state.customer);
  const { colors } = useTheme();

  const [balanceVisible, setBalanceVisible] = useState(true);
  const [activeSheet, setActiveSheet] = useState<"topup" | "withdraw">("topup");
  const [sheetOpen, setSheetOpen] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerToast = (message: string) => {
    toast.success(message);
  };

  useEffect(() => {
    if (route.params?.credited)
      triggerToast("Zubba account credited successfully");
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, [route.params?.credited]);

  useEffect(() => {
    if (route.params?.debited) triggerToast("Withdrawal successful");
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, [route.params?.debited]);

  const ecoPoints = customer.points.toLocaleString();
  const hasTransactions = MOCK_TRANSACTIONS.length > 0;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.bg }}
      edges={["top", "left", "right"]}
    >
      {/* Header */}
      <View
        style={{
          height: 48,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          backgroundColor: colors.bg,
        }}
      >
        <Pressable
          onPress={() => navigation.pop()}
          className="w-8 h-8 items-center justify-center"
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={20}
            color={colors.iconColor}
          />
        </Pressable>

        <View style={{ alignItems: "center", gap: 1 }}>
          <Image
            source={zubbaText}
            style={{ width: 38, height: 17 }}
            resizeMode="contain"
            tintColor="#31973D"
          />
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              letterSpacing: 0.6,
              textTransform: "uppercase",
              color: colors.text,
              lineHeight: 14,
            }}
          >
            Account
          </Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 12, paddingBottom: 40 }}
      >
        {/* Main card container */}
        <View
          style={{
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 35,
            paddingVertical: 11,
            gap: 24,
            alignItems: "center",
          }}
        >
          {/* Balance card */}
          <View
            style={{
              width: "95%",
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 24,
              padding: 24,
              gap: 12,
            }}
          >
            {/* Top row: balance + premium badge */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <View style={{ gap: 4, flex: 1 }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "500",
                    letterSpacing: 0.6,
                    textTransform: "uppercase",
                    color: colors.text,
                    opacity: 0.9,
                    lineHeight: 14,
                  }}
                >
                  Available Balance
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 32,
                      fontWeight: "600",
                      color: colors.text,
                      lineHeight: 38,
                    }}
                  >
                    {balanceVisible ? "GHS 500.00" : "GHS XXXXX"}
                  </Text>
                  <Pressable onPress={() => setBalanceVisible((v) => !v)}>
                    <MaterialCommunityIcons
                      name={balanceVisible ? "eye-outline" : "eye-off-outline"}
                      size={16}
                      color={colors.textSub}
                    />
                  </Pressable>
                </View>
              </View>

              {/* Premium badge */}
              {customer.is_premium && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    backgroundColor: "#FFE088",
                    borderRadius: 39,
                    paddingHorizontal: 12,
                    paddingVertical: 3,
                    borderWidth: 1,
                    borderColor: "#D4AF37",
                  }}
                >
                  <MaterialCommunityIcons
                    name="star"
                    size={11}
                    color="#574500"
                  />
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "400",
                      letterSpacing: 0.48,
                      color: "#574500",
                      lineHeight: 14,
                    }}
                  >
                    Premium
                  </Text>
                </View>
              )}
            </View>

            {/* Eco-Points row */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 16,
                height: 40,
                borderRadius: 8,
                gap: 8,
              }}
            >
              <MaterialCommunityIcons name="leaf" size={17} color="#31973D" />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "500",
                    letterSpacing: 0.48,
                    color: colors.text,
                    opacity: 0.8,
                  }}
                >
                  Eco-Points
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "baseline",
                    gap: 4,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "400",
                      color: "#31973D",
                      lineHeight: 28,
                    }}
                  >
                    {ecoPoints}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "400",
                      color: "#31973D",
                      opacity: 0.8,
                    }}
                  >
                    pts
                  </Text>
                </View>
              </View>

              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color="#ACB5BB"
                opacity={0.6}
              />
            </View>
          </View>

          {/* Action buttons */}
          <View style={{ width: "95%", flexDirection: "row", gap: 10 }}>
            <Pressable
              style={{
                flex: 1,
                height: 91,
                backgroundColor:
                  activeSheet === "withdraw" ? "#FFFFFF" : "#31973D",
                borderWidth: activeSheet === "withdraw" ? 1 : 0,
                borderColor: "#E2E8F0",
                borderRadius: 24,
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
              }}
              onPress={() => {
                setActiveSheet("topup");
                setSheetOpen(true);
              }}
            >
              <MaterialCommunityIcons
                name="plus-circle-outline"
                size={20}
                color={activeSheet === "withdraw" ? "#31973D" : "#FFFFFF"}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: activeSheet === "withdraw" ? "#31973D" : "#FFFFFF",
                  letterSpacing: 0.28,
                }}
              >
                Top Up
              </Text>
            </Pressable>

            <Pressable
              style={{
                flex: 1,
                height: 91,
                backgroundColor:
                  activeSheet === "withdraw" ? "#31973D" : "#FFFFFF",
                borderWidth: activeSheet === "withdraw" ? 0 : 1,
                borderColor: "#E2E8F0",
                borderRadius: 24,
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
              }}
              onPress={() => {
                setActiveSheet("withdraw");
                setSheetOpen(true);
              }}
            >
              <MaterialCommunityIcons
                name="send-outline"
                size={18}
                color={activeSheet === "withdraw" ? "#FFFFFF" : "#31973D"}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: activeSheet === "withdraw" ? "#FFFFFF" : "#31973D",
                  letterSpacing: 0.28,
                }}
              >
                Withdraw
              </Text>
            </Pressable>
          </View>

          {/* Recent Activity */}
          <View style={{ width: "95%", gap: 16 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "500",
                  color: colors.text,
                  lineHeight: 28,
                }}
              >
                Recent Activity
              </Text>
              <MaterialCommunityIcons
                name="tune-variant"
                size={18}
                color="#ACB5BB"
              />
            </View>

            {!hasTransactions ? (
              /* Transactions list */
              <View>
                <View
                  style={{
                    backgroundColor: colors.bg,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 24,
                    overflow: "hidden",
                  }}
                >
                  {MOCK_TRANSACTIONS.map((tx, i) => (
                    <TransactionRow
                      key={tx.id}
                      tx={tx}
                      isLast={i === MOCK_TRANSACTIONS.length - 1}
                    />
                  ))}
                </View>

                {/* View All button */}
                <Pressable
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingVertical: 8,
                  }}
                  onPress={() => navigation.navigate("Transactions")}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: colors.textSub,
                      letterSpacing: 0.28,
                    }}
                  >
                    View All Transactions
                  </Text>
                </Pressable>
              </View>
            ) : (
              /* Empty state */
              <View
                style={{
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 24,
                  paddingVertical: 64,
                  paddingHorizontal: 24,
                  alignItems: "center",
                  gap: 24,
                }}
              >
                <View style={{ alignItems: "center", gap: 24 }}>
                  <View>
                    <Image
                      source={activitesImage}
                      style={{ width: 166, height: 166 }}
                      resizeMode="contain"
                    />
                  </View>
                  <View
                    style={{
                      alignItems: "center",
                      gap: 4,
                      paddingHorizontal: 24,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "500",
                        color: colors.text,
                        textAlign: "center",
                        lineHeight: 24,
                      }}
                    >
                      No activities recorded
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "400",
                        color: colors.textSub,
                        textAlign: "center",
                        lineHeight: 20,
                      }}
                    >
                      Recorded activities will apprear here
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Top Up bottom sheet */}
      <PaymentMethodDrawer
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onContinue={() => {
          const dest =
            activeSheet === "withdraw" ? "Withdraw" : "CreditAccount";
          setSheetOpen(false);
          navigation.navigate(dest);
        }}
      />
    </SafeAreaView>
  );
}

export default ZubbaWalletScreen;
