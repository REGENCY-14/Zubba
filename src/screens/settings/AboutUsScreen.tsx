import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import type { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";
import CustomAppBar from "../../components/common/CustomAppBar";
import { Paragraph, Section } from "../../components/common/CustomAccordion";
import { AppBottomNav } from "../../components";
import { useAppSelector } from "../../hooks/useAppSelector";

const zubbaText = require("../../../assets/zubbaText.png");

type AccordionSectionProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  colors: ReturnType<typeof useTheme>["colors"];
};

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  backgroundColor: string;
  accentColor: string;
  colors: ReturnType<typeof useTheme>["colors"];
};

function FeatureCard({
  icon,
  title,
  description,
  backgroundColor,
  accentColor,
  colors,
}: FeatureCardProps) {
  return (
    <View
      style={{
        borderRadius: 24,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 18,
        gap: 10,
        backgroundColor,
      }}
    >
      <View
        style={{
          width: 32,
          height: 32,
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        {icon}
      </View>
      <Text
        style={{
          fontSize: 14,
          lineHeight: 30,
          fontWeight: "600",
          color: colors.text,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: 14,
          lineHeight: 30,
          color: accentColor,
        }}
      >
        {description}
      </Text>
    </View>
  );
}

function ResourceRow({
  title,
  subtitle,
  icon,
  onPress,
  colors,
  alignItems = "center",
}: {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  onPress?: () => void;
  alignItems?: "center" | "flex-start";
  colors: ReturnType<typeof useTheme>["colors"];
}) {
  return (
    <Pressable
      style={{
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: "row",
        alignItems: alignItems,
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
      }}
      onPress={onPress}
    >
      <View>
        <Text
          style={{
            fontSize: 14,
            lineHeight: 30,
            color: colors.text,
          }}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={{
              fontSize: 14,
              lineHeight: 22,
              color: colors.textSub,
            }}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View
        style={{ width: 26, alignItems: "center", justifyContent: "center" }}
      >
        {icon}
      </View>
    </Pressable>
  );
}

export function AboutUsScreen({ navigation }: RootStackScreenProps<"AboutUs">) {
  const { colors } = useTheme();
  const isPremium = useAppSelector((state) => state.customer?.is_premium);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.surface }}
      edges={["top", "left", "right"]}
    >
      <CustomAppBar title="About Us" navigation={navigation} />

      <View style={{ flex: 1, backgroundColor: colors.surface }}>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 12,
            paddingTop: 14,
            paddingBottom: 148,
            gap: 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              backgroundColor: colors.card,
              borderColor: colors.borderLight,
            }}
            className="border rounded-3xl p-3 gap-6"
          >
            <View
              style={{
                backgroundColor: colors.bg,
                borderColor: colors.borderLight,
              }}
              className="items-center rounded-2xl border py-6 px-4 gap-2"
            >
              <Image
                resizeMode="contain"
                style={{ height: 30 }}
                source={zubbaText}
                tintColor="#31973D"
              />
              {isPremium && (
                <View className="flex flex-row items-center justify-center gap-1 border border-[#D4AF37] rounded-full bg-[#FFE088] py-1 px-3">
                  <MaterialCommunityIcons
                    name="star"
                    size={11}
                    color="#574500"
                  />
                  <Text className="text-xs text-[#574500]">
                    Premium Gold Member
                  </Text>
                </View>
              )}
              <Text className="text-xs leading-4 text-[#64748A] text-center">
                Waste Pickup and Recycling Control
              </Text>
              <View className="bg-[#E3F2F7] rounded-full px-2.5 py-1">
                <Text className="text-[10px] leading-[11px] text-black font-['Inter']">
                  Version 1.0.0
                </Text>
              </View>
            </View>
            <Section
              title="Our Mission"
              defaultOpen
              colors={colors}
              cardBg={colors.bg}
            >
              <Paragraph colors={colors}>
                At Zubba, our mission is to make waste management simple,
                sustainable, and accessible through smart technology and
                eco-friendly solutions.
              </Paragraph>
            </Section>

            <View style={{ gap: 18 }}>
              <FeatureCard
                icon={
                  <MaterialCommunityIcons
                    name="recycle"
                    size={28}
                    color="#148732"
                  />
                }
                title="Zero Waste Goal"
                description="Driving circular economies through smart sorting."
                backgroundColor="rgba(0, 107, 35, 0.05)"
                accentColor="#6F7A6C"
                colors={colors}
              />
              <FeatureCard
                icon={
                  <MaterialCommunityIcons
                    name="shield-check"
                    size={28}
                    color="#735C00"
                  />
                }
                title="Trusted Service"
                description="Premium reliability for every pickup request."
                backgroundColor="rgba(115, 92, 0, 0.05)"
                accentColor="#6F7A6C"
                colors={colors}
              />
            </View>

            <View
              style={{
                backgroundColor: colors.bg,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: colors.borderLight,
                overflow: "hidden",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 30,
                  fontWeight: "600",
                  color: colors.text,
                  padding: 16,
                }}
              >
                Resources
              </Text>
              <View
                style={{ height: 1, backgroundColor: colors.borderLight }}
              />
              <ResourceRow
                title="Website"
                subtitle="https://zubbawaste.com/"
                alignItems="flex-start"
                icon={
                  <MaterialCommunityIcons
                    name="open-in-new"
                    size={16}
                    color={colors.textSub}
                  />
                }
                onPress={() => {}}
                colors={colors}
              />
              <ResourceRow
                title="Rate Us"
                icon={
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={16}
                    color={colors.textSub}
                  />
                }
                onPress={() =>
                  navigation.navigate("Details", {
                    itemId: "rate-us",
                    title: "Rate Us",
                  })
                }
                colors={colors}
              />
              <ResourceRow
                title="Share App"
                icon={
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={16}
                    color={colors.textSub}
                  />
                }
                onPress={() =>
                  navigation.navigate("Details", {
                    itemId: "share-app",
                    title: "Share App",
                  })
                }
                colors={colors}
              />
            </View>
          </View>
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

export default AboutUsScreen;
