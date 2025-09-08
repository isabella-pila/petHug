import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AreaPetScreen from '../screens/AreaPetScreen';
import CadastrarPetScreen from '../screens/CadastrarPetScreen';
import EditarPetScreen from '../screens/EditarPet';

// Tipos para as rotas desta pilha
export type AreaPetStackParamList = {
  AreaPetHome: undefined;
  CadastrarPet: undefined;
  EditarPet: undefined; // Adicione parâmetros se necessário, ex: { petId: string }
};

const Stack = createNativeStackNavigator<AreaPetStackParamList>();

export default function AreaPetStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AreaPetHome" component={AreaPetScreen} />
      <Stack.Screen name="CadastrarPet" component={CadastrarPetScreen} />
      <Stack.Screen name="EditarPet" component={EditarPetScreen} />
    </Stack.Navigator>
  );
}