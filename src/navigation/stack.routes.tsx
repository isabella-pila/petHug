import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTabNavigation from './BottomTabNavigation'; // Importamos as abas
import PetDetailsScreen from '../screens/PetDetailsScreen';

export type RootStackParamList = {
  MainTabs: undefined; // Nome para o conjunto de abas
  PetDetails: { id: string; title: string };
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
      <Stack.Screen name="PetDetails" component={PetDetailsScreen} />
    </Stack.Navigator>
  );
}

