import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';
import { Colors, darkColors, lightColors } from './Color';

interface ThemeContextValue {
  colors: Colors;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({
  children,
  initialDark,
}: {
  children: ReactNode;
  initialDark?: boolean;
}) {
  const system = useColorScheme();
  // null = follow the system, boolean = user toggled manually
  const [override, setOverride] = useState<boolean | null>(initialDark ?? null);
  const isDark = override ?? system === 'dark';

  const toggleTheme = useCallback(() => setOverride(!isDark), [isDark]);

  const value = useMemo<ThemeContextValue>(
    () => ({ colors: isDark ? darkColors : lightColors, isDark, toggleTheme }),
    [isDark, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
