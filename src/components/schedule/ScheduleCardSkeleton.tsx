import { View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

function SkeletonBar({
  width,
  height = 12,
  radius = 6,
  style,
}: {
  width: number | `${number}%`;
  height?: number;
  radius?: number;
  style?: object;
}) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius: radius,
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
    <View className="flex-row items-start px-3 h-32">
      {/* Main content column — mirrors flex-1 pt-1 pr-4 pb-1 gap-2.5 justify-center h-full */}
      <View className="flex-1 pt-1 pr-4 pb-1 gap-2.5 justify-center h-full">
        {/* Status badge row */}
        <View className="flex-row items-center gap-2">
          <SkeletonBar width={92} height={24} radius={12} />
        </View>

        {/* Date/time row + divider, and location line */}
        <View className="gap-1.5">
          <View className="flex-row items-center gap-2">
            <SkeletonBar width={64} height={14} />
            <View
              style={{ backgroundColor: colors.border }}
              className="w-px h-4"
            />
            <SkeletonBar width={56} height={14} />
          </View>
          <SkeletonBar width="70%" height={14} />
        </View>

        {/* Estimated cost row */}
        <View className="flex-row justify-between items-center">
          <SkeletonBar width={90} height={13} />
          <SkeletonBar width={70} height={20} />
        </View>
      </View>

      {/* Trailing menu button — mirrors w-[35px] items-center pt-2, w-8 h-8 rounded-full */}
      <View className="w-[35px] items-center pt-2">
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: colors.surface,
          }}
        />
      </View>
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
      {/* Header — matches the real "Schedules" bar (h-12, px-3) */}
      <View
        style={{
          height: 48,
          justifyContent: "center",
          paddingHorizontal: 12,
          backgroundColor: colors.surface,
        }}
      >
        <SkeletonBar width={90} height={16} />
      </View>

      {Array.from({ length: count }).map((_, index) => (
        <View key={index}>
          {index > 0 && (
            <View
              style={{
                borderTopWidth: 1,
                borderColor: colors.border,
                marginHorizontal: 12,
                marginVertical: 8,
              }}
            />
          )}
          <ScheduleCardSkeletonItem />
        </View>
      ))}
    </View>
  );
}