from fastapi import APIRouter
from app.database import supabase

router = APIRouter()


@router.get("/daily-challenge")
def get_daily_challenge():

    result = (
        supabase.table("daily_challenges")
        .select("*, problems(*)")
        .execute()
    )

    if not result.data:
        return {
            "message": "No challenge today"
        }

    return result.data[0]