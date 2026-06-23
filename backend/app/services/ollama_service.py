import json
import ollama
import re


def extract_profile(
    resume_text: str
):

    prompt = f"""
Return ONLY valid JSON.

Format:

{{
    "skills": [],
    "education": [],
    "projects": [],
    "experience": []
}}

Resume:

{resume_text}
"""

    response = ollama.chat(
        model="llama3",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    content = response["message"]["content"]

    try:

        match = re.search(
            r"\{.*\}",
            content,
            re.DOTALL
        )

        if match:
            return json.loads(
                match.group()
            )

    except Exception:
        pass

    return {
        "skills": [],
        "education": [],
        "projects": [],
        "experience": []
    }


def extract_job_skills(
    job_description: str
):

    prompt = f"""
Extract technical skills only.

Return ONLY JSON.

{{
    "skills": []
}}

Job Description:

{job_description}
"""

    response = ollama.chat(
        model="llama3",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    content = response["message"]["content"]

    try:

        match = re.search(
            r"\{.*\}",
            content,
            re.DOTALL
        )

        if match:

            data = json.loads(
                match.group()
            )

            skills = []

            for skill in data.get(
                "skills",
                []
            ):

                if isinstance(
                    skill,
                    dict
                ):

                    value = skill.get(
                        "skill",
                        ""
                    )

                    value = str(
                        value
                    ).strip()

                    if (
                        value
                        and value.lower()
                        != "nan"
                    ):
                        skills.append(
                            value
                        )

                else:

                    value = str(
                        skill
                    ).strip()

                    if (
                        value
                        and value.lower()
                        != "nan"
                    ):
                        skills.append(
                            value
                        )

            return list(
                set(skills)
            )

    except Exception as e:

        print(
            "Skill Extraction Error:",
            e
        )

    return []


def generate_learning_plan(
    missing_skills: list
):

    prompt = f"""
Create a practical 4 week learning roadmap.

Missing Skills:
{missing_skills}

Return ONLY valid JSON.

Example:

{{
    "week1": [
        {{
            "title": "Docker Basics",
            "description": "Learn Docker fundamentals"
        }}
    ],
    "week2": [],
    "week3": [],
    "week4": []
}}
"""

    response = ollama.chat(
        model="llama3",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    content = (
        response["message"]["content"]
    )

    print(
        "RAW ROADMAP RESPONSE:"
    )

    print(content)

    try:

        match = re.search(
            r"\{.*\}",
            content,
            re.DOTALL
        )

        if match:

            cleaned = (
                match.group()
                .replace(
                    "\n",
                    " "
                )
                .replace(
                    "\t",
                    " "
                )
            )

            return json.loads(
                cleaned
            )

    except Exception as e:

        print(
            "Roadmap Error:",
            e
        )

    return {
        "week1": [
            {
                "title":
                    "Learn Missing Skills",
                "description":
                    ", ".join(
                        missing_skills
                    )
            }
        ],
        "week2": [],
        "week3": [],
        "week4": []
    }
def generate_interview_questions(
    job_title: str,
    job_description: str
):

    prompt = f"""
Generate interview questions.

Job Title:
{job_title}

Job Description:
{job_description}

Return ONLY valid JSON.

Format:

{{
    "technical": [],
    "behavioral": [],
    "coding": [],
    "system_design": []
}}
"""

    try:

        response = ollama.chat(
            model="llama3",
            format="json",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        content = (
            response["message"]["content"]
        )

        print(
            "INTERVIEW RAW:"
        )

        print(content)

        return json.loads(
            content
        )

    except Exception as e:

        print(
            "Interview Error:",
            e
        )

    return {

        "technical": [
            "What is FastAPI?",
            "Explain async programming in Python",
            "Difference between Flask and Django"
        ],

        "behavioral": [
            "Tell me about yourself",
            "Describe a challenging project"
        ],

        "coding": [
            "Reverse a linked list",
            "Find duplicates in an array"
        ],

        "system_design": [
            "Design a scalable web application"
        ]
    }