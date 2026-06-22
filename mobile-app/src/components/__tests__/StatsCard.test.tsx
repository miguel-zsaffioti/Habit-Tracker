import React from 'react';
import renderer, { act } from 'react-test-renderer';
import StatsCard from '../StatsCard';

describe('StatsCard', () => {
  it('renders all three stat values', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <StatsCard habits={10} streak={5} achievements={3} />,
      );
    });
    const json = JSON.stringify(tree!.toJSON());

    expect(json).toContain('10');
    expect(json).toContain('5');
    expect(json).toContain('3');
  });

  it('renders labels correctly', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <StatsCard habits={0} streak={0} achievements={0} />,
      );
    });
    const json = JSON.stringify(tree!.toJSON());

    expect(json).toContain('Hábitos');
    expect(json).toContain('Streak');
    expect(json).toContain('Conquistas');
  });

  it('renders without crashing when props are undefined', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(<StatsCard />);
    });
    const json = JSON.stringify(tree!.toJSON());

    expect(json).toContain('Hábitos');
    expect(json).toContain('Streak');
    expect(json).toContain('Conquistas');
  });

  it('renders large numbers correctly', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <StatsCard habits={100} streak={365} achievements={50} />,
      );
    });
    const json = JSON.stringify(tree!.toJSON());

    expect(json).toContain('100');
    expect(json).toContain('365');
    expect(json).toContain('50');
  });
});
