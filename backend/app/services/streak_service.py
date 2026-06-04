from datetime import date, timedelta


def update_streak(profile):

    today = date.today()

    current_streak = profile.get("current_streak", 0) or 0
    max_streak = profile.get("max_streak", 0) or 0

    last_activity = profile.get("last_activity_date")

    if last_activity is None:
        current_streak = 1

    else:
        last_date = date.fromisoformat(last_activity)

        if last_date == today:
            return {
                "current_streak": current_streak,
                "max_streak": max_streak,
                "last_activity_date": str(today)
            }

        if last_date == today - timedelta(days=1):
            current_streak += 1

        else:
            current_streak = 1

    max_streak = max(
        max_streak,
        current_streak
    )

    return {
        "current_streak": current_streak,
        "max_streak": max_streak,
        "last_activity_date": str(today)
    }