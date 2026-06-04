from fastapi import APIRouter
from app.database import supabase

router = APIRouter()


@router.get("/rank/{user_id}")
def get_rank_position(user_id: str):

    result = (
        supabase.table("profiles")
        .select("id, xp, rank")
        .order("xp", desc=True)
        .execute()
    )

    users = result.data

    for index, user in enumerate(users, start=1):

        if user["id"] == user_id:

            return {
                "position": index,
                "xp": user["xp"],
                "rank": user["rank"]
            }

    return {
        "position": None
    }