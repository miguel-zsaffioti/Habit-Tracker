import { useCallback, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';

import Header from '@/components/Header';
import ProfileField from '@/components/ProfileField';
import StatsCard from '@/components/StatsCard';
import { useAuth } from '@/context/AuthContext';
import { listHabits } from '@/services/habits';
import { getAchievements } from '@/services/achievements';

export default function ProfileScreen() {
  const { user } = useAuth();
  const [habitsCount, setHabitsCount] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [achievementsCount, setAchievementsCount] = useState(0);

  useFocusEffect(useCallback(() => {
    listHabits()
      .then(habits => {
        setHabitsCount(habits.length);
        setMaxStreak(Math.max(0, ...habits.map(h => h.current_streak)));
      })
      .catch(() => {});

    getAchievements()
      .then(data => setAchievementsCount(data.desbloqueadas))
      .catch(() => {});
  }, []));

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
          <StatsCard habits={habitsCount} streak={maxStreak} achievements={achievementsCount} />
        </View>


        <View style={styles.fieldsSection}>
          <ProfileField label="Nome" value={user?.name ?? ''} />
          <ProfileField label="E-mail" value={user?.email ?? ''} />
          <ProfileField label="Nascimento" value={user?.data_nascimento ?? ''} />
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