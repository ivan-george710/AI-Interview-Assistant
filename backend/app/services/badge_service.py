from app.database import supabase


def unlock_badges(user_id, xp):

    unlocked = []

    badge_rules = [
        ("100 XP", 100),
        ("500 XP", 500)
    ]

    for badge_name, threshold in badge_rules:

        if xp < threshold:
            continue

        badge = (
            supabase.table("badges")
            .select("*")
            .eq("name", badge_name)
            .execute()
        )

        if not badge.data:
            continue

        badge_id = badge.data[0]["id"]

        existing = (
            supabase.table("user_badges")
            .select("*")
            .eq("user_id", user_id)
            .eq("badge_id", badge_id)
            .execute()
        )

        if existing.data:
            continue

        supabase.table("user_badges").insert({
            "user_id": user_id,
            "badge_id": badge_id
        }).execute()

        unlocked.append(badge_name)

    return unlocked