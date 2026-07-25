import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppBottomNav } from "../../components";
import type { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";
import CustomAppBar from "../../components/common/CustomAppBar";
import { scale, verticalScale, moderateScale } from "../../utils/scale";

type DeviceCardProps = {
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  title: string;
  location: string;
  status: string;
  actionLabel: string;
  actionTone?: "current" | "revoke";
  isCurrent?: boolean;
  colors: ReturnType<typeof useTheme>["colors"];
};

function DeviceCard({
  iconName,
  title,
  location,
  status,
  actionLabel,
  actionTone = "revoke",
  isCurrent = false,
  colors,
}: DeviceCardProps) {
  return (
    <View
      style={{
        backgroundColor: isCurrent ? "#31973D" : "transparent",
        borderRadius: moderateScale(24),
        paddingLeft: isCurrent ? scale(4) : 0,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: moderateScale(22),
          padding: moderateScale(16),
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            flex: 1,
            marginRight: scale(16),
          }}
        >
          <View
            style={{
              width: moderateScale(40),
              height: moderateScale(40),
              borderRadius: moderateScale(10),
              backgroundColor: colors.iconBg,
              alignItems: "center",
              justifyContent: "center",
              marginRight: scale(16),
            }}
          >
            <MaterialCommunityIcons
              name={iconName}
              size={moderateScale(24)}
              color={colors.iconColor}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: moderateScale(14),
                lineHeight: moderateScale(20),
                fontWeight: "600",
                color: colors.text,
              }}
            >
              {title}
            </Text>

            <Text
              style={{
                fontSize: moderateScale(12),
                lineHeight: moderateScale(16),
                color: colors.textSub,
                marginTop: verticalScale(2),
              }}
            >
              {location}
            </Text>

            <Text
              style={{
                fontSize: moderateScale(10),
                lineHeight: moderateScale(16),
                color: "#31973D",
                marginTop: verticalScale(4),
              }}
            >
              {status}
            </Text>
          </View>
        </View>

        <View
          style={{
            minWidth: scale(69),
            height: verticalScale(32),
            borderRadius: moderateScale(16),
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: scale(12),
            backgroundColor:
              actionTone === "current" ? colors.iconBg : colors.card,
            borderWidth: 1,
            borderColor: actionTone === "current" ? colors.border : "#FF383C",
          }}
        >
          <Text
            style={{
              fontSize: moderateScale(13),
              lineHeight: moderateScale(20),
              fontWeight: "bold",
              color: actionTone === "current" ? "#31973D" : "#FF383C",
            }}
          >
            {actionLabel}
          </Text>
        </View>
      </View>
    </View>
  );
}

function InfoCard({
  colors,
}: {
  colors: ReturnType<typeof useTheme>["colors"];
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        gap: moderateScale(16),
        borderRadius: moderateScale(16),
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.card,
        padding: moderateScale(16),
      }}
    >
      <View
        style={{
          width: moderateScale(33),
          height: moderateScale(33),
          borderRadius: 999,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 107, 35, 0.1)",
        }}
      >
        <MaterialCommunityIcons
          name="information-outline"
          size={moderateScale(20)}
          color="#31973D"
        />
      </View>
      <Text
        style={{ flex: 1, fontSize: moderateScale(14), lineHeight: moderateScale(21), color: colors.textSub }}
      >
        If you notice a device you don&apos;t recognize, revoke its access
        immediately and change your password.
      </Text>
    </View>
  );
}

export function ActiveSessionScreen({
  navigation,
}: RootStackScreenProps<"ActiveSession">) {
  const { isDark, colors } = useTheme();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.bg }}
      edges={["top", "left", "right"]}
    >
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <CustomAppBar title="Active Sessions" navigation={navigation} />

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: scale(12),
            paddingTop: verticalScale(16),
            paddingBottom: verticalScale(148),
            gap: moderateScale(24),
          }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              alignItems: "center",
              paddingHorizontal: scale(18),
              paddingVertical: verticalScale(24),
              gap: moderateScale(16),
            }}
          >
            <View
              style={{
                width: moderateScale(54),
                height: moderateScale(54),
                borderRadius: moderateScale(27),
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.iconBg,
              }}
            >
              <MaterialCommunityIcons
                name="shield-half-full"
                size={moderateScale(28)}
                color="#006B23"
              />
            </View>
            <Text
              style={{
                fontSize: moderateScale(14),
                lineHeight: moderateScale(20),
                color: colors.textSub,
                textAlign: "center",
              }}
            >
              Review and manage devices currently logged into your Zubba
              account.
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: scale(4),
            }}
          >
            <Text
              style={{
                fontSize: moderateScale(14),
                lineHeight: moderateScale(17),
                fontWeight: "500",
                color: colors.text,
                textTransform: "uppercase",
                letterSpacing: 0.7,
              }}
            >
              Active Devices
            </Text>
            <View
              style={{
                backgroundColor: "#31973D",
                borderRadius: 999,
                paddingHorizontal: scale(12),
                paddingVertical: verticalScale(4),
              }}
            >
              <Text style={{ color: "#F7FFF1", fontSize: moderateScale(12), lineHeight: moderateScale(14) }}>
                3 Active
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: isDark ? colors.surface : colors.bg,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: moderateScale(12),
              overflow: "hidden",
              padding: moderateScale(16),
              gap: moderateScale(16),
            }}
          >
            <DeviceCard
              iconName="cellphone"
              title="iPhone 13"
              location="Accra, Ghana"
              status="Active now"
              actionLabel="Current"
              actionTone="current"
              isCurrent
              colors={colors}
            />
            <DeviceCard
              iconName="laptop"
              title='MacBook Pro 14"'
              location="Accra, Ghana"
              status="Active now"
              actionLabel="Revoke"
              colors={colors}
            />
            <DeviceCard
              iconName="cellphone"
              title="iPhone 13"
              location="Accra, Ghana"
              status="Active now"
              actionLabel="Revoke"
              colors={colors}
            />
          </View>

          <View style={{ paddingTop: verticalScale(4) }}>
            <Pressable
              style={{
                height: verticalScale(48),
                borderRadius: moderateScale(12),
                backgroundColor: "#31973D",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => navigation.navigate("Settings")}
            >
              <Text style={{ color: "#FFFFFF", fontSize: moderateScale(14), lineHeight: moderateScale(20) }}>
                Back to Settings
              </Text>
            </Pressable>
          </View>

          <InfoCard colors={colors} />
        </ScrollView>

        <AppBottomNav
          activeTab="settings"
          paddingBottom={0}
          navigation={navigation}
        />
      </View>
    </SafeAreaView>
  );
}

export default ActiveSessionScreen;
