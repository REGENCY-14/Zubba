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
import { useNavigateToChoosePlan } from "../../hooks/useSubscription";
import { SidebarMenuItem } from "../../types/sidebarItem.types";
import {
  bottom_sidebar_items,
  isPremiumSidebarItems,
  noPlanSidebarItem,
  top_sidebar_items,
} from "../../constants/sidebarItems";
import { scale, verticalScale, moderateScale } from "../../utils/scale";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  getFocusedRouteName,
  getSidebarKeyForRoute,
} from "../../utils/sidebarRouteMap";

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
  ref,
) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const user = useAppSelector((state) => state.auth.user);
  const customer = useAppSelector((state) => state.customer);
  const navigateToChoosePlan = useNavigateToChoosePlan();
  const profilePicture =
    customer.profile_picture ?? user?.profile_picture ?? null;

  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState<string>(activeKey ?? "");

  useEffect(() => {
    const syncActiveFromRoute = () => {
      const state = navigation.getState?.();
      if (!state) return;
      const routeName = getFocusedRouteName(state);
      const key = getSidebarKeyForRoute(routeName);
      if (key) setActive(key);
    };

    syncActiveFromRoute();
    const unsubscribe = navigation.addListener("state", syncActiveFromRoute);
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (activeKey) setActive(activeKey);
  }, [activeKey]);

  const sidebarItems = [
    ...top_sidebar_items,
    ...(customer.is_premium ? isPremiumSidebarItems : [noPlanSidebarItem]),
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

  useImperativeHandle(ref, () => ({ open, close }));

  useEffect(() => {
    if (visible) {
      animateTo(true);
    } else if (mounted) {
      animateTo(false, () => setMounted(false));
    }
  }, [visible]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      setVisible(false);
      setMounted(false);
      translateX.setValue(-DRAWER_WIDTH);
      backdropOpacity.setValue(0);
    });
    return unsubscribe;
  }, [navigation]);

  if (!mounted) return null;

  const handleNavigate = (item: SidebarMenuItem) => {
    setActive(item.key);
    close();
    if (item.navigate === "ChoosePlan") {
      void navigateToChoosePlan();
      return;
    }
    navigation.navigate(item.navigate);
  };

  return (
    <Modal visible transparent animationType="none" onRequestClose={close}>
      <View style={{ flex: 1 }}>
        <Animated.View
          style={{
            position: "absolute",
            top: verticalScale(0),
            bottom: verticalScale(0),
            left: scale(0),
            right: scale(0),
            backgroundColor: "rgba(15,23,42,0.45)",
            opacity: backdropOpacity,
          }}
        >
          <Pressable
            style={{
              position: "absolute",
              top: verticalScale(0),
              bottom: verticalScale(0),
              left: scale(0),
              right: scale(0),
            }}
            onPress={close}
          />
        </Animated.View>

        <Animated.View
          style={{
            position: "absolute",
            top: verticalScale(0),
            bottom: verticalScale(0),
            left: scale(0),
            width: DRAWER_WIDTH,
            backgroundColor: colors.bg,
            paddingTop: insets.top + verticalScale(24),
            paddingBottom: Math.max(insets.bottom, verticalScale(20)),
            paddingHorizontal: scale(20),
            transform: [{ translateX }],
          }}
        >
          {/* Profile header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: scale(12),
              marginBottom: verticalScale(28),
            }}
          >
            <View
              style={{
                width: moderateScale(64),
                height: moderateScale(64),
                backgroundColor: colors.surface,
                borderRadius: moderateScale(12),
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: moderateScale(54),
                  height: moderateScale(54),
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {profilePicture ? (
                  <Image
                    source={{ uri: profilePicture }}
                    style={{
                      width: moderateScale(54),
                      height: moderateScale(54),
                      borderRadius: 999,
                      borderWidth: 2,
                      borderColor: "#90FA96",
                    }}
                    resizeMode="cover"
                  />
                ) : (
                  <TextAvatar
                    size={moderateScale(48)}
                    bgColor="#C7E0C9"
                    name={`${user?.firstname} ${user?.lastname}`}
                  />
                )}
                {customer.is_premium && (
                  <View
                    style={{
                      position: "absolute",
                      bottom: verticalScale(-2),
                      right: scale(-2),
                      width: moderateScale(18),
                      height: moderateScale(18),
                      borderRadius: moderateScale(9),
                      backgroundColor: "#006B23",
                      borderWidth: 2,
                      borderColor: colors.surface,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MaterialCommunityIcons
                      name="check-decagram"
                      size={moderateScale(12)}
                      color="#FFFFFF"
                      style={{
                        transform: [
                          { translateY: verticalScale(0.2) },
                          { translateX: verticalScale(0.3) },
                        ],
                      }}
                    />
                  </View>
                )}
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                numberOfLines={1}
                style={{ color: colors.text }}
                className="text-lg text-[20px]"
              >
                {`${user?.firstname} ${user?.lastname}`}
              </Text>
              <Text
                style={{ marginTop: verticalScale(2), color: colors.textSub }}
                className="text-sm"
              >
                {user?.phone}
              </Text>
            </View>
          </View>

          <View
            className="w-full border mb-5"
            style={{ borderColor: colors.border }}
          />

          {/* Menu items */}
          <View style={{ gap: moderateScale(12) }}>
            {sidebarItems.map((item) => {
              const currentScreen = item.key === active;
              return (
                <Pressable
                  key={item.key}
                  onPress={() => handleNavigate(item)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: scale(8),
                    paddingVertical: verticalScale(8),
                    paddingHorizontal: scale(12),
                    borderRadius: 999,
                    backgroundColor: currentScreen
                      ? colors.surface
                      : "transparent",
                  }}
                >
                  <View
                    style={{
                      width: moderateScale(40),
                      height: moderateScale(40),
                      borderRadius: moderateScale(18),
                      backgroundColor: colors.iconBg,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MaterialCommunityIcons
                      name={item.icon as any}
                      size={moderateScale(24)}
                      color="#2F8F4E"
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: moderateScale(14),
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
});

export default Sidebar;
