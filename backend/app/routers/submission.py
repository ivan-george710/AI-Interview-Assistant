from fastapi import APIRouter
from pydantic import BaseModel

from app.database import supabase
from app.services.xp_service import calculate_xp
from app.services.rank_service import get_rank
from app.services.badge_service import unlock_badges
from app.services.streak_service import update_streak

router = APIRouter()


class SubmissionRequest(BaseModel):
    user_id: str
    problem_id: int


@router.post("/submit")
def submit(data: SubmissionRequest):

    # Get Problem
    problem_result = (
        supabase.table("problems")
        .select("*")
        .eq("id", data.problem_id)
        .execute()
    )

    if not problem_result.data:
        return {
            "success": False,
            "message": "Problem not found"
        }

    problem = problem_result.data[0]

    difficulty = problem["difficulty"]

    xp_earned = calculate_xp(difficulty)

    # Check if Daily Challenge
    daily_result = (
        supabase.table("daily_challenges")
        .select("*")
        .eq("problem_id", data.problem_id)
        .execute()
    )

    bonus_xp = 0

    if daily_result.data:
        bonus_xp = 10

    # Get User Profile
    profile_result = (
        supabase.table("profiles")
        .select("*")
        .eq("id", data.user_id)
        .execute()
    )

    if not profile_result.data:
        return {
            "success": False,
            "message": "User not found"
        }

    profile = profile_result.data[0]

    current_xp = profile.get("xp", 0) or 0

    new_xp = current_xp + xp_earned + bonus_xp

    new_rank = get_rank(new_xp)

    # Update Streak
    streak_data = update_streak(profile)

    # Update Profile
    supabase.table("profiles").update({
        "xp": new_xp,
        "rank": new_rank,
        "current_streak": streak_data["current_streak"],
        "max_streak": streak_data["max_streak"],
        "last_activity_date": streak_data["last_activity_date"]
    }).eq("id", data.user_id).execute()

    # Save Submission
    supabase.table("submissions").insert({
        "user_id": data.user_id,
        "problem_id": data.problem_id,
        "score": 100,
        "xp_earned": xp_earned + bonus_xp,
        "status": "Accepted"
    }).execute()

    # Unlock Badges
    unlocked_badges = unlock_badges(
        data.user_id,
        new_xp
    )

    return {
        "success": True,
        "xpEarned": xp_earned,
        "bonusXP": bonus_xp,
        "totalXP": new_xp,
        "rank": new_rank,
        "currentStreak": streak_data["current_streak"],
        "maxStreak": streak_data["max_streak"],
        "badgesUnlocked": unlocked_badges
    }