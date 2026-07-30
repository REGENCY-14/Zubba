import { View } from "react-native";
import { Dimensions } from "react-native";
import { useTheme } from "../../context/ThemeContext";

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH - 48;

function Bar({
  width,
  height = 14,
  radius = 8,
  color,
}: {
  width: number | `${number}%`;
  height?: number;
  radius?: number;
  color?: string;
}) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        width,
        height,
        borderRadius: radius,
        backgroundColor: color ?? colors.surface,
      }}
    />
  );
}

export function ChoosePlanSkeleton() {
  const { colors } = useTheme();

  return (
    <View style={{ paddingBottom: 24 }}>
      {/* Comparison table */}
      <View
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 24,
          padding: 16,
          marginHorizontal: 16,
          marginTop: 16,
          backgroundColor: colors.card,
          gap: 24,
        }}
      >
        {/* "START YOUR FREE WEEK TRIAL!" — 3 centered lines */}
        <View style={{ alignItems: 'center', gap: 8 }}>
          <Bar width="70%" height={26} />
          <Bar width="45%" height={26} />
          <Bar width="55%" height={26} />
        </View>

        <View className="px-4">
          {/* Column header row: label col + FREE + GOLD */}
          <View className="flex-row items-center mb-1" style={{ height: 16 }}>
            <View className="flex-1" />
            <View className="w-[72px] items-center">
              <Bar width={36} height={10} radius={2} />
            </View>
            <View className="w-[72px] items-center">
              <Bar width={36} height={10} radius={2} />
            </View>
          </View>

          {/* Feature rows */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <View
              key={i}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: 45,
                borderBottomWidth: i < 5 ? 1 : 0,
                borderBottomColor: colors.borderLight,
              }}
            >
              <View className="flex-1" style={{ paddingRight: 12 }}>
                <Bar width={i % 2 === 0 ? '80%' : '60%'} height={14} />
              </View>
              <View className="w-[72px] items-center">
                <Bar width={20} height={20} radius={10} />
              </View>
              <View className="w-[72px] items-center">
                <Bar width={20} height={20} radius={10} />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Cards — horizontal row, mirrors the ScrollView of plan cards */}
      <View style={{ marginTop: 24, paddingHorizontal: 24, flexDirection: 'row', gap: 16 }}>
        {[0, 1].map((i) => (
          <View
            key={i}
            style={{
              width: CARD_WIDTH * 0.86,
              minHeight: 320,
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              backgroundColor: colors.surface,
              padding: 32,
              justifyContent: 'space-between',
              opacity: i === 0 ? 1 : 0.5,
            }}
          >
            {/* Title + subtitle */}
            <View style={{ gap: 8 }}>
              <Bar width="60%" height={22} color={colors.border} />
              <Bar width="85%" height={14} color={colors.border} />
            </View>

            {/* Price */}
            <View style={{ gap: 8 }}>
              <Bar width="50%" height={30} color={colors.border} />
            </View>

            {/* CTA button */}
            <Bar width="100%" height={57} radius={28.5} color={colors.border} />
          </View>
        ))}
      </View>
    </View>
  );
}