// Local: App.js (ou seu arquivo de entrada principal)

import React from 'react';
import { AuthProvider } from './src/context/auth'; // Importe o Provider
import Navigation from './src/navigation/index'; // Seu arquivo de rotas

export default function App() {
  return (
    // ✨ Envolva suas rotas com o AuthProvider
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}