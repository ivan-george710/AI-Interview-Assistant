"use client";

import { useState } from "react";

export default function AdminContestsPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  async function handleCreateContest() {
    const adminId = prompt("Enter Admin User ID");

    if (!adminId) return;

    const response = await fetch(
      `http://localhost:8000/contests?admin_id=${adminId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          start_time: startTime,
          end_time: endTime,
        }),
      }
    );

    const result = await response.json();

    if (result.success) {
      alert("Contest Created Successfully");

      setTitle("");
      setDescription("");
      setStartTime("");
      setEndTime("");
    } else {
      alert(result.message);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">
        Contest Management
      </h1>

      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 max-w-2xl">
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
            className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700"
          />

          <textarea
            placeholder="Contest Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700"
            rows={4}
          />

          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) =>
              setStartTime(e.target.value)
            }
            className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700"
          />

          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) =>
              setEndTime(e.target.value)
            }
            className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700"
          />

          <button
            onClick={handleCreateContest}
            className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-xl font-semibold"
          >
            Create Contest
          </button>
        </div>
      </div>
    </div>
  );
}