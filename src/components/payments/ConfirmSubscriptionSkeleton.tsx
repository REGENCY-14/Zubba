import { View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

function Bar({ width, height = 14 }: { width: number | `${number}%`; height?: number }) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        width,
        height,
        borderRadius: 8,
        backgroundColor: colors.surface,
      }}
    />
  );
}

export function ConfirmSubscriptionSkeleton() {
  const { colors } = useTheme();

  return (
    <View style={{ padding: 16, gap: 16 }}>
      <View
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 24,
          padding: 16,
          backgroundColor: colors.card,
          gap: 12,
        }}
      >
        <Bar width="60%" height={24} />
        <Bar width="90%" height={14} />
        <Bar width="45%" height={28} />
      </View>
      <Bar width="100%" height={48} />
    </View>
  );
}
