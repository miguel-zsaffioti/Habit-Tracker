from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import get_db
from routers import habits, achievements

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(habits.router)
app.include_router(achievements.router)

@app.get("/")
def read_root():
    return {"status": "Backend rodando e aguardando conexões"}

@app.get("/test-db")
def test_db_connection(db: Session = Depends(get_db)):
    return {"mensagem": "BD funcionando"}