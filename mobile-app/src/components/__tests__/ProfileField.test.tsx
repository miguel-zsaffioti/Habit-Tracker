import React from 'react';
import renderer, { act } from 'react-test-renderer';
import ProfileField from '../ProfileField';

function extractText(node: any): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (!node) return '';
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (node.children) return extractText(node.children);
  return '';
}

describe('ProfileField', () => {
  it('renderiza o label corretamente', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(<ProfileField label="Nome" value="João" />);
    });
    const text = extractText(tree!.toJSON());
    expect(text).toContain('Nome');
  });

  it('renderiza o valor corretamente', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(<ProfileField label="Email" value="joao@email.com" />);
    });
    const text = extractText(tree!.toJSON());
    expect(text).toContain('joao@email.com');
  });

  it('chama onPress quando fornecido e pressionado', () => {
    const mockOnPress = jest.fn();
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(<ProfileField label="Campo" value="Valor" onPress={mockOnPress} />);
    });
    const instance = tree!.toJSON() as any;
    act(() => {
      instance.props.onPress();
    });
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('renderiza sem onPress sem erros', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(<ProfileField label="Campo" value="Valor" />);
    });
    expect(tree!.toJSON()).not.toBeNull();
  });
});
