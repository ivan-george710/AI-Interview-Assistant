from fastapi import APIRouter
from pydantic import BaseModel

from app.database import supabase

from app.services.resume_parser import (
    extract_resume_text
)

from app.services.ollama_service import (
    extract_profile,
    extract_job_skills,
    generate_learning_plan,
    generate_interview_questions
)

from app.services.job_service import (
    search_real_jobs
)

import requests
import tempfile
import os

router = APIRouter()


class JobSearchRequest(
    BaseModel
):
    keywords: str
    location: str = "India"


def flatten_resume_skills(
    skills_data
):

    skills = set()

    if not skills_data:
        return skills

    for section in skills_data:

        if isinstance(
            section,
            dict
        ):

            for value in (
                section.values()
            ):

                if isinstance(
                    value,
                    list
                ):

                    for skill in value:

                        skills.add(
                            str(skill)
                            .strip()
                            .lower()
                        )

                else:

                    skills.add(
                        str(value)
                        .strip()
                        .lower()
                    )

        elif isinstance(
            section,
            list
        ):

            for skill in section:

                skills.add(
                    str(skill)
                    .strip()
                    .lower()
                )

        else:

            skills.add(
                str(section)
                .strip()
                .lower()
            )

    return skills


@router.post(
    "/jobs/build-profile/{user_id}"
)
def build_profile(
    user_id: str
):

    resume = (
        supabase.table(
            "resumes"
        )
        .select("*")
        .eq(
            "user_id",
            user_id
        )
        .order(
            "created_at",
            desc=True
        )
        .limit(1)
        .execute()
    )

    if not resume.data:

        return {
            "success": False,
            "message":
                "Resume not found"
        }

    resume_data = (
        resume.data[0]
    )

    file_url = (
        resume_data["file_url"]
    )

    response = requests.get(
        file_url
    )

    if response.status_code != 200:

        return {
            "success": False,
            "message":
                "Failed to download resume"
        }

    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".pdf"
    ) as temp_file:

        temp_file.write(
            response.content
        )

        temp_path = (
            temp_file.name
        )

    try:

        resume_text = (
            extract_resume_text(
                temp_path
            )
        )

        profile = (
            extract_profile(
                resume_text
            )
        )

        supabase.table(
            "resume_profiles"
        ).upsert({

            "user_id":
                user_id,

            "skills":
                profile.get(
                    "skills",
                    []
                ),

            "education":
                profile.get(
                    "education",
                    []
                ),

            "projects":
                profile.get(
                    "projects",
                    []
                ),

            "experience":
                profile.get(
                    "experience",
                    []
                ),

            "raw_text":
                resume_text

        }).execute()

        return {
            "success": True,
            "profile":
                profile
        }

    finally:

        if os.path.exists(
            temp_path
        ):
            os.remove(
                temp_path
            )


@router.post(
    "/jobs/search"
)
def search_jobs(
    data: JobSearchRequest
):

    jobs = search_real_jobs(
        data.keywords,
        data.location
    )

    saved_count = 0

    for job in jobs:

        try:

            existing = (
                supabase.table(
                    "jobs"
                )
                .select("id")
                .eq(
                    "title",
                    str(
                        job.get(
                            "title",
                            ""
                        )
                    )
                )
                .eq(
                    "company",
                    str(
                        job.get(
                            "company",
                            ""
                        )
                    )
                )
                .execute()
            )

            if existing.data:
                continue

            job_skills = (
                extract_job_skills(
                    str(
                        job.get(
                            "description",
                            ""
                        )
                    )
                )
            )

            if not job_skills:

                title = str(
                    job.get(
                        "title",
                        ""
                    )
                ).lower()

                fallback = []

                if "python" in title:
                    fallback.append(
                        "Python"
                    )

                if "django" in title:
                    fallback.append(
                        "Django"
                    )

                if "flask" in title:
                    fallback.append(
                        "Flask"
                    )

                if "fastapi" in title:
                    fallback.append(
                        "FastAPI"
                    )

                if "aws" in title:
                    fallback.append(
                        "AWS"
                    )

                if "devops" in title:
                    fallback.append(
                        "Docker"
                    )

                if "backend" in title:
                    fallback.append(
                        "Backend Development"
                    )

                if "react" in title:
                    fallback.append(
                        "React"
                    )

                if "fullstack" in title:
                    fallback.append(
                        "Full Stack Development"
                    )

                if "javascript" in title:
                    fallback.append(
                        "JavaScript"
                    )

                if "java" in title:
                    fallback.append(
                        "Java"
                    )

                if "sql" in title:
                    fallback.append(
                        "SQL"
                    )

                if "ai" in title:
                    fallback.append(
                        "Artificial Intelligence"
                    )

                job_skills = fallback

            print(
                f"Job: {job.get('title')}"
            )
            print(
                f"Skills: {job_skills}"
            )
            print(
                "------------------------"
            )

            supabase.table(
                "jobs"
            ).insert({

                "source":
                    str(
                        job.get(
                            "site",
                            ""
                        )
                    ),

                "title":
                    str(
                        job.get(
                            "title",
                            ""
                        )
                    ),

                "company":
                    str(
                        job.get(
                            "company",
                            ""
                        )
                    ),

                "location":
                    str(
                        job.get(
                            "location",
                            ""
                        )
                    ),

                "description":
                    str(
                        job.get(
                            "description",
                            ""
                        )
                    ),

                "salary":
                    str(
                        job.get(
                            "salary_source",
                            ""
                        )
                    ),

                "apply_url":
                    str(
                        job.get(
                            "job_url",
                            ""
                        )
                    ),

                "skills":
                    job_skills

            }).execute()

            saved_count += 1

        except Exception as e:

            print(
                f"ERROR: {e}"
            )

    return {
        "success": True,
        "jobs_found":
            len(jobs),
        "saved":
            saved_count
    }
@router.post(
    "/jobs/match/{user_id}"
)
def match_jobs(
    user_id: str
):

    profile = (
        supabase.table(
            "resume_profiles"
        )
        .select("*")
        .eq(
            "user_id",
            user_id
        )
        .single()
        .execute()
    )

    if not profile.data:

        return {
            "success": False,
            "message":
                "Profile not found"
        }

    resume_skills = (
        flatten_resume_skills(
            profile.data.get(
                "skills",
                []
            )
        )
    )

    jobs_result = (
        supabase.table(
            "jobs"
        )
        .select("*")
        .execute()
    )

    jobs = (
        jobs_result.data
        or []
    )

    results = []

    for job in jobs:

        raw_skills = (
            job.get(
                "skills",
                []
            )
            or []
        )

        job_skills = set()

        for skill in raw_skills:

            if isinstance(
                skill,
                dict
            ):

                skill_name = (
                    skill.get(
                        "skill",
                        ""
                    )
                )

                if skill_name:

                    job_skills.add(
                        str(
                            skill_name
                        )
                        .strip()
                        .lower()
                    )

            else:

                job_skills.add(
                    str(skill)
                    .strip()
                    .lower()
                )

        if not job_skills:
            continue

        if len(job_skills) < 3:
            continue

        matched_skills = sorted(
            list(
                resume_skills.intersection(
                    job_skills
                )
            )
        )

        missing_skills = sorted(
            list(
                job_skills -
                resume_skills
            )
        )

        matched_count = len(
            matched_skills
        )

        missing_count = len(
            missing_skills
        )

        score = int(
            (
                matched_count
                /
                (
                    matched_count
                    + missing_count
                    + 2
                )
            ) * 100
        )

        strengths = (
            matched_skills[:10]
        )

        missing = (
            missing_skills[:10]
        )

        try:

            supabase.table(
                "job_matches"
            ).upsert({

                "user_id":
                    user_id,

                "job_id":
                    job["id"],

                "match_score":
                    score,

                "strengths":
                    strengths,

                "missing_skills":
                    missing

            }).execute()

        except Exception as e:

            print(e)

        results.append({

            "job":
                job["title"],

            "company":
                job["company"],

            "score":
                score,

            "strengths":
                strengths,

            "missing_skills":
                missing

        })

    return {
        "success": True,
        "total_jobs":
            len(results),
        "matches":
            sorted(
                results,
                key=lambda x:
                x["score"],
                reverse=True
            )
    }

@router.get(
    "/jobs/recommendations/{user_id}"
)
def get_recommendations(
    user_id: str
):

    results = (
        supabase.table(
            "job_matches"
        )
        .select("""
            *,
            jobs(*)
        """)
        .eq(
            "user_id",
            user_id
        )
        .order(
            "match_score",
            desc=True
        )
        .execute()
    )

    return {
        "success": True,
        "jobs":
            results.data
    }


@router.post(
    "/jobs/roadmap/{user_id}/{job_id}"
)
def generate_roadmap(
    user_id: str,
    job_id: int
):

    match_result = (
    supabase.table(
        "job_matches"
    )
    .select("*")
    .eq(
        "user_id",
        user_id
    )
    .eq(
        "job_id",
        job_id
    )
    .limit(1)
    .execute()
)
    if not match_result.data:

        return {
            "success": False,
            "message":
                "Match not found"
        }

    match_data = (
    match_result.data[0]
)

    match_data = (
        match_result.data[0]
    )

    missing_skills = (
        match_data.get(
            "missing_skills",
            []
        )
        or []
    )

    roadmap = (
        generate_learning_plan(
            missing_skills
        )
    )

    try:

        supabase.table(
            "learning_roadmaps"
        ).upsert({

            "user_id":
                user_id,

            "job_id":
                job_id,

            "roadmap":
                roadmap

        }).execute()

    except Exception as e:

        print(
            "Roadmap Save Error:",
            e
        )

    return {
        "success": True,
        "job_id":
            job_id,
        "missing_skills":
            missing_skills,
        "roadmap":
            roadmap
    }

@router.post(
    "/jobs/interview/{job_id}"
)
def generate_interview_prep(
    job_id: int
):

    job_result = (
        supabase.table(
            "jobs"
        )
        .select("*")
        .eq(
            "id",
            job_id
        )
        .limit(1)
        .execute()
    )

    if not job_result.data:

        return {
            "success": False,
            "message":
                "Job not found"
        }

    job = (
        job_result.data[0]
    )

    questions = (
        generate_interview_questions(
            job.get(
                "title",
                ""
            ),
            job.get(
                "description",
                ""
            )
        )
    )

    return {
        "success": True,
        "job_id":
            job_id,
        "interview":
            questions
    }
@router.get("/jobs")
def get_jobs():

    result = (
        supabase.table(
            "jobs"
        )
        .select("*")
        .order(
            "created_at",
            desc=True
        )
        .execute()
    )

    return {
        "success": True,
        "jobs":
            result.data
    }