from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import get_db
from routers import habits, achievements, auth

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(habits.router)
app.include_router(achievements.router)
app.include_router(auth.router)

# #region agent log
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request as _Req
from starlette.responses import Response as _Resp
import json as _json, time as _time
class _AuthDebugMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: _Req, call_next):
        auth_header = request.headers.get("authorization", "MISSING")
        with open("/app/debug-160669.log", "a") as f:
            f.write(_json.dumps({"sessionId":"160669","hypothesisId":"H1","location":"main.py:middleware","message":"request_headers","data":{"method": request.method, "path": str(request.url.path), "auth_header": auth_header[:40] if auth_header else "NONE", "has_auth": auth_header != "MISSING"},"timestamp":int(_time.time()*1000)})+"\n")
        response = await call_next(request)
        return response
app.add_middleware(_AuthDebugMiddleware)
# #endregion

@app.get("/")
def read_root():
    return {"status": "Backend rodando e aguardando conexões"}

@app.get("/test-db")
def test_db_connection(db: Session = Depends(get_db)):
    return {"mensagem": "BD funcionando"}