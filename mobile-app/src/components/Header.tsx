import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';

export default function Header() {
  const navigation = useNavigation<any>();

  return (
<View style={styles.container}>
      <Pressable onPress={() => navigation.openDrawer()}>
        <Feather name="menu" size={24} color="#000" />
      </Pressable>

      <Text style={styles.title}>Do.it</Text>

      <Pressable onPress={() => router.push('/profile')}>
        <FontAwesome name="user-circle-o" size={24} color="#000" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF100',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: '#000',
  },
});