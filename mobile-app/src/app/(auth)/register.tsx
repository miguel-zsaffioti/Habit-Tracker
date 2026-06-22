import { useState } from 'react';
import { StyleSheet, TextInput, View, Pressable, Platform, Text, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { AntDesign } from '@expo/vector-icons';

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
  const [showYearPicker, setShowYearPicker] = useState(false);

  const currentYear = new Date().getFullYear();
  const [calendarMonth, setCalendarMonth] = useState(`${currentYear}-01-01`);

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    
    const [year, month, date] = day.dateString.split('-');
    setBirthDate(`${date}/${month}/${year}`);
    
    setShowCalendar(false);
  };

  const handleYearSelect = (year: number) => {
    const month = calendarMonth.split('-')[1] ?? '01';
    setCalendarMonth(`${year}-${month}-01`);
    setShowYearPicker(false);
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
              <Pressable style={styles.modalOverlay} onPress={() => { setShowCalendar(false); setShowYearPicker(false); }}>
                <View style={styles.calendarContainer} onStartShouldSetResponder={() => true}>
                  {showYearPicker ? (
                    <View style={styles.yearPickerContainer}>
                      <Text style={styles.yearPickerTitle}>Selecione o ano</Text>
                      <ScrollView style={styles.yearScroll} contentContainerStyle={styles.yearScrollContent}>
                        {Array.from({ length: currentYear - 1920 + 1 }, (_, i) => currentYear - i).map(year => (
                          <Pressable
                            key={year}
                            style={[
                              styles.yearItem,
                              calendarMonth.startsWith(String(year)) && styles.yearItemSelected,
                            ]}
                            onPress={() => handleYearSelect(year)}
                          >
                            <Text style={[
                              styles.yearItemText,
                              calendarMonth.startsWith(String(year)) && styles.yearItemTextSelected,
                            ]}>
                              {year}
                            </Text>
                          </Pressable>
                        ))}
                      </ScrollView>
                    </View>
                  ) : (
                    <>
                      <Pressable style={styles.yearSelector} onPress={() => setShowYearPicker(true)}>
                        <Text style={styles.yearSelectorText}>{calendarMonth.split('-')[0]}</Text>
                        <AntDesign name="down" size={14} color="#000" />
                      </Pressable>

                      <Calendar
                        key={calendarMonth}
                        initialDate={calendarMonth}
                        onDayPress={handleDayPress}
                        onMonthChange={(month: any) => setCalendarMonth(month.dateString)}
                        maxDate={new Date().toISOString().split('T')[0]}
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
                    </>
                  )}
                  
                  <Pressable style={styles.closeButton} onPress={() => { setShowCalendar(false); setShowYearPicker(false); }}>
                    <Text style={styles.closeButtonText}>Cancelar</Text>
                  </Pressable>
                </View>
              </Pressable>
            </Modal>
          </View>
        </View>

        <View style={styles.bottomSection}>
          <Button onPress={() => router.push({ pathname: '/redirect', params: { email, password, name: `${firstName} ${lastName}`.trim(), birthDate: selectedDate } })} text="Registrar-se" style={styles.button as any} />
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
  yearSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    marginBottom: 4,
  },
  yearSelectorText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000',
  },
  yearPickerContainer: {
    alignItems: 'center',
  },
  yearPickerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
  },
  yearScroll: {
    maxHeight: 280,
    width: '100%',
  },
  yearScrollContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: 8,
  },
  yearItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  yearItemSelected: {
    backgroundColor: '#FFCC00',
  },
  yearItemText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  yearItemTextSelected: {
    color: '#000',
    fontWeight: '700',
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