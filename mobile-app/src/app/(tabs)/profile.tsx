import { StyleSheet, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';

import Header from '@/components/Header';
import ProfileField from '@/components/ProfileField';
import StatsCard from '@/components/StatsCard';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      
      <View style={styles.headerContainer}>
        <Header />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarSection}>
          <FontAwesome name="user-circle-o" size={80} color="#000" />
        </View>

        <View style={styles.statsSection}>
          <StatsCard habits={3} streak={22} achievements={5} />
        </View>


        <View style={styles.fieldsSection}>
          <ProfileField label="Nome" value={user?.name ?? ''} />
          <ProfileField label="E-mail" value={user?.email ?? ''} />
          <ProfileField label="Nascimento" value={user?.birthDate ?? ''} />
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20, 
    zIndex: 1, 
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  statsSection: {
    width: '100%',
    marginBottom: 32,
  },
  fieldsSection: {
    width: '100%',
    gap: 12, 
  },           
});