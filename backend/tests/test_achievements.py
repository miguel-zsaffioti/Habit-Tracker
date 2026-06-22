import pytest
from datetime import date, timedelta
from unittest.mock import patch

import models
from routers.achievements import calcular_streak, verificar_e_desbloquear


class TestCalcularStreak:
    def test_streak_zero_no_logs(self, db_session, test_user):
        habit = models.Habit(
            user_id=test_user.id,
            nome="Test",
            frequencia_dias=[0, 1, 2, 3, 4, 5, 6],
            data_inicio=date.today(),
        )
        db_session.add(habit)
        db_session.commit()
        db_session.refresh(habit)

        assert calcular_streak(habit.id, db_session) == 0

    def test_streak_consecutive_days(self, db_session, test_user):
        habit = models.Habit(
            user_id=test_user.id,
            nome="Streak Test",
            frequencia_dias=[0, 1, 2, 3, 4, 5, 6],
            data_inicio=date.today() - timedelta(days=5),
        )
        db_session.add(habit)
        db_session.commit()
        db_session.refresh(habit)

        hoje = date.today()
        for i in range(3):
            log = models.HabitLog(
                habit_id=habit.id,
                data_checkin=hoje - timedelta(days=i),
                concluido=True,
            )
            db_session.add(log)
        db_session.commit()

        assert calcular_streak(habit.id, db_session) == 3

    def test_streak_breaks_on_gap(self, db_session, test_user):
        habit = models.Habit(
            user_id=test_user.id,
            nome="Gap Test",
            frequencia_dias=[0, 1, 2, 3, 4, 5, 6],
            data_inicio=date.today() - timedelta(days=10),
        )
        db_session.add(habit)
        db_session.commit()
        db_session.refresh(habit)

        hoje = date.today()
        db_session.add(models.HabitLog(
            habit_id=habit.id, data_checkin=hoje, concluido=True
        ))
        db_session.add(models.HabitLog(
            habit_id=habit.id, data_checkin=hoje - timedelta(days=2), concluido=True
        ))
        db_session.commit()

        assert calcular_streak(habit.id, db_session) == 1

    def test_streak_not_starting_today(self, db_session, test_user):
        habit = models.Habit(
            user_id=test_user.id,
            nome="Yesterday",
            frequencia_dias=[0, 1, 2, 3, 4, 5, 6],
            data_inicio=date.today() - timedelta(days=5),
        )
        db_session.add(habit)
        db_session.commit()
        db_session.refresh(habit)

        ontem = date.today() - timedelta(days=1)
        db_session.add(models.HabitLog(
            habit_id=habit.id, data_checkin=ontem, concluido=True
        ))
        db_session.commit()

        assert calcular_streak(habit.id, db_session) == 0


class TestVerificarEDesbloquear:
    def test_unlocks_total_habitos(self, db_session, test_user, sample_achievements):
        habit = models.Habit(
            user_id=test_user.id,
            nome="Primeiro",
            frequencia_dias=[0],
            data_inicio=date.today(),
            ativo=True,
        )
        db_session.add(habit)
        db_session.commit()

        novos = verificar_e_desbloquear(test_user.id, db_session)
        assert "Primeiro Passo" in novos

    def test_does_not_unlock_twice(self, db_session, test_user, sample_achievements):
        habit = models.Habit(
            user_id=test_user.id,
            nome="Primeiro",
            frequencia_dias=[0],
            data_inicio=date.today(),
            ativo=True,
        )
        db_session.add(habit)
        db_session.commit()

        verificar_e_desbloquear(test_user.id, db_session)
        novos = verificar_e_desbloquear(test_user.id, db_session)
        assert "Primeiro Passo" not in novos

    def test_unlocks_streak_achievement(self, db_session, test_user, sample_achievements):
        habit = models.Habit(
            user_id=test_user.id,
            nome="Streak",
            frequencia_dias=[0, 1, 2, 3, 4, 5, 6],
            data_inicio=date.today() - timedelta(days=10),
            ativo=True,
        )
        db_session.add(habit)
        db_session.commit()
        db_session.refresh(habit)

        hoje = date.today()
        for i in range(3):
            db_session.add(models.HabitLog(
                habit_id=habit.id,
                data_checkin=hoje - timedelta(days=i),
                concluido=True,
            ))
        db_session.commit()

        novos = verificar_e_desbloquear(test_user.id, db_session)
        assert "Consistente" in novos

    def test_does_not_unlock_unmet_criteria(self, db_session, test_user, sample_achievements):
        novos = verificar_e_desbloquear(test_user.id, db_session)
        assert novos == []

    def test_unlocks_habitos_ativos(self, db_session, test_user, sample_achievements):
        for i in range(5):
            db_session.add(models.Habit(
                user_id=test_user.id,
                nome=f"Habit {i}",
                frequencia_dias=[0],
                data_inicio=date.today(),
                ativo=True,
            ))
        db_session.commit()

        novos = verificar_e_desbloquear(test_user.id, db_session)
        assert "Colecionador" in novos


class TestAchievementsEndpoint:
    def test_list_achievements_empty(self, authenticated_client):
        response = authenticated_client.get("/achievements/")
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 0
        assert data["desbloqueadas"] == 0
        assert data["conquistas"] == []

    def test_list_achievements_with_data(self, authenticated_client, sample_achievements):
        response = authenticated_client.get("/achievements/")
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 3
        assert data["desbloqueadas"] == 0
        assert all(not c["desbloqueada"] for c in data["conquistas"])

    def test_list_achievements_shows_unlocked(
        self, authenticated_client, db_session, test_user, sample_achievements
    ):
        db_session.add(models.UserAchievement(
            user_id=test_user.id,
            achievement_id=sample_achievements[0].id,
        ))
        db_session.commit()

        response = authenticated_client.get("/achievements/")
        data = response.json()
        assert data["desbloqueadas"] == 1
        unlocked = [c for c in data["conquistas"] if c["desbloqueada"]]
        assert len(unlocked) == 1
        assert unlocked[0]["nome"] == "Primeiro Passo"

    def test_list_achievements_unauthenticated(self, client):
        response = client.get("/achievements/")
        assert response.status_code == 401

    def test_create_habit_triggers_achievement(self, authenticated_client, sample_achievements):
        response = authenticated_client.post("/habits/", json={
            "nome": "Trigger Achievement",
            "frequencia_dias": [0, 1, 2, 3, 4, 5, 6],
            "data_inicio": str(date.today()),
        })
        assert response.status_code == 201

        achievements_resp = authenticated_client.get("/achievements/")
        data = achievements_resp.json()
        assert data["desbloqueadas"] == 1
        unlocked = [c for c in data["conquistas"] if c["desbloqueada"]]
        assert unlocked[0]["nome"] == "Primeiro Passo"
