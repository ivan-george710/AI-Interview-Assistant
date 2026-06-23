"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function UserResumePage() {

  const params = useParams();

  const [profile, setProfile] =
    useState<any>(null);

  const [resume, setResume] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser =
    async () => {

      const userId =
        params.id;

      const profileRes =
        await supabase
          .from("profiles")
          .select("*")
          .eq(
            "id",
            userId
          )
          .single();

      const resumeRes =
        await supabase
          .from(
            "resume_profiles"
          )
          .select("*")
          .eq(
            "user_id",
            userId
          )
          .single();

      setProfile(
        profileRes.data
      );

      setResume(
        resumeRes.data
      );

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

      <h1 className="text-4xl font-bold mb-8">
        User Resume
      </h1>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

        <h2 className="text-2xl font-bold">
          {profile?.full_name}
        </h2>

        <p className="text-slate-400 mt-2">
          Role: {profile?.role}
        </p>

        <p className="text-slate-400">
          User ID: {profile?.id}
        </p>

      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

          <h3 className="text-xl font-bold text-cyan-400 mb-4">
            Skills
          </h3>

          <pre className="whitespace-pre-wrap text-slate-300">
            {JSON.stringify(
              resume?.skills,
              null,
              2
            )}
          </pre>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

          <h3 className="text-xl font-bold text-green-400 mb-4">
            Education
          </h3>

          <pre className="whitespace-pre-wrap text-slate-300">
            {JSON.stringify(
              resume?.education,
              null,
              2
            )}
          </pre>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

          <h3 className="text-xl font-bold text-purple-400 mb-4">
            Projects
          </h3>

          <pre className="whitespace-pre-wrap text-slate-300">
            {JSON.stringify(
              resume?.projects,
              null,
              2
            )}
          </pre>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

          <h3 className="text-xl font-bold text-yellow-400 mb-4">
            Experience
          </h3>

          <pre className="whitespace-pre-wrap text-slate-300">
            {JSON.stringify(
              resume?.experience,
              null,
              2
            )}
          </pre>

        </div>

      </div>

    </div>

  );
}