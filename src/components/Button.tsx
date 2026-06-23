import type { ReactNode } from 'react';
import { Pressable, Text, ViewStyle } from 'react-native';

import type { ButtonVariant } from '../types/ui';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: ViewStyle;
  leftIcon?: ReactNode;
};

const variantClass: Record<ButtonVariant, string> = {
  primary: 'bg-[#0F172A]',
  secondary: 'bg-[#E2E8F0]',
  ghost: 'bg-transparent border border-[#CBD5E1]',
};

const labelClass: Record<ButtonVariant, string> = {
  primary: 'text-[#F8FAFC]',
  secondary: 'text-[#0F172A]',
  ghost: 'text-[#F8FAFC]',
};

export function Button({ label, onPress, variant = 'primary', disabled = false, style, leftIcon }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={style}
      className={`min-h-[48px] rounded-[14px] px-[18px] items-center justify-center flex-row gap-2 active:scale-[0.99] ${variantClass[variant]} ${disabled ? 'opacity-55' : ''}`}
    >
      {leftIcon}
      <Text className={`text-base font-semibold ${labelClass[variant]}`}>{label}</Text>
    </Pressable>
  );
}
