import { useState } from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AchievementsCard from '@/components/AchievementsCard';
import BadgeCard from '@/components/BadgeCard';
import Header from '@/components/Header';

export default function Badges() {
  const fireImage = require('@/assets/images/fire.png');
  const calendarImage = require('@/assets/images/calendar.png');
  const plantImage = require('@/assets/images/plant.png');
  const armsImage = require('@/assets/images/arm.png');
  const targetImage = require('@/assets/images/target.png');
  
  const diamondImage = require('@/assets/images/diamond.png');
  const rocketImage = require('@/assets/images/rocket.png');
  const medalImage = require('@/assets/images/medal.png');
  const starImage = require('@/assets/images/star.png');

  const unlockedBadges = [
    { image: fireImage, title: 'Primeira chama', description: '7 dias seguidos' },
    { image: calendarImage, title: 'Mês perfeito', description: '30 dias seguidos' },
    { image: plantImage, title: 'Primeiro passo', description: '1º hábito criado' },
    { image: armsImage, title: 'Comprometido', description: '3 hábitos ativos' },
    { image: targetImage, title: 'Foco total', description: 'Meta atingida' },
  ];

  const lockedBadges = [
    { image: diamondImage, title: 'Diamante', description: '100 dias seguidos' },
    { image: rocketImage, title: 'Decolagem', description: '5 hábitos ativos' },
    { image: medalImage, title: 'Campeão', description: '365 dias totais' },
    { image: starImage, title: 'Estrela', description: '100% por 1 sem.' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Header />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.achievementsSection}>
            <AchievementsCard />
        </View>

        <View style={styles.badgesSection}>
            <Text style={styles.badgesTitle}>Desbloqueadas</Text>
            <View style={styles.badgesGrid}>
                {unlockedBadges.map((badge) => (
                    <View style={styles.cardWrapper} key={badge.title}>
                        <BadgeCard 
                            image={badge.image} 
                            title={badge.title} 
                            description={badge.description} 
                            isLocked={false} 
                        />
                    </View>
                ))}
            </View>
        </View>

        <View style={styles.badgesSection}>
            <Text style={styles.badgesTitle}>Bloqueadas</Text>
            <View style={styles.badgesGrid}>
                {lockedBadges.map((badge) => (
                    <View style={styles.cardWrapper} key={badge.title}>
                        <BadgeCard 
                            image={badge.image} 
                            title={badge.title} 
                            description={badge.description} 
                            isLocked={true} 
                        />
                    </View>
                ))}
            </View>
        </View>          
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