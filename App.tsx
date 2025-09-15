// Local: App.js (ou seu arquivo de entrada principal)

import React from 'react';
import { AuthProvider } from './src/context/auth'; // Importe o Provider
import Navigation from './src/navigation/index'; // Seu arquivo de rotas
import { useFonts } from 'expo-font';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({

    'Itim-Regular': require('./assets/Itim-Regular.ttf'),
 
  });

  return (
    
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}