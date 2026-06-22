import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { Text, Pressable } from 'react-native';
import { AuthProvider, useAuth } from '../AuthContext';

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

function TestConsumer() {
  const { user, token, loading, signIn, signUp, signOut } = useAuth();

  return (
    <>
      <Text testID="user">{user ? user.name : 'null'}</Text>
      <Text testID="token">{token ?? 'null'}</Text>
      <Text testID="loading">{String(loading)}</Text>
      <Pressable testID="signIn" onPress={() => signIn('test@example.com', 'senha123')} />
      <Pressable testID="signUp" onPress={() => signUp('Test', 'test@example.com', 'senha123', '2000-01-01')} />
      <Pressable testID="signOut" onPress={signOut} />
    </>
  );
}

function getTextContent(tree: renderer.ReactTestRenderer, testID: string): string {
  const node = tree.root.findAll(
    (n) => n.props.testID === testID && n.type === 'Text',
  );
  return node[0]?.props?.children ?? '';
}

function pressButton(tree: renderer.ReactTestRenderer, testID: string) {
  const node = tree.root.findAll((n) => n.props.testID === testID);
  node[0].props.onPress();
}

beforeEach(() => {
  mockFetch.mockReset();
});

describe('AuthContext', () => {
  it('starts with null user and token', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <AuthProvider><TestConsumer /></AuthProvider>,
      );
    });

    expect(getTextContent(tree!, 'user')).toBe('null');
    expect(getTextContent(tree!, 'token')).toBe('null');
    expect(getTextContent(tree!, 'loading')).toBe('false');
  });

  it('signIn sets user and token on success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        access_token: 'jwt-token-123',
        user: { id: 1, name: 'Test User', email: 'test@example.com', data_nascimento: null },
      }),
    } as Response);

    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <AuthProvider><TestConsumer /></AuthProvider>,
      );
    });

    await act(async () => {
      pressButton(tree!, 'signIn');
    });

    expect(getTextContent(tree!, 'user')).toBe('Test User');
    expect(getTextContent(tree!, 'token')).toBe('jwt-token-123');
  });

  it('signIn does nothing with empty fields', async () => {
    function EmptyConsumer() {
      const { signIn, user } = useAuth();
      return (
        <>
          <Text testID="user">{user ? user.name : 'null'}</Text>
          <Pressable testID="signIn" onPress={() => signIn('', '')} />
        </>
      );
    }

    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <AuthProvider><EmptyConsumer /></AuthProvider>,
      );
    });

    await act(async () => {
      pressButton(tree!, 'signIn');
    });

    expect(mockFetch).not.toHaveBeenCalled();
    expect(getTextContent(tree!, 'user')).toBe('null');
  });

  it('signUp sets user and token on success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        access_token: 'new-token',
        user: { id: 2, name: 'New User', email: 'new@example.com', data_nascimento: '2000-01-01' },
      }),
    } as Response);

    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <AuthProvider><TestConsumer /></AuthProvider>,
      );
    });

    await act(async () => {
      pressButton(tree!, 'signUp');
    });

    expect(getTextContent(tree!, 'user')).toBe('New User');
    expect(getTextContent(tree!, 'token')).toBe('new-token');
  });

  it('signOut clears user and token', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        access_token: 'token',
        user: { id: 1, name: 'User', email: 'u@e.com', data_nascimento: null },
      }),
    } as Response);

    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <AuthProvider><TestConsumer /></AuthProvider>,
      );
    });

    await act(async () => {
      pressButton(tree!, 'signIn');
    });

    expect(getTextContent(tree!, 'user')).toBe('User');

    act(() => {
      pressButton(tree!, 'signOut');
    });

    expect(getTextContent(tree!, 'user')).toBe('null');
    expect(getTextContent(tree!, 'token')).toBe('null');
  });

  it('handles login API error gracefully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ detail: 'E-mail ou senha incorretos' }),
    } as Response);

    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <AuthProvider><TestConsumer /></AuthProvider>,
      );
    });

    await act(async () => {
      pressButton(tree!, 'signIn');
    });

    expect(getTextContent(tree!, 'user')).toBe('null');
    expect(getTextContent(tree!, 'loading')).toBe('false');
  });
});
