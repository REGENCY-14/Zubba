import { Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { APP_DARK } from '../constants/appDarkTheme';

type HeaderProps = {
  title: string;
  subtitle?: string;
};

export function Header({ title, subtitle }: HeaderProps) {
  const { isDark } = useTheme();

  return (
    <View className="gap-[6px]">
      <Text className="text-[28px] font-extrabold" style={{ color: isDark ? APP_DARK.text : '#0F172A' }}>{title}</Text>
      {subtitle ? (
        <Text className="text-[15px] leading-[22px]" style={{ color: isDark ? APP_DARK.textSub : '#475569' }}>{subtitle}</Text>
      ) : null}
    </View>
  );
}
