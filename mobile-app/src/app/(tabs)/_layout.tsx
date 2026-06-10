import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import CustomDrawer from '@/components/CustomDrawer';

export default function AppLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawer {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'Início',
          }}
        />

        <Drawer.Screen
          name="habitRegister"
          options={{
            drawerLabel: 'Criar Hábito', 
          }}
        />
        
      </Drawer>
    </GestureHandlerRootView>
  );
}