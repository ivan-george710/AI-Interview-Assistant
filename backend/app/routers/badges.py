from fastapi import APIRouter
from app.database import supabase

router = APIRouter()


@router.get("/badges/{user_id}")
def get_badges(user_id: str):

    result = (
        supabase.table("user_badges")
        .select("*, badges(*)")
        .eq("user_id", user_id)
        .execute()
    )

    return result.data