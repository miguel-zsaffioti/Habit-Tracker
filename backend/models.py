from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey, Text, DateTime
from sqlalchemy import ARRAY, UniqueConstraint
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)


class Habit(Base):
    __tablename__ = "habits"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    nome = Column(String(100), nullable=False)
    descricao = Column(Text)
    tipo = Column(String(20), default='desenvolver')
    meta_especifica = Column(String(255))
    frequencia_dias = Column(ARRAY(Integer))
    data_inicio = Column(Date, nullable=False)
    data_fim = Column(Date)
    ativo = Column(Boolean, default=True)
    current_streak = Column(Integer, default=0)
    criado_em = Column(DateTime, default=func.now())


class HabitLog(Base):
    __tablename__ = "habit_logs"

    id = Column(Integer, primary_key=True, index=True)
    habit_id = Column(Integer, ForeignKey("habits.id", ondelete="CASCADE"))
    data_checkin = Column(Date, nullable=False)
    concluido = Column(Boolean, default=True)
    criado_em = Column(DateTime, default=func.now())


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    descricao = Column(Text, nullable=False)
    criterio_tipo = Column(String(50))
    criterio_valor = Column(Integer, nullable=False)
    icone_referencia = Column(String(100))


class UserAchievement(Base):
    __tablename__ = "user_achievements"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    achievement_id = Column(Integer, ForeignKey("achievements.id", ondelete="CASCADE"), primary_key=True)
    data_desbloqueio = Column(DateTime, default=func.now())