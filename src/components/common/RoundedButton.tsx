import React from "react";
import { Pressable, Text, PressableProps } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { APP_DARK } from "../../constants/appDarkTheme";

interface RoundedButtonProps extends PressableProps {
  title: string;
  variant?: "primary" | "secondary" | "premium";
}

export default function RoundedButton({
  title,
  variant = "primary",
  style,
  ...props
}: RoundedButtonProps) {
  const { colors, isDark } = useTheme();
  const isPrimary = variant === "primary";
  const isPremium = variant === "premium";
  const isSecondary = !isPrimary && !isPremium;

  // Colors are computed fully inline (never via a `bg-[...]`/`text-[...]`
  // className) so there's a single, unambiguous source of truth per theme.
  // Mixing a static NativeWind color class with a conditional `style`
  // override on a Pressable's function-style prop is unreliable — the
  // static class can win and silently swallow the dark-mode override.
  const backgroundColor = isSecondary
    ? colors.card
    : isPrimary
    ? isDark
      ? APP_DARK.buttonPrimaryBg
      : "#31973D"
    : isDark
    ? APP_DARK.premiumButtonBg
    : "#FFE088";

  const hasBorder = isSecondary || (isPremium && isDark);
  const borderColor = isSecondary
    ? colors.border
    : isPremium && isDark
    ? APP_DARK.border
    : undefined;

  const textColor = isPrimary
    ? "#FFFFFF"
    : isPremium
    ? isDark
      ? APP_DARK.premiumButtonText
      : "#000000"
    : colors.text;

  // NOTE: `style` is intentionally never passed to Pressable as a function
  // here (even though PressableProps allows it) — NativeWind's `className`
  // interop does not reliably compose with a function-style prop on
  // Pressable; it silently drops it, which previously made every variant
  // render with no background at all (in both themes). No caller currently
  // passes a function style, so we just fold it into a plain array instead.
  return (
    <Pressable
      className="h-12 rounded-full justify-center items-center px-4"
      style={[
        { backgroundColor, borderWidth: hasBorder ? 1 : 0, borderColor },
        typeof style === "function" ? undefined : style,
      ]}
      {...props}
    >
      <Text className="text-[14px]" style={{ color: textColor }}>
        {title}
      </Text>
    </Pressable>
  );
}