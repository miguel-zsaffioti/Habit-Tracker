import React from 'react';
import renderer, { act } from 'react-test-renderer';
import DailyChecker from '../DailyChecker';

function extractText(node: any): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (!node) return '';
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (node.children) return extractText(node.children);
  return '';
}

function findPressable(root: renderer.ReactTestInstance): renderer.ReactTestInstance | undefined {
  return root.findAll((node) => node.props.accessible === true || node.props.onPress)[0];
}

describe('DailyChecker', () => {
  const defaultProps = {
    nome: 'Exercício',
    streak: 5,
    checked: false,
    onToggle: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders habit name', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(<DailyChecker {...defaultProps} />);
    });
    const text = extractText(tree!.toJSON());
    expect(text).toContain('Exercício');
  });

  it('displays streak with plural "dias"', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(<DailyChecker {...defaultProps} streak={5} />);
    });
    const text = extractText(tree!.toJSON());
    expect(text).toContain('5 dias');
  });

  it('displays streak with singular "dia"', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(<DailyChecker {...defaultProps} streak={1} />);
    });
    const text = extractText(tree!.toJSON());
    expect(text).toContain('1 dia');
  });

  it('displays zero streak', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(<DailyChecker {...defaultProps} streak={0} />);
    });
    const text = extractText(tree!.toJSON());
    expect(text).toContain('0 dias');
  });

  it('calls onToggle when Pressable is pressed', () => {
    const onToggle = jest.fn();
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <DailyChecker {...defaultProps} onToggle={onToggle} />,
      );
    });

    const pressable = findPressable(tree!.root);
    expect(pressable).toBeDefined();
    act(() => {
      pressable!.props.onPress();
    });
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
