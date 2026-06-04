import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';

export default function Header() {
  return (
    <View style={styles.container}>
      {/* Ícone de Menu à esquerda */}
      <Pressable onPress={() => console.log('Abrir menu lateral')}>
        <Feather name="menu" size={24} color="#000" />
      </Pressable>

      {/* Título Central */}
      <Text style={styles.title}>Do.it</Text>

      {/* Ícone de Usuário à direita */}
      <Pressable onPress={() => console.log('Abrir perfil')}>
        <FontAwesome name="user-circle-o" size={24} color="#000" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Alinha os itens na horizontal
    justifyContent: 'space-between', // Espalha os itens (esquerda, centro, direita)
    alignItems: 'center', // Centraliza verticalmente
    backgroundColor: '#FFF100', // Amarelo vibrante igual ao da imagem
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30, // Deixa as bordas arredondadas (formato de pílula)
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Adiciona uma leve sombra para destacar do fundo
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: '#000',
  },
});