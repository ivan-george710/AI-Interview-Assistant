from pydantic import BaseModel

class SubmissionRequest(BaseModel):
    user_id: str
    problem_id: str
