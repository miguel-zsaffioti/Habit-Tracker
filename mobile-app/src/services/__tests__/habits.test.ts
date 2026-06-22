import { listHabits, getTodayHabits, getHabitDetail, createHabit, toggleCheckin } from '../habits';
import type { Habit, HabitToday, HabitDetail } from '../habits';

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

beforeEach(() => {
  mockFetch.mockReset();
});

const sampleHabit: Habit = {
  id: 1,
  user_id: 1,
  nome: 'Exercício',
  descricao: null,
  tipo: 'desenvolver',
  meta_especifica: null,
  frequencia_dias: [0, 1, 2, 3, 4],
  data_inicio: '2024-01-01',
  data_fim: null,
  ativo: true,
  current_streak: 5,
};

describe('listHabits', () => {
  it('fetches active habits list', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [sampleHabit],
    } as Response);

    const result = await listHabits();

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/habits/'),
      expect.objectContaining({ method: 'GET' }),
    );
    expect(result).toHaveLength(1);
    expect(result[0].nome).toBe('Exercício');
  });
});

describe('getTodayHabits', () => {
  it('fetches today habits with check status', async () => {
    const todayData: HabitToday[] = [
      { habito: sampleHabit, feito_hoje: false },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => todayData,
    } as Response);

    const result = await getTodayHabits();

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/habits/today'),
      expect.any(Object),
    );
    expect(result[0].feito_hoje).toBe(false);
  });
});

describe('getHabitDetail', () => {
  it('fetches habit detail with completed dates', async () => {
    const detail: HabitDetail = {
      detalhes: sampleHabit,
      datas_concluidas: ['2024-01-15', '2024-01-16'],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => detail,
    } as Response);

    const result = await getHabitDetail(1);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/habits/1'),
      expect.any(Object),
    );
    expect(result.datas_concluidas).toHaveLength(2);
  });

  it('throws on not found', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ detail: 'Hábito não encontrado' }),
    } as Response);

    await expect(getHabitDetail(999)).rejects.toThrow('Hábito não encontrado');
  });
});

describe('createHabit', () => {
  it('sends POST with habit data', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => sampleHabit,
    } as Response);

    const newHabit = {
      nome: 'Exercício',
      frequencia_dias: [0, 1, 2, 3, 4],
      data_inicio: '2024-01-01',
    };

    const result = await createHabit(newHabit);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/habits/'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(newHabit),
      }),
    );
    expect(result.id).toBe(1);
  });
});

describe('toggleCheckin', () => {
  it('sends POST to checkin endpoint', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ mensagem: 'Check-in realizado com sucesso!' }),
    } as Response);

    const result = await toggleCheckin(1, '2024-01-15');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/habits/1/checkin'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ data_checkin: '2024-01-15' }),
      }),
    );
    expect(result.mensagem).toContain('sucesso');
  });

  it('returns remove message on toggle off', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ mensagem: 'Check-in removido com sucesso.' }),
    } as Response);

    const result = await toggleCheckin(1, '2024-01-15');
    expect(result.mensagem).toContain('removido');
  });
});
