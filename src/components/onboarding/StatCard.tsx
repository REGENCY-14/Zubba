import { Image, ImageSourcePropType, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

type StatCardProps = {
  icon: ImageSourcePropType;
  label: string;
  value: string | number;
  description: string;
  labelColor?: string;
};

export function StatCard({ icon, label, value, description, labelColor = "#31973D" }: StatCardProps) {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 24, padding: 16, gap: 8 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Image source={icon} style={{ width: 21, height: 21 }} resizeMode="contain" />
        <Text style={{ fontSize: 12, fontWeight: '600', color: labelColor, fontFamily: 'Poppins', letterSpacing: 1.2, textTransform: 'uppercase' }}>
          {label}
        </Text>
      </View>

      <View>
        <Text style={{ fontSize: 20, fontWeight: '600', color: colors.text, fontFamily: 'Poppins', lineHeight: 28 }}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </Text>
        <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textSub, fontFamily: 'Poppins', lineHeight: 21 }}>
          {description}
        </Text>
      </View>
    </View>
  );
}
