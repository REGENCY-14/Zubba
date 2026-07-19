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
    <View style={{ flex: 1, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 24, padding: 16, gap: 8 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Image source={icon} style={{ width: 21, height: 21 }} resizeMode="contain" />
        <Text style={{ fontSize: 12, fontWeight: '600', color: labelColor, fontFamily: 'Poppins', letterSpacing: 1, textTransform: 'uppercase' }}>
          {label}
        </Text>
      </View>

      <Text style={{color: colors.textSub}} className="text-xl font-bold mt-2">{value}</Text>
      <Text style={{color: colors.textMuted}} className="text-sm mt-1 font-medium">{description}</Text>
    </View>
  );
}
