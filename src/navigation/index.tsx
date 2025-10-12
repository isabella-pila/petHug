import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppStackRoutes from './stack.routes';
import { LoginStackNavigation as StackLoginNavigation } from './LoginstackNavigation';
import { useAuth } from '../context/auth';

export default function Navigation() {

  const {login} = useAuth()
  return (
    <NavigationContainer>
       {login ? <AppStackRoutes /> : <StackLoginNavigation />} 
     
    </NavigationContainer>
  );
}