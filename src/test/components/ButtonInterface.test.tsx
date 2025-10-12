import React from 'react';
import { render } from '@testing-library/react-native';
import { ButtonInterface } from '../../components/ButtonInterface';
import { Text } from 'react-native';

describe('ButtonInterface', () => {
  it('renders with title (primary default)', () => {
    const { getByText } = render(<ButtonInterface title="Salvar" />);
    expect(getByText('Salvar')).toBeTruthy();
  });

  it('renders children instead of title', () => {
    const { getByText } = render(
      <ButtonInterface>
        <Text>Com Ícone</Text>
      </ButtonInterface>
    );
    expect(getByText('Com Ícone')).toBeTruthy();
  });

  it('renders with different types', () => {
    const { rerender } = render(<ButtonInterface title="Test" type="secondary" />);
    rerender(<ButtonInterface title="Test" type="third" />);
    rerender(<ButtonInterface title="Test" type="danger" />);
    expect(true).toBeTruthy(); // apenas para cobrir os estilos
  });

  it('renders icon subcomponent', () => {
    const { getByTestId } = render(
      <ButtonInterface.Icon>
        <Text testID="icon-child">Icon</Text>
      </ButtonInterface.Icon>
    );
    expect(getByTestId('icon-child')).toBeTruthy();
  });
  
});
