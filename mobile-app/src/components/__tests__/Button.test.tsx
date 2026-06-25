import React from 'react';
import renderer, { act } from 'react-test-renderer';
import Button from '../Button';

function extractText(node: any): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (!node) return '';
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (node.children) return extractText(node.children);
  return '';
}

function findPressable(root: renderer.ReactTestInstance): renderer.ReactTestInstance | undefined {
  return root.findAll((node) => node.props.onPress)[0];
}

describe('Button', () => {
  it('renderiza o texto corretamente', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(<Button text="Salvar" onPress={() => {}} />);
    });
    expect(extractText(tree!.toJSON())).toContain('Salvar');
  });

  it('chama onPress ao ser pressionado', () => {
    const mockOnPress = jest.fn();
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(<Button text="Clique" onPress={mockOnPress} />);
    });
    const pressable = findPressable(tree!.root);
    expect(pressable).toBeDefined();
    act(() => {
      pressable!.props.onPress();
    });
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('renderiza com texto diferente', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(<Button text="Cancelar" onPress={() => {}} />);
    });
    expect(extractText(tree!.toJSON())).toContain('Cancelar');
  });
});
