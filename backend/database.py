from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Formato da URL: postgresql://usuario:senha@host:porta/nome_do_banco
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:sua_senha_aqui@db:5432/doit_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()