import { StyleSheet, ScrollView, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth } from '@/constants/theme';
import Header from '@/components/Header';
import DailyChecker from '@/components/DailyChecker';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function HomeScreen() {
  
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
          <DailyChecker />
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
  addButtonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
});