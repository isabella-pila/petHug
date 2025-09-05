import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppStackRoutes from './stack.routes';

export default function Routes() {
  // FUTURAMENTE:
  // const isUserLoggedIn = true; // Você pegaria essa informação do estado global, AsyncStorage, etc.

  return (
    <NavigationContainer>
      {/* {isUserLoggedIn ? <AppStackRoutes /> : <StackLoginNavigation />} */}
      <AppStackRoutes />
    </NavigationContainer>
  );
}