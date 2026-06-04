import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router/react-navigation';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

// Impede que a splash screen feche sozinha
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isReady, setIsReady] = useState(false);

  // Exemplo de carregamento de fontes (se necessário)
  const [loaded] = useFonts({
    // 'MinhaFonte': require('../assets/fonts/minha-fonte.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      // Simula verificação de auth ou carregamento de dados
      setTimeout(() => {
        setIsReady(true);
        SplashScreen.hideAsync();
      }, 1000);
    }
  }, [loaded]);

  if (!isReady) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
      </Stack>
    </ThemeProvider>
  );
}