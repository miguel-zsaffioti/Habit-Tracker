import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { fireEvent, render } from '@testing-library/react-native';
import Button from '../Button';

function extractText(node: any): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (!node) return '';
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (node.children) return extractText(node.children);
  return '';
}

describe('Button', () => {
  it('renderiza o texto corretamente', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(<Button text="Salvar" onPress={() => {}} />);
    });
    const text = extractText(tree!.toJSON());
    expect(text).toContain('Salvar');
  });

  it('chama onPress ao ser pressionado', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(<Button text="Clique" onPress={mockOnPress} />);
    fireEvent.press(getByText('Clique'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('renderiza com texto diferente', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(<Button text="Cancelar" onPress={() => {}} />);
    });
    const text = extractText(tree!.toJSON());
    expect(text).toContain('Cancelar');
  });
});
