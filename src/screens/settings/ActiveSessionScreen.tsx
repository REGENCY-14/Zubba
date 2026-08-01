import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View, ActivityIndicator, Platform, UIManager, LayoutAnimation } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppBottomNav } from "../../components";
import type { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";
import CustomAppBar from "../../components/common/CustomAppBar";
import { scale, verticalScale, moderateScale } from "../../utils/scale";
import { deviceService, DeviceSession } from "../../api/deviceService";
import { toast } from "../../hooks/toast";

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
  onRevoke,
  revoking,
}: DeviceCardProps & { onRevoke?: () => void; revoking?: boolean }) {
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

        <Pressable
          onPress={onRevoke}
          disabled={!onRevoke || revoking || actionTone === "current"}
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
            opacity: revoking ? 0.5 : 1,
          }}
        >
          {revoking ? (
            <ActivityIndicator size="small" color="#FF383C" />
          ) : (
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
          )}
        </Pressable>
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


if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export function ActiveSessionScreen({
  navigation,
}: RootStackScreenProps<"ActiveSession">) {
  const { isDark, colors } = useTheme();
  const [sessions, setSessions] = useState<DeviceSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const res = await deviceService.getSessions();
      if (res.success) setSessions(res.data.items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleRevoke = async (sessionId: string) => {
  setRevokingId(sessionId);
    try {
      await deviceService.revokeSession(sessionId);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } catch (err) {
      toast.error("Couldn't revoke that device. Try again.")
    } finally {
      setRevokingId(null);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.bg }}
      edges={["top", "left", "right", "bottom"]}
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
                {sessions.length} Active
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
            {loading ? (
              <ActivityIndicator color="#31973D" />
            ) : sessions.length === 0 ? (
              <Text style={{ color: colors.textSub, textAlign: "center" }}>No active sessions</Text>
            ) : (
              sessions.map((session, index) => (
                <DeviceCard
                  key={session.id}
                  iconName={session.platform === "ios" ? "cellphone" : "laptop"}
                  title={session.device_name ?? "Unknown device"}
                  location={session.ip_address ?? "Unknown location"}
                  status={`Last active ${new Date(session.last_active_at).toLocaleString()}`}
                  actionLabel={index === 0 ? "Current" : "Revoke"}
                  actionTone={index === 0 ? "current" : "revoke"}
                  isCurrent={index === 0}
                  colors={colors}
                  onRevoke={index === 0 ? undefined : () => handleRevoke(session.id)}
                  revoking={revokingId === session.id}
                />
              ))
            )}
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
