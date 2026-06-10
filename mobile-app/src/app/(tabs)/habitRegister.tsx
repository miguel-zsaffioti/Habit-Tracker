import { useState } from 'react';
import { StyleSheet, TextInput, View, KeyboardAvoidingView, Platform, ScrollView, Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '@/components/Header'; // O componente amarelo do topo

export default function CreateHabitScreen() {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      
      <View style={styles.headerContainer}>
        <Header />
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardAvoiding} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nome do hábito"
              placeholderTextColor="#B0B0B0"
              value={name}
              onChangeText={setName}
              underlineColorAndroid="transparent"
              {...Platform.select({ web: { outlineStyle: 'none' } } as any)}
            />

            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Data de início"
                placeholderTextColor="#B0B0B0"
                value={startDate}
                onChangeText={setStartDate}
                underlineColorAndroid="transparent"
                {...Platform.select({ web: { outlineStyle: 'none' } } as any)}
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Data de fim"
                placeholderTextColor="#B0B0B0"
                value={endDate}
                onChangeText={setEndDate}
                underlineColorAndroid="transparent"
                {...Platform.select({ web: { outlineStyle: 'none' } } as any)}
              />
            </View>

            <TextInput
              style={styles.input}
              placeholder="Descrição"
              placeholderTextColor="#B0B0B0"
              value={description}
              onChangeText={setDescription}
              underlineColorAndroid="transparent"
              {...Platform.select({ web: { outlineStyle: 'none' } } as any)}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Pressable style={styles.createButton} onPress={() => console.log('Criar hábito clicado')}>
              <Text style={styles.createButtonText}>Criar</Text>
            </Pressable>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA', 
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20, 
    zIndex: 1, 
  },
  keyboardAvoiding: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1, 
    paddingHorizontal: 32,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  formContainer: {
    width: '100%',
    gap: 32,
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 24,
  },
  input: {
    width: '100%',
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEC',
    paddingHorizontal: 0,
    fontSize: 16,
    color: '#000',
    backgroundColor: 'transparent',
  },
  halfInput: {
    flex: 1, 
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 40,
  },
  createButton: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  createButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
});