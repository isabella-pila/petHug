import React from 'react';
import { View, Text } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

import Navigation from '../navigation/index'; 
import { AuthProvider } from '../context/auth';


import { MockUserRepository } from '../core/infra/repositories/MockUserRepository';


const HomeScreen = () => (
  <View>
    <Text testID="welcome-message">Bem-vindo!</Text>
  </View>
);




jest.mock('../navigation/stack.routes.tsx', () => {


  const MockedAppStackRoutes = () => <HomeScreen />;
  return MockedAppStackRoutes;
});




describe('LoginScreen Integration', () => {
  beforeEach(() => {
    MockUserRepository.getInstance().reset();
  });


  it('should login successfully after registering', async () => {
   
   
const { getByPlaceholderText, getByText, findByTestId, findByPlaceholderText } = render(
  <AuthProvider>
    <Navigation />
  </AuthProvider>
);


   
    const registerNavButton = getByText('Cadastre-se');
    fireEvent.press(registerNavButton);


   
    const nameInput = await findByPlaceholderText('Nome');
    fireEvent.changeText(nameInput, 'Test User');
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Senha'), 'password123');
    fireEvent.press(getByText('Salvar'));


    // --- Aguarde a navegação de volta para a tela de Login ---
    const loginButton = await findByTestId('login-button');


    // --- ETAPA DE LOGIN ---
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Senha'), 'password123');
    fireEvent.press(loginButton);




    const welcomeMessage = await findByTestId('welcome-message');
    expect(welcomeMessage).toBeTruthy();
  });
});

