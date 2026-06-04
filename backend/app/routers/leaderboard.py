from fastapi import APIRouter
from app.database import supabase

router = APIRouter()


@router.get("/leaderboard")
def get_leaderboard():

    result = (
        supabase.table("profiles")
        .select("id,full_name,username,xp,rank")
        .order("xp", desc=True)
        .limit(100)
        .execute()
    )

    return result.data