import pytest


class TestRegister:
    def test_register_success(self, client):
        response = client.post("/auth/register", json={
            "name": "Novo User",
            "email": "novo@example.com",
            "password": "senha123",
        })
        assert response.status_code == 201
        data = response.json()
        assert "access_token" in data
        assert data["user"]["name"] == "Novo User"
        assert data["user"]["email"] == "novo@example.com"

    def test_register_with_birth_date(self, client):
        response = client.post("/auth/register", json={
            "name": "User Com Data",
            "email": "data@example.com",
            "password": "senha123",
            "data_nascimento": "2000-01-15",
        })
        assert response.status_code == 201
        data = response.json()
        assert data["user"]["data_nascimento"] == "2000-01-15"

    def test_register_duplicate_email(self, client, test_user):
        response = client.post("/auth/register", json={
            "name": "Outro User",
            "email": "test@example.com",
            "password": "outrasenha",
        })
        assert response.status_code == 409
        assert "já cadastrado" in response.json()["detail"]

    def test_register_invalid_email(self, client):
        response = client.post("/auth/register", json={
            "name": "User",
            "email": "nao-e-email",
            "password": "senha123",
        })
        assert response.status_code == 422

    def test_register_missing_fields(self, client):
        response = client.post("/auth/register", json={
            "email": "only@email.com",
        })
        assert response.status_code == 422


class TestLogin:
    def test_login_success(self, client, test_user):
        response = client.post("/auth/login", json={
            "email": "test@example.com",
            "password": "senha123",
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["user"]["email"] == "test@example.com"
        assert data["user"]["id"] == test_user.id

    def test_login_wrong_password(self, client, test_user):
        response = client.post("/auth/login", json={
            "email": "test@example.com",
            "password": "senhaerrada",
        })
        assert response.status_code == 401
        assert "incorretos" in response.json()["detail"]

    def test_login_nonexistent_email(self, client):
        response = client.post("/auth/login", json={
            "email": "naoexiste@example.com",
            "password": "senha123",
        })
        assert response.status_code == 401

    def test_login_invalid_email_format(self, client):
        response = client.post("/auth/login", json={
            "email": "invalido",
            "password": "senha123",
        })
        assert response.status_code == 422
