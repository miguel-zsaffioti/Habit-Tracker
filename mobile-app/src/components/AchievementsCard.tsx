import { StyleSheet, Text, View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

type AchievementsCardProps = {
  current?: number;
  total?: number;
};

export default function AchievementsCard({ current, total }: AchievementsCardProps) {
  const isThereProgress = current !== undefined && total !== undefined;
  const progressPercentage = isThereProgress ? (current / total) * 100 : 0;

  return (
    <View style={styles.container}>
      
      <View style={styles.iconContainer}>   
        <FontAwesome6 name="ranking-star" size={32} color="#F2A900" />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.cardTitle}>{current} de {total} conquistas</Text>
        
        <View style={styles.progressBarTrack}>
          <View 
            style={[
              styles.progressBarFill, 
              { width: `${progressPercentage}%` } 
            ]} 
          />
        </View>

        <Text style={styles.label}>Continue assim!</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9D2', 
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFE600',
    paddingVertical: 16,
    paddingHorizontal: 20, 
  },
  iconContainer: {
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    gap: 6, 
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#000000',
  },
  label: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '400',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 4, 
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFCC00', 
    borderRadius: 4,
  },
});