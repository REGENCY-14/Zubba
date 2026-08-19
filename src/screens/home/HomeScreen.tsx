import { useEffect, useRef, useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { RootStackScreenProps } from "../../navigation/types";
import { AppBottomNav } from "../../components";
import RoundedButton from "../../components/common/RoundedButton";
import { useAppSelector } from "../../hooks/useAppSelector";
import { StatCardsRow } from "../../components/onboarding/StatCardsRow";
import { TextAvatar } from "../../components/onboarding/TextAvatar";
import AnimatedSwitch from "../../components/ui/inputs/AnimatedSwitch";
import { useTheme } from "../../context/ThemeContext";
import { APP_DARK } from "../../constants/appDarkTheme";
import Sidebar, { SidebarHandle } from "../../components/home/Sidebar";
import { toast } from "../../hooks/toast";
import { scale, verticalScale, moderateScale } from "../../utils/scale";
import { binFullService, normalizeBinFullStatus, type BinFullStatus } from "../../api/binFullService";
import { customerService } from "../../api/customerService";
import { useCurrentLocation } from "../../hooks/useCurrentLocation";
import { useLocationSearch } from "../../hooks/useLocationSearch";
import {
  useNavigateToChoosePlan,
  usePrefetchSubscriptionPlans,
} from "../../hooks/useSubscription";
import { LocationSearchDropdown } from "../../components/location/LocationSearchDropdown";
import type { PickupLocation } from "../../types/location.types";
import { buildPickupParams } from "../../utils/pickupLocation";

const premium = require("../../../assets/premium.png");
const futurePlan = require("../../../assets/futurePlan.png");
const tricycle = require("../../../assets/picktricycle.png");
const mapImage = require("../../../assets/RawMap.png");
const mapDarkImage = require("../../../assets/RawMapDark1.png");

// Matches the `bottomOffset` AppBottomNav defaults to when this screen
// doesn't pass one — the gap it floats above the screen's bottom edge,
// which isn't part of its own measured layout height.
const NAV_BOTTOM_OFFSET = 20;

export function HomeScreen({ navigation }: RootStackScreenProps<"Home">) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPickup, setSelectedPickup] = useState<PickupLocation | null>(
    null,
  );
  const [mapCenterOn, setMapCenterOn] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [shouldResetHomeOnFocus, setShouldResetHomeOnFocus] = useState(false);
  // Measured height of the floating bottom nav below — used to size the
  // gap the content area reserves for it. AppBottomNav mixes scaled values
  // (paddingVertical/paddingHorizontal) with unscaled ones (its NavItem
  // Tailwind padding, `bottomOffset`), so a single guessed constant here
  // drifts from its *actual* rendered height once fonts, safe-area insets,
  // or screen density differ — which is what let the search panel/action
  // cards collide with it (or leave an inconsistent gap) on other phones.
  // The fallback is only what's shown before the first layout pass measures
  // the real value.
  const [navHeight, setNavHeight] = useState(verticalScale(90));
  const sidebarRef = useRef<SidebarHandle>(null);
  const [activePill, setActivePill] = useState<number>(0);
  const customer = useAppSelector((state) => state.customer);
  const [isBinFull, setIsBinFull] = useState<boolean>(false);
  const [binFullLoading, setBinFullLoading] = useState(false);
  const binFullLoadingRef = useRef(false);
  const binFullRequestIdRef = useRef<string | null>(null);
  const isPremium = customer.is_premium;
  const { isDark, colors } = useTheme();
  const { coords } = useCurrentLocation();
  const request = useAppSelector((state) => state.request);
  const prefetchPlans = usePrefetchSubscriptionPlans();
  const navigateToChoosePlan = useNavigateToChoosePlan();
  const locationSearchEnabled = !isPremium || activePill === 0;
  const {
    results: locationResults,
    isLoading: locationLoading,
    error: locationError,
  } = useLocationSearch(searchQuery, locationSearchEnabled);
  const showLocationDropdown =
    locationSearchEnabled && searchQuery.trim().length >= 3 && !selectedPickup;

  const handleLocationSelect = (result: {
    label: string;
    latitude: number;
    longitude: number;
  }) => {
    const pickup: PickupLocation = {
      label: result.label,
      latitude: result.latitude,
      longitude: result.longitude,
    };
    setSelectedPickup(pickup);
    setSearchQuery(result.label);
    setMapCenterOn({ latitude: result.latitude, longitude: result.longitude });
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    if (selectedPickup && text !== selectedPickup.label) {
      setSelectedPickup(null);
      setMapCenterOn(null);
    }
  };

  const navigateToScanning = () => {
    navigation.navigate("Scanning", {
      ...buildPickupParams(
        selectedPickup,
        selectedPickup?.label ?? (searchQuery || undefined),
      ),
    });
    setShouldResetHomeOnFocus(true);
  };

  const TERMINAL_REQUEST_STATUSES = ["completed", "cancelled"];

  // A bin-full signal's own `is_active` flips false the instant a driver is
  // assigned (the signal is "consumed" into a real request) -- but the
  // switch itself should stay on for the whole bin-full-to-pickup lifecycle,
  // so once a request is attached we track that request's status instead of
  // trusting the raw signal flag.
  const applyBinFullStatus = async (status: BinFullStatus) => {
    if (status.is_active) {
      binFullRequestIdRef.current = status.request_id;
      setIsBinFull(true);
      return;
    }
    if (status.request_id) {
      try {
        const res = await customerService.getRequestById(status.request_id);
        const requestStatus = res?.data?.status as string | undefined;
        if (res.success && requestStatus && !TERMINAL_REQUEST_STATUSES.includes(requestStatus)) {
          binFullRequestIdRef.current = status.request_id;
          setIsBinFull(true);
          return;
        }
      } catch {
        // can't confirm the linked request's status -- fall through and
        // trust the raw (inactive) signal rather than getting stuck "on"
      }
    }
    binFullRequestIdRef.current = null;
    setIsBinFull(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (coords) {
        setMapCenterOn(coords);
      }
      if (shouldResetHomeOnFocus) {
        setSelectedPickup(null);
        setSearchQuery("");
        setMapCenterOn(coords ?? null);
        setShouldResetHomeOnFocus(false);
      }
      if (isPremium) {
        binFullService
          .getStatus()
          .then((res) => {
            if (res.success && !binFullLoadingRef.current) {
              applyBinFullStatus(normalizeBinFullStatus(res.data));
            }
          })
          .catch(() => {});
      }
    });

    return unsubscribe;
  }, [navigation, coords, shouldResetHomeOnFocus, isPremium]);

  useEffect(() => {
    prefetchPlans();
  }, [prefetchPlans]);

  useEffect(() => {
    if (!isPremium) return;
    binFullService
      .getStatus()
      .then((res) => {
        if (res.success && !binFullLoadingRef.current) {
          applyBinFullStatus(normalizeBinFullStatus(res.data));
        }
      })
      .catch(() => {});
  }, [isPremium]);

  const handleBinFullToggle = async (value: boolean) => {
    if (!isPremium || binFullLoading) return;

    const previousValue = isBinFull;
    setIsBinFull(value);
    setBinFullLoading(true);
    binFullLoadingRef.current = true;
    try {
      let pickupLocation: { type: "Point"; coordinates: [number, number] } | undefined;
      let pickupAddress = selectedPickup?.label ?? (searchQuery || "Current location");

      if (value) {
        if (selectedPickup) {
          pickupLocation = {
            type: "Point",
            coordinates: [selectedPickup.longitude, selectedPickup.latitude],
          };
        } else if (coords) {
          pickupLocation = {
            type: "Point",
            coordinates: [coords.longitude, coords.latitude],
          };
        } else {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === "granted") {
            const loc = await Location.getCurrentPositionAsync({});
            const longitude = loc?.coords?.longitude;
            const latitude = loc?.coords?.latitude;

            if (typeof longitude !== "number" || typeof latitude !== "number") {
              throw new Error(
                "Unable to determine your current location. Please try again or choose a pickup location.",
              );
            }

            pickupLocation = {
              type: "Point",
              coordinates: [longitude, latitude],
            };
          } else {
            throw new Error(
              "Location permission is required to enable bin-full signal. Please allow location access or choose a pickup location.",
            );
          }
        }

        if (
          !pickupLocation ||
          pickupLocation.coordinates.length !== 2 ||
          pickupLocation.coordinates.some(
            (coord) => typeof coord !== "number" || Number.isNaN(coord),
          )
        ) {
          throw new Error(
            "Unable to determine your location. Please select a pickup location or enable location access.",
          );
        }
      }

      const res = await binFullService.setSignal({
        isActive: value,
        pickupAddress,
        pickupLocation,
      });

      if (!res.success) {
        throw new Error("Unable to update bin-full signal.");
      }

      const status = normalizeBinFullStatus(res.data);
      const assigned = Boolean(res.data.immediateResult?.assigned);
      // A driver assigned immediately still means the bin-full flow is
      // active (now as a real request) -- keep the switch on rather than
      // trusting the signal's own `is_active`, which flips false the moment
      // it's consumed into a request.
      if (assigned && status.request_id) {
        binFullRequestIdRef.current = status.request_id;
        setIsBinFull(true);
      } else {
        await applyBinFullStatus(status);
      }

      if (value) {
        if (assigned) {
          toast.success("Driver found!\nA driver has been assigned.");
        } else if (status.is_active) {
          toast.info(
            "Bin signal sent.\nWe'll notify you when a driver is found.",
          );
        }
      }
    } catch (err: any) {
      setIsBinFull(previousValue);
      toast.error(err?.message || "Unable to update bin-full signal.");
    } finally {
      setBinFullLoading(false);
      binFullLoadingRef.current = false;
    }
  };

  const changeActivePill = (value: number) => {
    if (isPremium) {
      setActivePill(value);
    } else {
      setActivePill(0);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.bg }}
      edges={["top", "left", "right", "bottom"]}
    >
      <ImageBackground
        source={isDark ? mapDarkImage : mapImage}
        resizeMode="cover"
        style={{ flex: 1, width: "100%", height: "100%" }}
      >
          <View
            style={{
              position: "absolute",
              width: "100%",
              top: 0,
              left: 0,
              right: 0,
              height: verticalScale(48),
              backgroundColor: colors.bg,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: scale(16),
              zIndex: 10,
            }}
          >
            <Pressable
              className="w-8 h-8 items-center justify-center"
              onPress={() => sidebarRef.current?.open()}
            >
              <MaterialCommunityIcons
                name="menu"
                size={moderateScale(20)}
                color={colors.iconColor}
              />
            </Pressable>

            <View className="flex-row gap-2 items-center justify-center">
              {isPremium && (
                <View className="flex-row gap-2 items-center justify-center">
                  <Text
                    style={{
                      fontSize: moderateScale(12),
                      color: colors.textSub,
                    }}
                  >
                    Bin Full?
                  </Text>
                  <View style={{ opacity: binFullLoading ? 0.5 : 1 }}>
                    <AnimatedSwitch
                      value={isBinFull}
                      onChange={handleBinFullToggle}
                      disabled={binFullLoading}
                    />
                    {binFullLoading && (
                      <ActivityIndicator
                        size="small"
                        color={isDark ? APP_DARK.accentGreen : "#31973D"}
                        style={{ position: "absolute", right: -28, top: 8 }}
                      />
                    )}
                  </View>
                </View>
              )}
              <Pressable
                style={{
                  width: moderateScale(40),
                  height: moderateScale(40),
                  padding: moderateScale(4),
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.iconBg,
                  borderRadius: moderateScale(8),
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  navigation.navigate("NotificationsList");
                }}
              >
                <MaterialCommunityIcons
                  name="bell-outline"
                  size={moderateScale(20)}
                  color={colors.iconColor}
                />
              </Pressable>
            </View>
          </View>

          {/* Search/stats panel is pinned to the top and the action cards
              below are pinned to the bottom (via justifyContent:
              "space-between" on the shared container), leaving the map
              visible in between instead of the cards hugging the panel.
              top/bottom are both derived from real, scaled measurements
              (the header's own height + a small gap, and the bottom nav's
              measured height + its floating offset) instead of guessed
              constants, so the reserved space matches what's actually
              rendered on this device rather than the one this was tuned
              against. */}
          <View
            style={{
              position: "absolute",
              top: verticalScale(48) + verticalScale(10),
              left: 0,
              right: 0,
              bottom: navHeight + NAV_BOTTOM_OFFSET + verticalScale(12),
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
          <View
            style={{
              backgroundColor: isDark ? APP_DARK.surface : colors.bg,
              borderColor: isDark ? APP_DARK.border : colors.border,
              gap: moderateScale(12),
              borderRadius: moderateScale(34),
            }}
            className="p-5 border mx-2.5 space-y-6"
          >
            {isPremium ? (
              <View
                style={{
                  gap: moderateScale(12),
                }}
              >
                <View
                  style={{
                    backgroundColor: colors.surface,
                    padding: moderateScale(10),
                    borderRadius: 999,
                    flexDirection: "row",
                    gap: scale(8),
                    justifyContent: "space-between",
                  }}
                >
                  <Pressable
                    onPress={() => {
                      changeActivePill(0);
                    }}
                    style={[
                      {
                        borderRadius: 999,
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingHorizontal: scale(12),
                        paddingVertical: verticalScale(10),
                      },
                      activePill === 0
                        ? {
                            backgroundColor: colors.card,
                            borderWidth: 1,
                            borderColor: colors.border,
                          }
                        : {},
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: moderateScale(14),
                        fontWeight: "600",
                        color: colors.text,
                      }}
                    >
                      Pickup Location
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      changeActivePill(1);
                    }}
                    style={[
                      {
                        borderRadius: 999,
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingHorizontal: scale(12),
                        paddingVertical: verticalScale(10),
                      },
                      activePill === 1
                        ? {
                            backgroundColor: colors.card,
                            borderWidth: 1,
                            borderColor: colors.border,
                          }
                        : {},
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: moderateScale(14),
                        fontWeight: "600",
                        color: colors.text,
                      }}
                    >
                      Find Driver
                    </Text>
                  </Pressable>
                </View>

                {/* Search bar */}
                <View style={{ position: "relative", zIndex: 20 }}>
                  <View
                    style={{
                      height: verticalScale(54),
                      backgroundColor: colors.card,
                      borderRadius: 999,
                      borderWidth: 1,
                      borderColor: colors.border,
                      paddingHorizontal: scale(12),
                      flexDirection: "row",
                      alignItems: "center",
                      gap: scale(8),
                    }}
                  >
                    <Pressable
                      onPress={() =>
                        navigation.navigate("Details", {
                          itemId: "search",
                          title: "Search",
                        })
                      }
                    >
                      <MaterialCommunityIcons
                        name="magnify"
                        size={moderateScale(24)}
                        color={colors.iconColor}
                      />
                    </Pressable>
                    <TextInput
                      style={{
                        flex: 1,
                        fontSize: moderateScale(14),
                        color: colors.text,
                        padding: 0,
                      }}
                      placeholder={
                        activePill == 0
                          ? "Tarkwa, UMaT Campus, Hall 3"
                          : "Search driver by name ..."
                      }
                      placeholderTextColor={colors.textMuted}
                      value={searchQuery}
                      onChangeText={
                        activePill === 0 ? handleSearchChange : setSearchQuery
                      }
                    />
                    {searchQuery.length > 0 && (
                      <Pressable
                        onPress={() => {
                          setSearchQuery("");
                          setSelectedPickup(null);
                          setMapCenterOn(null);
                        }}
                        className="w-8 h-8 items-center justify-center"
                      >
                        <MaterialCommunityIcons
                          name="close-circle"
                          size={moderateScale(22)}
                          color="#EF4444"
                        />
                      </Pressable>
                    )}
                  </View>
                  {activePill === 0 && (
                    <LocationSearchDropdown
                      visible={showLocationDropdown}
                      results={locationResults}
                      loading={locationLoading}
                      error={locationError}
                      onSelect={handleLocationSelect}
                    />
                  )}
                </View>

                {/* <View className="flex-row justify-between gap-3">
                  <View className="flex-row gap-3 items-center justify-center">
                    <View className="flex-row items-center">
                      {closeDrivers.slice(0, 2).map((driver, index) => (
                        <View
                          key={index}
                          style={{
                            marginLeft: index === 0 ? 0 : -scale(8),
                            zIndex: index === 0 ? 1 : 2,
                          }}
                        >
                          <TextAvatar
                            size={moderateScale(24)}
                            bgColor={index == 1 ? "#FFE088" : "#90FA96"}
                            name={driver}
                          />
                        </View>
                      ))}
                    </View>
                    <Text
                      style={{
                        fontSize: moderateScale(14),
                        fontWeight: "500",
                        color: colors.textSub,
                      }}
                    >
                      {closeDrivers.length} verified driver
                      {closeDrivers.length == 1 ? "" : "s"} nearby
                    </Text>
                  </View>
                  <View className="rounded-full bg-[#148732] py-0.5 px-2">
                    <Text className="text-sm text-white">New</Text>
                  </View>
                </View> */}
                <StatCardsRow
                  bags={customer.bags_recycled}
                  points={customer.points}
                />
              </View>
            ) : (
              /* Non-premium search bar */
              <View style={{ position: "relative", zIndex: 20 }}>
                <View
                  style={{
                    height: verticalScale(54),
                    backgroundColor: isDark ? APP_DARK.card : colors.bg,
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: isDark ? APP_DARK.border : colors.border,
                    paddingHorizontal: scale(12),
                    flexDirection: "row",
                    alignItems: "center",
                    gap: scale(8),
                  }}
                >
                  <Pressable
                    onPress={() =>
                      navigation.navigate("Details", {
                        itemId: "search",
                        title: "Search",
                      })
                    }
                  >
                    <MaterialCommunityIcons
                      name="magnify"
                      size={moderateScale(24)}
                      color={colors.iconColor}
                    />
                  </Pressable>
                  <TextInput
                    style={{
                      flex: 1,
                      fontSize: moderateScale(14),
                      color: colors.text,
                      padding: 0,
                    }}
                    placeholder="Where is your waste?"
                    placeholderTextColor={colors.textMuted}
                    value={searchQuery}
                    onChangeText={handleSearchChange}
                  />
                  {searchQuery.length > 0 && (
                    <Pressable
                      onPress={() => {
                        setSearchQuery("");
                        setSelectedPickup(null);
                        setMapCenterOn(null);
                      }}
                      className="w-8 h-8 items-center justify-center"
                    >
                      <MaterialCommunityIcons
                        name="close-circle"
                        size={moderateScale(22)}
                        color="#EF4444"
                      />
                    </Pressable>
                  )}
                </View>
                <LocationSearchDropdown
                  visible={showLocationDropdown}
                  results={locationResults}
                  loading={locationLoading}
                  error={locationError}
                  onSelect={handleLocationSelect}
                />
              </View>
            )}

            {!isPremium && (
              <StatCardsRow
                bags={customer.bags_recycled}
                points={customer.points}
              />
            )}
          </View>

          {/* Bottom action cards — sit in the second "space-between" slot of
              the wrapper above, so they're pinned below the stats panel
              without needing to measure its height. Laid out as a plain
              (non-scrolling) View — the rows below are sized and spaced to
              fit the available height on their own, scaling via
              moderateScale/verticalScale like the rest of the screen. */}
          <View
            style={{
              justifyContent: "center",
              paddingHorizontal: scale(8),
            }}
          >
            <View className="space-y-3">
              {/* Tricycle row */}
              <View
                style={{
                  flexDirection: "row",
                  gap: scale(8),
                  marginBottom: verticalScale(12),
                  alignItems: "center",
                  backgroundColor: isDark ? APP_DARK.card : colors.card,
                  borderWidth: 1,
                  borderColor: isDark ? APP_DARK.border : colors.border,
                  borderRadius: 999,
                  padding: moderateScale(12),
                }}
              >
                <View
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: isDark ? "rgba(188,233,208,0.1)" : "#419E6A1A" }}
                >
                  <Image
                    source={tricycle}
                    style={{
                      width: moderateScale(30),
                      height: moderateScale(30),
                      transform: [{ scaleX: -1 }],
                    }}
                    resizeMode="contain"
                  />
                </View>

                <View className="flex-1">
                  <Text
                    style={{
                      fontSize: moderateScale(14),
                      fontWeight: "600",
                      color: colors.text,
                    }}
                  >
                    Find nearby tricycles
                  </Text>
                  <Text
                    style={{
                      fontSize: moderateScale(12),
                      color: colors.textSub,
                      fontWeight: isPremium ? "700" : "400",
                    }}
                  >
                    Instant pickup
                  </Text>
                </View>

                <RoundedButton
                  title="Request now"
                  variant="primary"
                  onPress={navigateToScanning}
                />
              </View>

              {/* Premium / future pickup row */}
              <View
                style={{
                  flexDirection: "row",
                  gap: scale(8),
                  marginBottom: verticalScale(6),
                  alignItems: "center",
                  backgroundColor: isDark ? APP_DARK.card : colors.card,
                  borderWidth: 1,
                  borderColor: isDark ? APP_DARK.premiumBorder : "#FFE088",
                  borderRadius: 999,
                  padding: moderateScale(12),
                }}
              >
                <View
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: isDark ? APP_DARK.premiumIconBg : "#EFF5FF" }}
                >
                  <Image
                    source={isPremium ? futurePlan : premium}
                    style={{
                      width: moderateScale(20),
                      height: moderateScale(20),
                      transform: [{ scaleX: -1 }],
                    }}
                    resizeMode="contain"
                  />
                </View>

                <View className="flex-1">
                  <Text
                    style={{
                      fontSize: moderateScale(14),
                      fontWeight: "600",
                      color: colors.text,
                    }}
                  >
                    Plan future pickup
                  </Text>
                  <Text
                    style={{
                      fontSize: moderateScale(12),
                      color: colors.textSub,
                      fontWeight: isPremium ? "700" : "400",
                    }}
                  >
                    Future service
                  </Text>
                </View>

                {isPremium ? (
                  <RoundedButton
                    title="Plan for later"
                    variant="premium"
                    onPress={() => navigation.navigate("Schedule")}
                  />
                ) : (
                  <RoundedButton
                    title="Premium Tier"
                    variant="premium"
                    onPress={navigateToChoosePlan}
                  />
                )}
              </View>

              {!isPremium && (
                <Pressable
                  onPress={navigateToChoosePlan}
                  className="flex-row items-center justify-center gap-1"
                >
                  <MaterialCommunityIcons
                    name="lock"
                    size={moderateScale(16)}
                    color={isDark ? APP_DARK.premiumLockIcon : "#574500"}
                  />
                  <Text
                    className="italic"
                    style={{
                      color: isDark ? APP_DARK.premiumLabelText : "#574500",
                      fontSize: moderateScale(13),
                      lineHeight: moderateScale(19),
                    }}
                  >
                    Upgrade to Gold for scheduled pickups
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
          </View>

          <AppBottomNav
            activeTab="home"
            paddingBottom={0}
            navigation={navigation}
            onLayout={(e) => setNavHeight(e.nativeEvent.layout.height)}
          />
        </ImageBackground>
      <Sidebar ref={sidebarRef} navigation={navigation} activeKey="home" />
    </SafeAreaView>
  );
}
