from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date, timedelta

import models
from database import get_db

router = APIRouter(
    prefix="/achievements",
    tags=["achievements"]
)

# ==========================================
# DEPENDENCIA MOCK (igual ao habits.py)
# ==========================================
def get_current_user_id():
    return 1



def calcular_streak(habit_id: int, db: Session) -> int:
    """Calcula quantos dias consecutivos até hoje o hábito foi concluído."""
    logs = (
        db.query(models.HabitLog.data_checkin)
        .filter(models.HabitLog.habit_id == habit_id)
        .order_by(models.HabitLog.data_checkin.desc())
        .all()
    )

    streak = 0
    esperado = date.today()
    for (data_log,) in logs:
        if data_log == esperado:
            streak += 1
            esperado -= timedelta(days=1)
        else:
            break
    return streak


def verificar_e_desbloquear(user_id: int, db: Session) -> list[str]:
    """
    Verifica todas as conquistas e desbloqueia as que o usuário
    ainda não tem mas já merece. Retorna os nomes das novas conquistas.
    Chamada sempre que o usuário faz um checkin.
    """
    todas = db.query(models.Achievement).all()

    ja_desbloqueadas = {
        ua.achievement_id
        for ua in db.query(models.UserAchievement)
        .filter(models.UserAchievement.user_id == user_id)
        .all()
    }

    # Métricas do usuário
    habitos = db.query(models.Habit).filter_by(user_id=user_id).all()
    total_habitos = len(habitos)
    habitos_ativos = sum(1 for h in habitos if h.ativo)
    max_streak = max((calcular_streak(h.id, db) for h in habitos), default=0)

    novos = []
    for conquista in todas:
        if conquista.id in ja_desbloqueadas:
            continue

        deve_desbloquear = False
        ct = conquista.criterio_tipo
        cv = conquista.criterio_valor

        if ct == "streak" and max_streak >= cv:
            deve_desbloquear = True
        elif ct == "total_habitos" and total_habitos >= cv:
            deve_desbloquear = True
        elif ct == "habitos_ativos" and habitos_ativos >= cv:
            deve_desbloquear = True

        if deve_desbloquear:
            db.add(models.UserAchievement(
                user_id=user_id,
                achievement_id=conquista.id
            ))
            novos.append(conquista.nome)

    db.commit()
    return novos


@router.get("/")
def listar_conquistas(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """
    Retorna todas as conquistas do sistema, indicando quais
    o usuário já desbloqueou e quantas faltam.
    """
    todas = db.query(models.Achievement).all()

    desbloqueadas_ids = {
        ua.achievement_id
        for ua in db.query(models.UserAchievement)
        .filter(models.UserAchievement.user_id == user_id)
        .all()
    }

    conquistas = [
        {
            "id": a.id,
            "nome": a.nome,
            "descricao": a.descricao,
            "icone_referencia": a.icone_referencia,
            "desbloqueada": a.id in desbloqueadas_ids,
        }
        for a in todas
    ]

    return {
        "total": len(todas),
        "desbloqueadas": len(desbloqueadas_ids),
        "conquistas": conquistas,
    }