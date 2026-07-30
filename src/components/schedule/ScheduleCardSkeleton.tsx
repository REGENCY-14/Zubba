import { View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

function SkeletonBar({
  width,
  height = 12,
  style,
}: {
  width: number | `${number}%`;
  height?: number;
  style?: object;
}) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius: 6,
          backgroundColor: colors.surface,
        },
        style,
      ]}
    />
  );
}

function ScheduleCardSkeletonItem() {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        paddingHorizontal: 12,
        height: 128,
        gap: 12,
      }}
    >
      <View style={{ flex: 1, gap: 10, justifyContent: "center" }}>
        <SkeletonBar width={96} height={24} />
        <SkeletonBar width="70%" height={14} />
        <SkeletonBar width="55%" height={14} />
        <SkeletonBar width="40%" height={14} />
      </View>
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: colors.surface,
          marginTop: 8,
        }}
      />
    </View>
  );
}

export function ScheduleListSkeleton({ count = 3 }: { count?: number }) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: colors.bg,
      }}
    >
      <View
        style={{
          height: 48,
          justifyContent: "center",
          paddingHorizontal: 12,
          backgroundColor: colors.surface,
        }}
      >
        <SkeletonBar width={100} height={16} />
      </View>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index}>
          {index > 0 && (
            <View
              style={{
                borderTopWidth: 1,
                borderColor: colors.border,
                marginHorizontal: 12,
              }}
            />
          )}
          <ScheduleCardSkeletonItem />
        </View>
      ))}
    </View>
  );
}
