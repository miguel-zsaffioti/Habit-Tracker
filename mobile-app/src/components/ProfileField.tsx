import { StyleSheet, Text, View, Pressable } from 'react-native';

type ProfileFieldProps = {
  label: string;
  value: string;
  onPress?: () => void;
};

export default function ProfileField({ label, value, onPress }: ProfileFieldProps) {
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed
      ]} 
      onPress={onPress}
    >
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>

    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  containerPressed: {
    opacity: 0.7,
  },
  textContainer: {
    flexDirection: 'column',
    gap: 4,
  },
  label: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '400',
  },
  value: {
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
  },
});