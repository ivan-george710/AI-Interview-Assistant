"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function JobReadinessPage() {
  const [technical, setTechnical] =
    useState(70);

  const [aptitude, setAptitude] =
    useState(75);

  const [communication, setCommunication] =
    useState(80);

  const [loading, setLoading] =
    useState(false);

  const readiness = Math.round(
    (technical +
      aptitude +
      communication) /
      3
  );

  useEffect(() => {
    loadAssessment();
  }, []);

  const loadAssessment = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } =
      await supabase
        .from("job_readiness")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        })
        .limit(1)
        .single();

    if (!data) return;

    setTechnical(
      data.technical_score
    );

    setAptitude(
      data.aptitude_score
    );

    setCommunication(
      data.communication_score
    );
  };

  const saveAssessment =
    async () => {
      setLoading(true);

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) return;

      const { error } =
        await supabase
          .from("job_readiness")
          .insert({
            user_id: user.id,
            technical_score:
              technical,
            aptitude_score:
              aptitude,
            communication_score:
              communication,
            readiness_score:
              readiness,
          });

      if (error) {
        alert(error.message);
      } else {
        alert(
          "Assessment Saved"
        );
      }

      setLoading(false);
    };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      <h1 className="text-4xl font-bold mb-8">
        Job Readiness Assessment
      </h1>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-3xl">

        <div className="space-y-8">

          <div>
            <div className="flex justify-between mb-2">
              <p>
                Technical Skills
              </p>

              <p>
                {technical}%
              </p>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={technical}
              onChange={(e) =>
                setTechnical(
                  Number(
                    e.target.value
                  )
                )
              }
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <p>
                Aptitude
              </p>

              <p>
                {aptitude}%
              </p>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={aptitude}
              onChange={(e) =>
                setAptitude(
                  Number(
                    e.target.value
                  )
                )
              }
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <p>
                Communication
              </p>

              <p>
                {communication}%
              </p>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={communication}
              onChange={(e) =>
                setCommunication(
                  Number(
                    e.target.value
                  )
                )
              }
              className="w-full"
            />
          </div>

          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-black rounded-2xl p-8">

            <h2 className="text-2xl font-bold">
              Overall Readiness
            </h2>

            <p className="text-6xl font-bold mt-3">
              {readiness}%
            </p>

          </div>

          <button
            onClick={
              saveAssessment
            }
            disabled={loading}
            className="w-full bg-cyan-500 text-black py-4 rounded-xl font-bold"
          >
            {loading
              ? "Saving..."
              : "Save Assessment"}
          </button>

        </div>

      </div>

    </div>
  );
}