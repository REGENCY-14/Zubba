import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { RootStackScreenProps } from "../../navigation/types";
import { AppBottomNav } from "../../components";
import RoundedButton from "../../components/common/RoundedButton";
import { useAppSelector } from "../../hooks/useAppSelector";
import { StatCardsRow } from "../../components/onboarding/StatCardsRow";
import { TextAvatar } from "../../components/onboarding/TextAvatar";
import { PremiumSidebar } from "../../components/home/PremiumSidebar";
import AnimatedSwitch from "../../components/ui/inputs/AnimatedSwitch";
import { useTheme } from "../../context/ThemeContext";

const mapImage = require("../../../assets/RawMap.png");
const futurePlan = require("../../../assets/futurePlan.png");
const tricycle = require("../../../assets/picktricycle.png");

const CLOSE_DRIVERS = ["Aaron", "Bob", "Candice"];

export function PremiumHomeScreen({ navigation }: RootStackScreenProps<"PremiumHome">) {
  const [isBinFull, setIsBinFull] = useState<boolean>(false);
  const [showBinToast, setShowBinToast] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activePill, setActivePill] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const toastTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleBinToggle = (val: boolean) => {
    setIsBinFull(val);
    if (val) {
      setShowBinToast(true);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setShowBinToast(false), 4000);
    } else {
      setShowBinToast(false);
    }
  };
  const customer = useAppSelector((state) => state.customer);
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top", "left", "right"]}>
      <ImageBackground source={mapImage} style={{ flex: 1, width: "100%", height: "100%" }} resizeMode="cover">

        {/* Full-height flex column: top — map — bottom */}
        <View style={{ flex: 1, justifyContent: "space-between" }}>

          {/* ── Top section ── */}
          <View>
            {/* Top bar */}
            <View
              style={{
                height: 52,
                backgroundColor: colors.bg,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 16,
              }}
            >
              <Pressable
                style={{ width: 32, height: 32, alignItems: "center", justifyContent: "center" }}
                onPress={() => setSidebarOpen(true)}
              >
                <MaterialCommunityIcons name="menu" size={22} color={colors.iconColor} />
              </Pressable>

              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Text style={{ fontSize: 12, color: colors.textSub }}>Bin Full?</Text>
                <AnimatedSwitch value={isBinFull} onChange={handleBinToggle} />
                <Pressable
                  style={{
                    width: 40,
                    height: 40,
                    borderWidth: 1,
                    borderColor: colors.border,
                    backgroundColor: colors.iconBg,
                    borderRadius: 8,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => navigation.navigate("Notifications")}
                >
                  <MaterialCommunityIcons name="bell-outline" size={20} color={colors.iconColor} />
                </Pressable>
              </View>
            </View>

            {/* Pickup location card */}
            <View style={{ paddingHorizontal: 12, paddingTop: 8 }}>
              <View
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderWidth: 1,
                  borderRadius: 20,
                  padding: 12,
                  gap: 12,
                }}
              >
                {/* Pill switcher */}
                <View
                  style={{
                    backgroundColor: colors.surface,
                    padding: 4,
                    borderRadius: 999,
                    flexDirection: "row",
                    gap: 4,
                  }}
                >
                  {[{ label: "Pickup Location", index: 0 }, { label: "Find Driver", index: 1 }].map(({ label, index }) => (
                    <Pressable
                      key={index}
                      onPress={() => setActivePill(index)}
                      style={[
                        {
                          borderRadius: 999,
                          flex: 1,
                          alignItems: "center",
                          justifyContent: "center",
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                        },
                        activePill === index
                          ? { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }
                          : {},
                      ]}
                    >
                      <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text }}>{label}</Text>
                    </Pressable>
                  ))}
                </View>

                {/* Search bar */}
                <View
                  style={{
                    height: 48,
                    backgroundColor: colors.card,
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: colors.border,
                    paddingHorizontal: 14,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Pressable
                    onPress={() => navigation.navigate("Details", { itemId: "search", title: "Search" })}
                  >
                    <MaterialCommunityIcons name="magnify" size={22} color={colors.iconColor} />
                  </Pressable>
                  <TextInput
                    style={{ flex: 1, fontSize: 14, color: colors.text, padding: 0 }}
                    placeholder={activePill === 0 ? "Tarkwa, UMaT Campus, Hall 3" : "Search driver by name ..."}
                    placeholderTextColor={colors.textMuted}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                  {searchQuery.length > 0 && (
                    <Pressable
                      onPress={() => setSearchQuery("")}
                      style={{ width: 28, height: 28, alignItems: "center", justifyContent: "center" }}
                    >
                      <MaterialCommunityIcons name="close-circle" size={20} color="#EF4444" />
                    </Pressable>
                  )}
                </View>

                {/* Nearby drivers */}
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 4 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      {CLOSE_DRIVERS.slice(0, 2).map((driver, index) => (
                        <View key={index} style={{ marginLeft: index === 0 ? 0 : -8, zIndex: index === 0 ? 1 : 2 }}>
                          <TextAvatar size={24} bgColor={index === 1 ? "#FFE088" : "#90FA96"} name={driver} />
                        </View>
                      ))}
                    </View>
                    <Text style={{ fontSize: 13, fontWeight: "500", color: colors.textSub }}>
                      {CLOSE_DRIVERS.length} verified drivers nearby
                    </Text>
                  </View>
                  <View style={{ backgroundColor: "#148732", borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 }}>
                    <Text style={{ fontSize: 11, color: "#fff" }}>New</Text>
                  </View>
                </View>

                {/* Stat cards */}
                <StatCardsRow
                  mass_recycled={customer.mass_recycled}
                  points={customer.points}
                  noCard
                />
              </View>
            </View>
          </View>

          {/* ── Bottom section ── */}
          <View style={{ paddingHorizontal: 12, paddingBottom: 96, gap: 8 }}>
            {/* Find nearby tricycles */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 999,
                paddingVertical: 8,
                paddingHorizontal: 12,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: "rgba(65,158,106,0.10)",
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Image
                  source={tricycle}
                  style={{ width: 26, height: 26, transform: [{ scaleX: -1 }] }}
                  resizeMode="contain"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text, lineHeight: 20 }}>Find nearby tricycles</Text>
                <Text style={{ fontSize: 12, color: colors.textSub, fontWeight: "400", lineHeight: 16 }}>Instant pickup</Text>
              </View>
              <RoundedButton title="Request now" variant="primary" onPress={() => navigation.navigate("Scanning")} />
            </View>

            {/* Plan for later */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: "#FFE088",
                borderRadius: 999,
                paddingVertical: 8,
                paddingHorizontal: 12,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: "#EFF5FF",
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Image
                  source={futurePlan}
                  style={{ width: 20, height: 20, transform: [{ scaleX: -1 }] }}
                  resizeMode="contain"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text, lineHeight: 20 }}>Plan future pickup</Text>
                <Text style={{ fontSize: 12, color: colors.textSub, fontWeight: "400", lineHeight: 16 }}>Future service</Text>
              </View>
              <RoundedButton title="Plan for later" variant="premium" onPress={() => navigation.navigate("PlanForLater")} />
            </View>
          </View>

        </View>

        {/* Bin full toast */}
        {showBinToast && (
          <View
            style={{
              position: "absolute",
              left: 16,
              right: 16,
              top: 60,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 8,
              paddingHorizontal: 20,
              backgroundColor: "#F0F9FF",
              borderWidth: 1,
              borderColor: "#38BDF8",
              borderRadius: 999,
              zIndex: 100,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: "#0EA5E9", alignItems: "center", justifyContent: "center" }}>
                <MaterialCommunityIcons name="information" size={14} color="#FFFFFF" />
              </View>
              <Text style={{ fontFamily: "Poppins", fontWeight: "500", fontSize: 13, lineHeight: 28, color: "#0284C7" }}>
                Bin signal sent. Driver will attend in no time
              </Text>
            </View>
            <Pressable onPress={() => setShowBinToast(false)} hitSlop={8}>
              <MaterialCommunityIcons name="close" size={16} color="#0284C7" />
            </Pressable>
          </View>
        )}

        <AppBottomNav
          activeTab="home"
          paddingBottom={0}
          showCalendar
          onHomePress={() => navigation.navigate("PremiumHome")}
          onSavedPress={() => navigation.navigate("Pickups")}
          onSettingsPress={() => navigation.navigate("Settings")}
          onCalendarPress={() => navigation.navigate("Schedule")}
        />

        <PremiumSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeKey="profile"
          menuItems={[
            { key: "profile",      label: "Profile",       icon: "account-outline", onPress: () => navigation.navigate("Profile") },
            { key: "wallet",       label: "Zubba Wallet",  icon: "wallet-outline",  onPress: () => navigation.navigate("ZubbaWallet") },
            { key: "subscription", label: "Subscription",  icon: "crown-outline",   onPress: () => navigation.navigate("ManageSubscription") },
            { key: "settings",     label: "Settings",      icon: "cog-outline",     onPress: () => navigation.navigate("Settings") },
            { key: "support",      label: "Support",       icon: "headset",         onPress: () => navigation.navigate("HelpCenter") },
            { key: "promotions",   label: "Promotions",    icon: "tag-outline",     onPress: () => navigation.navigate("Promotions") },
          ]}
        />

      </ImageBackground>
    </SafeAreaView>
  );
}
