import { StyleSheet, Text, View, Pressable } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

type DailyCheckerProps = {
  nome: string;
  streak: number;
  checked: boolean;
  onToggle: () => void;
};

export default function DailyChecker({ nome, streak, checked, onToggle }: DailyCheckerProps) {
  return (
    <View style={styles.container}>
      
      <View style={styles.leftSection}>
        <Text style={styles.title}>{nome}</Text>
        <View style={styles.strikes}>
          <AntDesign name="fire" size={20} color="black" />
          <Text style={styles.daysText}>{streak} {streak === 1 ? 'dia' : 'dias'}</Text>
        </View>
      </View>

      <Pressable 
        style={[styles.checkButton, checked && styles.checkButtonActive]} 
        onPress={onToggle}
      >
        {checked && <AntDesign name="check" size={24} color="black" />}
      </Pressable>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 24,
    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    // Sombra para Android (Elevation)
    elevation: 2,
    marginVertical: 8,
  },
  leftSection: {
    gap: 6, // Espaçamento vertical entre o título e o ícone de fogo
  },
  title: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
  strikes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6, // Espaçamento horizontal entre o fogo e o texto "22 dias"
  },
  daysText: {
    color: '#111',
    fontSize: 15,
    fontWeight: '500',
  },
  checkButton: {
    width: 48,
    height: 48,
    borderRadius: 24, // Metade da largura/altura para formar um círculo perfeito
    backgroundColor: '#F0F0F0', // Cor cinza claro quando desmarcado
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkButtonActive: {
    backgroundColor: '#34D35D', // Cor verde vibrante quando marcado
  },
});