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
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [contests, setContests] = useState<Contest[]>([]);

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (error || profile?.role !== "admin") {
      router.push("/dashboard");
      return;
    }

    setAuthorized(true);
    await loadContests();
    setLoading(false);
  }

  async function loadContests() {
    const { data, error } = await supabase
      .from("contests")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.log(error);
      return;
    }

    setContests(data || []);
  }

  async function createContest() {
    if (
      !title ||
      !description ||
      !startTime ||
      !endTime
    ) {
      alert("Please fill all fields");
      return;
    }

    const { error } = await supabase
      .from("contests")
      .insert([
        {
          title,
          description,
          start_time:
            new Date(startTime).toISOString(),
          end_time:
            new Date(endTime).toISOString(),
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Contest created successfully");

    setTitle("");
    setDescription("");
    setStartTime("");
    setEndTime("");

    loadContests();
  }

  async function deleteContest(id: string) {
    const confirmed = window.confirm(
      "Delete this contest?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("contests")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadContests();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          Contest Management
        </h1>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-10">
          <h2 className="text-2xl font-semibold mb-6">
            Create Contest
          </h2>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Contest Title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl"
            />

            <textarea
              placeholder="Contest Description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              rows={4}
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl"
            />

            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) =>
                setStartTime(e.target.value)
              }
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl"
            />

            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) =>
                setEndTime(e.target.value)
              }
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl"
            />

            <button
              onClick={createContest}
              className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-xl font-semibold transition"
            >
              Create Contest
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4">
          Existing Contests
        </h2>

        <div className="space-y-4">
          {contests.length === 0 && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-slate-400">
              No contests found.
            </div>
          )}

          {contests.map((contest) => (
            <div
              key={contest.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
            >
              <h3 className="text-xl font-bold mb-2">
                {contest.title}
              </h3>

              <p className="text-slate-400 mb-3">
                {contest.description}
              </p>

              <div className="text-sm text-slate-500 space-y-1">
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

              <button
                onClick={() =>
                  deleteContest(contest.id)
                }
                className="mt-4 bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg font-medium transition"
              >
                Delete Contest
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}