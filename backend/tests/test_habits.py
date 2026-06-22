import pytest
from datetime import date, timedelta


class TestCreateHabit:
    def test_create_habit_success(self, authenticated_client):
        response = authenticated_client.post("/habits/", json={
            "nome": "Exercício",
            "descricao": "Fazer 30 min de exercício",
            "tipo": "desenvolver",
            "frequencia_dias": [0, 1, 2, 3, 4],
            "data_inicio": str(date.today()),
        })
        assert response.status_code == 201
        data = response.json()
        assert data["nome"] == "Exercício"
        assert data["ativo"] is True
        assert data["current_streak"] == 0
        assert data["frequencia_dias"] == [0, 1, 2, 3, 4]

    def test_create_habit_minimal_fields(self, authenticated_client):
        response = authenticated_client.post("/habits/", json={
            "nome": "Leitura",
            "frequencia_dias": [0, 2, 4],
            "data_inicio": str(date.today()),
        })
        assert response.status_code == 201
        data = response.json()
        assert data["nome"] == "Leitura"
        assert data["tipo"] == "desenvolver"
        assert data["descricao"] is None

    def test_create_habit_unauthenticated(self, client):
        response = client.post("/habits/", json={
            "nome": "Sem Auth",
            "frequencia_dias": [0],
            "data_inicio": str(date.today()),
        })
        assert response.status_code == 401

    def test_create_habit_missing_required_fields(self, authenticated_client):
        response = authenticated_client.post("/habits/", json={
            "descricao": "Sem nome",
        })
        assert response.status_code == 422


class TestListHabits:
    def test_list_habits_empty(self, authenticated_client):
        response = authenticated_client.get("/habits/")
        assert response.status_code == 200
        assert response.json() == []

    def test_list_habits_returns_user_habits(self, authenticated_client):
        authenticated_client.post("/habits/", json={
            "nome": "Habit 1",
            "frequencia_dias": [0, 1, 2],
            "data_inicio": str(date.today()),
        })
        authenticated_client.post("/habits/", json={
            "nome": "Habit 2",
            "frequencia_dias": [3, 4],
            "data_inicio": str(date.today()),
        })

        response = authenticated_client.get("/habits/")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        names = [h["nome"] for h in data]
        assert "Habit 1" in names
        assert "Habit 2" in names

    def test_list_habits_unauthenticated(self, client):
        response = client.get("/habits/")
        assert response.status_code == 401


class TestTodayHabits:
    def test_today_habits_filters_by_weekday(self, authenticated_client):
        hoje = date.today()
        dia_semana = hoje.weekday()
        outro_dia = (dia_semana + 1) % 7

        authenticated_client.post("/habits/", json={
            "nome": "Habit Hoje",
            "frequencia_dias": [dia_semana],
            "data_inicio": str(hoje),
        })
        authenticated_client.post("/habits/", json={
            "nome": "Habit Outro Dia",
            "frequencia_dias": [outro_dia],
            "data_inicio": str(hoje),
        })

        response = authenticated_client.get("/habits/today")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["habito"]["nome"] == "Habit Hoje"
        assert data[0]["feito_hoje"] is False

    def test_today_habits_excludes_future_start(self, authenticated_client):
        hoje = date.today()
        dia_semana = hoje.weekday()
        futuro = hoje + timedelta(days=7)

        authenticated_client.post("/habits/", json={
            "nome": "Habit Futuro",
            "frequencia_dias": [dia_semana],
            "data_inicio": str(futuro),
        })

        response = authenticated_client.get("/habits/today")
        assert response.status_code == 200
        assert response.json() == []


class TestHabitDetail:
    def test_habit_detail_success(self, authenticated_client):
        create_resp = authenticated_client.post("/habits/", json={
            "nome": "Meditação",
            "frequencia_dias": [0, 1, 2, 3, 4, 5, 6],
            "data_inicio": str(date.today()),
        })
        habit_id = create_resp.json()["id"]

        response = authenticated_client.get(f"/habits/{habit_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["detalhes"]["nome"] == "Meditação"
        assert data["datas_concluidas"] == []

    def test_habit_detail_not_found(self, authenticated_client):
        response = authenticated_client.get("/habits/9999")
        assert response.status_code == 404

    def test_habit_detail_other_user(self, authenticated_client, db_session, test_user):
        import models
        from auth import hash_password

        other_user = models.User(
            name="Other",
            email="other@example.com",
            hashed_password=hash_password("senha123"),
        )
        db_session.add(other_user)
        db_session.commit()
        db_session.refresh(other_user)

        habit = models.Habit(
            user_id=other_user.id,
            nome="Habit Alheio",
            frequencia_dias=[0],
            data_inicio=date.today(),
        )
        db_session.add(habit)
        db_session.commit()
        db_session.refresh(habit)

        response = authenticated_client.get(f"/habits/{habit.id}")
        assert response.status_code == 404


class TestCheckin:
    def test_checkin_success(self, authenticated_client):
        create_resp = authenticated_client.post("/habits/", json={
            "nome": "Exercício",
            "frequencia_dias": [0, 1, 2, 3, 4, 5, 6],
            "data_inicio": str(date.today()),
        })
        habit_id = create_resp.json()["id"]

        response = authenticated_client.post(
            f"/habits/{habit_id}/checkin",
            json={"data_checkin": str(date.today())},
        )
        assert response.status_code == 200
        data = response.json()
        assert "sucesso" in data["mensagem"]

    def test_checkin_toggle_removes(self, authenticated_client):
        create_resp = authenticated_client.post("/habits/", json={
            "nome": "Toggle Test",
            "frequencia_dias": [0, 1, 2, 3, 4, 5, 6],
            "data_inicio": str(date.today()),
        })
        habit_id = create_resp.json()["id"]
        checkin_payload = {"data_checkin": str(date.today())}

        authenticated_client.post(f"/habits/{habit_id}/checkin", json=checkin_payload)
        response = authenticated_client.post(f"/habits/{habit_id}/checkin", json=checkin_payload)

        assert response.status_code == 200
        assert "removido" in response.json()["mensagem"]

    def test_checkin_nonexistent_habit(self, authenticated_client):
        response = authenticated_client.post(
            "/habits/9999/checkin",
            json={"data_checkin": str(date.today())},
        )
        assert response.status_code == 404

    def test_checkin_shows_in_detail(self, authenticated_client):
        create_resp = authenticated_client.post("/habits/", json={
            "nome": "Detail Check",
            "frequencia_dias": [0, 1, 2, 3, 4, 5, 6],
            "data_inicio": str(date.today()),
        })
        habit_id = create_resp.json()["id"]
        hoje = str(date.today())

        authenticated_client.post(f"/habits/{habit_id}/checkin", json={"data_checkin": hoje})

        detail = authenticated_client.get(f"/habits/{habit_id}")
        assert hoje in detail.json()["datas_concluidas"]

    def test_checkin_marks_today_as_done(self, authenticated_client):
        hoje = date.today()
        dia_semana = hoje.weekday()

        create_resp = authenticated_client.post("/habits/", json={
            "nome": "Today Done",
            "frequencia_dias": [dia_semana],
            "data_inicio": str(hoje),
        })
        habit_id = create_resp.json()["id"]

        authenticated_client.post(
            f"/habits/{habit_id}/checkin",
            json={"data_checkin": str(hoje)},
        )

        today_resp = authenticated_client.get("/habits/today")
        habits_today = today_resp.json()
        assert len(habits_today) == 1
        assert habits_today[0]["feito_hoje"] is True
