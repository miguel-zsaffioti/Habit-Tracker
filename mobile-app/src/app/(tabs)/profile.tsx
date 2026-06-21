import { useState } from 'react';
import { StyleSheet, TextInput, View, KeyboardAvoidingView, Platform, ScrollView, Pressable, Text, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome } from '@expo/vector-icons';

import Header from '@/components/Header';
import ProfileField from '@/components/ProfileField';
import StatsCard from '@/components/StatsCard';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const { user } = useAuth();

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
          <StatsCard habits={3} streak={22} achievements={5} />
        </View>


        <View style={styles.fieldsSection}>
          <ProfileField label="Nome" value={user?.name ?? ''} />
          <ProfileField label="E-mail" value={user?.email ?? ''} />
          <ProfileField label="Nascimento" value={user?.birthDate ?? ''} />
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
    alignItems: 'center', // Centraliza apenas o ícone
    marginBottom: 24, // Espaço entre o ícone e o StatsCard
    width: '100%',
  },
  statsSection: {
    width: '100%',
    marginBottom: 32, // Espaço maior entre as estatísticas e as informações pessoais
  },
  fieldsSection: {
    width: '100%', // Garante que os campos ocupem toda a largura disponível
    // Se o gap não funcionar na sua versão do React Native, você pode colocar marginBottom no ProfileField
    gap: 12, 
  },           
});