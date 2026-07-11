import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { TextAvatar } from "../onboarding/TextAvatar";
import { useTheme } from "../../context/ThemeContext";
import { useAppSelector } from "../../hooks/useAppSelector";
import { RootStackParamList } from "../../navigation/types";

export type SidebarMenuItem = {
  key: string;
  label: string;
  icon: string;
  navigate: keyof RootStackParamList;
};

export const DEFAULT_SIDEBAR_ITEMS: SidebarMenuItem[] = [
  { key: "home", label: "Home", icon: "home-outline", navigate: "Home" },
  {
    key: "profile",
    label: "Profile",
    icon: "account-outline",
    navigate: "Profile",
  },
  {
    key: "wallet",
    label: "Zubba Wallet",
    icon: "wallet-outline",
    navigate: "ZubbaWallet",
  },
  {
    key: "subscription",
    label: "Subscription",
    icon: "clock-outline",
    navigate: "ConfirmSubscription",
  },
  {
    key: "settings",
    label: "Settings",
    icon: "cog-outline",
    navigate: "Settings",
  },
  {
    key: "support",
    label: "Support",
    icon: "face-agent",
    navigate: "HelpCenter",
  },
];

const avatarUrl = require("../../../assets/avatar.jpg");
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DRAWER_WIDTH = Math.round(SCREEN_WIDTH * 0.72);

type SidebarProps = {
  visible: boolean;
  onClose: () => void;
  isVerified?: boolean;
  menuItems?: SidebarMenuItem[];
  navigation: any;
  activeKey?: string;
};

export default function Sidebar({
  visible,
  onClose,
  isVerified = true,
  menuItems = DEFAULT_SIDEBAR_ITEMS,
  navigation,
  activeKey,
}: SidebarProps) {
  const { colors } = useTheme();
  const user = useAppSelector((state) => state.auth.user);
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(visible);
  const [active, setActive] = useState<string>(activeKey ?? "");

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 260,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (mounted) {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -DRAWER_WIDTH,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(() => setMounted(false));
    }
  }, [visible]);

  if (!mounted) return null;

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose}>
      <View style={{ flex: 1 }}>
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "rgba(15,23,42,0.45)",
            opacity: backdropOpacity,
          }}
        >
          <Pressable
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
            onPress={onClose}
          />
        </Animated.View>

        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: DRAWER_WIDTH,
            backgroundColor: colors.bg,
            paddingTop: 24,
            paddingHorizontal: 20,
            transform: [{ translateX }],
          }}
        >
          {/* Profile header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              marginBottom: 28,
            }}
          >
            <View
              style={{
                width: 64,
                height: 64,
                backgroundColor: "#F4F4F5",
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View style={{ width: 54, height: 54 }}>
                {avatarUrl ? (
                  <Image
                    source={avatarUrl}
                    style={{
                      width: 54,
                      height: 54,
                      borderRadius: 999,
                      borderWidth: 2,
                      borderColor: "#90FA96",
                    }}
                    resizeMode="cover"
                  />
                ) : (
                  <TextAvatar
                    size={48}
                    bgColor="#C7E0C9"
                    name={`${user?.firstname} ${user?.lastname}`}
                  />
                )}
                {isVerified && (
                  <View
                    style={{
                      position: "absolute",
                      bottom: -2,
                      right: -2,
                      width: 18,
                      height: 18,
                      borderRadius: 9,
                      backgroundColor: "#006B23",
                      borderWidth: 2,
                      borderColor: "#FFFFFF",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MaterialCommunityIcons
                      name="check-decagram"
                      size={11}
                      color="#FFFFFF"
                    />
                  </View>
                )}
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                numberOfLines={1}
                style={{ fontSize: 15, fontWeight: "700", color: colors.text }}
              >
                {`${user?.firstname} ${user?.lastname}`}
              </Text>
              <Text
                style={{ fontSize: 12, marginTop: 2, color: colors.textSub }}
              >
                {user?.phone}
              </Text>
            </View>
          </View>

          <View
            className="w-full border mb-5"
            style={{ borderColor: colors.border }}
          ></View>

          {/* Menu items */}
          <View style={{ gap: 12 }}>
            {menuItems.map((item) => {
              const currentScreen = item.key === active;
              return (
                <Pressable
                  key={item.key}
                  onPress={() => {
                    setActive(item.key);
                    navigation.navigate(item.navigate);
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 999,
                    backgroundColor: currentScreen
                      ? colors.surface
                      : "transparent",
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 18,
                      backgroundColor: colors.iconBg,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MaterialCommunityIcons
                      name={item.icon as any}
                      size={24}
                      color="#2F8F4E"
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: colors.text,
                    }}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
