import { Pressable, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";

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
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.borderLight,
        overflow: "hidden",
      }}
    >
      <Pressable
        style={{
          minHeight: 44,
          paddingHorizontal: 16,
          paddingVertical: 12,
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
            fontSize: 14,
            lineHeight: 20,
            fontWeight: "600",
            color: colors.text,
          }}
        >
          {title}
        </Text>
        <MaterialCommunityIcons
          name={open ? "chevron-up" : "chevron-down"}
          size={18}
          color={colors.textSub}
        />
      </Pressable>
      {open ? (
        <View style={{ paddingHorizontal: 16, paddingVertical: 8, gap: 12 }}>
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
    <Text style={{ fontSize: 14, lineHeight: 20, color: colors.textSub }}>
      {children}
    </Text>
  );
}