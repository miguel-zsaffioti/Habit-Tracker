import { Image, StyleSheet, TextInput, useColorScheme, View, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth } from '@/constants/theme';
import Button from '@/components/Button';

export default function HomeScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        
        <View style={styles.headerContainer}>
          <Image source={require('@/assets/images/logo.svg')} style={styles.logo} />
          <ThemedText type="title" style={styles.title}>
            Do.it
          </ThemedText>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={[styles.input, isDark && styles.inputDark]}
            placeholder="E-mail"
            placeholderTextColor={isDark ? '#555' : '#B0B0B0'}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
            underlineColorAndroid="transparent" // Remove linha de foco nativa do Android
          />
    
          <TextInput
            style={[styles.input, isDark && styles.inputDark]}
            placeholder="Senha"
            placeholderTextColor={isDark ? '#555' : '#B0B0B0'}
            secureTextEntry
            autoComplete="password"
            value={password}
            onChangeText={setPassword}
            underlineColorAndroid="transparent" // Remove linha de foco nativa do Android
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button link="/login" text="Entrar" />
          <Button link="/register" text="Registrar-se" />
        </View>

      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F7', 
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 40,
    justifyContent: 'center', 
    alignItems: 'center',
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  formContainer: {
    width: '100%',
    marginBottom: 50,
    gap: 30, 
  },
  input: {
    width: '100%',
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2', 
    paddingHorizontal: 0,
    fontSize: 16,
    color: '#000', // Mantém o texto sempre preto
    backgroundColor: 'transparent',
    // Remove a borda de foco ao clicar no navegador (Web)
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  inputDark: {
    borderBottomColor: '#444', 
  },
  buttonContainer: {
    width: '100%',
    gap: 16, 
  },
});