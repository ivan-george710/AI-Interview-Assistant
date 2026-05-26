from fastapi import FastAPI
from backend.app.api.routes.health import router as health_router

app = FastAPI(
    title="My API",
    version="1.0.0"
)

app.include_router(health_router)

@app.get("/")
def root():
    return {
        "message": "Backend running"
    }