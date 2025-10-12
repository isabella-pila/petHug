import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeStack from './HomeStack'; 
import AreaPetStack from './AreaPetStack'; // ✨ IMPORTAR O STACK

const Tab = createBottomTabNavigator();

export default function BottomTabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown:false,
        tabBarActiveTintColor: '#392566',
        tabBarInactiveTintColor: '#fff',
        tabBarStyle: { 
          backgroundColor: '#C8B2F6',
          borderTopWidth: 2,
          borderTopColor: '#392566'
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: 'Início', 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AreaPet"
        component={AreaPetStack} 
        options={{
          tabBarLabel: 'Meus Pets', 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="paw" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}