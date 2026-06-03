"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminTitle from "@/components/admin/AdminTitle";

export default function AdminPage() {
  const [users, setUsers] = useState(0);
  const [questions, setQuestions] = useState(0);
  const [contests, setContests] = useState(0);
  const [reports, setReports] = useState(0);
  const [aiRequests, setAiRequests] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const usersRes = await supabase
      .from("profiles")
      .select("*");

    const questionsRes = await supabase
      .from("questions")
      .select("*");

    const contestsRes = await supabase
      .from("contests")
      .select("*");

    const reportsRes = await supabase
      .from("reports")
      .select("*");

    const aiRes = await supabase
      .from("ai_usage")
      .select("*");

    setUsers(usersRes.data?.length || 0);
    setQuestions(questionsRes.data?.length || 0);
    setContests(contestsRes.data?.length || 0);
    setReports(reportsRes.data?.length || 0);
    setAiRequests(aiRes.data?.length || 0);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">


      <div className="flex-1">

        <AdminNavbar />

        <main className="p-8">

          <AdminTitle
            title="Admin Dashboard"
            subtitle="System analytics and management center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mt-8">

            <AdminStatCard
              title="Users"
              value={String(users)}
            />

            <AdminStatCard
              title="Questions"
              value={String(questions)}
            />

            <AdminStatCard
              title="Contests"
              value={String(contests)}
            />

            <AdminStatCard
              title="Reports"
              value={String(reports)}
            />

            <AdminStatCard
              title="AI Requests"
              value={String(aiRequests)}
            />

          </div>

          <div className="grid lg:grid-cols-2 gap-6 mt-8">

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

              <h2 className="text-2xl font-semibold mb-5">
                Admin Modules
              </h2>

              <div className="grid grid-cols-2 gap-4">

                <a
                  href="/admin/users"
                  className="bg-slate-800 p-4 rounded-2xl hover:border hover:border-cyan-500"
                >
                  User Management
                </a>

                <a
                  href="/admin/questions"
                  className="bg-slate-800 p-4 rounded-2xl hover:border hover:border-cyan-500"
                >
                  Question Management
                </a>

                <a
                  href="/admin/contests"
                  className="bg-slate-800 p-4 rounded-2xl hover:border hover:border-cyan-500"
                >
                  Contest Management
                </a>

                <a
                  href="/admin/reports"
                  className="bg-slate-800 p-4 rounded-2xl hover:border hover:border-cyan-500"
                >
                  Report Monitoring
                </a>

                <a
                  href="/admin/ai-usage"
                  className="bg-slate-800 p-4 rounded-2xl hover:border hover:border-cyan-500"
                >
                  AI Usage Monitoring
                </a>

              </div>

            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

              <h2 className="text-2xl font-semibold mb-5">
                Platform Overview
              </h2>

              <div className="space-y-4 text-slate-300">

                <div className="flex justify-between">
                  <span>Total Users</span>
                  <span>{users}</span>
                </div>

                <div className="flex justify-between">
                  <span>Total Questions</span>
                  <span>{questions}</span>
                </div>

                <div className="flex justify-between">
                  <span>Total Contests</span>
                  <span>{contests}</span>
                </div>

                <div className="flex justify-between">
                  <span>Total Reports</span>
                  <span>{reports}</span>
                </div>

                <div className="flex justify-between">
                  <span>AI Requests</span>
                  <span>{aiRequests}</span>
                </div>

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}