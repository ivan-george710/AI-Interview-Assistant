"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

interface InterviewExperience {
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

export default function InterviewExperiencesPage() {
  const [posts, setPosts] = useState<
    InterviewExperience[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [showForm, setShowForm] =
    useState(false);

  const [currentUserId, setCurrentUserId] =
    useState("");

  const [company, setCompany] =
    useState("");

  const [role, setRole] =
    useState("");

  const [difficulty, setDifficulty] =
    useState(3);

  const [experience, setExperience] =
    useState("");

  const [interviewType,
    setInterviewType] =
    useState("");

  const [offerReceived,
    setOfferReceived] =
    useState(false);

  const [interviewYear,
    setInterviewYear] =
    useState(
      new Date().getFullYear()
    );

  const [search, setSearch] =
    useState("");

  const [roleFilter,
    setRoleFilter] =
    useState("all");

  const [difficultyFilter,
    setDifficultyFilter] =
    useState("all");

  const [typeFilter,
    setTypeFilter] =
    useState("all");

  const [offerFilter,
    setOfferFilter] =
    useState("all");

  const [sortBy, setSortBy] =
    useState("newest");

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      setCurrentUserId(user.id);
    }

    const { data, error } =
      await supabase
        .from(
          "interview_experiences"
        )
        .select("*")
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    if (error) {
      console.log(error);
      setLoading(false);
      return;
    }

    setPosts(data || []);
    setLoading(false);
  };

  const submitPost = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login");
      return;
    }

    if (
      !company ||
      !role ||
      !experience ||
      !interviewType
    ) {
      alert(
        "Please fill all required fields"
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
          interview_type:
            interviewType,
          offer_received:
            offerReceived,
          interview_year:
            interviewYear,
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
    setInterviewType("");
    setOfferReceived(false);
    setInterviewYear(
      new Date().getFullYear()
    );

    setShowForm(false);

    loadExperiences();
  };

  const deleteExperience =
    async (id: string) => {
      const confirmed =
        window.confirm(
          "Delete this experience?"
        );

      if (!confirmed) return;

      const { error } =
        await supabase
          .from(
            "interview_experiences"
          )
          .delete()
          .eq("id", id);

      if (error) {
        alert(error.message);
        return;
      }

      loadExperiences();
    };

  const companyStats =
    useMemo(() => {
      return posts.reduce(
        (acc: any, post) => {
          if (
            !acc[
              post.company_name
            ]
          ) {
            acc[
              post.company_name
            ] = {
              count: 0,
              totalDifficulty: 0,
            };
          }

          acc[
            post.company_name
          ].count++;

          acc[
            post.company_name
          ].totalDifficulty +=
            post.difficulty;

          return acc;
        },
        {}
      );
    }, [posts]);

  const filteredPosts =
    useMemo(() => {
      return posts
        .filter((post) => {
          const companyMatch =
            post.company_name
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const roleMatch =
            roleFilter ===
              "all" ||
            post.role ===
              roleFilter;

          const difficultyMatch =
            difficultyFilter ===
              "all" ||
            String(
              post.difficulty
            ) ===
              difficultyFilter;

          const typeMatch =
            typeFilter ===
              "all" ||
            post.interview_type ===
              typeFilter;

          const offerMatch =
            offerFilter ===
              "all" ||
            String(
              post.offer_received
            ) === offerFilter;

          return (
            companyMatch &&
            roleMatch &&
            difficultyMatch &&
            typeMatch &&
            offerMatch
          );
        })
        .sort((a, b) => {
          if (
            sortBy ===
            "hardest"
          ) {
            return (
              b.difficulty -
              a.difficulty
            );
          }

          return (
            new Date(
              b.created_at
            ).getTime() -
            new Date(
              a.created_at
            ).getTime()
          );
        });
    }, [
      posts,
      search,
      roleFilter,
      difficultyFilter,
      typeFilter,
      offerFilter,
      sortBy,
    ]);
      if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">
          Loading interview experiences...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-8">

          <div>

            <h1 className="text-4xl font-bold">
              Interview Experiences
            </h1>

            <p className="text-slate-400 mt-2">
              Learn from real interview experiences shared by students
            </p>

          </div>

          <button
            onClick={() =>
              setShowForm(true)
            }
            className="
              bg-cyan-500
              text-black
              px-6
              py-3
              rounded-xl
              font-semibold
              hover:opacity-90
              transition
            "
          >
            + Share Experience
          </button>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">

          <input
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Search company..."
            className="
              w-full
              bg-slate-800
              border
              border-slate-700
              rounded-xl
              p-3
              mb-4
              outline-none
            "
          />

          <div className="grid md:grid-cols-5 gap-4">

            <select
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(
                  e.target.value
                )
              }
              className="
                bg-slate-800
                border
                border-slate-700
                p-3
                rounded-xl
              "
            >
              <option value="all">
                All Roles
              </option>

              {[
                ...new Set(
                  posts.map(
                    (p) =>
                      p.role
                  )
                ),
              ].map((role) => (
                <option
                  key={role}
                  value={role}
                >
                  {role}
                </option>
              ))}
            </select>

            <select
              value={
                difficultyFilter
              }
              onChange={(e) =>
                setDifficultyFilter(
                  e.target.value
                )
              }
              className="
                bg-slate-800
                border
                border-slate-700
                p-3
                rounded-xl
              "
            >
              <option value="all">
                All Difficulty
              </option>

              <option value="1">
                Easy
              </option>

              <option value="2">
                Medium Easy
              </option>

              <option value="3">
                Medium
              </option>

              <option value="4">
                Hard
              </option>

              <option value="5">
                Very Hard
              </option>

            </select>

            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(
                  e.target.value
                )
              }
              className="
                bg-slate-800
                border
                border-slate-700
                p-3
                rounded-xl
              "
            >
              <option value="all">
                All Types
              </option>

              {[
                ...new Set(
                  posts.map(
                    (p) =>
                      p.interview_type
                  )
                ),
              ].map((type) => (
                <option
                  key={type}
                  value={type}
                >
                  {type}
                </option>
              ))}
            </select>

            <select
              value={offerFilter}
              onChange={(e) =>
                setOfferFilter(
                  e.target.value
                )
              }
              className="
                bg-slate-800
                border
                border-slate-700
                p-3
                rounded-xl
              "
            >
              <option value="all">
                All Outcomes
              </option>

              <option value="true">
                Offer Received
              </option>

              <option value="false">
                No Offer
              </option>

            </select>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value
                )
              }
              className="
                bg-slate-800
                border
                border-slate-700
                p-3
                rounded-xl
              "
            >
              <option value="newest">
                Newest
              </option>

              <option value="hardest">
                Hardest
              </option>

            </select>

          </div>

        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">

          {Object.entries(
            companyStats
          )
            .slice(0, 8)
            .map(
              (
                [
                  company,
                  stats,
                ]: any
              ) => (
                <div
                  key={company}
                  className="
                    bg-slate-900
                    border
                    border-slate-800
                    rounded-2xl
                    p-5
                  "
                >

                  <h3 className="font-bold text-lg">
                    {company}
                  </h3>

                  <p className="text-slate-400 text-sm mt-1">
                    {
                      stats.count
                    } experiences
                  </p>

                  <p className="text-cyan-400 mt-3 font-semibold">
                    Avg Difficulty{" "}
                    {(
                      stats.totalDifficulty /
                      stats.count
                    ).toFixed(1)}
                    /5
                  </p>

                </div>
              )
            )}

        </div>

        <div className="space-y-5">          {filteredPosts.length === 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">

              <h3 className="text-xl font-semibold">
                No Experiences Found
              </h3>

              <p className="text-slate-400 mt-2">
                Try adjusting your filters or be the first to share an experience.
              </p>

            </div>
          )}

          {filteredPosts.map((post) => (

            <div
              key={post.id}
              className="
                bg-slate-900
                border
                border-slate-800
                rounded-2xl
                p-6
              "
            >

              <div className="flex flex-col md:flex-row md:justify-between gap-4">

                <div>

                  <div className="flex items-center gap-3 flex-wrap">

                    <h2 className="text-2xl font-bold">
                      {post.company_name}
                    </h2>

                    <span
                      className="
                        bg-cyan-500/10
                        border
                        border-cyan-500/30
                        text-cyan-400
                        px-3
                        py-1
                        rounded-full
                        text-sm
                      "
                    >
                      {post.interview_type}
                    </span>

                  </div>

                  <p className="text-slate-400 mt-2">
                    {post.role}
                  </p>

                </div>

                <div className="flex gap-3 flex-wrap">

                  <div
                    className="
                      bg-slate-800
                      px-4
                      py-2
                      rounded-xl
                    "
                  >
                    Difficulty: {post.difficulty}/5
                  </div>

                  <div
                    className={`
                      px-4
                      py-2
                      rounded-xl
                      ${
                        post.offer_received
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }
                    `}
                  >
                    {post.offer_received
                      ? "Offer Received"
                      : "No Offer"}
                  </div>

                </div>

              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-5">

                <div className="bg-slate-950 rounded-xl p-4">

                  <p className="text-slate-500 text-sm">
                    Interview Year
                  </p>

                  <p className="mt-1">
                    {post.interview_year}
                  </p>

                </div>

                <div className="bg-slate-950 rounded-xl p-4">

                  <p className="text-slate-500 text-sm">
                    Posted On
                  </p>

                  <p className="mt-1">
                    {new Date(
                      post.created_at
                    ).toLocaleDateString()}
                  </p>

                </div>

              </div>

              <div className="mt-5">

                <h3 className="font-semibold mb-3">
                  Interview Experience
                </h3>

                <div
                  className="
                    bg-slate-950
                    border
                    border-slate-800
                    rounded-xl
                    p-5
                    whitespace-pre-wrap
                    leading-relaxed
                  "
                >
                  {post.experience}
                </div>

              </div>

              {post.user_id ===
                currentUserId && (

                <div className="mt-5">

                  <button
                    onClick={() =>
                      deleteExperience(
                        post.id
                      )
                    }
                    className="
                      border
                      border-red-500
                      text-red-400
                      px-5
                      py-2
                      rounded-xl
                      hover:bg-red-500/10
                      transition
                    "
                  >
                    Delete Experience
                  </button>

                </div>

              )}

            </div>

          ))}

        </div>
      </div>
              {showForm && (

          <div
            className="
              fixed
              inset-0
              bg-black/70
              flex
              items-center
              justify-center
              z-50
              p-4
            "
          >

            <div
              className="
                bg-slate-900
                border
                border-slate-800
                rounded-3xl
                p-8
                w-full
                max-w-3xl
                max-h-[90vh]
                overflow-y-auto
              "
            >

              <div className="flex justify-between items-center mb-6">

                <h2 className="text-2xl font-bold">
                  Share Interview Experience
                </h2>

                <button
                  onClick={() =>
                    setShowForm(false)
                  }
                  className="
                    text-slate-400
                    hover:text-white
                    text-xl
                  "
                >
                  ✕
                </button>

              </div>

              <div className="grid md:grid-cols-2 gap-4">

                <input
                  value={company}
                  onChange={(e) =>
                    setCompany(
                      e.target.value
                    )
                  }
                  placeholder="Company Name"
                  className="
                    bg-slate-800
                    border
                    border-slate-700
                    p-3
                    rounded-xl
                    outline-none
                  "
                />

                <input
                  value={role}
                  onChange={(e) =>
                    setRole(
                      e.target.value
                    )
                  }
                  placeholder="Role"
                  className="
                    bg-slate-800
                    border
                    border-slate-700
                    p-3
                    rounded-xl
                    outline-none
                  "
                />

                <input
                  value={interviewType}
                  onChange={(e) =>
                    setInterviewType(
                      e.target.value
                    )
                  }
                  placeholder="Interview Type (OA, Technical, HR, System Design...)"
                  className="
                    bg-slate-800
                    border
                    border-slate-700
                    p-3
                    rounded-xl
                    outline-none
                  "
                />

                <input
                  type="number"
                  value={interviewYear}
                  onChange={(e) =>
                    setInterviewYear(
                      Number(
                        e.target.value
                      )
                    )
                  }
                  placeholder="Interview Year"
                  className="
                    bg-slate-800
                    border
                    border-slate-700
                    p-3
                    rounded-xl
                    outline-none
                  "
                />

              </div>

              <div className="mt-5">

                <label className="block mb-2 text-slate-300">
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
                  className="
                    w-full
                    bg-slate-800
                    border
                    border-slate-700
                    p-3
                    rounded-xl
                  "
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

              <div className="mt-5">

                <label className="block mb-2 text-slate-300">
                  Outcome
                </label>

                <select
                  value={
                    String(
                      offerReceived
                    )
                  }
                  onChange={(e) =>
                    setOfferReceived(
                      e.target.value ===
                        "true"
                    )
                  }
                  className="
                    w-full
                    bg-slate-800
                    border
                    border-slate-700
                    p-3
                    rounded-xl
                  "
                >
                  <option value="true">
                    Offer Received
                  </option>

                  <option value="false">
                    No Offer
                  </option>

                </select>

              </div>

              <div className="mt-5">

                <label className="block mb-2 text-slate-300">
                  Share Your Experience
                </label>

                <textarea
                  value={experience}
                  onChange={(e) =>
                    setExperience(
                      e.target.value
                    )
                  }
                  placeholder="Describe the interview process, questions asked, rounds, tips, preparation strategy, surprises, and overall experience..."
                  className="
                    w-full
                    h-48
                    bg-slate-800
                    border
                    border-slate-700
                    p-4
                    rounded-xl
                    resize-none
                    outline-none
                  "
                />

              </div>

              <div className="flex gap-3 mt-6">

                <button
                  onClick={submitPost}
                  className="
                    bg-cyan-500
                    text-black
                    px-6
                    py-3
                    rounded-xl
                    font-semibold
                    hover:opacity-90
                    transition
                  "
                >
                  Submit Experience
                </button>

                <button
                  onClick={() =>
                    setShowForm(false)
                  }
                  className="
                    border
                    border-slate-700
                    px-6
                    py-3
                    rounded-xl
                    hover:bg-slate-800
                    transition
                  "
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>

        )}



    </div>
  );
}