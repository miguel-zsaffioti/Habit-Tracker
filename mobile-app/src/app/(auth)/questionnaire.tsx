import { useState } from 'react';
import { Platform, StyleSheet, TextInput, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Checkbox } from 'expo-checkbox';

import Button from '@/components/Button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';
import { useLocalSearchParams } from 'expo-router';

export default function QuestionnaireScreen() {
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [check3, setCheck3] = useState(false);
  const [other, setOther] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { signUp } = useAuth();
  const { email, name, password, birthDate } = useLocalSearchParams<{ email: string; name: string; password: string; birthDate: string }>();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topSection}>
          <ThemedText style={styles.headerTitle}>
            Cadastro
          </ThemedText>

          <ThemedText style={styles.title}>
            Estou utilizando esse aplicativo pois:
          </ThemedText>

          <View style={styles.optionsContainer}>
            <View style={styles.section}>
              <Checkbox
                style={styles.checkbox}
                value={check1}
                onValueChange={setCheck1}
                color={check1 ? '#222' : undefined}
              />
              <ThemedText style={styles.paragraph}>
                Tenho dificuldade em implementar hábitos em minha rotina.
              </ThemedText>
            </View>

            <View style={styles.section}>
              <Checkbox
                style={styles.checkbox}
                value={check2}
                onValueChange={setCheck2}
                color={check2 ? '#222' : undefined}
              />
              <ThemedText style={styles.paragraph}>
                Quero cumprir alguma meta de fim de ano.
              </ThemedText>
            </View>

            <View style={styles.section}>
              <Checkbox
                style={styles.checkbox}
                value={check3}
                onValueChange={setCheck3}
                color={check3 ? '#222' : undefined}
              />
              <ThemedText style={styles.paragraph}>
                Quero medir minha consistência diária.
              </ThemedText>
            </View>

            <View style={styles.section}>
                <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                placeholderTextColor={isDark ? '#555' : '#B0B0B0'}
                placeholder="Outro"
                autoCapitalize="none"
                value={other}
                onChangeText={setOther}
                />
            </View>
          </View>
        </View>

        <View style={styles.bottomSection}>
          <Button onPress={() => signUp(name ?? '', email ?? '', password ?? '', birthDate ?? '')} text="Finalizar!" style={styles.button}/>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F6',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'space-between',
    paddingTop: 24,
    paddingBottom: 40,
  },
  topSection: {
    width: '100%',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 40,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: 32,
  },
  optionsContainer: {
    width: '100%',
    gap: 24,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
    borderRadius: 4,
  },
  paragraph: {
    fontSize: 15,
    color: '#333',
    flex: 1,
    lineHeight: 22,
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEC',
    paddingHorizontal: 0,
    fontSize: 16,
    color: '#000',
    backgroundColor: 'transparent',
    ...Platform.select({
        web: {
          outlineStyle: 'none',
        },
      }),
  },
  inputDark: {
    borderBottomColor: '#444',
  },
  button: {
    width: '100%',
    borderRadius: 32,
    padding: 12,
    backgroundColor: '#FFCC00',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
