import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppStackRoutes from './stack.routes';
import { LoginStackNavigation as StackLoginNavigation } from './LoginstackNavigation';

export default function Routes() {

 const isUserLoggedIn = true; 
  return (
    <NavigationContainer>
       {isUserLoggedIn ? <AppStackRoutes /> : <StackLoginNavigation />} 
     
    </NavigationContainer>
  );
}