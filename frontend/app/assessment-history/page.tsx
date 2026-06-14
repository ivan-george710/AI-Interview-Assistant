"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";

export default function AssessmentHistoryPage() {

  const [attempts, setAttempts] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) return;

    const { data, error } =
      await supabase
        .from("assessment_attempts")
        .select(`
          *,
          assessments (
            title,
            description
          )
        `)
        .eq(
          "user_id",
          user.id
        )
        .order(
          "completed_at",
          {
            ascending: false,
          }
        );

    if (error) {
      console.log(error);
      return;
    }

    setAttempts(data || []);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      <Sidebar />

      <main className="flex-1 p-8">

        <h1 className="text-4xl font-bold mb-8">
          Assessment History
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : attempts.length === 0 ? (
          <div className="bg-slate-900 p-6 rounded-xl">
            No assessments attempted yet.
          </div>
        ) : (
          <div className="space-y-4">

            {attempts.map(
              (attempt) => (
                <div
                  key={attempt.id}
                  className="bg-slate-900 p-6 rounded-xl border border-slate-800"
                >
                  <h2 className="text-xl font-bold">
                    {
                      attempt
                        .assessments
                        ?.title
                    }
                  </h2>

                  <p className="text-slate-400 mt-2">
                    Score:
                    {" "}
                    {attempt.score}
                  </p>

                  <p className="text-slate-500 text-sm mt-2">
                    Completed:
                    {" "}
                    {new Date(
                      attempt.completed_at
                    ).toLocaleString()}
                  </p>
                </div>
              )
            )}

          </div>
        )}

      </main>

    </div>
  );
}