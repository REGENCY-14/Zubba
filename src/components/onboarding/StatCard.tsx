import { Image, ImageSourcePropType, Text, View } from "react-native";

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
  return (
    <View
      className="flex-1 bg-white border border-[#E2E8F0] p-3"
      style={{ borderRadius: 24 }}
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

      <Text className="text-xl font-bold text-[#1F2A33] mt-2">{value}</Text>

      <Text className="text-sm text-[#6F7A6C] mt-1">{description}</Text>
    </View>
  );
}
