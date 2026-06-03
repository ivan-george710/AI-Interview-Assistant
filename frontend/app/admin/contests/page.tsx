"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ContestsPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [startTime, setStartTime] =
    useState("");

  const [endTime, setEndTime] =
    useState("");

  const [contests, setContests] =
    useState<any[]>([]);

  useEffect(() => {
    loadContests();
  }, []);

  const loadContests = async () => {
    const { data } = await supabase
      .from("contests")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    setContests(data || []);
  };

  const addContest = async () => {
    if (!title) return;

    const { error } =
      await supabase
        .from("contests")
        .insert([
          {
            title,
            description,
            start_time: startTime,
            end_time: endTime,
          },
        ]);

    if (error) {
      console.log(error);
      alert(error.message);
      return;
    }

    setTitle("");
    setDescription("");
    setStartTime("");
    setEndTime("");

    loadContests();
  };

  const deleteContest = async (
    id: string
  ) => {
    await supabase
      .from("contests")
      .delete()
      .eq("id", id);

    loadContests();
  };

  return (
    <div className="p-8 text-white">

      <h1 className="text-3xl font-bold mb-6">
        Contest Management
      </h1>

      <div className="space-y-3 mb-8">

        <input
          type="text"
          placeholder="Contest Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          className="w-full p-3 bg-slate-900 rounded"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
          className="w-full p-3 bg-slate-900 rounded"
        />

        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) =>
            setStartTime(
              e.target.value
            )
          }
          className="w-full p-3 bg-slate-900 rounded"
        />

        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) =>
            setEndTime(
              e.target.value
            )
          }
          className="w-full p-3 bg-slate-900 rounded"
        />

        <button
          onClick={addContest}
          className="bg-green-600 px-4 py-2 rounded"
        >
          Create Contest
        </button>

      </div>

      <div>
        {contests.map((contest) => (
          <div
            key={contest.id}
            className="bg-slate-900 p-4 rounded mb-3"
          >
            <h3 className="font-bold text-xl">
              {contest.title}
            </h3>

            <p>
              {contest.description}
            </p>

            <p>
              Start:
              {" "}
              {contest.start_time}
            </p>

            <p>
              End:
              {" "}
              {contest.end_time}
            </p>

            <button
              onClick={() =>
                deleteContest(
                  contest.id
                )
              }
              className="mt-3 bg-red-600 px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}