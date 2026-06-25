from pydantic import BaseModel, EmailStr
from datetime import date
from typing import List, Optional


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    data_nascimento: Optional[date] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    data_nascimento: Optional[date] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    user: UserResponse

class HabitBase(BaseModel):
    nome: str
    descricao: Optional[str] = None
    tipo: str = 'desenvolver'
    meta_especifica: Optional[str] = None
    frequencia_dias: List[int]
    data_inicio: date
    data_fim: Optional[date] = None

class HabitCreate(HabitBase):
    pass

class HabitResponse(HabitBase):
    id: int
    user_id: int
    ativo: bool
    current_streak: int
    
    class Config:
        from_attributes = True

class HabitCheckin(BaseModel):
    data_checkin: date