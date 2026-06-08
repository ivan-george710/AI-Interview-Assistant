from fastapi import APIRouter
from pydantic import BaseModel

from app.database import supabase

router = APIRouter()


class ContestRegistrationRequest(BaseModel):
    contest_id: str
    user_id: str


class ContestSubmissionRequest(BaseModel):
    contest_id: str
    user_id: str
    score: int


@router.get("/contests")
def get_contests():

    result = (
        supabase.table("contests")
        .select("*")
        .order("start_time")
        .execute()
    )

    return result.data


@router.get("/contests/{contest_id}")
def get_contest(contest_id: str):

    result = (
        supabase.table("contests")
        .select("*")
        .eq("id", contest_id)
        .single()
        .execute()
    )

    return result.data


@router.post("/contests/register")
def register_for_contest(
    data: ContestRegistrationRequest
):

    existing = (
        supabase.table("contest_registrations")
        .select("*")
        .eq("contest_id", data.contest_id)
        .eq("user_id", data.user_id)
        .execute()
    )

    if existing.data:
        return {
            "success": False,
            "message": "Already registered"
        }

    supabase.table(
        "contest_registrations"
    ).insert({
        "contest_id": data.contest_id,
        "user_id": data.user_id
    }).execute()

    return {
        "success": True,
        "message": "Registration successful"
    }


@router.post("/contests/submit")
def submit_contest_score(
    data: ContestSubmissionRequest
):

    supabase.table(
        "contest_submissions"
    ).insert({
        "contest_id": data.contest_id,
        "user_id": data.user_id,
        "score": data.score
    }).execute()

    return {
        "success": True,
        "message": "Contest submission saved"
    }


@router.get("/contests/{contest_id}/leaderboard")
def contest_leaderboard(contest_id: str):

    result = (
        supabase.table("contest_submissions")
        .select("*")
        .eq("contest_id", contest_id)
        .order("score", desc=True)
        .execute()
    )

    return result.data