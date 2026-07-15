import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import type { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";
import CustomAppBar from "../../components/common/CustomAppBar";
import { Paragraph, Section } from "../../components/common/CustomAccordion";
import { AppBottomNav } from "../../components";

const supportImage = require("../../../assets/help.png");

function BulletList({
  items,
  colors,
}: {
  items: string[];
  colors: ReturnType<typeof useTheme>["colors"];
}) {
  return (
    <View style={{ gap: 8 }}>
      {items.map((item) => (
        <View
          key={item}
          style={{ flexDirection: "row", alignItems: "flex-start", gap: 8 }}
        >
          <Text
            style={{
              width: 12,
              color: colors.textSub,
              fontSize: 18,
              lineHeight: 20,
            }}
          >
            •
          </Text>
          <Text
            style={{
              flex: 1,
              fontSize: 14,
              lineHeight: 20,
              color: colors.textSub,
            }}
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
  const [search, setSearch] = useState("");

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.bg }}
      edges={["top", "left", "right"]}
    >
      <CustomAppBar title="Help Center" navigation={navigation} />
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <ScrollView
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 148,
            gap: 14,
            backgroundColor: colors.surface,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              height: 50,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.card,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 14,
              gap: 10,
            }}
          >
            <MaterialCommunityIcons
              name="magnify"
              size={24}
              color={colors.iconColor}
            />

            <TextInput
              style={{ color: colors.text }}
              className="text-[13px] outline-none font-semibold"
              placeholder="Search for help"
              placeholderTextColor={colors.iconColor}
              value={search}
              onChangeText={setSearch}
            />
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
              To schedule a pickup, go to the Home or Schedule tab. Tap on Find
              nearby tricycles for an instant pickup or Plan future pickup to
              set a specific date and time that works for you. Select your waste
              type, confirm your location on the map, and tap Proceed to
              request.
            </Paragraph>
            <Paragraph colors={colors}>
              What waste types can I dispose of? Zubba supports a wide range of
              household and commercial waste, including:
            </Paragraph>
            <BulletList
              colors={colors}
              items={[
                "General Waste: Everyday household trash.",
                "Recyclables: Plastic bottles, paper, cardboard, glass, and metal.",
                "Organic Waste: Food scraps and garden waste.",
                "E-Waste: Old electronics (requires special handling). Please ensure your waste is properly sorted as per the guidelines in the app to earn maximum Eco-Points.",
              ]}
            />
            <Paragraph colors={colors}>
              Can I cancel or reschedule a pickup? Yes. You can cancel a pickup
              directly from the Schedule tab or the active request screen.
              Please note that cancellations made within 30 minutes of the
              scheduled pickup time may incur a small convenience fee.
            </Paragraph>
          </Section>

          <Section
            title="How does the Zubba Wallet work?"
            defaultOpen
            colors={colors}
          >
            <Paragraph colors={colors}>
              Your Zubba Wallet is a secure digital account used to pay for
              waste collection services seamlessly. You can top up your wallet
              using Mobile Money, Credit/Debit Cards, or AirtelTigo.
            </Paragraph>
            <Paragraph colors={colors}>
              What are the benefits of using the Zubba Wallet?
            </Paragraph>
            <BulletList
              colors={colors}
              items={[
                "Faster Checkout: No need to enter card details for every request.",
                "Auto-Topup: Premium users can enable this to ensure they never miss a collection.",
                "Bonus Eco-Points: Wallet transactions often qualify for higher rewards.",
              ]}
            />
            <Paragraph colors={colors}>
              Is my payment information secure? Absolutely. All transactions are
              encrypted and processed through our secure payment gateway. We do
              not store your full card details or PINs on our servers.
            </Paragraph>
          </Section>

          <Section
            title="How do I secure my account?"
            defaultOpen
            colors={colors}
          >
            <Paragraph colors={colors}>
              Since Zubba uses your phone number or email for direct access, we
              recommend securing your account with verification codes and
              keeping your app updated.
            </Paragraph>
            <BulletList
              colors={colors}
              items={[
                "Secure OTPs when they arrive.",
                "Keeping your app updated to the latest version to ensure you have the latest security patches.",
                "Monitoring your Active Sessions in Settings to manage devices logged into your account.",
              ]}
            />
          </Section>

          <Section
            title="How do I change my contact details?"
            defaultOpen
            colors={colors}
          >
            <Paragraph colors={colors}>
              Go to Settings &gt; Security &amp; PIN &gt; Update Identity
              Details. Enter your new email or phone number. You will receive a
              verification code on both your old and new contact methods to
              confirm the change.
            </Paragraph>
          </Section>

          <View
            style={{
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#31973D",
              padding: 16,
              gap: 8,
              backgroundColor: "rgba(0, 107, 35, 0.1)",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                lineHeight: 20,
                fontWeight: "600",
                color: colors.text,
              }}
            >
              Still need help
            </Text>
            <Text
              style={{ fontSize: 14, lineHeight: 20, color: colors.textSub }}
            >
              Visit our website or contact our support team for personalized
              assistance.
            </Text>
            <Pressable
              style={{
                alignSelf: "flex-start",
                minWidth: 198,
                height: 48,
                paddingHorizontal: 16,
                borderRadius: 12,
                backgroundColor: "#31973D",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
              onPress={() => {}}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 14, lineHeight: 20 }}>
                Visit Zubba website
              </Text>
              <MaterialCommunityIcons
                name="open-in-new"
                size={18}
                color="#FFFFFF"
              />
            </Pressable>
          </View>

          <View className="h-[230px] rounded-2xl overflow-hidden">
            <Image
              source={supportImage}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />

            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.9)"]}
              style={{
                position: "absolute",
                inset: 0,
              }}
            />

            <View className="absolute bottom-0 left-0 right-0 p-6 gap-2">
              <Text className="text-[12px] leading-[14px] tracking-[1.2px] uppercase font-medium text-white/80">
                OUR COMMITMENT
              </Text>

              <Text className="text-base leading-7 font-semibold text-white">
                We&apos;re here to make sustainability simple.
              </Text>
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

export default HelpCenterScreen;
