import { Pressable, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { scale, verticalScale, moderateScale } from "../../utils/scale";

type SectionProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  compact?: boolean;
  colors: ReturnType<typeof useTheme>["colors"];
  cardBg?: string
};

export function Section({
  title,
  children,
  defaultOpen = false,
  colors,
  cardBg,
}: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <View
      style={{
        backgroundColor: cardBg ? cardBg : colors.card,
        borderRadius: moderateScale(16),
        borderWidth: 1,
        borderColor: colors.borderLight,
        overflow: "hidden",
      }}
    >
      <Pressable
        style={{
          minHeight: verticalScale(44),
          paddingHorizontal: scale(16),
          paddingVertical: verticalScale(12),
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
            fontSize: moderateScale(14),
            lineHeight: moderateScale(20),
            fontWeight: "600",
            color: colors.text,
          }}
        >
          {title}
        </Text>
        <MaterialCommunityIcons
          name={open ? "chevron-up" : "chevron-down"}
          size={moderateScale(18)}
          color={colors.textSub}
        />
      </Pressable>
      {open ? (
        <View style={{ paddingHorizontal: scale(16), paddingVertical: verticalScale(8), gap: moderateScale(12) }}>
          {children}
        </View>
      ) : null}
    </View>
  );
}

export function Paragraph({
  children,
  colors,
}: {
  children: React.ReactNode;
  colors: ReturnType<typeof useTheme>["colors"];
}) {
  return (
    <Text style={{ fontSize: moderateScale(14), lineHeight: moderateScale(20), color: colors.textSub }}>
      {children}
    </Text>
  );
}