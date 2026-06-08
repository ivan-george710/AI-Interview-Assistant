from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.submission import router as submission_router
from app.routers.leaderboard import router as leaderboard_router
from app.routers.badges import router as badges_router
from app.routers.daily_challenge import router as daily_challenge_router
from app.routers.profile import router as profile_router
from app.routers.rank import router as rank_router
from app.routers.contests import router as contests_router
from app.routers.assessments import router as assessments_router

app = FastAPI(
    title="AI Interview Assistant API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Core Gamification
app.include_router(submission_router)
app.include_router(leaderboard_router)
app.include_router(rank_router)
app.include_router(profile_router)

# Rewards & Progress
app.include_router(badges_router)
app.include_router(daily_challenge_router)

# Competition Features
app.include_router(contests_router)
app.include_router(assessments_router)


@app.get("/")
def root():
    return {
        "status": "running",
        "project": "AI Interview Assistant API",
        "version": "1.0.0"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }