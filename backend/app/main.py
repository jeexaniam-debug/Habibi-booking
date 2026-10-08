from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database.database import Base, engine
from .database import models
from .routers import services, auth, admin, bookings

Base.metadata.create_all(bind=engine)


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(services.router)
app.include_router(auth.router)

app.include_router(admin.router)
app.include_router(bookings.router)


@app.get("/")
def home():
    return {"message": "Hello from Service Booking Backend!"}


@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "message": "Backend is running"
    }