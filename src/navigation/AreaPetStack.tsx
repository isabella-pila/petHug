import React from 'react';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import AreaPetScreen from '../screens/AreaPetScreen';
import CadastrarPetScreen from '../screens/CadastrarPetScreen';
import EditarPetScreen from '../screens/EditarPet';


export type AreaPetStackParamList = {
  AreaPetHome: undefined;
  CadastrarPet: undefined;
  EditarPet: { petId: string };
};
type PetPerfilScreenProp = NativeStackNavigationProp<AreaPetStackParamList, 'AreaPetHome'>
export type PetPerfilTypes = {
    navigation: PetPerfilScreenProp
}
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