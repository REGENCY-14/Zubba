import { Image, ImageSourcePropType, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { APP_DARK } from "../../constants/appDarkTheme";
import { moderateScale } from "../../utils/scale";

type StatCardProps = {
  icon: ImageSourcePropType;
  label: string;
  value: string | number;
  description: string;
  labelColor?: string;
  /** Dark-mode override for `labelColor` — falls back to `labelColor` if omitted. */
  darkLabelColor?: string;
};

export function StatCard({
  icon,
  label,
  value,
  description,
  labelColor = "#31973D",
  darkLabelColor,
}: StatCardProps) {
  const { isDark, colors } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? APP_DARK.cardAlt : colors.card,
        borderWidth: 1,
        borderColor: isDark ? APP_DARK.border : colors.border,
        borderRadius: moderateScale(24),
        padding: moderateScale(16),
        gap: moderateScale(8),
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Image source={icon} style={{ width: moderateScale(21), height: moderateScale(21) }} resizeMode="contain" />
        <Text style={{ fontSize: moderateScale(12), fontWeight: '600', color: isDark ? (darkLabelColor ?? labelColor) : labelColor, fontFamily: 'Poppins', letterSpacing: 1.2, textTransform: 'uppercase' }}>
          {label}
        </Text>
      </View>

      <Text style={{ color: colors.text, fontFamily: 'Poppins', fontWeight: '600', fontSize: moderateScale(20), lineHeight: moderateScale(28) }}>
        {value}
      </Text>
      <Text style={{ color: isDark ? APP_DARK.textMuted : colors.textMuted, fontFamily: 'Poppins', fontWeight: '500', fontSize: moderateScale(14), lineHeight: moderateScale(21) }}>
        {description}
      </Text>
    </View>
  );
}
