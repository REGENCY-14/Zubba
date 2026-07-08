import React, { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppBottomNav } from "../../components";
import AnimatedSwitch from "../../components/ui/inputs/AnimatedSwitch";
import type { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from '../../context/ThemeContext';

type SettingsRowProps = {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightSlot?: React.ReactNode;
  showChevron?: boolean;
};

function SettingsRow({
  icon,
  title,
  subtitle,
  onPress,
  rightSlot,
  showChevron = true,
}: SettingsRowProps) {
  const Container = onPress ? Pressable : View;
  const { colors } = useTheme();

  return (
    <Container
      className="min-h-[72px] flex-row items-center justify-between p-4 gap-4"
      onPress={onPress}
    >
      <View className="flex-1 flex-row items-center gap-4">
        <View className="w-10 h-10 rounded-[10px] bg-[#F1F5F9] items-center justify-center">
          {icon}
        </View>
        <View className="flex-1 gap-1">
          <Text style={{color: colors.text}} className="text-sm leading-5 font-medium">
            {title}
          </Text>
          {subtitle ? (
            <Text style={{color: colors.textMuted}} className="text-xs leading-4">{subtitle}</Text>
          ) : null}
        </View>
      </View>
      <View className="flex-row items-center gap-2">
        {rightSlot}
        {showChevron ? (
          <MaterialCommunityIcons
            name="chevron-right"
            size={22}
            color="#C7C4D7"
          />
        ) : null}
      </View>
    </Container>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { colors } = useTheme();

  return (
    <View style={{backgroundColor: colors.bg, borderColor: colors.border}} className="rounded-2xl border overflow-hidden">
      <Text style={{color: colors.text}} className="text-base leading-6 font-semibold p-4">
        {title}
      </Text>
      <View className="h-px bg-[#F1F5F9]" />
      {children}
    </View>
  );
}

export function SettingsScreen({
  navigation,
}: RootStackScreenProps<"Settings">) {
  const { isDark, colors, toggle } = useTheme();

  const zubbaText = require("../../../assets/zubbaText.png");
  const tricycleImage = require("../../../assets/tricycle image.png");

  return (
    <SafeAreaView style={{ backgroundColor: colors.bg }} className="flex-1" edges={["top", "left", "right"]}>
      <View style={{ backgroundColor: colors.bg }} className="flex-1">

        <View style={{ backgroundColor: colors.bg }} className="h-12 px-4 flex-row items-center justify-between">
          <Pressable
            className="w-6 h-6 items-center justify-center"
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="chevron-left" size={24} color={colors.text} />
          </Pressable>
          <Text style={{color: colors.text }} className="text-base leading-6 font-semibold">
            Settings
          </Text>
          <View className="w-6 h-6" />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 12,
            paddingTop: 16,
            paddingBottom: 128,
            gap: 24,
          }}
        >
          <View style={{backgroundColor: colors.card, borderColor: colors.borderLight }} className="border rounded-3xl p-3 gap-6">

            <View  style={{backgroundColor: colors.bg, borderColor: colors.borderLight }} className="items-center rounded-2xl border py-6 px-4 gap-2">
              <Image
                resizeMode="contain"
                style={{ height: 30 }}
                source={zubbaText}
                tintColor="#31973D"
              />
              <Text className="text-xs leading-4 text-[#64748A] text-center">
                Waste Pickup and Recycling Control
              </Text>
              <View className="bg-[#E3F2F7] rounded-full px-2.5 py-1">
                <Text className="text-[10px] leading-[11px] text-black font-['Inter']">
                  Version 1.0.0
                </Text>
              </View>
            </View>

            <View className="bg-[#31973D] rounded-2xl p-4 pb-6 overflow-hidden">
              <View className="absolute -top-2 -right-11 rotate-45 opacity-20">
                <Image
                  resizeMode="cover"
                  style={{ height: 140, width: 220 }}
                  source={tricycleImage}
                  tintColor="#90FA96"
                />
              </View>

              <View className="relative z-10 gap-6">
                <Text className="text-white text-base leading-6 font-semibold">
                  Premium Benefits
                </Text>
                <View className="flex-row gap-[5px]">
                  <View className="flex-1 min-h-[72px] rounded-lg border border-[rgba(144,250,150,0.2)] bg-[rgba(20,135,50,0.4)] p-3 gap-2">
                    <MaterialCommunityIcons
                      name="lightning-bolt-outline"
                      size={20}
                      color="#90FA96"
                    />
                    <Text className="text-white text-[13px] leading-5 font-['Inter']">
                      Double Eco-Points
                    </Text>
                  </View>
                  <View className="flex-1 min-h-[72px] rounded-lg border border-[rgba(144,250,150,0.2)] bg-[rgba(20,135,50,0.4)] p-3 gap-2">
                    <MaterialCommunityIcons
                      name="face-agent"
                      size={20}
                      color="#90FA96"
                    />
                    <Text className="text-white text-[13px] leading-5 font-['Inter']">
                      Priority Support
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <SectionCard title="Security and Configuration">
            <View className="min-h-[72px] flex-row items-center justify-between p-4 border-b border-b-[#F1F5F9] gap-4">
              <View className="flex-1 flex-row items-center gap-4">
                <View className="w-10 h-10 rounded-[10px] bg-[#F1F5F9] items-center justify-center">
                  <MaterialCommunityIcons name="web" size={22} color="#111827" />
                </View>
                <View className="flex-1 gap-1">
                  <Text style={{color: colors.text}} className="text-sm leading-5 font-medium">
                    Language
                  </Text>
                  <Text style={{color: colors.textMuted}} className="text-xs leading-4">
                    App display language
                  </Text>
                </View>
              </View>
              <View className="border border-[#E2E8F0] rounded-full px-3 py-1.5 bg-white">
                <Text className="text-xs leading-4 text-[#1F2A33]">English</Text>
              </View>
            </View>

            <SettingsRow
              icon={<MaterialCommunityIcons name="bell-outline" size={22} color="#111827" />}
              title="Notifications"
              subtitle="Manage your notifications and alerts."
              onPress={() => navigation.navigate("Notifications")}
            />
            <SettingsRow
              icon={<MaterialCommunityIcons name="lock-outline" size={22} color="#111827" />}
              title="Change phone number"
              subtitle="Update your security key"
              onPress={() => navigation.navigate("UpdateDetails")}
            />
            <SettingsRow
              icon={<MaterialCommunityIcons name="timer-outline" size={22} color="#111827" />}
              title="Active Session"
              subtitle="Manage devices currently logged in"
              onPress={() => navigation.navigate("ActiveSession")}
            />
          </SectionCard>

          <SectionCard title="Preferences">
            <View className="min-h-[72px] flex-row items-center justify-between p-4 gap-4">
              <View className="flex-1 flex-row items-center gap-4">
                <View className="w-10 h-10 rounded-[10px] bg-[#F1F5F9] items-center justify-center">
                  <MaterialCommunityIcons
                    name="brightness-4"
                    size={22}
                    color="#111827"
                    style={{ transform: [{ rotate: "125deg" }] }}
                  />
                </View>
                <View className="flex-1 gap-1">
                  <Text className="text-sm leading-5 font-medium text-[#101828]">
                    Appearance
                  </Text>
                  <Text className="text-xs leading-4 text-[#64748A]">
                    {isDark ? 'Dark mode' : 'Light mode'}
                  </Text>
                </View>
              </View>
              <AnimatedSwitch value={isDark} onChange={toggle} />
            </View>
          </SectionCard>

          <View className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
            <View className="flex-row items-center justify-between gap-4">
              <View className="flex-1 flex-row items-center gap-4">
                <View className="w-10 h-10 rounded-[10px] bg-[#F1F5F9] items-center justify-center">
                  <MaterialCommunityIcons
                    name="text-box-outline"
                    size={22}
                    color="#111827"
                  />
                </View>
                <View className="flex-1 gap-1">
                  <Text className="text-sm leading-5 font-medium text-[#101828]">
                    Eco-Impact Reports
                  </Text>
                  <Text className="text-xs leading-4 text-[#64748A]">
                    Weekly detailed insights
                  </Text>
                </View>
              </View>
              <Pressable className="flex-row items-center gap-2 border border-[#E2E8F0] rounded-2xl bg-[#F8FAFC] px-4 py-2.5">
                <MaterialCommunityIcons
                  name="tray-arrow-down"
                  size={16}
                  color="#1F2A33"
                />
                <Text className="text-sm leading-5 text-[#1F2A33]">
                  Export data
                </Text>
              </Pressable>
            </View>
          </View>

          <View className="bg-[#FFE088]/30 rounded-2xl border border-[#D4AF37] p-4">
            <View className="flex-row items-center justify-between gap-4">
              <View className="flex-1 flex-row items-center gap-4">
                <View className="w-10 h-10 rounded-[10px] bg-[#F1F5F9] items-center justify-center">
                  <MaterialCommunityIcons
                    name="phone"
                    size={22}
                    color="#111827"
                  />
                </View>
                <View className="flex-1 gap-1">
                  <Text className="text-sm leading-5 font-medium text-[#101828]">
                    Support line
                  </Text>
                  <Text className="text-xs leading-4 text-[#64748A]">
                    Average response: &lt;2 mins
                  </Text>
                </View>
              </View>
              <Pressable className="flex-row items-center gap-2 border border-[#D4AF37] rounded-full bg-[#FFE088] px-4 py-2.5">
                <Text className="text-sm leading-5 text-[#1F2A33]">
                  Call Now
                </Text>
              </Pressable>
            </View>
          </View>

          <SectionCard title="Support & Legal">
            <SettingsRow
              icon={<MaterialCommunityIcons name="help-circle-outline" size={22} color="#111827" />}
              title="Help Center"
              subtitle="FAQs and guides"
              onPress={() => navigation.navigate("HelpCenter")}
            />
            <SettingsRow
              icon={<MaterialCommunityIcons name="message-text-outline" size={22} color="#111827" />}
              title="Terms and Conditions"
              subtitle="Review our legal terms"
              onPress={() => navigation.navigate("TermsAndConditions")}
            />
            <SettingsRow
              icon={<MaterialCommunityIcons name="information-outline" size={22} color="#111827" />}
              title="About Zubba"
              subtitle="Version 1.0.0"
              onPress={() => navigation.navigate("AboutUs")}
            />
          </SectionCard>

          <Pressable
            className="h-[42px] rounded-full border border-[#C10007] items-center justify-center flex-row gap-2 bg-white"
            onPress={() => navigation.navigate("SignIn")}
          >
            <MaterialCommunityIcons name="logout" size={16} color="#C10007" />
            <Text className="text-sm leading-5 text-[#C10007] font-['Manrope']">
              Sign out
            </Text>
          </Pressable>
        </ScrollView>

        <AppBottomNav
          activeTab="settings"
          paddingBottom={0}
          onHomePress={() => navigation.navigate("Home")}
          onSavedPress={() =>
            navigation.navigate("Details", { itemId: "save", title: "Saved" })
          }
          onSettingsPress={() => navigation.navigate("Settings")}
        />
      </View>
    </SafeAreaView>
  );
}

export default SettingsScreen;