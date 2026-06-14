"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";

export default function AssessmentsPage() {
  const router = useRouter();

  const [assessments, setAssessments] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments =
    async () => {
      const { data, error } =
        await supabase
          .from("assessments")
          .select("*")
          .order(
            "created_at",
            {
              ascending: false,
            }
          );

      if (error) {
        console.log(error);
        return;
      }

      setAssessments(data || []);
      setLoading(false);
    };

  const startAssessment =
    async (
      assessmentId: string
    ) => {
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        alert(
          "Please login first"
        );
        return;
      }

      const { error } =
        await supabase
          .from(
            "assessment_attempts"
          )
          .insert({
            assessment_id:
              assessmentId,
            user_id: user.id,
          });

      if (error) {
        alert(error.message);
        return;
      }

      router.push(
        `/assessments/${assessmentId}`
      );
    };

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      <Sidebar />

      <main className="flex-1 p-8">

        <h1 className="text-4xl font-bold mb-8">
          Assessments
        </h1>

        {loading ? (
          <div>
            Loading...
          </div>
        ) : assessments.length ===
          0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            No assessments found.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {assessments.map(
              (
                assessment
              ) => (
                <div
                  key={
                    assessment.id
                  }
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500 transition"
                >
                  <h2 className="text-xl font-bold mb-3">
                    {
                      assessment.title
                    }
                  </h2>

                  <p className="text-slate-400 mb-5">
                    {
                      assessment.description
                    }
                  </p>

                  <div className="flex justify-between text-cyan-400 text-sm mb-6">
                    <span>
                      Assessment
                    </span>

                    <span>
                      {
                        assessment.duration_minutes
                      }{" "}
                      mins
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      startAssessment(
                        assessment.id
                      )
                    }
                    className="w-full bg-cyan-500 text-black py-3 rounded-xl font-semibold hover:bg-cyan-400 transition"
                  >
                    Start Assessment
                  </button>
                </div>
              )
            )}

          </div>
        )}

      </main>

    </div>
  );
}