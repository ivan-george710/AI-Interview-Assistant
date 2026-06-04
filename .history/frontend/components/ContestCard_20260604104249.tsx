"use client";

import { Trophy } from "lucide-react";

interface Props {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  isRegistered: boolean;
  onRegister: () => void;
}

export default function ContestCard({
  title,
  description,
  startTime,
  endTime,
  isRegistered,
  onRegister,
}: Props) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Trophy className="text-yellow-400" />

        <h3 className="font-bold text-lg">
          {title}
        </h3>
      </div>

      <p className="text-slate-400 mb-4">
        {description}
      </p>

      <div className="text-sm text-slate-500 space-y-1 mb-5">
        <p>
          Starts:{" "}
          {new Date(startTime).toLocaleString()}
        </p>

        <p>
          Ends:{" "}
          {new Date(endTime).toLocaleString()}
        </p>
      </div>

      {isRegistered ? (
        <button
          disabled
          className="bg-green-600 px-4 py-2 rounded-xl font-semibold"
        >
          ✓ Registered
        </button>
      ) : (
        <button
          onClick={onRegister}
          className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-xl font-semibold transition"
        >
          Register
        </button>
      )}
    </div>
  );
}