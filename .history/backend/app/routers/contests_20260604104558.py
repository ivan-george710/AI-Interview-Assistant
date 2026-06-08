from fastapi import APIRouter
from pydantic import BaseModel

from app.database import supabase

router = APIRouter()


class ContestCreateRequest(BaseModel):
    title: str
    description: str
    start_time: str
    end_time: str


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


@router.post("/contests")
def create_contest(
    data: ContestCreateRequest,
    admin_id: str
):

    profile = (
        supabase.table("profiles")
        .select("role")
        .eq("id", admin_id)
        .single()
        .execute()
    )

    if not profile.data:
        return {
            "success": False,
            "message": "User not found"
        }

    if profile.data["role"] != "admin":
        return {
            "success": False,
            "message": "Unauthorized"
        }

    result = (
        supabase.table("contests")
        .insert({
            "title": data.title,
            "description": data.description,
            "start_time": data.start_time,
            "end_time": data.end_time
        })
        .execute()
    )

    return {
        "success": True,
        "message": "Contest created successfully",
        "contest": result.data[0]
    }


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


@router.get("/contests/user/{user_id}")
def get_user_contests(user_id: str):

    result = (
        supabase.table("contest_registrations")
        .select("""
            *,
            contests(*)
        """)
        .eq("user_id", user_id)
        .execute()
    )

    return result.data