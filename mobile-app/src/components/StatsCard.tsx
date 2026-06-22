import { StyleSheet, Text, View } from 'react-native';

type StatsCardProps = {
  habits?: number;
  streak?: number;
  achievements?: number;
};

export default function StatsCard({ 
  habits, 
  streak, 
  achievements
}: StatsCardProps) {
  return (
    <View style={styles.container}>
      
      <View style={styles.statContainer}>
        <Text style={styles.value}>{habits}</Text>
        <Text style={styles.label}>Hábitos</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.statContainer}>
        <Text style={styles.value}>{streak}</Text>
        <Text style={styles.label}>Streak</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.statContainer}>
        <Text style={styles.value}>{achievements}</Text>
        <Text style={styles.label}>Conquistas</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAEAEC',
    paddingVertical: 16,
    marginVertical: 12,
  },
  statContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '400',
  },
  divider: {
    width: 1,
    height: '70%',
    backgroundColor: '#EAEAEC',
  },
});