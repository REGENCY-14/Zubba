import type { ReactNode } from 'react';
import { View } from 'react-native';

type CardProps = {
  children: ReactNode;
};

export function Card({ children }: CardProps) {
  return (
    <View
      className="bg-white rounded-[20px] p-4 border border-[#E2E8F0]"
      style={{ shadowColor: '#0F172A', shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 2 }}
    >
      {children}
    </View>
  );
}
