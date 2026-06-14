"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface Resume {
  id: string;
  user_id: string;
  file_url: string;
  ats_score: number;
  storage_path: string;
  created_at: string;
}

interface Experience {
  id: string;
  user_id: string;
  company_name: string;
  role: string;
  difficulty: number;
  experience: string;
  interview_type: string;
  offer_received: boolean;
  interview_year: number;
  created_at: string;
}

interface Profile {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string;
  bio: string;
  role: string;
  xp: number;
  rank: string;
  current_streak: number;
  max_streak: number;
  created_at: string;
}


export default function ProfilePage() {
    const router = useRouter();
  const [loading, setLoading] =
    useState(true);

  const [user, setUser] =
    useState<any>(null);

  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [resume, setResume] =
    useState<Resume | null>(null);

  const [experiences,
    setExperiences] =
    useState<Experience[]>([]);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile =
    async () => {

      setLoading(true);

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setUser(user);

      const {
        data: profileData,
      } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      const {
        data: resumeData,
      } = await supabase
        .from("resumes")
        .select("*")
        .eq("user_id", user.id)
        .order(
          "created_at",
          {
            ascending: false,
          }
        )
        .limit(1)
        .single();

      if (resumeData) {
        setResume(resumeData);
      }

      const {
        data: experienceData,
      } = await supabase
        .from(
          "interview_experiences"
        )
        .select("*")
        .eq("user_id", user.id)
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

      setExperiences(
        experienceData || []
      );

      setLoading(false);
    };

  const experienceCount =
    experiences.length;

  const companyCount =
    new Set(
      experiences.map(
        (e) =>
          e.company_name
      )
    ).size;

  const offerCount =
    experiences.filter(
      (e) =>
        e.offer_received
    ).length;

  const avgDifficulty =
    experiences.length
      ? (
          experiences.reduce(
            (sum, e) =>
              sum +
              e.difficulty,
            0
          ) /
          experiences.length
        ).toFixed(1)
      : "0";

  const xp =
    profile?.xp || 0;

  const rank =
    profile?.rank ||
    "Beginner";

  const currentStreak =
    profile?.current_streak ||
    0;

  const maxStreak =
    profile?.max_streak ||
    0;
      const companies =
    useMemo(
      () =>
        [
          ...new Set(
            experiences.map(
              (e) =>
                e.company_name
            )
          ),
        ],
      [experiences]
    );

  const achievements =
    useMemo(() => {

      const list: string[] =
        [];

      if (resume) {
        list.push(
          "📄 Resume Uploaded"
        );
      }

      if (
        experienceCount >= 1
      ) {
        list.push(
          "📝 First Experience Shared"
        );
      }

      if (
        companyCount >= 5
      ) {
        list.push(
          "🏢 5+ Companies"
        );
      }

      if (
        offerCount >= 1
      ) {
        list.push(
          "🎯 First Offer"
        );
      }

      if (
        experienceCount >= 10
      ) {
        list.push(
          "⭐ Community Contributor"
        );
      }

      if (xp >= 100) {
        list.push(
          "🥉 Bronze Member"
        );
      }

      if (xp >= 500) {
        list.push(
          "🥈 Silver Member"
        );
      }

      if (xp >= 1000) {
        list.push(
          "🥇 Gold Member"
        );
      }

      if (
        currentStreak >= 7
      ) {
        list.push(
          "🔥 7 Day Streak"
        );
      }

      if (
        currentStreak >= 30
      ) {
        list.push(
          "🔥 30 Day Streak"
        );
      }

      return list;

    }, [
      resume,
      experienceCount,
      companyCount,
      offerCount,
      xp,
      currentStreak,
    ]);

  if (loading) {
    
    return (
        
        
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">

          <div className="text-4xl mb-4">
            🚀
          </div>

          <p className="text-slate-400">
            Loading Profile...
          </p>

        </div>
      </div>
    );
  }

  return (
    

    <div className="min-h-screen bg-slate-950 text-white p-8">

      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => router.back()}
          className="
            h-10
            w-10
            flex
            items-center
            justify-center
            rounded-xl
            bg-slate-900
            border
            border-slate-800
            text-slate-400
            hover:text-cyan-400
            hover:border-cyan-500/30
            transition-all
          "
        >
          ←
        </button>

        <div
          className="
            bg-slate-900
            border
            border-slate-800
            rounded-3xl
            p-8
            mb-8
          "
        >

          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8">

            <div className="flex gap-6 items-center">

              {profile?.avatar_url ? (

                <img
                  src={
                    profile.avatar_url
                  }
                  alt="avatar"
                  className="
                    w-24
                    h-24
                    rounded-full
                    object-cover
                    border-2
                    border-cyan-500
                  "
                />

              ) : (

                <div
                  className="
                    w-24
                    h-24
                    rounded-full
                    bg-cyan-500
                    text-black
                    flex
                    items-center
                    justify-center
                    text-3xl
                    font-bold
                  "
                >
                  {
                    profile
                      ?.full_name?.[0] ||
                    user?.email?.[0]
                  }
                </div>

              )}

              <div>

                <h1 className="text-4xl font-bold">
                  {
                    profile?.full_name ||
                    "User"
                  }
                </h1>

                <p className="text-cyan-400 mt-1">
                  @
                  {
                    profile?.username ||
                    "username"
                  }
                </p>

                <p className="text-slate-400 mt-3">
                  {
                    profile?.bio ||
                    "No bio added yet"
                  }
                </p>

              </div>

            </div>

            <div className="flex gap-4 flex-wrap">
                              <div
                className="
                  bg-cyan-500/10
                  border
                  border-cyan-500/20
                  px-5
                  py-3
                  rounded-2xl
                "
              >

                <p className="text-slate-400 text-sm">
                  Rank
                </p>

                <p className="text-cyan-400 text-xl font-bold">
                  {rank}
                </p>

              </div>

              <div
  className="
    bg-slate-950
    border
    border-slate-800
    rounded-2xl
    p-5
  "
>

                <p className="text-slate-400 text-sm">
                  XP
                </p>

                <p className="text-2xl font-bold">
                  {xp}
                </p>

              </div>

              <div
                className="
                  bg-slate-950
                  border
                  border-slate-800
                  px-5
                  py-3
                  rounded-2xl
                "
              >

                <p className="text-slate-400 text-sm">
                  Current Streak
                </p>

                <p className="text-2xl font-bold">
                  🔥 {currentStreak}
                </p>

              </div>

            </div>

          </div>

        </div>

        <div className="grid md:grid-cols-6 gap-4 mb-8">

          <div
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-2xl
              p-6
            "
          >
            <p className="text-slate-400 text-sm">
              XP
            </p>

            <p className="text-3xl font-bold mt-2">
              {xp}
            </p>
          </div>

          <div
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-2xl
              p-6
            "
          >
            <p className="text-slate-400 text-sm">
              Rank
            </p>

            <p className="text-3xl font-bold mt-2 text-cyan-400">
              {rank}
            </p>
          </div>

          <div
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-2xl
              p-6
            "
          >
            <p className="text-slate-400 text-sm">
              Current Streak
            </p>

            <p className="text-3xl font-bold mt-2">
              🔥 {currentStreak}
            </p>
          </div>

          <div
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-2xl
              p-6
            "
          >
            <p className="text-slate-400 text-sm">
              Best Streak
            </p>

            <p className="text-3xl font-bold mt-2">
              {maxStreak}
            </p>
          </div>

          <div
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-2xl
              p-6
            "
          >
            <p className="text-slate-400 text-sm">
              Experiences
            </p>

            <p className="text-3xl font-bold mt-2">
              {experienceCount}
            </p>
          </div>

          <div
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-2xl
              p-6
            "
          >
            <p className="text-slate-400 text-sm">
              ATS Score
            </p>

            <p className="text-3xl font-bold mt-2 text-cyan-400">
              {resume?.ats_score ?? "--"}
            </p>
          </div>

        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
                      <div
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-3xl
              p-6
            "
          >

            <h2 className="text-2xl font-semibold mb-5">
              Resume
            </h2>

            {resume ? (

              <div
                className="
                  bg-slate-950
                  border
                  border-slate-800
                  rounded-2xl
                  p-5
                "
              >

                <div className="flex justify-between items-center">

                  <div>

                    <p className="text-slate-400">
                      ATS Score
                    </p>

                    <p className="text-4xl font-bold text-cyan-400 mt-2">
                      {resume.ats_score}
                    </p>

                  </div>

                  <div
                    className="
                      bg-green-500/10
                      text-green-400
                      border
                      border-green-500/20
                      px-4
                      py-2
                      rounded-xl
                    "
                  >
                    Active Resume
                  </div>

                </div>

                <p className="text-slate-500 text-sm mt-5">
                  Uploaded on{" "}
                  {new Date(
                    resume.created_at
                  ).toLocaleDateString()}
                </p>

                <a
                  href={resume.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    inline-block
                    mt-5
                    bg-cyan-500
                    text-black
                    px-5
                    py-3
                    rounded-xl
                    font-semibold
                  "
                >
                  View Resume
                </a>

              </div>

            ) : (

              <div
                className="
                  bg-slate-950
                  border
                  border-slate-800
                  rounded-2xl
                  p-6
                "
              >
                <p className="text-slate-400">
                  No resume uploaded yet.
                </p>
              </div>

            )}

          </div>

          <div
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-3xl
              p-6
            "
          >

            <h2 className="text-2xl font-semibold mb-5">
              Community Impact
            </h2>

            <div className="space-y-4">

              <div
                className="
                  bg-slate-950
                  rounded-2xl
                  p-5
                "
              >
                <p className="text-slate-400">
                  Experiences Shared
                </p>

                <p className="text-3xl font-bold mt-2">
                  {experienceCount}
                </p>
              </div>

              <div
                className="
                  bg-slate-950
                  rounded-2xl
                  p-5
                "
              >
                <p className="text-slate-400">
                  Companies Documented
                </p>

                <p className="text-3xl font-bold mt-2">
                  {companyCount}
                </p>
              </div>

              <div
                className="
                  bg-slate-950
                  rounded-2xl
                  p-5
                "
              >
                <p className="text-slate-400">
                  Offers Received
                </p>

                <p className="text-3xl font-bold mt-2 text-cyan-400">
                  {offerCount}
                </p>
              </div>

              <div
                className="
                  bg-slate-950
                  rounded-2xl
                  p-5
                "
              >
                <p className="text-slate-400">
                  Avg Difficulty
                </p>

                <p className="text-3xl font-bold mt-2">
                  {avgDifficulty}
                </p>
              </div>

            </div>

          </div>

        </div>

        <div
          className="
            bg-slate-900
            border
            border-slate-800
            rounded-3xl
            p-6
            mb-8
          "
        >

          <h2 className="text-2xl font-semibold mb-5">
            Companies Interviewed At
          </h2>

          {companies.length > 0 ? (

            <div className="flex flex-wrap gap-3">

              {companies.map(
                (company) => (

                  <div
                    key={company}
                    className="
                      bg-cyan-500/10
                      border
                      border-cyan-500/20
                      text-cyan-400
                      px-4
                      py-2
                      rounded-full
                    "
                  >
                    {company}
                  </div>

                )
              )}

            </div>

          ) : (

            <p className="text-slate-400">
              No interview experiences shared yet.
            </p>

          )}

        </div>
        
        </div>
        
            </div>
  )
};