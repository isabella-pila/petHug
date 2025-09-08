import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import PetDetailsScreen from '../screens/PetDetailsScreen';

// Tipos para as rotas desta pilha específica
export type HomeStackParamList = {
  HomeList: undefined;
  PetDetails: { id: string; title: string; image: string | number; descricao: string };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    // headerShown: false para que as telas não tenham um cabeçalho próprio.
    // O cabeçalho principal (do Drawer/MainStack) será usado no lugar.
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeList" component={HomeScreen} />
      <Stack.Screen name="PetDetails" component={PetDetailsScreen} />
    </Stack.Navigator>
  );
}