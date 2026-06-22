import React from 'react';
import renderer, { act } from 'react-test-renderer';
import AchievementsCard from '../AchievementsCard';

function extractText(node: any): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (!node) return '';
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (node.children) return extractText(node.children);
  return '';
}

describe('AchievementsCard', () => {
  it('renders current and total achievements text', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(<AchievementsCard current={3} total={10} />);
    });
    const text = extractText(tree!.toJSON());
    expect(text).toContain('3 de 10 conquistas');
  });

  it('renders encouragement text', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(<AchievementsCard current={1} total={5} />);
    });
    const text = extractText(tree!.toJSON());
    expect(text).toContain('Continue assim!');
  });

  it('handles zero progress', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(<AchievementsCard current={0} total={10} />);
    });
    const text = extractText(tree!.toJSON());
    expect(text).toContain('0 de 10 conquistas');
  });

  it('handles full completion', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(<AchievementsCard current={10} total={10} />);
    });
    const text = extractText(tree!.toJSON());
    expect(text).toContain('10 de 10 conquistas');
  });

  it('renders without crashing with undefined props', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(<AchievementsCard />);
    });
    const text = extractText(tree!.toJSON());
    expect(text).toContain('Continue assim!');
  });
});
