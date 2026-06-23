import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { ActivityIndicator, Appearance, View } from 'react-native';

import {
  darkTheme,
  getThemePalette,
  type ResolvedColorScheme,
  type ThemePalette,
} from '@/constants/zentra-theme';

const STORAGE_KEY = '@nexa/theme-preference';

export type ThemePreference = 'light' | 'dark' | 'system';

type ThemeContextValue = {
  themePreference: ThemePreference;
  setThemePreference: (preference: ThemePreference) => void;
  resolvedColorScheme: ResolvedColorScheme;
  colors: ThemePalette;
  isReady: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isThemePreference(value: string | null): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}

function readSystemScheme(): ResolvedColorScheme {
  return Appearance.getColorScheme() === 'light' ? 'light' : 'dark';
}

function resolveColorScheme(
  preference: ThemePreference,
  systemScheme: ResolvedColorScheme,
): ResolvedColorScheme {
  if (preference === 'light') return 'light';
  if (preference === 'dark') return 'dark';
  return systemScheme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { setColorScheme } = useColorScheme();
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('dark');
  const [systemScheme, setSystemScheme] = useState<ResolvedColorScheme>(readSystemScheme);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme === 'light' ? 'light' : 'dark');
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        const preference = isThemePreference(stored) ? stored : 'dark';
        setThemePreferenceState(preference);
        setColorScheme(preference);
      } catch {
        setColorScheme('dark');
      } finally {
        setIsReady(true);
      }
    })();
  }, [setColorScheme]);

  const resolvedColorScheme = resolveColorScheme(themePreference, systemScheme);
  const colors = useMemo(() => getThemePalette(resolvedColorScheme), [resolvedColorScheme]);

  useEffect(() => {
    if (!isReady) return;
    setColorScheme(themePreference);
  }, [isReady, setColorScheme, themePreference]);

  const setThemePreference = useCallback(
    (preference: ThemePreference) => {
      setThemePreferenceState(preference);
      setColorScheme(preference);
      void AsyncStorage.setItem(STORAGE_KEY, preference).catch(() => undefined);
    },
    [setColorScheme],
  );

  const value = useMemo(
    () => ({
      themePreference,
      setThemePreference,
      resolvedColorScheme,
      colors,
      isReady,
    }),
    [colors, isReady, resolvedColorScheme, themePreference, setThemePreference],
  );

  if (!isReady) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: darkTheme.background }}>
        <ActivityIndicator color={darkTheme.accent} size="large" />
      </View>
    );
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

export function useThemeColors() {
  return useTheme().colors;
}
