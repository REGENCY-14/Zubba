import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import type { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";

const supportImage = require("../../../assets/tricycle image.png");

type SectionProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  colors: ReturnType<typeof useTheme>["colors"];
};

function Section({
  title,
  children,
  defaultOpen = false,
  colors,
}: SectionProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <View
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: colors.card,
        borderColor: colors.borderLight,
        borderWidth: 1,
      }}
    >
      <Pressable
        className="flex-row items-center justify-between px-4 py-3 min-h-[44px]"
        style={{ borderBottomColor: colors.borderLight, borderBottomWidth: 1 }}
        onPress={() => setOpen((v) => !v)}
      >
        <Text
          className="text-sm font-semibold"
          style={{ color: colors.text, fontFamily: "Poppins" }}
        >
          {title}
        </Text>
        <MaterialCommunityIcons
          name={open ? "chevron-up" : "chevron-down"}
          size={18}
          color={colors.textSub}
        />
      </Pressable>

      {open ? <View className="px-4 py-2 gap-3">{children}</View> : null}
    </View>
  );
}

function Paragraph({
  children,
  colors,
}: {
  children: React.ReactNode;
  colors: ReturnType<typeof useTheme>["colors"];
}) {
  return (
    <Text
      className="text-sm leading-5"
      style={{ color: colors.textSub, fontFamily: "Poppins" }}
    >
      {children}
    </Text>
  );
}

function BulletList({
  items,
  colors,
}: {
  items: string[];
  colors: ReturnType<typeof useTheme>["colors"];
}) {
  return (
    <View className="gap-2">
      {items.map((item) => (
        <View key={item} className="flex-row items-start gap-2">
          <Text
            className="w-3 text-lg leading-5"
            style={{ color: colors.textSub }}
          >
            •
          </Text>
          <Text
            className="flex-1 text-sm leading-5"
            style={{ color: colors.textSub, fontFamily: "Poppins" }}
          >
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function HelpCenterScreen({
  navigation,
}: RootStackScreenProps<"HelpCenter">) {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.bg }}
      edges={["top", "left", "right"]}
    >
      <View className="flex-1" style={{ backgroundColor: colors.bg }}>
        <View className="h-12 flex-row items-center justify-between px-4">
          <Pressable
            className="w-6 h-6 items-center justify-center"
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={28}
              color={colors.text}
            />
          </Pressable>

          <Text
            className="text-base font-semibold"
            style={{ color: colors.text, fontFamily: "Inter" }}
          >
            Help Center
          </Text>

          <View className="w-6 h-6" />
        </View>

        <ScrollView
          className="p-4"
          contentContainerStyle={{ paddingBottom: 24 }}
          style={{ backgroundColor: colors.surface }}
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-4">
            <View
              className="h-[50px] rounded-full flex-row items-center px-3 gap-2"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: 1,
              }}
            >
              <MaterialCommunityIcons
                name="magnify"
                size={24}
                color={colors.iconColor}
              />
              <Text
                className="text-sm font-bold"
                style={{ color: colors.text, fontFamily: "Nexa Text-Trial" }}
              >
                Search for help
              </Text>
            </View>

            <Section title="Getting Started" defaultOpen colors={colors}>
              <Paragraph colors={colors}>
                Connect your Zubba account, verify your address, and set your
                first pickup schedule to start your waste-free lifestyle.
              </Paragraph>
            </Section>

            <Section
              title="How do I schedule a pickup?"
              defaultOpen
              colors={colors}
            >
              <Paragraph colors={colors}>
                To schedule a pickup, go to the Home or Schedule tab. Tap on
                Find nearby tricycles for an instant pickup or Plan future
                pickup to set a specific date and time that works for you.
              </Paragraph>

              <Paragraph colors={colors}>
                What waste types can I dispose of? Zubba supports a wide range
                of household and commercial waste, including:
              </Paragraph>

              <BulletList
                colors={colors}
                items={[
                  "General Waste: Everyday household trash.",
                  "Recyclables: Plastic bottles, paper, cardboard, glass, and metal.",
                  "Organic Waste: Food scraps and garden waste.",
                  "E-Waste: Old electronics (requires special handling). Please ensure your waste is properly sorted.",
                ]}
              />
            </Section>

            <Section
              title="How does the Zubba Wallet work?"
              defaultOpen
              colors={colors}
            >
              <Paragraph colors={colors}>
                Your Zubba Wallet is a secure digital account used to pay for
                waste collection services seamlessly.
              </Paragraph>

              <BulletList
                colors={colors}
                items={[
                  "Faster Checkout: No need to enter card details every time.",
                  "Auto-Topup: Premium users can enable this feature.",
                  "Bonus Eco-Points: Wallet transactions may earn extra rewards.",
                ]}
              />
            </Section>

            <Section
              title="How do I secure my account?"
              defaultOpen
              colors={colors}
            >
              <BulletList
                colors={colors}
                items={[
                  "Secure OTPs when they arrive.",
                  "Keep your app updated regularly.",
                  "Monitor active sessions in settings.",
                ]}
              />
            </Section>

            <View
              className="rounded-2xl p-4 gap-2"
              style={{
                borderColor: "#31973D",
                borderWidth: 1,
                backgroundColor: "rgba(0, 107, 35, 0.1)",
              }}
            >
              <Text
                className="text-sm font-semibold"
                style={{ color: colors.text, fontFamily: "Poppins" }}
              >
                Still need help
              </Text>

              <Text
                className="text-sm"
                style={{ color: colors.textSub, fontFamily: "Poppins" }}
              >
                Visit our website or contact support for assistance.
              </Text>

              <Pressable
                className="flex-row items-center justify-center rounded-xl px-4 h-12 gap-2 self-start"
                style={{ backgroundColor: "#31973D", minWidth: 198 }}
                onPress={() => {}}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 14,
                    fontFamily: "Plus Jakarta Sans",
                  }}
                >
                  Visit Zubba website
                </Text>
                <MaterialCommunityIcons
                  name="open-in-new"
                  size={18}
                  color="#fff"
                />
              </Pressable>
            </View>

            <View className="h-[230px] rounded-2xl overflow-hidden">
              <Image
                source={supportImage}
                resizeMode="cover"
                style={{ width: "100%", height: "100%" }}
              />

              <View
                className="absolute bottom-0 left-0 right-0 p-6 gap-2"
                style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
              >
                <Text
                  className="text-xs uppercase tracking-widest"
                  style={{ color: "rgba(255,255,255,0.8)" }}
                >
                  OUR COMMITMENT
                </Text>
                <Text className="text-base font-semibold text-white">
                  We&apos;re here to make sustainability simple.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default HelpCenterScreen;
