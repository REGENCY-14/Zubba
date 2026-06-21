import React, { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, ViewStyle } from "react-native";

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
  trackColor = {
    on: "#31973D",
    off: "#FFFFFF",
  },
  thumbColor = {
    on: "#FFFFFF",
    off: "#31973D",
  },
  style,
}: AnimatedSwitchProps) {
  const translateX = useRef(new Animated.Value(value ? 14 : 0)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: value ? 14 : 0,
      duration: 220,
      easing: Easing.out(Easing.circle),
      useNativeDriver: true,
    }).start();
  }, [value, translateX]);

  const backgroundColor = value ? trackColor.on : trackColor.off;
  const thumbBg = value ? thumbColor.on : thumbColor.off;

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