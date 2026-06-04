XP_MAP = {
    "easy": 20,
    "medium": 40,
    "hard": 60
}

def calculate_xp(difficulty: str):
    return XP_MAP.get(
        difficulty.lower(),
        0
    )