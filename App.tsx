// Local: App.js (ou seu arquivo de entrada principal)

import React, { useEffect } from 'react';
import { AuthProvider } from './src/context/auth'; // Importe o Provider
import Navigation from './src/navigation/index'; // Seu arquivo de rotas
import { useFonts } from 'expo-font';
import { testSupabaseConnection } from './src/core/utils/testSupabase';
import DatabaseConnection from './src/core/infra/sqlite/connection';
import { SyncService } from './src/core/services/SyncServices';


export default function App() {
  useEffect(() => {
    async function initializeApp() {
      await testSupabaseConnection();
      await DatabaseConnection.getConnection();
      SyncService.getInstance();
    }
    initializeApp();
  }, []);
  const [fontsLoaded, fontError] = useFonts({

    'Itim-Regular': require('./assets/Itim-Regular.ttf'),
 
  });
  

  return (
    
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}