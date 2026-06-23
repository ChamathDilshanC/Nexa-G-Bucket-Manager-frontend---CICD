/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter_400Regular'],
        inter: ['Inter_400Regular'],
        'inter-medium': ['Inter_500Medium'],
        'inter-semibold': ['Inter_600SemiBold'],
        'inter-bold': ['Inter_700Bold'],
      },
      colors: {
        app: {
          bg: 'rgb(var(--color-bg) / <alpha-value>)',
          'bg-elevated': 'rgb(var(--color-bg-elevated) / <alpha-value>)',
          surface: 'rgb(var(--color-surface) / <alpha-value>)',
          card: 'rgb(var(--color-card) / <alpha-value>)',
          'card-muted': 'rgb(var(--color-card-muted) / <alpha-value>)',
          border: 'rgb(var(--color-border) / <alpha-value>)',
          'border-strong': 'rgb(var(--color-border-strong) / <alpha-value>)',
          title: 'rgb(var(--color-title) / <alpha-value>)',
          body: 'rgb(var(--color-body) / <alpha-value>)',
          muted: 'rgb(var(--color-muted) / <alpha-value>)',
          icon: 'rgb(var(--color-icon) / <alpha-value>)',
          accent: 'rgb(var(--color-accent) / <alpha-value>)',
          'accent-soft': 'rgb(var(--color-accent-soft) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
};
