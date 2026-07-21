import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
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
import { SidebarMenuItem } from "../../types/sidebarItem.types";
import { bottom_sidebar_items, isPremiumSidebarItem, noPlanSidebarItem, top_sidebar_items } from "../../constants/sidebarItems";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const avatarUrl = require("../../../assets/avatar.jpg");
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DRAWER_WIDTH = Math.round(SCREEN_WIDTH * 0.7);

export type SidebarHandle = {
  open: () => void;
  close: () => void;
};

type SidebarProps = {
  isVerified?: boolean;
  menuItems?: SidebarMenuItem[];
  navigation: any;
  activeKey?: string;
};

const Sidebar = forwardRef<SidebarHandle, SidebarProps>(function Sidebar(
  { isVerified = true, menuItems = [], navigation, activeKey },
  ref
) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const user = useAppSelector((state) => state.auth.user);
  const customer = useAppSelector((state) => state.customer);

  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Internal ownership of open/closed state — parent no longer holds this.
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState<string>(activeKey ?? "");

  const sidebarItems = [
    ...top_sidebar_items,
    ...(customer.is_premium ? [isPremiumSidebarItem] : [noPlanSidebarItem]),
    ...bottom_sidebar_items,
    ...menuItems,
  ];

  const animateTo = (open: boolean, onDone?: () => void) => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: open ? 0 : -DRAWER_WIDTH,
        duration: open ? 260 : 220,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: open ? 1 : 0,
        duration: open ? 260 : 220,
        useNativeDriver: true,
      }),
    ]).start(() => onDone?.());
  };

  const open = () => {
    setMounted(true);
    setVisible(true);
  };

  const close = () => {
    setVisible(false);
  };

  // Expose imperative API to parent — parent just calls ref.current?.open()
  useImperativeHandle(ref, () => ({ open, close }));

  useEffect(() => {
    if (visible) {
      animateTo(true);
    } else if (mounted) {
      animateTo(false, () => setMounted(false));
    }
  }, [visible]);

  // Force-close whenever this screen loses focus (back nav, tab switch, etc.)
  // so re-entering the screen never shows a stale "open" drawer.
  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      setVisible(false);
      setMounted(false);
      // reset animated values instantly, no transition, so it's not visible mid-flight
      translateX.setValue(-DRAWER_WIDTH);
      backdropOpacity.setValue(0);
    });
    return unsubscribe;
  }, [navigation]);

  if (!mounted) return null;

  const handleNavigate = (item: SidebarMenuItem) => {
    setActive(item.key);
    close(); // close first
    navigation.navigate(item.navigate);
  };

  return (
    <Modal visible transparent animationType="none" onRequestClose={close}>
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
            style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
            onPress={close}
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
            paddingTop: insets.top + 24,
            paddingBottom: Math.max(insets.bottom, 20),
            paddingHorizontal: 20,
            transform: [{ translateX }],
          }}
        >
          {/* Profile header */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 28 }}>
            <View
              style={{
                width: 64,
                height: 64,
                backgroundColor: colors.surface,
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
                  <TextAvatar size={48} bgColor="#C7E0C9" name={`${user?.firstname} ${user?.lastname}`} />
                )}
                {customer.is_premium && (
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
                    <MaterialCommunityIcons name="check-decagram" size={11} color="#FFFFFF" />
                  </View>
                )}
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text numberOfLines={1} style={{ color: colors.text }} className="text-lg text-[20px]">
                {`${user?.firstname} ${user?.lastname}`}
              </Text>
              <Text style={{ marginTop: 2, color: colors.textSub }} className="text-sm">
                {user?.phone}
              </Text>
            </View>
          </View>

          <View className="w-full border mb-5" style={{ borderColor: colors.border }} />

          {/* Menu items */}
          <View style={{ gap: 12 }}>
            {sidebarItems.map((item) => {
              const currentScreen = item.key === active;
              return (
                <Pressable
                  key={item.key}
                  onPress={() => handleNavigate(item)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 999,
                    backgroundColor: currentScreen ? colors.surface : "transparent",
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
                    <MaterialCommunityIcons name={item.icon as any} size={24} color="#2F8F4E" />
                  </View>
                  <Text style={{ fontSize: 14, fontWeight: "500", color: colors.text }}>
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
});

export default Sidebar;