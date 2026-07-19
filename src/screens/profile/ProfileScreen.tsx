import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { RootStackScreenProps } from "../../navigation/types";
import { useAppSelector } from "../../hooks/useAppSelector";
import { TextAvatar } from "../../components/onboarding/TextAvatar";
import CustomAppBar from "../../components/common/CustomAppBar";
import { useTheme } from "../../context/ThemeContext";
import { toast } from "../../hooks/toast";
const avatarUrl = require("../../../assets/avatar.jpg");

function InfoCard({
  label,
  value,
  onPress,
  children,
}: {
  label: string;
  value: string;
  onPress?: () => void;
  children?: React.ReactNode;
}) {
  const { colors } = useTheme()

  return (
    <Pressable
      onPress={onPress}
      style={{
        width: "100%",
        backgroundColor: colors.bg,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 24,
        padding: 16,
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 16,
      }}
    >
      <View style={{ flex: 1, gap: 4 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: colors.text,
            lineHeight: 20,
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "400",
            color: colors.textMuted,
            lineHeight: 16,
          }}
        >
          {value}
        </Text>
        {children}
      </View>

      <MaterialCommunityIcons
        name="chevron-right"
        size={16}
        color={colors.textMuted}
        style={{ marginTop: 2 }}
      />
    </Pressable>
  );
}

export function ProfileScreen({
  navigation,
  route,
}: RootStackScreenProps<"Profile">) {
  const user = useAppSelector((state) => state.auth.user);
  const { colors } = useTheme()

  const fullName =
    route.params?.newFullName ??
    (user ? `${user.firstname} ${user.lastname}` : "");
  const phone = route.params?.newPhone ?? user?.phone ?? "";
  const email = route.params?.newEmail ?? user?.email ?? "";
  const isVerified = user?.verified ?? true;

  useEffect(() => {
    if (route.params?.updatedAt) {
      toast.success("Details updated successfully")
    }
  }, [route.params?.updatedAt]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.surface }}
      edges={["top", "left", "right"]}
    >
      <CustomAppBar title="Profile" navigation={navigation}/>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          padding: 16,
          gap: 16,
          alignItems: "center",
        }}
      >
        {/* Avatar section */}
        <View style={{ alignItems: "center", gap: 16 }}>
          {/* Avatar with verified badge */}
          <View
            style={{
              width: 64,
              height: 64,
              backgroundColor: colors.card,
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
                    borderColor: colors.border,
                  }}
                  resizeMode="cover"
                />
              ) : (
                <TextAvatar
                  size={48}
                  bgColor={colors.textSub}
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

          <Text
            style={{
              fontSize: 14,
              fontWeight: "400",
              color: colors.textSub,
              lineHeight: 20,
              textAlign: "center",
            }}
          >
            Choose photo for easy identification
          </Text>
        </View>

        {/* Name card */}
        <InfoCard
          label="Name"
          value={fullName}
          onPress={() => navigation.navigate("UpdateName")}
        />

        {/* Phone number card */}
        <InfoCard
          label="Phone number"
          value={phone}
          onPress={() =>
            navigation.navigate("UpdateDetails", { kind: "phone" })
          }
        >
          {isVerified && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                alignSelf: "flex-start",
                backgroundColor: "rgba(0, 107, 35, 0.1)",
                borderRadius: 11,
                paddingRight: 8,
                marginTop: 4,
              }}
            >
              <View style={{ padding: 4 }}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={14}
                  color="#31973D"
                />
              </View>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "400",
                  color: "#31973D",
                  letterSpacing: 0.48,
                  lineHeight: 14,
                }}
              >
                Verified
              </Text>
            </View>
          )}
        </InfoCard>

        {/* Email address card */}
        <InfoCard
          label="Email Address"
          value={email}
          onPress={() =>
            navigation.navigate("UpdateDetails", { kind: "email" })
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}

export default ProfileScreen;
