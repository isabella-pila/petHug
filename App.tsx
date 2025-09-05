import React, { useEffect } from 'react';
import Routes from './src/navigation'; // Importa o orquestrador
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
export default function App() {
    // Use `useFonts` only if you can't use the config plugin.
  const [loaded, error] = useFonts({
    'Itim-Regular': require('./assets/Itim-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  return <Routes />;
}