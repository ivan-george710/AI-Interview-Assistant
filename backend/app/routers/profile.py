from fastapi import APIRouter
from app.database import supabase

router = APIRouter()


@router.get("/profile/{user_id}")
def get_profile(user_id: str):

    result = (
        supabase.table("profiles")
        .select("*")
        .eq("id", user_id)
        .single()
        .execute()
    )

    return result.data