import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTabNavigation from './BottomTabNavigation'; // Importamos as abas
import PetDetailsScreen from '../screens/PetDetailsScreen';
import CadastrarPetScreen from '../screens/CadastrarPetScreen';
import EditarPetScreen from '../screens/EditarPet';

export type RootStackParamList = {
  MainTabs: undefined; // Nome para o conjunto de abas
  PetDetails: { id: string; title: string };
  CadastrarPet: undefined;
  EditarPet: undefined;
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
      <Stack.Screen name="CadastrarPet" component={CadastrarPetScreen} />
      <Stack.Screen name="EditarPet" component={EditarPetScreen} />
    </Stack.Navigator>
  );
}

