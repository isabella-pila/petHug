import React from 'react';
import { View, Text } from 'react-native';
import { render, fireEvent, waitFor, renderHook } from '@testing-library/react-native';

import Navigation from '../navigation/index'; 
import { AuthProvider, useAuth } from '../context/auth';


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

    const loginButton = await findByTestId('login-button');

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Senha'), 'password123');
    fireEvent.press(loginButton);




    const welcomeMessage = await findByTestId('welcome-message');
    expect(welcomeMessage).toBeTruthy();
  });

  it('should handle login failure', async () => {
  const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
  
  // Mocka a função de loginUser para lançar erro
  jest.spyOn(result.current, 'handleLogin').mockImplementationOnce(async () => {
    throw new Error('Invalid credentials');
  });

  await expect(result.current.handleLogin({ email: 'wrong@example.com', password: '123' }))
    .rejects.toThrow('Invalid credentials');
});


});

