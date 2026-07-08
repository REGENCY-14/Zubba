import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import type { RootStackScreenProps } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";
import CustomAppBar from "../../components/common/CustomAppBar";

type AccordionSectionProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  colors: ReturnType<typeof useTheme>["colors"];
};

function AccordionSection({
  title,
  children,
  defaultOpen = false,
  colors,
}: AccordionSectionProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.borderLight,
        overflow: "hidden",
      }}
    >
      <Pressable
        style={{
          minHeight: 64,
          paddingHorizontal: 16,
          paddingVertical: 14,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottomWidth: 1,
          borderBottomColor: colors.borderLight,
        }}
        onPress={() => setOpen((value) => !value)}
      >
        <Text
          style={{
            fontSize: 22,
            lineHeight: 30,
            fontWeight: "600",
            color: colors.text,
            fontFamily: "Poppins",
          }}
        >
          {title}
        </Text>
        <MaterialCommunityIcons
          name={open ? "chevron-up" : "chevron-down"}
          size={28}
          color={colors.textSub}
        />
      </Pressable>
      {open ? (
        <View style={{ paddingHorizontal: 16, paddingVertical: 18 }}>
          {children}
        </View>
      ) : null}
    </View>
  );
}

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
        minHeight: 141,
        borderRadius: 16,
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
          fontSize: 24,
          lineHeight: 30,
          fontWeight: "600",
          color: colors.text,
          fontFamily: "Poppins",
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: 18,
          lineHeight: 30,
          fontFamily: "Poppins",
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
}: {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  onPress?: () => void;
  colors: ReturnType<typeof useTheme>["colors"];
}) {
  return (
    <Pressable
      style={{
        minHeight: 64,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
      }}
      onPress={onPress}
    >
      <View>
        <Text
          style={{
            fontSize: 22,
            lineHeight: 30,
            color: colors.text,
            fontFamily: "Poppins",
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
              fontFamily: "Poppins",
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

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.surface }}
      edges={["top", "left", "right"]}
    >
      <CustomAppBar title="About Us" navigation={navigation}/>
      
      <View style={{ flex: 1, backgroundColor: colors.surface }}>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 12,
            paddingTop: 14,
            paddingBottom: 24,
            gap: 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              alignItems: "center",
              backgroundColor: colors.card,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: colors.border,
              paddingVertical: 26,
              paddingHorizontal: 16,
              gap: 10,
              shadowColor: colors.border,
              shadowOpacity: 0.2,
              shadowRadius: 18,
              shadowOffset: { width: 0, height: 6 },
              elevation: 2,
            }}
          >
            <Text
              style={{
                fontSize: 30,
                lineHeight: 34,
                fontWeight: "700",
                color: "#31973D",
                letterSpacing: 1.4,
              }}
            >
              ZUBBA
            </Text>
            <Text
              style={{
                fontSize: 12,
                lineHeight: 16,
                color: colors.textSub,
                textAlign: "center",
                fontFamily: "Poppins",
              }}
            >
              Waste Pickup and Recycling Control
            </Text>
            <View
              style={{
                backgroundColor: colors.iconBg,
                borderRadius: 999,
                paddingHorizontal: 12,
                paddingVertical: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  lineHeight: 14,
                  color: colors.text,
                  fontFamily: "Poppins",
                }}
              >
                Version 1.0.0
              </Text>
            </View>
          </View>

          <AccordionSection title="Our Mission" defaultOpen colors={colors}>
            <Text
              style={{
                fontSize: 22,
                lineHeight: 34,
                color: colors.textSub,
                fontFamily: "Poppins",
              }}
            >
              At Zubba, our mission is to make waste management simple,
              sustainable, and accessible through smart technology and
              eco-friendly solutions.
            </Text>
          </AccordionSection>

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
              backgroundColor: colors.card,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.borderLight,
              overflow: "hidden",
            }}
          >
            <Text
              style={{
                fontSize: 22,
                lineHeight: 30,
                fontWeight: "600",
                color: colors.text,
                padding: 16,
                fontFamily: "Poppins",
              }}
            >
              Resources
            </Text>
            <View style={{ height: 1, backgroundColor: colors.borderLight }} />
            <ResourceRow
              title="Website"
              subtitle="https://zubbaaste.com/"
              icon={
                <MaterialCommunityIcons
                  name="open-in-new"
                  size={26}
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
                  size={26}
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
                  size={26}
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

          <Text
            style={{
              fontSize: 12,
              lineHeight: 16,
              color: colors.textSub,
              textAlign: "center",
              marginTop: 8,
              fontFamily: "Poppins",
            }}
          >
            2026 Zubba Eco Solutions.
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default AboutUsScreen;
