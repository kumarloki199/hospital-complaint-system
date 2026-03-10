from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.complaint_routes import router as complaint_router
from app.api.doctor_routes import router as doctor_router
from app.database.db import init_db


app = FastAPI(title="Hospital Complaint Handling System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    init_db()


@app.get("/")
def health_check() -> dict[str, str]:
    return {"message": "Hospital Complaint Handling System API is running"}


app.include_router(complaint_router)
app.include_router(doctor_router)
