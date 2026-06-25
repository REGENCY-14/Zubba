import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@zubba_theme';

export type ThemeColors = {
  bg: string;
  surface: string;
  card: string;
  border: string;
  borderLight: string;
  text: string;
  textSub: string;
  textMuted: string;
  iconBg: string;
  iconColor: string;
};

const LIGHT: ThemeColors = {
  bg: '#FFFFFF',
  surface: '#F8FAFC',
  card: '#FFFFFF',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  text: '#101828',
  textSub: '#64748A',
  textMuted: '#99A1AF',
  iconBg: '#F1F5F9',
  iconColor: '#111827',
};

const DARK: ThemeColors = {
  bg: '#0F1621',
  surface: '#141D2B',
  card: '#1A2438',
  border: '#2D3748',
  borderLight: '#1E2D40',
  text: '#F1F5F9',
  textSub: '#94A3B8',
  textMuted: '#64748A',
  iconBg: '#1E2D40',
  iconColor: '#CBD5E1',
};

type ThemeContextType = {
  isDark: boolean;
  colors: ThemeColors;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  colors: LIGHT,
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(val => {
      if (val === 'dark') setIsDark(true);
    });
  }, []);

  const toggle = useCallback(() => {
    setIsDark(prev => {
      const next = !prev;
      AsyncStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, colors: isDark ? DARK : LIGHT, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
