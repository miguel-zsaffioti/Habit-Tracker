from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
import logging

import models
import schemas
from auth import hash_password, verify_password, create_access_token
from database import get_db

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)


@router.post("/register", response_model=schemas.Token, status_code=status.HTTP_201_CREATED)
def registrar(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    logger.info("REGISTER body: name=%s email=%s data_nascimento=%s", user_in.name, user_in.email, user_in.data_nascimento)
    if db.query(models.User).filter(models.User.email == user_in.email).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="E-mail já cadastrado",
        )

    novo_usuario = models.User(
        name=user_in.name,
        email=user_in.email,
        hashed_password=hash_password(user_in.password),
        data_nascimento=user_in.data_nascimento,
    )
    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)

    token = create_access_token(data={"sub": str(novo_usuario.id)})

    return schemas.Token(
        access_token=token,
        user=schemas.UserResponse.model_validate(novo_usuario),
    )


@router.post("/login", response_model=schemas.Token)
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == credentials.email).first()

    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos",
        )

    token = create_access_token(data={"sub": str(user.id)})

    return schemas.Token(
        access_token=token,
        user=schemas.UserResponse.model_validate(user),
    )
