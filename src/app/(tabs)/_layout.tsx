import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#2F80ED',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarStyle: {
            backgroundColor: '#0A0A0A',
            borderTopColor: '#1F1F1F',
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontFamily: 'Inter_600SemiBold',
            fontSize: 12,
          },
        }}>
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color, size }) => (
              <SymbolView
                name={{ ios: 'square.grid.2x2.fill', android: 'grid_view', web: 'grid_view' }}
                tintColor={color}
                size={size}
              />
            ),
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}
