import { api } from './api';

export type Habit = {
  id: number;
  user_id: number;
  nome: string;
  descricao: string | null;
  tipo: string;
  meta_especifica: string | null;
  frequencia_dias: number[];
  data_inicio: string;
  data_fim: string | null;
  ativo: boolean;
  current_streak: number;
};

export type HabitToday = {
  habito: Habit;
  feito_hoje: boolean;
};

export type HabitCreate = {
  nome: string;
  descricao?: string;
  tipo?: string;
  meta_especifica?: string;
  frequencia_dias: number[];
  data_inicio: string;
  data_fim?: string;
};

export type HabitDetail = {
  detalhes: Habit;
  datas_concluidas: string[];
};

export function listHabits(): Promise<Habit[]> {
  return api<Habit[]>('/habits/');
}

export function getTodayHabits(): Promise<HabitToday[]> {
  return api<HabitToday[]>('/habits/today');
}

export function getHabitDetail(habitId: number): Promise<HabitDetail> {
  return api<HabitDetail>(`/habits/${habitId}`);
}

export function createHabit(data: HabitCreate): Promise<Habit> {
  return api<Habit>('/habits/', { method: 'POST', body: data });
}

export function toggleCheckin(habitId: number, date: string): Promise<{ mensagem: string }> {
  return api<{ mensagem: string }>(`/habits/${habitId}/checkin`, {
    method: 'POST',
    body: { data_checkin: date },
  });
}
