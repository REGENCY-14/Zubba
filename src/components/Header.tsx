import { Text, View } from 'react-native';

type HeaderProps = {
  title: string;
  subtitle?: string;
};

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <View className="gap-[6px]">
      <Text className="text-[#0F172A] text-[28px] font-extrabold">{title}</Text>
      {subtitle ? <Text className="text-[#475569] text-[15px] leading-[22px]">{subtitle}</Text> : null}
    </View>
  );
}
