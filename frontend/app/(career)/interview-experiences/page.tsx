"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function InterviewExperiencesPage() {
  const [posts, setPosts] =
    useState<any[]>([]);

  const [company, setCompany] =
    useState("");

  const [role, setRole] =
    useState("");

  const [difficulty, setDifficulty] =
    useState(3);

  const [experience, setExperience] =
    useState("");

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } =
      await supabase
        .from("interview_experiences")
        .select("*")
        .eq("user_id", user.id)
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

    setPosts(data || []);
  };

  const submitPost = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    if (
      !company ||
      !role ||
      !experience
    ) {
      alert(
        "Fill all fields"
      );
      return;
    }

    const { error } =
      await supabase
        .from(
          "interview_experiences"
        )
        .insert({
          user_id: user.id,
          company_name: company,
          role,
          difficulty,
          experience,
        });

    if (error) {
      console.log(error);
      alert(error.message);
      return;
    }

    setCompany("");
    setRole("");
    setDifficulty(3);
    setExperience("");

    loadExperiences();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      <h1 className="text-4xl font-bold mb-8">
        Interview Experiences
      </h1>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">

        <div className="grid md:grid-cols-2 gap-4">

          <input
            value={company}
            onChange={(e) =>
              setCompany(
                e.target.value
              )
            }
            placeholder="Company"
            className="bg-slate-800 p-3 rounded-xl"
          />

          <input
            value={role}
            onChange={(e) =>
              setRole(
                e.target.value
              )
            }
            placeholder="Role"
            className="bg-slate-800 p-3 rounded-xl"
          />

        </div>

        <div className="mt-4">

          <label>
            Difficulty
          </label>

          <select
            value={difficulty}
            onChange={(e) =>
              setDifficulty(
                Number(
                  e.target.value
                )
              )
            }
            className="w-full mt-2 bg-slate-800 p-3 rounded-xl"
          >
            <option value={1}>
              1 - Easy
            </option>
            <option value={2}>
              2 - Medium Easy
            </option>
            <option value={3}>
              3 - Medium
            </option>
            <option value={4}>
              4 - Hard
            </option>
            <option value={5}>
              5 - Very Hard
            </option>
          </select>

        </div>

        <textarea
          value={experience}
          onChange={(e) =>
            setExperience(
              e.target.value
            )
          }
          placeholder="Share your interview experience..."
          className="w-full h-40 mt-4 bg-slate-800 p-3 rounded-xl"
        />

        <button
          onClick={submitPost}
          className="mt-4 bg-cyan-500 text-black px-6 py-3 rounded-xl font-semibold"
        >
          Post Experience
        </button>

      </div>

      <div className="space-y-4">

        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5"
          >

            <div className="flex justify-between">

              <div>
                <h2 className="text-xl font-bold">
                  {
                    post.company_name
                  }
                </h2>

                <p className="text-slate-400">
                  {post.role}
                </p>
              </div>

              <div className="text-cyan-400">
                {post.difficulty}/5
              </div>

            </div>

            <p className="mt-4">
              {post.experience}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}