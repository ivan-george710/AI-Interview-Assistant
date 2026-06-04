from fastapi import APIRouter
from pydantic import BaseModel

from app.database import supabase

router = APIRouter()


class AssessmentStartRequest(BaseModel):
    assessment_id: str
    user_id: str


class AssessmentSubmitRequest(BaseModel):
    assessment_id: str
    user_id: str
    score: int


@router.get("/assessments")
def get_assessments():

    result = (
        supabase.table("assessments")
        .select("*")
        .execute()
    )

    return result.data


@router.post("/assessments/start")
def start_assessment(
    data: AssessmentStartRequest
):

    result = (
        supabase.table("assessment_attempts")
        .insert({
            "assessment_id": data.assessment_id,
            "user_id": data.user_id
        })
        .execute()
    )

    return {
        "success": True,
        "attempt": result.data[0]
    }


@router.post("/assessments/submit")
def submit_assessment(
    data: AssessmentSubmitRequest
):

    (
        supabase.table("assessment_attempts")
        .update({
            "score": data.score,
            "completed_at": "now()"
        })
        .eq("assessment_id", data.assessment_id)
        .eq("user_id", data.user_id)
        .execute()
    )

    return {
        "success": True,
        "message": "Assessment submitted"
    }


@router.get("/assessments/{assessment_id}/leaderboard")
def assessment_leaderboard(
    assessment_id: str
):

    result = (
        supabase.table("assessment_attempts")
        .select("*")
        .eq("assessment_id", assessment_id)
        .order("score", desc=True)
        .execute()
    )

    return result.data