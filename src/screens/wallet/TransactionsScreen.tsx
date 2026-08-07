import React, { useState, useCallback, useMemo, useRef } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
  RefreshControl,
  Dimensions,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";
import CustomAppBar from "../../components/common/CustomAppBar";
import {
  useWalletTransactions,
  type RawWalletTransaction,
} from "../../hooks/useWallet";
import { scale, verticalScale, moderateScale } from "../../utils/scale";

type TxStatus = "SUCCESS" | "CREDITED" | "PENDING" | "FAILED";
type FilterKey = "All" | "Incoming" | "Expenses" | "Success" | "Failed";

type Transaction = {
  id: string;
  title: string;
  date: string;
  amount: string;
  amountColor: string;
  status: TxStatus;
  type: "incoming" | "expense";
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

const FILTERS: FilterKey[] = [
  "All",
  "Incoming",
  "Expenses",
  "Success",
  "Failed",
];

function applyFilter(txs: Transaction[], filter: FilterKey): Transaction[] {
  switch (filter) {
    case "Incoming":
      return txs.filter((t) => t.type === "incoming");
    case "Expenses":
      return txs.filter((t) => t.type === "expense");
    case "Success":
      return txs.filter(
        (t) => t.status === "SUCCESS" || t.status === "CREDITED",
      );
    case "Failed":
      return txs.filter((t) => t.status === "FAILED");
    default:
      return txs;
  }
}

function TransactionRow({ tx, isLast }: { tx: Transaction; isLast: boolean }) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(16),
        gap: moderateScale(16),
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: colors.borderLight,
      }}
    >
      <View
        style={{
          width: moderateScale(40),
          height: moderateScale(40),
          borderRadius: 9999,
          backgroundColor: tx.iconBg,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialCommunityIcons
          name={tx.iconName}
          size={moderateScale(20)}
          color={tx.iconColor}
        />
      </View>

      <View style={{ flex: 1, gap: moderateScale(4) }}>
        <Text
          style={{
            fontSize: moderateScale(14),
            fontWeight: "500",
            letterSpacing: 0.28,
            color: colors.text,
            lineHeight: moderateScale(17),
          }}
        >
          {tx.title}
        </Text>
        <Text
          style={{
            fontSize: moderateScale(13),
            fontWeight: "400",
            color: colors.textSub,
            lineHeight: moderateScale(21),
          }}
        >
          {tx.date}
        </Text>
      </View>

      <View style={{ alignItems: "flex-end", gap: moderateScale(4) }}>
        <Text
          style={{
            fontSize: moderateScale(14),
            fontWeight: "600",
            letterSpacing: 0.28,
            color: tx.amountColor,
            lineHeight: moderateScale(17),
          }}
        >
          {tx.amount}
        </Text>
        <Text
          style={{
            fontSize: moderateScale(10),
            fontWeight: "600",
            letterSpacing: -0.5,
            textTransform: "uppercase",
            color: STATUS_COLOR[tx.status],
            lineHeight: moderateScale(15),
          }}
        >
          {tx.status}
        </Text>
      </View>
    </View>
  );
}

export function TransactionsScreen({
  navigation,
}: RootStackScreenProps<"Transactions">) {
  const { colors } = useTheme();

  const [activeFilter, setActiveFilter] = useState<FilterKey>("All");
  const [showFilter, setShowFilter] = useState(false);
  const [filterAnchor, setFilterAnchor] = useState<{
    top: number;
    right: number;
  } | null>(null);
  const filterButtonRef = useRef<View>(null);
  const [refreshing, setRefreshing] = useState(false);

  const openFilter = useCallback(() => {
    filterButtonRef.current?.measureInWindow((x, y, width, height) => {
      const screenWidth = Dimensions.get("window").width;
      setFilterAnchor({
        top: y + height + 6,
        right: screenWidth - (x + width),
      });
      setShowFilter(true);
    });
  }, []);

  const mapTransaction = (item: RawWalletTransaction): Transaction => {
    const isExpense =
      item.transaction_type === "withdrawal" || item.transaction_type === "fee";
    const amount = Number(item.amount) || 0;

    return {
      id: item.id ?? String(Date.now()),
      title: item.transaction_type ?? "Transaction",
      date: item.created_at
        ? new Date(item.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Unknown date",
      amount: isExpense
        ? `- GHS ${amount.toFixed(2)}`
        : `+ GHS ${amount.toFixed(2)}`,
      amountColor: isExpense ? "#FF383C" : "#31973D",
      status: (item.status as TxStatus) || "SUCCESS",
      type: isExpense ? "expense" : "incoming",
      iconBg: isExpense ? "rgba(255, 56, 60, 0.1)" : "rgba(0, 107, 35, 0.1)",
      iconName: isExpense ? "receipt-text-outline" : "cellphone",
      iconColor: isExpense ? "#FF383C" : "#31973D",
    };
  };

  const {
    data: rawTransactions,
    isLoading,
    refetch,
  } = useWalletTransactions({ limit: 50 });

  const transactions = useMemo(
    () => (rawTransactions ?? []).map(mapTransaction),
    [rawTransactions],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const filtered = applyFilter(transactions, activeFilter);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.bg }}
      edges={["top", "left", "right"]}
    >
      <CustomAppBar title="Transactions" navigation={navigation} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: moderateScale(12), paddingBottom: verticalScale(40) }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.text}
            colors={["#31973D"]}
          />
        }
      >
        {/* Main card */}
        <View
          style={{
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: moderateScale(24),
            paddingVertical: verticalScale(11),
            paddingHorizontal: scale(11),
            gap: moderateScale(16),
          }}
        >
          {/* Section header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: scale(5),
            }}
          >
            <Text
              style={{
                fontSize: moderateScale(20),
                fontWeight: "500",
                color: colors.text,
                lineHeight: moderateScale(28),
              }}
            >
              Recent Activity
            </Text>
            <Pressable
              ref={filterButtonRef}
              onPress={openFilter}
              style={{
                width: moderateScale(32),
                height: moderateScale(32),
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialCommunityIcons
                name="tune-variant"
                size={moderateScale(18)}
                color={colors.iconColor}
              />
            </Pressable>
          </View>

          {/* Loading state */}
          {isLoading && !refreshing && (
            <View style={{ padding: 32, alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.textSub,
                  textAlign: "center",
                }}
              >
                Loading transactions...
              </Text>
            </View>
          )}

          {/* Transactions list */}
          {!isLoading && (
            <View
              style={{
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: moderateScale(24),
                overflow: "hidden",
              }}
            >
              {filtered.length > 0 ? (
                filtered.map((tx, i) => (
                  <TransactionRow
                    key={tx.id + i}
                    tx={tx}
                    isLast={i === filtered.length - 1}
                  />
                ))
              ) : (
                <View style={{ padding: moderateScale(32), alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: moderateScale(14),
                      color: colors.textSub,
                      textAlign: "center",
                    }}
                  >
                    No transactions found
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Filter dropdown overlay */}
      <Modal
        transparent
        visible={showFilter}
        animationType="fade"
        onRequestClose={() => setShowFilter(false)}
      >
        <Pressable style={{ flex: 1 }} onPress={() => setShowFilter(false)}>
          {filterAnchor && (
            <View
              style={{
                position: "absolute",
                top: filterAnchor.top,
                right: filterAnchor.right,
                width: scale(161),
                backgroundColor: colors.bg,
                borderWidth: 1,
                borderColor: colors.borderLight,
                borderRadius: moderateScale(24),
                padding: moderateScale(8),
                gap: moderateScale(4),
                shadowColor: "rgba(69, 71, 69, 0.15)",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 1,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              {FILTERS.map((filter) => {
                const isActive = filter === activeFilter;
                return (
                  <Pressable
                    key={filter}
                    onPress={() => {
                      setActiveFilter(filter);
                      setShowFilter(false);
                    }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: scale(8),
                      height: verticalScale(32),
                      borderRadius: moderateScale(16),
                      backgroundColor: isActive
                        ? colors.surface
                        : "transparent",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: moderateScale(14),
                        fontWeight: "400",
                        color: isActive ? colors.text : colors.textMuted,
                        lineHeight: moderateScale(20),
                      }}
                    >
                      {filter}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

export default TransactionsScreen;
