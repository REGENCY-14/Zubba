import React, { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, ViewStyle } from "react-native";
import { useTheme } from "../../../context/ThemeContext";

type AnimatedSwitchProps = {
  value: boolean;
  onChange: (value: boolean) => void;
  trackColor?: {
    on?: string;
    off?: string;
  };
  thumbColor?: {
    on?: string;
    off?: string;
  };
  style?: ViewStyle;
};

export default function AnimatedSwitch({
  value,
  onChange,
  trackColor,
  thumbColor,
  style,
}: AnimatedSwitchProps) {
  const translateX = useRef(new Animated.Value(value ? 14 : 0)).current;
  const { colors } = useTheme();

  const resolvedTrackColor = trackColor ?? {
    on: "#31973D",
    off: colors.surface
  };

  const resolvedThumbColor = thumbColor ?? {
    on: colors.surface,
    off: "#31973D",
  };

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: value ? 14 : 0,
      duration: 220,
      easing: Easing.out(Easing.circle),
      useNativeDriver: true,
    }).start();
  }, [value, translateX]);

  const backgroundColor = value
    ? resolvedTrackColor.on
    : resolvedTrackColor.off;

  const thumbBg = value
    ? resolvedThumbColor.on
    : resolvedThumbColor.off;

  return (
    <Pressable
      onPress={() => onChange(!value)}
      style={[
        {
          width: 36,
          height: 20,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: "#31973D",
          justifyContent: "center",
        },
        { backgroundColor },
        style,
      ]}
    >
      <Animated.View
        style={{
          width: 16,
          height: 16,
          borderRadius: 999,
          position: "absolute",
          left: 2,
          top: 1,
          transform: [{ translateX }],
          backgroundColor: thumbBg,
        }}
      />
    </Pressable>
  );
}