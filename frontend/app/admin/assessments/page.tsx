"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminAssessmentsPage() {

  const router =
    useRouter();

  const [loading, setLoading] =
    useState(true);

  const [assessments, setAssessments] =
    useState<any[]>([]);

  const [attempts, setAttempts] =
    useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {

    const {
      data: assessmentsData
    } =
      await supabase
        .from("assessments")
        .select("*")
        .order(
          "created_at",
          {
            ascending: false
          }
        );

    const {
      data: attemptsData
    } =
      await supabase
        .from(
          "assessment_attempts"
        )
        .select("*");

    setAssessments(
      assessmentsData || []
    );

    setAttempts(
      attemptsData || []
    );

    setLoading(
      false
    );
  }

  async function deleteAssessment(
    id: string
  ) {

    const confirmed =
      window.confirm(
        "Delete assessment?"
      );

    if (!confirmed)
      return;

    await supabase
      .from(
        "assessments"
      )
      .delete()
      .eq(
        "id",
        id
      );

    loadData();
  }

  if (loading) {

    return (

      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">

        Loading...

      </div>

    );
  }

  const totalAttempts =
    attempts.length;

  const completedAttempts =
    attempts.filter(
      (
        attempt
      ) =>
        attempt.completed_at
    ).length;

  const averageScore =
    attempts.length > 0
      ? (
          attempts.reduce(
            (
              sum,
              attempt
            ) =>
              sum +
              (
                attempt.score ||
                0
              ),
            0
          ) /
          attempts.length
        ).toFixed(1)
      : "0";

  return (

    <div className="min-h-screen bg-slate-950 text-white p-8">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold mb-2">
          Assessment Analytics
        </h1>

        <p className="text-slate-400 mb-8">
          Track assessment performance and participation
        </p>

        <div className="grid md:grid-cols-4 gap-6 mb-10">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <p className="text-slate-400">
              Assessments
            </p>

            <h2 className="text-4xl font-bold">
              {
                assessments.length
              }
            </h2>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <p className="text-slate-400">
              Attempts
            </p>

            <h2 className="text-4xl font-bold text-cyan-400">
              {
                totalAttempts
              }
            </h2>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <p className="text-slate-400">
              Completed
            </p>

            <h2 className="text-4xl font-bold text-green-400">
              {
                completedAttempts
              }
            </h2>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <p className="text-slate-400">
              Avg Score
            </p>

            <h2 className="text-4xl font-bold text-yellow-400">
              {
                averageScore
              }
            </h2>

          </div>

        </div>

        <div className="space-y-5">

          {assessments.map(
            (
              assessment
            ) => {

              const assessmentAttempts =
                attempts.filter(
                  (
                    attempt
                  ) =>
                    attempt.assessment_id ===
                    assessment.id
                );

              const avgScore =
                assessmentAttempts.length > 0
                  ? (
                      assessmentAttempts.reduce(
                        (
                          sum,
                          attempt
                        ) =>
                          sum +
                          (
                            attempt.score ||
                            0
                          ),
                        0
                      ) /
                      assessmentAttempts.length
                    ).toFixed(1)
                  : "0";

              return (

                <div
                  key={
                    assessment.id
                  }
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-6"
                >

                  <div className="flex justify-between items-start">

                    <div>

                      <h2 className="text-2xl font-bold">
                        {
                          assessment.title
                        }
                      </h2>

                      <p className="text-slate-400 mt-2">
                        {
                          assessment.description
                        }
                      </p>

                    </div>

                    <div className="text-right">

                      <div className="text-cyan-400 font-semibold">
                        {
                          assessment.duration_minutes
                        }
                        mins
                      </div>

                    </div>

                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mt-6">

                    <div className="bg-slate-800 rounded-xl p-4">

                      <p className="text-slate-400 text-sm">
                        Attempts
                      </p>

                      <h3 className="text-2xl font-bold">
                        {
                          assessmentAttempts.length
                        }
                      </h3>

                    </div>

                    <div className="bg-slate-800 rounded-xl p-4">

                      <p className="text-slate-400 text-sm">
                        Avg Score
                      </p>

                      <h3 className="text-2xl font-bold text-green-400">
                        {
                          avgScore
                        }
                      </h3>

                    </div>

                    <div className="bg-slate-800 rounded-xl p-4">

                      <p className="text-slate-400 text-sm">
                        Completed
                      </p>

                      <h3 className="text-2xl font-bold text-yellow-400">
                        {
                          assessmentAttempts.filter(
                            (
                              a
                            ) =>
                              a.completed_at
                          ).length
                        }
                      </h3>

                    </div>

                  </div>

                  <div className="flex gap-3 mt-6">

                    <button
                      onClick={() =>
                        router.push(
                          `/admin/assessments/${assessment.id}`
                        )
                      }
                      className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-lg"
                    >
                      View Analytics
                    </button>

                    <button
                      onClick={() =>
                        deleteAssessment(
                          assessment.id
                        )
                      }
                      className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              );
            }
          )}

        </div>

      </div>

    </div>
  );
}