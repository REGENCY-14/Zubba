import React from "react";
import { Text, View } from "react-native";

type TextAvatarProps = {
  name: string;
  size?: number;
  bgColor?: string;
};

export function TextAvatar({
  name,
  size = 40,
  bgColor = "#E5E7EB",
}: TextAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <View
      style={{
        width: size,
        height: size,
        backgroundColor: bgColor,
      }}
      className="border-2 border-white rounded-full items-center justify-center"
    >
      <Text
        className="text-black font-bold"
        style={{
          fontSize: size * 0.4,
        }}
      >
        {initials}
      </Text>
    </View>
  );
}