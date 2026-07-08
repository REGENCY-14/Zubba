import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Invert, Grayscale } from "react-native-color-matrix-image-filters";
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

const mapImage = require("../../../assets/RawMap.png");
const premium = require("../../../assets/premium.png");
const futurePlan = require("../../../assets/futurePlan.png");
const tricycle = require("../../../assets/picktricycle.png");

export function HomeScreen({ navigation }: RootStackScreenProps<"Home">) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activePill, setActivePill] = useState<number>(0);
  const customer = useAppSelector((state) => state.customer);
  const [isBinFull, setIsBinFull] = useState<boolean>(false);
  const isPremium = true;
  const closeDrivers = ["Aaron", "Bob", "Candice"];
  const { isDark, colors } = useTheme();

  const translateX = useRef(new Animated.Value(isBinFull ? 16 : 0)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isBinFull ? 14 : 0,
      duration: 220,
      easing: Easing.out(Easing.circle),
      useNativeDriver: true,
    }).start();
  }, [isBinFull]);

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
      edges={["top", "left", "right"]}
    >
      <View style={{ flex: 1 }}>
        {/* <Invert>
          <Grayscale>
            <Image
              source={mapImage}
              style={StyleSheet.absoluteFillObject}
              resizeMode="cover"
            />
          </Grayscale>
        </Invert> */}
        <View
          style={{flex: 1}}
        >
          <View
            style={{
              position: "absolute",
              width: "100%",
              top: 0,
              left: 0,
              right: 0,
              height: 48,
              backgroundColor: colors.bg,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 16,
              zIndex: 10,
            }}
          >
            <Pressable className="w-8 h-8 items-center justify-center">
              <MaterialCommunityIcons
                name="menu"
                size={20}
                color={colors.iconColor}
              />
            </Pressable>

            <View className="flex-row gap-2 items-center justify-center">
              {isPremium && (
                <View className="flex-row gap-2 items-center justify-center">
                  <Text style={{ fontSize: 12, color: colors.textSub }}>
                    Bin Full?
                  </Text>
                  <AnimatedSwitch value={isBinFull} onChange={setIsBinFull} />
                </View>
              )}
              <Pressable
                style={{
                  width: 40,
                  height: 40,
                  padding: 4,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.iconBg,
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialCommunityIcons
                  name="bell-outline"
                  size={20}
                  color={colors.iconColor}
                />
              </Pressable>
            </View>
          </View>

          <View style={{backgroundColor: isDark ? colors.card : colors.bg, borderColor: colors.border}} className="absolute p-5 border rounded-3xl top-[58px] left-2.5 right-2.5 space-y-6">
            {isPremium ? (
              <View
                style={{
                  gap: 12,
                }}
              >
                <View
                  style={{
                    backgroundColor: colors.surface,
                    padding: 10,
                    borderRadius: 999,
                    flexDirection: "row",
                    gap: 8,
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
                        paddingHorizontal: 12,
                        paddingVertical: 10,
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
                        fontSize: 14,
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
                        paddingHorizontal: 12,
                        paddingVertical: 10,
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
                        fontSize: 14,
                        fontWeight: "600",
                        color: colors.text,
                      }}
                    >
                      Find Driver
                    </Text>
                  </Pressable>
                </View>

                {/* Search bar */}
                <View
                  style={{
                    height: 54,
                    backgroundColor: colors.card,
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: colors.border,
                    paddingHorizontal: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
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
                      size={24}
                      color={colors.iconColor}
                    />
                  </Pressable>
                  <TextInput
                    style={{
                      flex: 1,
                      fontSize: 14,
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
                    onChangeText={setSearchQuery}
                  />
                  {searchQuery.length > 0 && (
                    <Pressable
                      onPress={() => setSearchQuery("")}
                      className="w-8 h-8 items-center justify-center"
                    >
                      <MaterialCommunityIcons
                        name="close-circle"
                        size={22}
                        color="#EF4444"
                      />
                    </Pressable>
                  )}
                </View>

                <View className="flex-row justify-between gap-3">
                  <View className="flex-row gap-3 items-center justify-center">
                    <View className="flex-row items-center">
                      {closeDrivers.slice(0, 2).map((driver, index) => (
                        <View
                          key={index}
                          style={{
                            marginLeft: index === 0 ? 0 : -8,
                            zIndex: index === 0 ? 1 : 2,
                          }}
                        >
                          <TextAvatar
                            size={24}
                            bgColor={index == 1 ? "#FFE088" : "#90FA96"}
                            name={driver}
                          />
                        </View>
                      ))}
                    </View>
                    <Text
                      style={{
                        fontSize: 14,
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
                </View>
                <StatCardsRow
                  mass_recycled={customer.mass_recycled}
                  points={customer.points}
                />
              </View>
            ) : (
              /* Non-premium search bar */
              <View
                style={{
                  height: 54,
                  backgroundColor: isDark ? colors.card : colors.bg,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: colors.border,
                  paddingHorizontal: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
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
                    size={24}
                    color={colors.iconColor}
                  />
                </Pressable>
                <TextInput
                  style={{
                    flex: 1,
                    fontSize: 14,
                    color: colors.text,
                    padding: 0,
                  }}
                  placeholder="Where is your waste?"
                  placeholderTextColor={colors.textMuted}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <Pressable
                    onPress={() => setSearchQuery("")}
                    className="w-8 h-8 items-center justify-center"
                  >
                    <MaterialCommunityIcons
                      name="close-circle"
                      size={22}
                      color="#EF4444"
                    />
                  </Pressable>
                )}
              </View>
            )}

            {!isPremium && (
              <StatCardsRow
                mass_recycled={customer.mass_recycled}
                points={customer.points}
              />
            )}
          </View>

          {/* Bottom action cards */}
          <View className="absolute bottom-[102px] left-2 right-2 p-4">
            <View className="space-y-3">
              {/* Tricycle row */}
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  alignItems: "center",
                  backgroundColor: colors.card,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 999,
                  padding: 12,
                }}
              >
                <View className="w-10 h-10 bg-[#419E6A1A] rounded-full items-center justify-center">
                  <Image
                    source={tricycle}
                    style={{
                      width: 30,
                      height: 30,
                      transform: [{ scaleX: -1 }],
                    }}
                    resizeMode="contain"
                  />
                </View>

                <View className="flex-1">
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: colors.text,
                    }}
                  >
                    Find nearby tricycles
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
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
                  onPress={() => navigation.navigate("Scanning")}
                />
              </View>

              {/* Premium / future pickup row */}
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  alignItems: "center",
                  backgroundColor: colors.card,
                  borderWidth: 1,
                  borderColor: "#FFE088",
                  borderRadius: 999,
                  padding: 12,
                }}
              >
                <View className="w-10 h-10 bg-[##EFF5FF] rounded-full items-center justify-center">
                  <Image
                    source={isPremium ? futurePlan : premium}
                    style={{
                      width: 20,
                      height: 20,
                      transform: [{ scaleX: -1 }],
                    }}
                    resizeMode="contain"
                  />
                </View>

                <View className="flex-1">
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: colors.text,
                    }}
                  >
                    Plan future pickup
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
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
                    onPress={() => navigation.navigate("Scanning")}
                  />
                ) : (
                  <RoundedButton
                    title="Premium Tier"
                    variant="premium"
                    onPress={() => {}}
                  />
                )}
              </View>

              {!isPremium && (
                <Pressable
                  onPress={() => navigation.navigate("ChoosePlan")}
                  className="flex-row items-center justify-center gap-1"
                >
                  <MaterialCommunityIcons
                    name="lock"
                    size={16}
                    color="#574500"
                  />
                  <Text className="text-[#574500] italic">
                    Upgrade to Gold for scheduled pickups
                  </Text>
                </Pressable>
              )}
            </View>
          </View>

          <AppBottomNav
            activeTab="home"
            paddingBottom={0}
            navigation={navigation}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
