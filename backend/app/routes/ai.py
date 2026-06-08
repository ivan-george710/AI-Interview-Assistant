from fastapi import APIRouter
from pydantic import BaseModel
from ollama import chat

router = APIRouter(prefix="/api/ai", tags=["AI"])


class ReviewRequest(BaseModel):
    questionTitle: str
    questionDescription: str
    userCode: str
    language: str


class HintRequest(BaseModel):
    questionTitle: str
    questionDescription: str
    language: str


@router.post("/hint")
async def generate_hint(data: HintRequest):

    prompt = f"""
You are an interview coach.

Problem:
{data.questionTitle}

Description:
{data.questionDescription}

Give ONE useful hint.

Rules:
- No code
- No full solution
- Only guide the student
"""

    response = chat(
        model="qwen2.5-coder:1.5b",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return {
        "hint": response["message"]["content"]
    }


@router.post("/review")
async def review_code(data: ReviewRequest):

    prompt = f"""
Review this coding interview solution.

Problem:
{data.questionTitle}

Description:
{data.questionDescription}

Language:
{data.language}

Code:
{data.userCode}

Evaluate:

1. Correctness
2. Time Complexity
3. Space Complexity
4. Edge Cases
5. Improvements

Keep feedback concise.
"""

    response = chat(
        model="qwen2.5-coder:1.5b",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return {
        "review": response["message"]["content"]
    }