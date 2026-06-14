import React from "react";
import { Pressable, Text, PressableProps } from "react-native";

interface RoundedButtonProps extends PressableProps {
  title: string;
  variant?: "primary" | "secondary";
}

export default function RoundedButton({
  title,
  variant = "primary",
  ...props
}: RoundedButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <Pressable
      className={[
        "h-12 rounded-full justify-center items-center px-4",
        isPrimary ? "bg-[#31973D]" : "bg-white border border-[#E2E8F0]",
      ].join(" ")}
      {...props}
    >
      <Text
        className={[
          "text-[14px]",
          isPrimary ? "text-white" : "text-black",
        ].join(" ")}
      >
        {title}
      </Text>
    </Pressable>
  );
}