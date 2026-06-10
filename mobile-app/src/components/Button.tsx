import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, StyleProp, ViewStyle } from 'react-native';

type ButtonProps = {
  link: string;
  text: string;
  style?: StyleProp<ViewStyle>; 
};

export default function Button({ link, text, style }: ButtonProps) {
  return (
    <Link href={link as any} asChild>
      <Pressable style={StyleSheet.flatten([styles.button, style])}>
        <Text style={styles.text}>{text}</Text>
      </Pressable>
    </Link>
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