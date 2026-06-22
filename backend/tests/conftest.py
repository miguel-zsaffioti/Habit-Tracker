import os
import sys
import json
from pathlib import Path

os.environ.setdefault("DATABASE_URL", "sqlite:///./test.db")

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import pytest
from sqlalchemy import create_engine, event, String
from sqlalchemy.orm import sessionmaker
from sqlalchemy.types import TypeDecorator
from fastapi.testclient import TestClient

from database import Base, get_db
from main import app
from auth import hash_password, create_access_token, get_current_user
import models


class JSONEncodedList(TypeDecorator):
    """Stores a Python list as JSON text for SQLite compatibility."""
    impl = String
    cache_ok = True

    def process_bind_param(self, value, dialect):
        if value is not None:
            return json.dumps(value)
        return None

    def process_result_value(self, value, dialect):
        if value is not None:
            return json.loads(value)
        return None


# Patch ARRAY column to use JSON-backed list for SQLite
models.Habit.frequencia_dias.property.columns[0].type = JSONEncodedList()

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)


@event.listens_for(engine, "connect")
def _set_sqlite_pragma(dbapi_conn, connection_record):
    cursor = dbapi_conn.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db_session():
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def client(db_session):
    def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture
def test_user(db_session):
    user = models.User(
        name="Test User",
        email="test@example.com",
        hashed_password=hash_password("senha123"),
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def auth_headers(test_user):
    token = create_access_token(data={"sub": test_user.id})
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def authenticated_client(client, db_session, test_user):
    def override_get_current_user():
        return test_user

    app.dependency_overrides[get_current_user] = override_get_current_user
    yield client
    app.dependency_overrides.pop(get_current_user, None)


@pytest.fixture
def sample_achievements(db_session):
    achievements = [
        models.Achievement(
            nome="Primeiro Passo",
            descricao="Crie seu primeiro hábito",
            criterio_tipo="total_habitos",
            criterio_valor=1,
            icone_referencia="star",
        ),
        models.Achievement(
            nome="Consistente",
            descricao="Mantenha um streak de 3 dias",
            criterio_tipo="streak",
            criterio_valor=3,
            icone_referencia="fire",
        ),
        models.Achievement(
            nome="Colecionador",
            descricao="Tenha 5 hábitos ativos",
            criterio_tipo="habitos_ativos",
            criterio_valor=5,
            icone_referencia="medal",
        ),
    ]
    db_session.add_all(achievements)
    db_session.commit()
    for a in achievements:
        db_session.refresh(a)
    return achievements
