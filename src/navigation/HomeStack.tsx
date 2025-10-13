import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import PetDetailsScreen from '../screens/PetDetailsScreen';
import AdoptionMessageScreen from '../screens/AdoptionMessageScreen'; 
import { ImageSourcePropType } from 'react-native';

export type HomeStackParamList = {
  HomeList: undefined;
  PetDetails: { id: string; title: string; image: ImageSourcePropType; descricao: string };
  AdoptionMessage: undefined;

};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeList" component={HomeScreen} />
      <Stack.Screen name="PetDetails" component={PetDetailsScreen} />
      <Stack.Screen name="AdoptionMessage" component={AdoptionMessageScreen} />
    
    </Stack.Navigator>
  );
}