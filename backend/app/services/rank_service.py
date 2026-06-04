def get_rank(xp: int):

    if xp >= 3000:
        return "Expert"

    if xp >= 1500:
        return "Interview Ready"

    if xp >= 700:
        return "Problem Solver"

    if xp >= 300:
        return "Explorer"

    if xp >= 100:
        return "Learner"

    return "Beginner"