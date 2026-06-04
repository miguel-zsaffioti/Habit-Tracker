# Root Layout Implementation Plan

This plan outlines the structure of `src/app/_layout.tsx` to handle authentication, themes, and navigation.

## Proposed Changes

### Root Layout (`src/app/_layout.tsx`)

O `_layout.tsx` na raiz é o primeiro arquivo a ser carregado. Ele deve configurar o ambiente global do aplicativo.

#### Responsabilidades:
1.  **Providers Globais**: Envolver o app com `ThemeProvider` (para cores), `AuthProvider` (para login) e outros contextos.
2.  **Carregamento de Assets**: Carregar fontes customizadas e manter a Splash Screen visível até que tudo esteja pronto.
3.  **Definição da Navegação**: Usar um `Stack` para alternar entre o grupo `(auth)` e o grupo `(tabs)`.

```tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
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
        {/* O Stack define as rotas principais */}
        <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
      </Stack>
    </ThemeProvider>
  );
}
```

### Refatoração de Layouts Existentes

#### `src/app/(tabs)/_layout.tsx`
- Remover o `ThemeProvider` daqui, pois ele já estará no Root Layout.
- Manter apenas a configuração das Tabs.

## Verificação

- Verificar se a Splash Screen aparece corretamente.
- Testar se o tema (Light/Dark) é aplicado a todas as telas.
- Validar se a navegação entre Login e App funciona sem barras de cabeçalho duplicadas.
