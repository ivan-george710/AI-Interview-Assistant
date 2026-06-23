"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Contest {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  created_at?: string;
}

export default function AdminContestsPage() {

  const router =
    useRouter();

  const [loading, setLoading] =
    useState(true);

  const [authorized, setAuthorized] =
    useState(false);

  const [contests, setContests] =
    useState<Contest[]>([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {

      router.push(
        "/login"
      );

      return;
    }

    const {
      data: profile,
      error,
    } =
      await supabase
        .from("profiles")
        .select("role")
        .eq(
          "id",
          user.id
        )
        .single();

    if (
      error ||
      profile?.role !==
        "admin"
    ) {

      router.push(
        "/dashboard"
      );

      return;
    }

    setAuthorized(
      true
    );

    await loadContests();

    setLoading(
      false
    );
  }

  async function loadContests() {

    const {
      data,
      error,
    } =
      await supabase
        .from("contests")
        .select("*")
        .order(
          "created_at",
          {
            ascending:
              false,
          }
        );

    if (error) {

      console.log(
        error
      );

      return;
    }

    setContests(
      data || []
    );
  }

  async function deleteContest(
    id: string
  ) {

    const confirmed =
      window.confirm(
        "Delete this contest?"
      );

    if (
      !confirmed
    )
      return;

    const {
      error,
    } =
      await supabase
        .from(
          "contests"
        )
        .delete()
        .eq(
          "id",
          id
        );

    if (error) {

      alert(
        error.message
      );

      return;
    }

    loadContests();
  }

  if (loading) {

    return (

      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">

        Loading...

      </div>

    );
  }

  if (!authorized)
    return null;

  const now =
    new Date();

  const activeContests =
    contests.filter(
      (
        contest
      ) =>
        new Date(
          contest.start_time
        ) <= now &&
        new Date(
          contest.end_time
        ) >= now
    ).length;

  const upcomingContests =
    contests.filter(
      (
        contest
      ) =>
        new Date(
          contest.start_time
        ) > now
    ).length;

  const completedContests =
    contests.filter(
      (
        contest
      ) =>
        new Date(
          contest.end_time
        ) < now
    ).length;

  const filteredContests =
    contests.filter(
      (
        contest
      ) =>
        contest.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  return (

    <div className="min-h-screen bg-slate-950 text-white p-8">

      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-8">

          <div>

            <h1 className="text-4xl font-bold">
              Contest Management
            </h1>

            <p className="text-slate-400 mt-2">
              Manage all coding contests
            </p>

          </div>

          <button
            onClick={() =>
              router.push(
                "/admin/contests/create"
              )
            }
            className="bg-cyan-600 hover:bg-cyan-500 px-6 py-3 rounded-xl font-semibold"
          >
            + Create Contest
          </button>

        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <p className="text-slate-400">
              Total Contests
            </p>

            <h2 className="text-4xl font-bold mt-2">
              {contests.length}
            </h2>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <p className="text-slate-400">
              Active
            </p>

            <h2 className="text-4xl font-bold text-green-400 mt-2">
              {activeContests}
            </h2>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <p className="text-slate-400">
              Upcoming
            </p>

            <h2 className="text-4xl font-bold text-yellow-400 mt-2">
              {upcomingContests}
            </h2>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <p className="text-slate-400">
              Completed
            </p>

            <h2 className="text-4xl font-bold text-red-400 mt-2">
              {completedContests}
            </h2>

          </div>

        </div>

        <input
          type="text"
          placeholder="Search contests..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="w-full bg-slate-900 border border-slate-800 p-4 rounded-2xl mb-8"
        />

        <div className="space-y-4">

          {filteredContests.map(
            (
              contest
            ) => {

              const status =
                new Date(
                  contest.start_time
                ) > now
                  ? "Upcoming"
                  : new Date(
                      contest.end_time
                    ) < now
                  ? "Completed"
                  : "Active";

              return (

                <div
                  key={
                    contest.id
                  }
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
                >

                  <div className="flex justify-between items-start">

                    <div>

                      <h2 className="text-2xl font-bold">
                        {
                          contest.title
                        }
                      </h2>

                      <p className="text-slate-400 mt-2">
                        {
                          contest.description
                        }
                      </p>

                    </div>

                    <span
                      className={`px-4 py-2 rounded-xl font-semibold ${
                        status ===
                        "Active"
                          ? "bg-green-600"
                          : status ===
                            "Upcoming"
                          ? "bg-yellow-600"
                          : "bg-red-600"
                      }`}
                    >
                      {status}
                    </span>

                  </div>

                  <div className="mt-4 text-slate-400">

                    <p>
                      Start:{" "}
                      {new Date(
                        contest.start_time
                      ).toLocaleString()}
                    </p>

                    <p>
                      End:{" "}
                      {new Date(
                        contest.end_time
                      ).toLocaleString()}
                    </p>

                  </div>

                  <div className="flex gap-3 mt-6">

                    <button
                      onClick={() =>
                        router.push(
                          `/admin/contests/${contest.id}`
                        )
                      }
                      className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-lg"
                    >
                      View Contest
                    </button>

                    <button
                      onClick={() =>
                        deleteContest(
                          contest.id
                        )
                      }
                      className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              );
            }
          )}

          {filteredContests.length ===
            0 && (

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">

              No contests found.

            </div>

          )}

        </div>

      </div>

    </div>

  );
}