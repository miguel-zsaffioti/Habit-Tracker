import { useState } from 'react';
import { StyleSheet, TextInput, View, KeyboardAvoidingView, Platform, ScrollView, Pressable, Text, Modal, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useRouter } from 'expo-router';

import Header from '@/components/Header';
import { createHabit } from '@/services/habits';

// Configuração do calendário para o idioma Português
LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  monthNamesShort: ['Jan.','Fev.','Mar.','Abr.','Mai.','Jun.','Jul.','Ago.','Set.','Out.','Nov.','Dez.'],
  dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
  dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

function showError(message: string) {
  if (Platform.OS === 'web') window.alert(message);
  else Alert.alert('Erro', message);
}

export default function CreateHabitScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Estados de exibição formatada (DD/MM/AAAA)
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Estados de controle do Calendário
  const [rawStartDate, setRawStartDate] = useState(''); // Formato YYYY-MM-DD para marcar no calendário
  const [rawEndDate, setRawEndDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [activeDateField, setActiveDateField] = useState<'start' | 'end' | null>(null);

  const handleDayPress = (day: any) => {
    // Converte de YYYY-MM-DD para o formato brasileiro DD/MM/AAAA
    const [year, month, date] = day.dateString.split('-');
    const formattedDate = `${date}/${month}/${year}`;

    // Define qual campo receberá a data selecionada
    if (activeDateField === 'start') {
      setStartDate(formattedDate);
      setRawStartDate(day.dateString);
    } else if (activeDateField === 'end') {
      setEndDate(formattedDate);
      setRawEndDate(day.dateString);
    }
    
    // Fecha o modal
    setShowCalendar(false);
    setActiveDateField(null);
  };

  const openCalendarFor = (field: 'start' | 'end') => {
    setActiveDateField(field);
    setShowCalendar(true);
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      showError('Preencha o nome do hábito.');
      return;
    }
    if (!rawStartDate) {
      showError('Selecione a data de início.');
      return;
    }

    setLoading(true);
    try {
      await createHabit({
        nome: name.trim(),
        descricao: description.trim() || undefined,
        frequencia_dias: [0, 1, 2, 3, 4, 5, 6],
        data_inicio: rawStartDate,
        data_fim: rawEndDate || undefined,
      });

      if (Platform.OS === 'web') window.alert('Hábito criado com sucesso!');
      else Alert.alert('Sucesso', 'Hábito criado com sucesso!');

      setName('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setRawStartDate('');
      setRawEndDate('');
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Não foi possível criar o hábito.');
    } finally {
      setLoading(false);
    }
  };

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
              <Pressable 
                style={[styles.input, styles.halfInput, styles.dateInput]} 
                onPress={() => openCalendarFor('start')}
              >
                <Text style={{ color: startDate ? '#000' : '#B0B0B0', fontSize: 16 }}>
                  {startDate || "Data de início"}
                </Text>
              </Pressable>

              <Pressable 
                style={[styles.input, styles.halfInput, styles.dateInput]} 
                onPress={() => openCalendarFor('end')}
              >
                <Text style={{ color: endDate ? '#000' : '#B0B0B0', fontSize: 16 }}>
                  {endDate || "Data de fim"}
                </Text>
              </Pressable>
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
            <Pressable style={[styles.createButton, loading && { opacity: 0.6 }]} onPress={handleCreate} disabled={loading}>
              {loading
                ? <ActivityIndicator color="#000" />
                : <Text style={styles.createButtonText}>Criar</Text>}
            </Pressable>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={showCalendar}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowCalendar(false);
          setActiveDateField(null);
        }}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => {
            setShowCalendar(false);
            setActiveDateField(null);
          }}
        >
          <View style={styles.calendarContainer}>
            <Calendar
              onDayPress={handleDayPress}
              markedDates={{
                // Destaca a data do campo que está sendo editado no momento
                [activeDateField === 'start' ? rawStartDate : rawEndDate]: { 
                  selected: true, 
                  selectedColor: '#FFCC00', 
                  selectedTextColor: '#000' 
                }
              }}
              theme={{
                todayTextColor: '#FFCC00',
                arrowColor: '#000',
                textDayFontWeight: '500',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '500',
              }}
            />
            
            <Pressable 
              style={styles.closeButton} 
              onPress={() => {
                setShowCalendar(false);
                setActiveDateField(null);
              }}
            >
              <Text style={styles.closeButtonText}>Cancelar</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

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
  dateInput: {
    justifyContent: 'center', // Adicionado para centralizar verticalmente o texto no Pressable
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
  // Estilos do Modal
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