@router.get("/admin/stats")
def get_admin_stats():

    users = (
        supabase.table("profiles")
        .select("*", count="exact")
        .execute()
    )

    questions = (
        supabase.table("questions")
        .select("*", count="exact")
        .execute()
    )

    contests = (
        supabase.table("contests")
        .select("*", count="exact")
        .execute()
    )

    reports = (
        supabase.table("reports")
        .select("*", count="exact")
        .execute()
    )

    assessments = (
        supabase.table("assessments")
        .select("*", count="exact")
        .execute()
    )

    return {
        "users": users.count or 0,
        "questions": questions.count or 0,
        "contests": contests.count or 0,
        "reports": reports.count or 0,
        "assessments": assessments.count or 0
    }