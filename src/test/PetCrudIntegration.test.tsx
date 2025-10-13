import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '../context/auth';
import { MockPetPerfilRepository } from '../core/infra/repositories/MockPetPerfilRepository';
import AreaPetStack from '../navigation/AreaPetStack';
import { Alert } from 'react-native';

jest.spyOn(Alert, 'alert');
const mockConfirmDeleteInAlert = () => {
  (Alert.alert as jest.Mock).mockImplementation((title, message, buttons) => {
    if (buttons && buttons[1] && buttons[1].onPress) {
      buttons[1].onPress();
    }
  });
};

describe('AreaPetStack - Integração CRUD', () => {

  beforeEach(() => {
    MockPetPerfilRepository.getInstance().clear();
    (Alert.alert as jest.Mock).mockClear();
  });

  it('deve realizar um ciclo completo de Criar, Ler, Atualizar e Excluir um pet', async () => {
    render(
      <AuthProvider>
        <NavigationContainer>
          <AreaPetStack />
        </NavigationContainer>
      </AuthProvider>
    );

    const registerButton = await screen.findByText('Cadastrar Novo Pet');
    fireEvent.press(registerButton);

    await waitFor(() => {
      fireEvent.changeText(screen.getByPlaceholderText('Nome'), 'Bolinha');
      fireEvent.changeText(screen.getByPlaceholderText('URL da Foto'), 'https://example.com/bolinha.jpg');
      fireEvent.changeText(screen.getByPlaceholderText('Descrição'), 'Um gato muito fofo e tranquilo.');
    });
    
    fireEvent.press(screen.getByText('Cadastrar'));

    const petName = await screen.findByText('Bolinha');
    expect(petName).toBeDefined();

 
    const editButton = screen.getByText('Editar'); 
    fireEvent.press(editButton);
    
    const descriptionInput = await screen.findByDisplayValue('Um gato muito fofo e tranquilo.');
    fireEvent.changeText(descriptionInput, 'Um gato persa muito elegante.');
  
    fireEvent.press(screen.getByText('Salvar Alterações'));

    
    await screen.findByText('Bolinha');


    const deleteButton = await screen.findByText('Excluir');

    mockConfirmDeleteInAlert();
    fireEvent.press(deleteButton);

    expect(Alert.alert).toHaveBeenCalled();

   
  });
});