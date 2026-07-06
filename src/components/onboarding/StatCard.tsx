import { Image, ImageSourcePropType, Text, View } from "react-native";

type StatCardProps = {
  icon: ImageSourcePropType;
  label: string;
  value: string | number;
  description: string;
  labelColor?: string;
};

export function StatCard({ icon, label, value, description, labelColor = "#31973D" }: StatCardProps) {
  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.95)', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 24, padding: 16, gap: 8 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Image source={icon} style={{ width: 21, height: 21 }} resizeMode="contain" />
        <Text style={{ fontSize: 12, fontWeight: '600', color: labelColor, fontFamily: 'Poppins', letterSpacing: 1.2, textTransform: 'uppercase' }}>
          {label}
        </Text>
      </View>

      <View>
        <Text style={{ fontSize: 20, fontWeight: '600', color: '#1F2A33', fontFamily: 'Poppins', lineHeight: 28 }}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </Text>
        <Text style={{ fontSize: 14, fontWeight: '500', color: '#6F7A6C', fontFamily: 'Poppins', lineHeight: 21 }}>
          {description}
        </Text>
      </View>
    </View>
  );
}
