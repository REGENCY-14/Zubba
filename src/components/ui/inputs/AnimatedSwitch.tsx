import React, { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, ViewStyle } from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import { scale, verticalScale, moderateScale } from "../../../utils/scale";

type AnimatedSwitchProps = {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
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
  disabled = false,
  trackColor,
  thumbColor,
  style,
}: AnimatedSwitchProps) {
  const translateX = useRef(new Animated.Value(value ? scale(14) : scale(0))).current;
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
      toValue: value ? scale(14) : scale(0),
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
      onPress={() => {
        if (!disabled) onChange(!value);
      }}
      disabled={disabled}
      style={[
        {
          width: scale(36),
          height: verticalScale(20),
          borderRadius: 999,
          borderWidth: 1,
          borderColor: "#31973D",
          justifyContent: "center",
        },
        { backgroundColor },
        style,
        disabled ? { opacity: 0.5 } : null,
      ]}
    >
      <Animated.View
        style={{
          width: moderateScale(16),
          height: moderateScale(16),
          borderRadius: 999,
          position: "absolute",
          left: scale(2),
          top: verticalScale(1),
          transform: [{ translateX }],
          backgroundColor: thumbBg,
        }}
      />
    </Pressable>
  );
}