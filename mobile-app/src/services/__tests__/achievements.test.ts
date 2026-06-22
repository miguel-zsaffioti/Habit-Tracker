import { getAchievements } from '../achievements';
import type { AchievementsResponse } from '../achievements';

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

beforeEach(() => {
  mockFetch.mockReset();
});

describe('getAchievements', () => {
  it('fetches achievements list with unlock status', async () => {
    const mockResponse: AchievementsResponse = {
      total: 3,
      desbloqueadas: 1,
      conquistas: [
        { id: 1, nome: 'Primeiro Passo', descricao: 'Crie seu primeiro hábito', icone_referencia: 'star', desbloqueada: true },
        { id: 2, nome: 'Consistente', descricao: 'Streak de 3 dias', icone_referencia: 'fire', desbloqueada: false },
        { id: 3, nome: 'Colecionador', descricao: '5 hábitos ativos', icone_referencia: 'medal', desbloqueada: false },
      ],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await getAchievements();

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/achievements/'),
      expect.objectContaining({ method: 'GET' }),
    );
    expect(result.total).toBe(3);
    expect(result.desbloqueadas).toBe(1);
    expect(result.conquistas).toHaveLength(3);
  });

  it('returns empty state when no achievements exist', async () => {
    const emptyResponse: AchievementsResponse = {
      total: 0,
      desbloqueadas: 0,
      conquistas: [],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => emptyResponse,
    } as Response);

    const result = await getAchievements();
    expect(result.conquistas).toHaveLength(0);
  });

  it('throws on unauthorized access', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ detail: 'Token inválido ou expirado' }),
    } as Response);

    await expect(getAchievements()).rejects.toThrow('Token inválido ou expirado');
  });
});
