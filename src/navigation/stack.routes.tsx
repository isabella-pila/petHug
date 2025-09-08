import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTabNavigation from './BottomTabNavigation'; // Importamos as abas
import PetDetailsScreen from '../screens/PetDetailsScreen';
import CadastrarPetScreen from '../screens/CadastrarPetScreen';
import EditarPetScreen from '../screens/EditarPet';

export type RootStackParamList = {
  MainTabs: undefined; // Nome para o conjunto de abas
  PetDetails: { id: string; title: string; image: string | number; descricao: string};
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
      <Stack.Screen name="PetDetails" component={PetDetailsScreen}  options={{ headerShown: false }} />
      <Stack.Screen name="CadastrarPet" component={CadastrarPetScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EditarPet" component={EditarPetScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

