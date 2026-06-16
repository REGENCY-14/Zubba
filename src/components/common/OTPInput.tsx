import { useRef } from "react";
import { TextInput, View } from "react-native";

type OTPInputProps = {
  value: string[];
  onChange: (digits: string[]) => void;
  length?: number;
  onComplete?: (otp: string) => void;
};

export function OTPInput({
  value,
  onChange,
  length = 4,
  onComplete,
}: OTPInputProps) {
  const refs = useRef<(TextInput | null)[]>([]);

  return (
    <View className="flex-row gap-3">
      {Array.from({ length }).map((_, i) => (
        <TextInput
          key={i}
          ref={(ref) => {
            refs.current[i] = ref;
          }}
          value={value[i]}
          keyboardType="number-pad"
          maxLength={i === 0 ? length : 1}
          className={[
            "w-[44px] h-[44px] pb-2 rounded-md border text-[20px] text-center font-medium",
            value[i]
              ? "border-[#34A853] bg-white text-[#1F2A33]"
              : "border-[#B8B8B833] bg-[#B8B8B833] text-[#1F2A33]",
          ].join(" ")}
          onChangeText={(text) => {
            // paste support
            if (text.length > 1) {
              const pasted = text.replace(/\D/g, "").slice(0, length);

              const digits = Array(length).fill("");

              pasted.split("").forEach((char, index) => {
                digits[index] = char;
              });

              onChange(digits);

              if (digits.every(Boolean)) {
                onComplete?.(digits.join(""));
              }

              refs.current[Math.min(pasted.length - 1, length - 1)]?.focus();

              return;
            }

            if (!/^\d$/.test(text)) return;

            const digits = [...value];
            digits[i] = text;

            onChange(digits);

            if (i < length - 1) {
              refs.current[i + 1]?.focus();
            }

            if (digits.every(Boolean)) {
              onComplete?.(digits.join(""));
            }
          }}
          onKeyPress={(e) => {
            if (e.nativeEvent.key !== "Backspace") return;

            const digits = [...value];

            if (digits[i]) {
              digits[i] = "";
            } else if (i > 0) {
              digits[i - 1] = "";
              refs.current[i - 1]?.focus();
            }

            onChange(digits);
          }}
        />
      ))}
    </View>
  );
}