from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import extract
from datetime import date
from typing import List

import models
import schemas
from database import get_db

router = APIRouter(
    prefix="/habits",
    tags=["habits"]
)

# ==========================================
# DEPENDENCIA MOCK (Substitua por PyJWT depois)
# ==========================================
def get_current_user_id():
    return 1

@router.post("/", response_model=schemas.HabitResponse, status_code=status.HTTP_201_CREATED)
def criar_habito(
    habit_in: schemas.HabitCreate, 
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    novo_habito = models.Habit(**habit_in.model_dump(), user_id=user_id)
    db.add(novo_habito)
    db.commit()
    db.refresh(novo_habito)
    return novo_habito

@router.get("/", response_model=List[schemas.HabitResponse])
def listar_todos_habitos(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    habitos = db.query(models.Habit).filter(
        models.Habit.user_id == user_id, 
        models.Habit.ativo == True
    ).all()
    return habitos

@router.get("/today")
def listar_habitos_de_hoje(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    hoje = date.today()
    dia_da_semana = hoje.weekday()
    
    habitos = db.query(models.Habit).filter(
        models.Habit.user_id == user_id,
        models.Habit.ativo == True,
        models.Habit.data_inicio <= hoje
    ).all()

    resultado = []
    for hab in habitos:
        if dia_da_semana in hab.frequencia_dias:
            checkin_hoje = db.query(models.HabitLog).filter(
                models.HabitLog.habit_id == hab.id,
                models.HabitLog.data_checkin == hoje
            ).first()
            
            resultado.append({
                "habito": hab,
                "feito_hoje": checkin_hoje is not None
            })
            
    return resultado

@router.get("/{habit_id}")
def detalhe_do_habito(
    habit_id: int, 
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    habito = db.query(models.Habit).filter(
        models.Habit.id == habit_id, 
        models.Habit.user_id == user_id
    ).first()
    
    if not habito:
        raise HTTPException(status_code=404, detail="Hábito não encontrado")
        
    logs = db.query(models.HabitLog.data_checkin).filter(
        models.HabitLog.habit_id == habit_id
    ).all()
    
    datas_concluidas = [log[0] for log in logs]
    
    return {
        "detalhes": habito,
        "datas_concluidas": datas_concluidas
    }

@router.post("/{habit_id}/checkin")
def fazer_checkin(
    habit_id: int, 
    checkin_data: schemas.HabitCheckin,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    habito = db.query(models.Habit).filter(
        models.Habit.id == habit_id, 
        models.Habit.user_id == user_id
    ).first()
    
    if not habito:
        raise HTTPException(status_code=404, detail="Hábito não encontrado")

    log_existente = db.query(models.HabitLog).filter(
        models.HabitLog.habit_id == habit_id,
        models.HabitLog.data_checkin == checkin_data.data_checkin
    ).first()

    if log_existente:
        db.delete(log_existente)
        mensagem = "Check-in removido com sucesso."
    else:
        novo_log = models.HabitLog(
            habit_id=habit_id, 
            data_checkin=checkin_data.data_checkin,
            concluido=True
        )
        db.add(novo_log)
        mensagem = "Check-in realizado com sucesso!"
    
    db.commit()
    return {"mensagem": mensagem}