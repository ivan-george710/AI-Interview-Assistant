"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AssessmentDetailsPage() {

  const params =
    useParams();

  const assessmentId =
    params.id as string;

  const [loading, setLoading] =
    useState(true);

  const [assessment, setAssessment] =
    useState<any>(null);

  const [attempts, setAttempts] =
    useState<any[]>([]);

  const [profiles, setProfiles] =
    useState<any[]>([]);

  useEffect(() => {

    if (assessmentId) {
      loadData();
    }

  }, [assessmentId]);

  async function loadData() {

    const {
      data: assessmentData
    } =
      await supabase
        .from("assessments")
        .select("*")
        .eq(
          "id",
          assessmentId
        )
        .single();

    const {
      data: attemptsData
    } =
      await supabase
        .from(
          "assessment_attempts"
        )
        .select("*")
        .eq(
          "assessment_id",
          assessmentId
        )
        .order(
          "started_at",
          {
            ascending: false
          }
        );

    let profileData: any[] =
      [];

    if (
      attemptsData &&
      attemptsData.length > 0
    ) {

      const userIds =
        attemptsData.map(
          (
            attempt
          ) =>
            attempt.user_id
        );

      const {
        data
      } =
        await supabase
          .from(
            "profiles"
          )
          .select(
            "id, full_name"
          )
          .in(
            "id",
            userIds
          );

      profileData =
        data || [];
    }

    setAssessment(
      assessmentData
    );

    setAttempts(
      attemptsData || []
    );

    setProfiles(
      profileData
    );

    setLoading(
      false
    );
  }

  if (loading) {

    return (

      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">

        Loading...

      </div>

    );
  }

  if (!assessment) {

    return (

      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">

        Assessment Not Found

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

  const highestScore =
    attempts.length > 0
      ? Math.max(
          ...attempts.map(
            (
              attempt
            ) =>
              attempt.score ||
              0
          )
        )
      : 0;

  const completionRate =
    totalAttempts > 0
      ? (
          (
            completedAttempts /
            totalAttempts
          ) *
          100
        ).toFixed(1)
      : "0";

  return (

    <div className="min-h-screen bg-slate-950 text-white p-8">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold">
          {assessment.title}
        </h1>

        <p className="text-slate-400 mt-2 mb-8">
          {
            assessment.description
          }
        </p>

        <div className="grid md:grid-cols-5 gap-6 mb-10">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <p className="text-slate-400">
              Duration
            </p>

            <h2 className="text-3xl font-bold">
              {
                assessment.duration_minutes
              }
              m
            </h2>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <p className="text-slate-400">
              Attempts
            </p>

            <h2 className="text-3xl font-bold text-cyan-400">
              {
                totalAttempts
              }
            </h2>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <p className="text-slate-400">
              Completed
            </p>

            <h2 className="text-3xl font-bold text-green-400">
              {
                completedAttempts
              }
            </h2>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <p className="text-slate-400">
              Avg Score
            </p>

            <h2 className="text-3xl font-bold text-yellow-400">
              {
                averageScore
              }
            </h2>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <p className="text-slate-400">
              Highest
            </p>

            <h2 className="text-3xl font-bold text-purple-400">
              {
                highestScore
              }
            </h2>

          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <h3 className="text-xl font-bold mb-4">
              Completion Rate
            </h3>

            <div className="text-5xl font-bold text-green-400">
              {
                completionRate
              }
              %
            </div>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <h3 className="text-xl font-bold mb-4">
              Assessment Info
            </h3>

            <div className="space-y-2 text-slate-300">

              <p>
                Created:
                {" "}
                {
                  new Date(
                    assessment.created_at
                  ).toLocaleString()
                }
              </p>

              <p>
                Duration:
                {" "}
                {
                  assessment.duration_minutes
                }
                {" "}
                Minutes
              </p>

            </div>

          </div>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

          <h2 className="text-2xl font-bold mb-6">
            Attempt History
          </h2>

          {attempts.length ===
          0 ? (

            <div className="text-slate-400">
              No attempts yet.
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="border-b border-slate-700">

                    <th className="text-left p-3">
                      User
                    </th>

                    <th className="text-left p-3">
                      Score
                    </th>

                    <th className="text-left p-3">
                      Started
                    </th>

                    <th className="text-left p-3">
                      Completed
                    </th>

                    <th className="text-left p-3">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {attempts.map(
                    (
                      attempt
                    ) => {

                      const user =
                        profiles.find(
                          (
                            profile
                          ) =>
                            profile.id ===
                            attempt.user_id
                        );

                      return (

                        <tr
                          key={
                            attempt.id
                          }
                          className="border-b border-slate-800"
                        >

                          <td className="p-3">

                            {
                              user?.full_name ||
                              "Unknown User"
                            }

                          </td>

                          <td className="p-3 text-cyan-400 font-semibold">

                            {
                              attempt.score
                            }

                          </td>

                          <td className="p-3">

                            {
                              new Date(
                                attempt.started_at
                              ).toLocaleString()
                            }

                          </td>

                          <td className="p-3">

                            {
                              attempt.completed_at
                                ? new Date(
                                    attempt.completed_at
                                  ).toLocaleString()
                                : "-"
                            }

                          </td>

                          <td className="p-3">

                            <span
                              className={`px-3 py-1 rounded-lg ${
                                attempt.completed_at
                                  ? "bg-green-600"
                                  : "bg-yellow-600"
                              }`}
                            >
                              {
                                attempt.completed_at
                                  ? "Completed"
                                  : "In Progress"
                              }
                            </span>

                          </td>

                        </tr>

                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>

  );
}