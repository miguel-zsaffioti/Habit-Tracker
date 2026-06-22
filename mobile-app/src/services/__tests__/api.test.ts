import { api, setApiToken } from '../api';

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

beforeEach(() => {
  mockFetch.mockReset();
  setApiToken(null);
});

describe('setApiToken', () => {
  it('includes Authorization header when token is set', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: 'ok' }),
    } as Response);

    setApiToken('my-token');
    await api('/test');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer my-token',
        }),
      }),
    );
  });

  it('does not include Authorization header when token is null', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response);

    await api('/test');

    const headers = mockFetch.mock.calls[0][1]?.headers as Record<string, string>;
    expect(headers.Authorization).toBeUndefined();
  });
});

describe('api', () => {
  it('makes GET request by default', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: 'data' }),
    } as Response);

    const result = await api('/endpoint');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/endpoint'),
      expect.objectContaining({ method: 'GET' }),
    );
    expect(result).toEqual({ result: 'data' });
  });

  it('sends POST request with JSON body', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1 }),
    } as Response);

    const body = { nome: 'Test', frequencia_dias: [0, 1] };
    await api('/habits/', { method: 'POST', body });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/habits/'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(body),
      }),
    );
  });

  it('includes Content-Type header', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response);

    await api('/test');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      }),
    );
  });

  it('throws error with detail message on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ detail: 'Token inválido' }),
    } as Response);

    await expect(api('/protected')).rejects.toThrow('Token inválido');
  });

  it('throws generic error when response has no detail', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => { throw new Error('parse error'); },
    } as Response);

    await expect(api('/broken')).rejects.toThrow('Erro desconhecido');
  });

  it('merges custom headers with defaults', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response);

    await api('/test', { headers: { 'X-Custom': 'value' } });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'X-Custom': 'value',
        }),
      }),
    );
  });

  it('does not send body for GET requests', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response);

    await api('/test');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ body: undefined }),
    );
  });
});
