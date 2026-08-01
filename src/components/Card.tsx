import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

type CardProps = {
  children: ReactNode;
};

export function Card({ children }: CardProps) {
  const { colors } = useTheme();

  return (
    <View
      className="rounded-[20px] p-4 border"
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        shadowColor: '#0F172A',
        shadowOpacity: 0.08,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 2,
      }}
    >
      {children}
    </View>
  );
}
