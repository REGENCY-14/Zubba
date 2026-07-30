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

export function SubscriptionSkeleton() {
  const { colors } = useTheme();

  return (
    <View style={{ gap: 20, paddingTop: 12 }}>
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 20,
          padding: 20,
          gap: 16,
          height: 180,
        }}
      >
        <Bar width="50%" height={20} />
        <Bar width="40%" height={32} />
        <Bar width="60%" height={14} />
      </View>

      <View style={{ gap: 8 }}>
        <Bar width={120} height={16} />
        <View
          style={{
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 16,
            padding: 16,
            height: 72,
          }}
        />
      </View>

      <View style={{ gap: 8 }}>
        <Bar width={140} height={16} />
        <View
          style={{
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <View
              key={i}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                padding: 16,
                borderBottomWidth: i === 3 ? 0 : 1,
                borderBottomColor: colors.borderLight,
              }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: colors.surface,
                }}
              />
              <Bar width="70%" height={14} />
            </View>
          ))}
        </View>
      </View>

      <Bar width="100%" height={52} />
      <Bar width="100%" height={52} />
    </View>
  );
}
