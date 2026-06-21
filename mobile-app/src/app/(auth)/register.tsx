import { useState } from 'react';
import { StyleSheet, TextInput, View, Pressable, Platform, Text, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, LocaleConfig } from 'react-native-calendars';

import Button from '@/components/Button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';

LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  monthNamesShort: ['Jan.','Fev.','Mar.','Abr.','Mai.','Jun.','Jul.','Ago.','Set.','Out.','Nov.','Dez.'],
  dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
  dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  
  const [birthDate, setBirthDate] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    
    const [year, month, date] = day.dateString.split('-');
    setBirthDate(`${date}/${month}/${year}`);
    
    setShowCalendar(false);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        
        <View style={styles.topSection}>
          <ThemedText type="title" style={styles.title}>
            Cadastro
          </ThemedText>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor="#B0B0B0"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              value={email}
              onChangeText={setEmail}
              underlineColorAndroid="transparent"
              {...Platform.select({ web: { outlineStyle: 'none' } } as any)}
            />

            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#B0B0B0"
              secureTextEntry
              autoComplete="password"
              value={password}
              onChangeText={setPassword}
              underlineColorAndroid="transparent"
            />

            <TextInput
              style={styles.input}
              placeholder="Primeiro nome"
              placeholderTextColor="#B0B0B0"
              autoCapitalize="words"
              value={firstName}
              onChangeText={setFirstName}
              underlineColorAndroid="transparent"
              {...Platform.select({ web: { outlineStyle: 'none' } } as any)}
            />

            <TextInput
              style={styles.input}
              placeholder="Último nome"
              placeholderTextColor="#B0B0B0"
              autoCapitalize="words"
              value={lastName}
              onChangeText={setLastName}
              underlineColorAndroid="transparent"
              {...Platform.select({ web: { outlineStyle: 'none' } } as any)}
            />
 
            <Pressable onPress={() => setShowCalendar(true)}>
              <View style={[styles.input, styles.dateInput]}>
                <Text style={{ color: birthDate ? '#000' : '#B0B0B0', fontSize: 16 }}>
                  {birthDate || "Data de nascimento"}
                </Text>
              </View>
            </Pressable>

            <Modal
              visible={showCalendar}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setShowCalendar(false)}
            >
              <Pressable style={styles.modalOverlay} onPress={() => setShowCalendar(false)}>
                <View style={styles.calendarContainer}>
                  <Calendar
                    onDayPress={handleDayPress}
                    maxDate={new Date().toISOString().split('T')[0]} // Impede selecionar datas futuras
                    markedDates={{
                      [selectedDate]: { selected: true, disableTouchEvent: true, selectedColor: '#FFCC00', selectedTextColor: '#000' }
                    }}
                    theme={{
                      todayTextColor: '#FFCC00',
                      arrowColor: '#000',
                      textDayFontWeight: '500',
                      textMonthFontWeight: 'bold',
                      textDayHeaderFontWeight: '500',
                    }}
                  />
                  
                  <Pressable style={styles.closeButton} onPress={() => setShowCalendar(false)}>
                    <Text style={styles.closeButtonText}>Cancelar</Text>
                  </Pressable>
                </View>
              </Pressable>
            </Modal>
          </View>
        </View>

        <View style={styles.bottomSection}>
          <Button onPress={() => router.push({ pathname: '/redirect', params: { email, password, name: `${firstName} ${lastName}`.trim() } })} text="Registrar-se" style={styles.button as any} />
        </View>

      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: 40,
  },
  topSection: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 40,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 24,
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
    ...(Platform.OS === 'web' && { outlineStyle: 'none' as any }),
  },
  dateInput: {
    justifyContent: 'center', 
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  calendarContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    maxWidth: 360,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  closeButton: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 10,
  },
  closeButtonText: {
    color: '#FF0000',
    fontSize: 16,
    fontWeight: '600',
  },
});