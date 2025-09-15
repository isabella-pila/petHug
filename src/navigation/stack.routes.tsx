import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigation from './BottomTabNavigation';

// ✨ VOCÊ PODE SIMPLIFICAR A TIPAGEM SE NÃO TIVER MAIS TELAS AQUI
export type RootStackParamList = {
  MainTabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppStackRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={BottomTabNavigation} 
        options={{ headerShown: false }}
      />
    
    </Stack.Navigator>
  );
}