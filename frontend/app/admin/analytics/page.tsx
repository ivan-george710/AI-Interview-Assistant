"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AnalyticsPage() {

  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] =
    useState({
      users: 0,
      resumes: 0,
      assessments: 0,
      attempts: 0,
      contests: 0,
      aiRequests: 0,
    });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics =
    async () => {

      const [
        usersRes,
        resumesRes,
        assessmentsRes,
        attemptsRes,
        contestsRes,
        aiRes,
      ] =
        await Promise.all([

          supabase
            .from("profiles")
            .select("*"),

          supabase
            .from("resume_profiles")
            .select("*"),

          supabase
            .from("assessments")
            .select("*"),

          supabase
            .from(
              "assessment_attempts"
            )
            .select("*"),

          supabase
            .from("contests")
            .select("*"),

          supabase
            .from("ai_usage")
            .select("*"),

        ]);

      setStats({

        users:
          usersRes.data
            ?.length || 0,

        resumes:
          resumesRes.data
            ?.length || 0,

        assessments:
          assessmentsRes.data
            ?.length || 0,

        attempts:
          attemptsRes.data
            ?.length || 0,

        contests:
          contestsRes.data
            ?.length || 0,

        aiRequests:
          aiRes.data
            ?.length || 0,

      });

      setLoading(false);
    };

  if (loading) {

    return (

      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">

        Loading...

      </div>

    );
  }

  return (

    <div className="min-h-screen bg-slate-950 text-white p-8">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold mb-2">
          Platform Analytics
        </h1>

        <p className="text-slate-400 mb-8">
          Overall system performance and usage
        </p>

        <div className="grid md:grid-cols-3 xl:grid-cols-6 gap-6">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400">
              Users
            </p>
            <h2 className="text-4xl font-bold text-cyan-400">
              {stats.users}
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400">
              Resumes
            </p>
            <h2 className="text-4xl font-bold text-green-400">
              {stats.resumes}
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400">
              Assessments
            </p>
            <h2 className="text-4xl font-bold text-yellow-400">
              {stats.assessments}
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400">
              Attempts
            </p>
            <h2 className="text-4xl font-bold text-purple-400">
              {stats.attempts}
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400">
              Contests
            </p>
            <h2 className="text-4xl font-bold text-orange-400">
              {stats.contests}
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400">
              AI Requests
            </p>
            <h2 className="text-4xl font-bold text-red-400">
              {stats.aiRequests}
            </h2>
          </div>

        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-8">

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

            <h2 className="text-2xl font-bold mb-4">
              User Activity
            </h2>

            <div className="space-y-4">

              <div className="flex justify-between">
                <span>Total Users</span>
                <span>{stats.users}</span>
              </div>

              <div className="flex justify-between">
                <span>Resume Uploads</span>
                <span>{stats.resumes}</span>
              </div>

              <div className="flex justify-between">
                <span>Assessment Attempts</span>
                <span>{stats.attempts}</span>
              </div>

            </div>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

            <h2 className="text-2xl font-bold mb-4">
              Platform Usage
            </h2>

            <div className="space-y-4">

              <div className="flex justify-between">
                <span>Contests</span>
                <span>{stats.contests}</span>
              </div>

              <div className="flex justify-between">
                <span>Assessments</span>
                <span>{stats.assessments}</span>
              </div>

              <div className="flex justify-between">
                <span>AI Requests</span>
                <span>{stats.aiRequests}</span>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}