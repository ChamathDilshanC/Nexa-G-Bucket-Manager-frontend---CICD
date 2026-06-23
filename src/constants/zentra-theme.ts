/** Zentra design tokens — light and dark palettes */

export type ThemePalette = {
  background: string;
  backgroundElevated: string;
  title: string;
  body: string;
  accent: string;
  buttonStart: string;
  buttonEnd: string;
  footer: string;
  inputBackground: string;
  inputBorder: string;
  inputPlaceholder: string;
  card: string;
  cardBorder: string;
  cardMuted: string;
  surface: string;
  danger: string;
  success: string;
  muted: string;
  icon: string;
  borderSubtle: string;
  tabBarBorder: string;
  tabBarTint: string;
  tabBarHighlight: string;
  overlay: string;
  screenGradient: readonly string[];
  screenGradientLocations: readonly number[];
  screenGradientHeight: number;
};

export const lightTheme: ThemePalette = {
  background: '#FFFFFF',
  backgroundElevated: '#F9FAFB',
  title: '#111827',
  body: '#6B7280',
  accent: '#2563EB',
  buttonStart: '#4F9CF9',
  buttonEnd: '#2563EB',
  footer: '#6B7280',
  inputBackground: '#F9FAFB',
  inputBorder: '#D1D5DB',
  inputPlaceholder: '#9CA3AF',
  card: '#FFFFFF',
  cardBorder: '#E5E7EB',
  cardMuted: '#F3F4F6',
  surface: '#F3F4F6',
  danger: '#DC2626',
  success: '#16A34A',
  muted: '#9CA3AF',
  icon: '#6B7280',
  borderSubtle: '#E5E7EB',
  tabBarBorder: 'rgba(0, 0, 0, 0.08)',
  tabBarTint: 'rgba(255, 255, 255, 0.82)',
  tabBarHighlight: 'rgba(0, 0, 0, 0.06)',
  overlay: 'rgba(0, 0, 0, 0.45)',
  screenGradient: [
    '#BFDBFE',
    '#DBEAFE',
    '#EFF6FF',
    '#F8FAFC',
    '#FFFFFF',
    '#FFFFFF',
    '#FFFFFF',
  ],
  screenGradientLocations: [0, 0.12, 0.24, 0.4, 0.58, 0.78, 1],
  screenGradientHeight: 0.62,
};

export const darkTheme: ThemePalette = {
  background: '#000000',
  backgroundElevated: '#0A0A0A',
  title: '#FFFFFF',
  body: '#9CA3AF',
  accent: '#2F80ED',
  buttonStart: '#4F9CF9',
  buttonEnd: '#2F80ED',
  footer: '#9CA3AF',
  inputBackground: '#141414',
  inputBorder: '#2A2A2A',
  inputPlaceholder: '#555555',
  card: '#111111',
  cardBorder: '#1F1F1F',
  cardMuted: '#141414',
  surface: '#111111',
  danger: '#EF4444',
  success: '#22C55E',
  muted: '#6B7280',
  icon: '#D1D5DB',
  borderSubtle: '#1F2937',
  tabBarBorder: 'rgba(255, 255, 255, 0.14)',
  tabBarTint: 'rgba(18, 18, 18, 0.42)',
  tabBarHighlight: 'rgba(255, 255, 255, 0.22)',
  overlay: 'rgba(0, 0, 0, 0.72)',
  screenGradient: [
    '#4F9CF9',
    '#3A8AE8',
    '#2F80ED',
    '#1B4F8A',
    '#122033',
    '#0D1117',
    '#0A0A0A',
  ],
  screenGradientLocations: [0, 0.12, 0.24, 0.4, 0.58, 0.78, 1],
  screenGradientHeight: 0.62,
};

export type ResolvedColorScheme = 'light' | 'dark';

export function getThemePalette(scheme: ResolvedColorScheme): ThemePalette {
  return scheme === 'light' ? lightTheme : darkTheme;
}

/** Default dark palette — prefer `useThemeColors()` in components */
export const ZentraColors = darkTheme;

export const ZentraTypography = {
  brand: {
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: 0.2,
  },
  title: {
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: -0.5,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
  },
  bullet: {
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    fontSize: 17,
    lineHeight: 24,
  },
  footer: {
    fontSize: 15,
    lineHeight: 22,
  },
} as const;

export const ZentraLayout = {
  horizontalPadding: 24,
  buttonHeight: 56,
  buttonRadius: 28,
  contentGap: 16,
} as const;
