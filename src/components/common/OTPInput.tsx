import { useRef } from "react";
import { TextInput, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

type OTPInputProps = {
  value: string[];
  onChange: (digits: string[]) => void;
  length?: number;
  onComplete?: (otp: string) => void;
};

export function OTPInput({ value, onChange, length = 4, onComplete }: OTPInputProps) {
  const refs = useRef<(TextInput | null)[]>([]);
  const { colors } = useTheme();

  return (
    <View style={{ flexDirection: "row", gap: 12 }}>
      {Array.from({ length }).map((_, i) => (
        <TextInput
          key={i}
          ref={(ref) => { refs.current[i] = ref; }}
          value={value[i]}
          keyboardType="number-pad"
          maxLength={i === 0 ? length : 1}
          style={{
            width: 44, height: 44, paddingBottom: 8, borderRadius: 6,
            borderWidth: 1, fontSize: 20, textAlign: "center", fontWeight: "500",
            backgroundColor: value[i] ? colors.card : colors.surface,
            borderColor: value[i] ? "#34A853" : colors.border,
            color: colors.text,
          }}
          onChangeText={(text) => {
            if (text.length > 1) {
              const pasted = text.replace(/\D/g, "").slice(0, length);
              const digits = Array(length).fill("");
              pasted.split("").forEach((char, index) => { digits[index] = char; });
              onChange(digits);
              if (digits.every(Boolean)) onComplete?.(digits.join(""));
              refs.current[Math.min(pasted.length - 1, length - 1)]?.focus();
              return;
            }
            if (!/^\d$/.test(text)) return;
            const digits = [...value];
            digits[i] = text;
            onChange(digits);
            if (i < length - 1) refs.current[i + 1]?.focus();
            if (digits.every(Boolean)) onComplete?.(digits.join(""));
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
