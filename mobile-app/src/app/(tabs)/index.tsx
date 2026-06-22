import { useCallback, useState } from 'react';
import { StyleSheet, ScrollView, View, Pressable, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth } from '@/constants/theme';
import Header from '@/components/Header';
import DailyChecker from '@/components/DailyChecker';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { getTodayHabits, toggleCheckin, type HabitToday } from '@/services/habits';
import { getApiToken } from '@/services/api';

export default function HomeScreen() {
  const [habits, setHabits] = useState<HabitToday[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHabits = useCallback(async () => {
    if (!getApiToken()) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await getTodayHabits();
      setHabits(data);
    } catch {
      setHabits([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { fetchHabits(); }, [fetchHabits]));

  const handleToggle = async (habitId: number) => {
    const today = new Date().toISOString().split('T')[0];
    try {
      await toggleCheckin(habitId, today);
      setHabits(prev =>
        prev.map(h =>
          h.habito.id === habitId ? { ...h, feito_hoje: !h.feito_hoje } : h
        )
      );
    } catch { /* silently ignore */ }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        
        <View style={styles.headerContainer}>
          <Header />
        </View>
        <ScrollView 
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
          {loading ? (
            <ActivityIndicator size="large" color="#FFCC00" style={{ marginTop: 40 }} />
          ) : habits.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum hábito para hoje.</Text>
          ) : (
            habits.map(h => (
              <DailyChecker
                key={h.habito.id}
                nome={h.habito.nome}
                streak={h.habito.current_streak}
                checked={h.feito_hoje}
                onToggle={() => handleToggle(h.habito.id)}
              />
            ))
          )}
          <View style={styles.addButtonContainer}>
            <Pressable 
              style={styles.addButton} 
              onPress={() => router.push('/habitRegister')}
            >
              <AntDesign name="plus" size={24} color="black" />
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F7', 
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center', 
    alignItems: 'center',
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  dailyCheckerContainer: {
    width: '100%',
    marginBottom: 20,
  },
  headerContainer: {
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingBottom: 40,
    gap: 12,  
    width: '100%',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 40,
  },
  addButtonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
});