from fastapi import APIRouter, HTTPException

from app.database import supabase
from app.schemas.submission import SubmissionRequest
from app.services.xp_service import calculate_xp
from app.services.rank_service import get_rank
from app.services.badge_service import unlock_badges
from app.services.streak_service import update_streak

router = APIRouter()


@router.post("/submit")
def submit(data: SubmissionRequest):

    question_result = (
        supabase.table("questions")
        .select("*")
        .eq("id", data.problem_id)
        .execute()
    )

    if not question_result.data:
        raise HTTPException(
            status_code=404,
            detail="Question not found"
        )

    question = question_result.data[0]

    difficulty = question.get(
        "difficulty",
        "easy"
    )

    xp_earned = calculate_xp(difficulty)

    bonus_xp = 0

    try:
        daily_result = (
            supabase.table("daily_challenges")
            .select("*")
            .eq("problem_id", data.problem_id)
            .execute()
        )

        if daily_result.data:
            bonus_xp = 10

    except Exception:
        bonus_xp = 0

    profile_result = (
        supabase.table("profiles")
        .select("*")
        .eq("id", data.user_id)
        .execute()
    )

    if not profile_result.data:
        raise HTTPException(
            status_code=404,
            detail="Profile not found"
        )

    profile = profile_result.data[0]

    current_xp = profile.get("xp", 0) or 0

    new_xp = (
        current_xp
        + xp_earned
        + bonus_xp
    )

    new_rank = get_rank(new_xp)

    streak_data = update_streak(profile)

    # Save submission
    supabase.table("submissions").insert({
        "user_id": data.user_id,
        "problem_id": data.problem_id,
        "score": 100,
        "xp_earned": xp_earned + bonus_xp,
        "status": "Accepted"
    }).execute()

    # Update profile
    supabase.table("profiles").update({
        "xp": new_xp,
        "rank": new_rank,
        "current_streak": streak_data["current_streak"],
        "max_streak": streak_data["max_streak"],
        "last_activity_date": streak_data["last_activity_date"]
    }).eq(
        "id",
        data.user_id
    ).execute()

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