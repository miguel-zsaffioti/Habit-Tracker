import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, StyleProp, ViewStyle } from 'react-native';

type ButtonProps = {
  text: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>; 
};

export default function Button({ onPress, text, style }: ButtonProps) {
  return (
    <Pressable style={StyleSheet.flatten([styles.button, style])} onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFCC00',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 32,
    alignItems: 'center',
  },
  text: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});