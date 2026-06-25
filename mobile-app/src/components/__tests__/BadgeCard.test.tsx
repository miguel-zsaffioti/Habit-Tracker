import React from 'react';
import renderer, { act } from 'react-test-renderer';
import BadgeCard from '../BadgeCard';

function extractText(node: any): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (!node) return '';
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (node.children) return extractText(node.children);
  return '';
}

const mockImage = { uri: 'https://example.com/badge.png' };

describe('BadgeCard', () => {
  it('renderiza o título corretamente', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <BadgeCard image={mockImage} title="Primeiro Passo" description="Complete seu primeiro hábito" />
      );
    });
    const text = extractText(tree!.toJSON());
    expect(text).toContain('Primeiro Passo');
  });

  it('renderiza a descrição corretamente', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <BadgeCard image={mockImage} title="Badge" description="Descrição do badge" />
      );
    });
    const text = extractText(tree!.toJSON());
    expect(text).toContain('Descrição do badge');
  });

  it('renderiza no estado desbloqueado por padrão', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <BadgeCard image={mockImage} title="Badge" description="Desc" />
      );
    });
    expect(tree!.toJSON()).not.toBeNull();
  });

  it('renderiza no estado bloqueado (isLocked=true)', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <BadgeCard image={mockImage} title="Bloqueado" description="Desbloqueie mais tarde" isLocked={true} />
      );
    });
    const text = extractText(tree!.toJSON());
    expect(text).toContain('Bloqueado');
  });
});
