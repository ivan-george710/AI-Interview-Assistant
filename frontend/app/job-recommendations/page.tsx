"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";

interface Recommendation {
  id: number;
  job_id: number;
  match_score: number;
  strengths: string[];
  missing_skills: string[];

  jobs: {
    title: string;
    company: string;
    location: string;
    apply_url: string;
    source: string;
  };
}

export default function JobRecommendationsPage() {

  const [jobs, setJobs] =
    useState<Recommendation[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [roadmaps, setRoadmaps] =
    useState<Record<number, any>>({});
  const [interviews, setInterviews] =
  useState<Record<number, any>>({});  

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations =
    async () => {

      try {

        const {
          data: { user },
        } =
          await supabase.auth.getUser();

        if (!user) {

          setLoading(false);
          return;
        }

        const response =
          await fetch(
            `http://localhost:8000/jobs/recommendations/${user.id}`
          );

        const result =
          await response.json();

        const uniqueJobs =
  (result.jobs || []).filter(
    (
      job: Recommendation,
      index: number,
      self: Recommendation[]
    ) =>
      index ===
      self.findIndex(
        (
          j
        ) =>
          j.job_id ===
          job.job_id
      )
  );

setJobs(
  uniqueJobs
);
      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }
    };

  const generateRoadmap =
  async (
    jobId: number
  ) => {

    try {

      console.log(
        "Generating roadmap for:",
        jobId
      );

      const {
        data: { user }
      } =
        await supabase.auth.getUser();

      console.log(
        "User:",
        user
      );

      if (!user) {

        alert(
          "No user found"
        );

        return;
      }

      const response =
        await fetch(
          `http://localhost:8000/jobs/roadmap/${user.id}/${jobId}`,
          {
            method: "POST"
          }
        );

      console.log(
        "Response:",
        response.status
      );

      const result =
        await response.json();

      console.log(
        "Result:",
        result
      );

      setRoadmaps(
        (prev) => ({
          ...prev,
          [jobId]:
            result.roadmap
        })
      );

    } catch (error) {

      console.error(
        "Roadmap Error:",
        error
      );

    }
  };
  const generateInterviewPrep =
  async (
    jobId: number
  ) => {

    try {

      const response =
        await fetch(
          `http://localhost:8000/jobs/interview/${jobId}`,
          {
            method: "POST"
          }
        );

      const result =
        await response.json();
        console.log(
  "INTERVIEW RESULT:",
  result
);

      setInterviews(
        (prev) => ({
          ...prev,
          [jobId]:
            result.interview
        })
      );

    } catch (error) {

      console.error(
        "Interview Error:",
        error
      );

    }
  };
  if (loading) {

    return (

      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">

        Loading...

      </div>

    );
  }
return (

  <div className="flex min-h-screen bg-slate-950 text-white">

    <Sidebar />

    <main className="flex-1 p-8">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold mb-2">
          AI Job Recommendations
        </h1>

        <p className="text-slate-400 mb-10">
          Personalized job matches based on your resume
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-10">

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

            <p className="text-slate-400">
              Total Matches
            </p>

            <h2 className="text-4xl font-bold mt-2">
              {jobs.length}
            </h2>

          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

            <p className="text-slate-400">
              Best Match
            </p>

            <h2 className="text-4xl font-bold mt-2 text-green-400">

              {
                jobs.length
                  ? Math.max(
                      ...jobs.map(
                        (j) =>
                          j.match_score
                      )
                    )
                  : 0
              }%

            </h2>

          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

            <p className="text-slate-400">
              Average Match
            </p>

            <h2 className="text-4xl font-bold mt-2 text-cyan-400">

              {
                jobs.length
                  ? Math.round(
                      jobs.reduce(
                        (
                          total,
                          job
                        ) =>
                          total +
                          job.match_score,
                        0
                      ) /
                        jobs.length
                    )
                  : 0
              }%

            </h2>

          </div>

        </div>

        <div className="space-y-6">

          {jobs.map(
            (item) => (

              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6"
              >

                <div className="flex justify-between items-start">

                  <div>

                    <h2 className="text-2xl font-bold">
                      {item.jobs?.title}
                    </h2>

                    <p className="text-slate-400 mt-1">
                      {item.jobs?.company}
                    </p>

                    <p className="text-slate-500">
                      {item.jobs?.location}
                    </p>

                  </div>

                  <div className="bg-cyan-500/10 border border-cyan-500/30 px-4 py-2 rounded-xl">

                    <span className="text-cyan-400 font-semibold">

                      {
                        item.match_score
                      }%
                      Match

                    </span>

                  </div>

                </div>

                <div className="mt-6">

                  <h3 className="font-semibold text-green-400 mb-3">
                    Strengths
                  </h3>

                  <div className="flex flex-wrap gap-2">

                    {(
                      item.strengths ||
                      []
                    ).map(
                      (
                        skill,
                        index
                      ) => (

                        <span
                          key={index}
                          className="bg-green-500/10 border border-green-500/30 px-3 py-1 rounded-lg text-sm"
                        >
                          {skill}
                        </span>

                      )
                    )}

                  </div>

                </div>

                <div className="mt-6">

                  <h3 className="font-semibold text-red-400 mb-3">
                    Missing Skills
                  </h3>

                  <div className="flex flex-wrap gap-2">

                    {(
                      item.missing_skills ||
                      []
                    ).map(
                      (
                        skill,
                        index
                      ) => (

                        <span
                          key={index}
                          className="bg-red-500/10 border border-red-500/30 px-3 py-1 rounded-lg text-sm"
                        >
                          {skill}
                        </span>

                      )
                    )}

                  </div>

                </div>

                <div className="flex gap-4 mt-8">

  <a
    href={
      item.jobs?.apply_url
    }
    target="_blank"
    rel="noreferrer"
    className="bg-cyan-500 text-black px-6 py-3 rounded-xl font-semibold"
  >
    Apply Now
  </a>

  <button
    onClick={() =>
      generateRoadmap(
        item.job_id
      )
    }
    className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-semibold"
  >
    Generate Roadmap
  </button>

  <button
    onClick={() =>
      generateInterviewPrep(
        item.job_id
      )
    }
    className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-xl font-semibold"
  >
    Interview Prep
  </button>

</div>
                {roadmaps[
  item.job_id
] && (

  <div className="mt-8 border-t border-slate-800 pt-6">

    <h3 className="text-xl font-bold text-purple-400 mb-4">
      AI Learning Roadmap
    </h3>

    {
      Object.entries(
        roadmaps[
          item.job_id
        ]
      ).map(
        (
          [
            week,
            tasks
          ]
        ) => (

          <div
            key={week}
            className="mb-6"
          >

            <h4 className="text-cyan-400 font-bold mb-3">
              {
                week.toUpperCase()
              }
            </h4>

            <div className="space-y-3">

              {(
                tasks as any[]
              ).map(
                (
                  task,
                  index
                ) => (

                  <div
                    key={index}
                    className="bg-slate-800 p-4 rounded-xl"
                  >

                    <div className="font-semibold">
                      {
                        task.title
                      }
                    </div>

                    <div className="text-sm text-slate-400 mt-1">
                      {
                        task.description
                      }
                    </div>

                  </div>

                )
              )}

            </div>

          </div>

        )
      )
    }

  </div>

)}

{interviews[
  item.job_id
] && (

  <div className="mt-8 border-t border-slate-800 pt-6">

    <h3 className="text-xl font-bold text-emerald-400 mb-4">
      AI Interview Preparation
    </h3>

    {
      Object.entries(
        interviews[
          item.job_id
        ]
      ).map(
        (
          [
            category,
            questions
          ]
        ) => (

          <div
            key={category}
            className="mb-6"
          >

            <h4 className="text-cyan-400 font-bold mb-3">
              {
                category
                  .replace(
                    "_",
                    " "
                  )
                  .toUpperCase()
              }
            </h4>

            <div className="space-y-3">

              {(
                questions as any[]
              ).map(
                (
                  question,
                  index
                ) => (

                  <div
                    key={index}
                    className="bg-slate-800 p-4 rounded-xl"
                  >

                    {
                      typeof question ===
                      "string"
                        ? (
                          <div className="text-white">
                            {question}
                          </div>
                        )
                        : (
                          <>
                            <div className="font-semibold text-white">
                              {
                                question.question
                              }
                            </div>

                            <div className="text-sm text-slate-400 mt-2">
                              {
                                question.description ||
                                question.type
                              }
                            </div>
                          </>
                        )
                    }

                  </div>

                )
              )}

            </div>

          </div>

        )
      )
    }

  </div>

  )}
                </div>

            )
          )}

        </div>

            </div>

    </main>

  </div>

  );
}