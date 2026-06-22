import { useCallback, useState } from 'react';
import { StyleSheet, View, ScrollView, Text, ActivityIndicator, ImageSourcePropType } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';

import AchievementsCard from '@/components/AchievementsCard';
import BadgeCard from '@/components/BadgeCard';
import Header from '@/components/Header';
import { getAchievements, type Achievement } from '@/services/achievements';

const iconMap: Record<string, ImageSourcePropType> = {
  chama: require('@/assets/images/fire.png'),
  calendario: require('@/assets/images/calendar.png'),
  planta: require('@/assets/images/plant.png'),
  musculo: require('@/assets/images/arm.png'),
  alvo: require('@/assets/images/target.png'),
  diamante: require('@/assets/images/diamond.png'),
  foguete: require('@/assets/images/rocket.png'),
  medalha: require('@/assets/images/medal.png'),
  estrela: require('@/assets/images/star.png'),
};

const fallbackIcon = require('@/assets/images/star.png');

export default function Badges() {
  const [unlocked, setUnlocked] = useState<Achievement[]>([]);
  const [locked, setLocked] = useState<Achievement[]>([]);
  const [total, setTotal] = useState(0);
  const [unlockedCount, setUnlockedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchAchievements = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAchievements();
      setTotal(data.total);
      setUnlockedCount(data.desbloqueadas);
      setUnlocked(data.conquistas.filter(c => c.desbloqueada));
      setLocked(data.conquistas.filter(c => !c.desbloqueada));
    } catch {
      setUnlocked([]);
      setLocked([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { fetchAchievements(); }, [fetchAchievements]));

  const getIcon = (ref: string) => iconMap[ref] ?? fallbackIcon;

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FFCC00" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Header />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.achievementsSection}>
            <AchievementsCard current={unlockedCount} total={total} />
        </View>

        {unlocked.length > 0 && (
          <View style={styles.badgesSection}>
              <Text style={styles.badgesTitle}>Desbloqueadas</Text>
              <View style={styles.badgesGrid}>
                  {unlocked.map((badge) => (
                      <View style={styles.cardWrapper} key={badge.id}>
                          <BadgeCard 
                              image={getIcon(badge.icone_referencia)} 
                              title={badge.nome} 
                              description={badge.descricao} 
                              isLocked={false} 
                          />
                      </View>
                  ))}
              </View>
          </View>
        )}

        {locked.length > 0 && (
          <View style={styles.badgesSection}>
              <Text style={styles.badgesTitle}>Bloqueadas</Text>
              <View style={styles.badgesGrid}>
                  {locked.map((badge) => (
                      <View style={styles.cardWrapper} key={badge.id}>
                          <BadgeCard 
                              image={getIcon(badge.icone_referencia)} 
                              title={badge.nome} 
                              description={badge.descricao} 
                              isLocked={true} 
                          />
                      </View>
                  ))}
              </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  achievementsSection: {
    marginTop: 24,
    marginBottom: 32,
  },
  badgesSection: {
    marginBottom: 24,
  },
  badgesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 10,
  },
  cardWrapper: {
    width: '31%', 
  }
});