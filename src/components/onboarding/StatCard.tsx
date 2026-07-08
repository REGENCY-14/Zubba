import { Image, ImageSourcePropType, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

type StatCardProps = {
  icon: ImageSourcePropType;
  label: string;
  value: string | number;
  description: string;
  labelColor?: string;
};

export function StatCard({
  icon,
  label,
  value,
  description,
  labelColor = "#31973D",
}: StatCardProps) {
  const { isDark, colors } = useTheme();

  return (
    <View
      style={{borderColor: colors.border, borderRadius: 24, backgroundColor: isDark ? colors.card : colors.bg}}
      className="flex-1 border p-3"
    >
      <View className="flex-row justify-between items-center">
        <Image
          source={icon}
          className="w-[20px] h-[20px]"
          resizeMode="contain"
        />

        <Text
          className="text-xs font-semibold uppercase"
          style={{ color: labelColor }}
        >
          {label}
        </Text>
      </View>

      <Text style={{color: colors.textSub}} className="text-xl font-bold text-[#1F2A33] mt-2">{value}</Text>
      <Text style={{color: colors.textMuted}} className="text-sm text-[#6F7A6C] mt-1 font-medium">{description}</Text>
    </View>
  );
}
