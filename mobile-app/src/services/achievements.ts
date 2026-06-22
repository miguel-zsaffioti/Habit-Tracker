import { api } from './api';

export type Achievement = {
  id: number;
  nome: string;
  descricao: string;
  icone_referencia: string;
  desbloqueada: boolean;
};

export type AchievementsResponse = {
  total: number;
  desbloqueadas: number;
  conquistas: Achievement[];
};

export function getAchievements(): Promise<AchievementsResponse> {
  return api<AchievementsResponse>('/achievements/');
}
