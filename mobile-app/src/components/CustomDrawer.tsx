import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
type DrawerContentComponentProps = {
  navigation: { closeDrawer: () => void };
};

const drawerItems = [
  { label: 'Início', route: '/' as const, icon: 'home' as const },
  { label: 'Criar Hábito', route: '/habitRegister' as const, icon: 'add-circle-outline' as const },
  { label: 'Conquistas', route: '/badges' as const, icon: 'star' as const },
];

export default function CustomDrawer({ navigation }: DrawerContentComponentProps) {
  const { signOut } = useAuth();
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingTop: 0 }}>

        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>U</Text>
          </View>
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userEmail}>john.doe@hotmail.com</Text>
        </View>

        <View style={styles.listContainer}>
          {drawerItems.map((item) => (
            <Pressable
              key={item.route}
              style={styles.drawerItem}
              onPress={() => {
                navigation.closeDrawer();
                router.push(item.route);
              }}
            >
              <MaterialIcons name={item.icon} size={22} color="#333" />
              <Text style={styles.drawerItemText}>{item.label}</Text>
            </Pressable>
          ))}
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.logoutButton} onPress={() => console.log('Fazer Logout')}>
          <MaterialIcons name="door-back" size={24} color="#E53935" />
          <Text style={styles.logoutText}>Sair</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#FFEB3B', // Amarelo do topo
    padding: 20,
    paddingTop: 60, // Espaço para a barra de status do celular
    paddingBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#111', // Círculo preto
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#FFEB3B', // Letra 'U' amarela
    fontSize: 24,
    fontWeight: 'bold',
  },
  userName: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#333',
    fontSize: 14,
  },
  listContainer: {
    flex: 1,
    paddingTop: 10,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoutText: {
    fontSize: 16,
    color: '#E53935',
    fontWeight: '500',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  drawerItemText: {
    fontSize: 16,
    color: '#333',
  },
});