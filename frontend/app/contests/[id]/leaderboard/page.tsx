"use client";

import { useEffect, useState } from "react";

interface Props {
  params: {
    id: string;
  };
}

export default function LeaderboardPage({
  params,
}: Props) {

  const [leaderboard, setLeaderboard] =
    useState<any[]>([]);

  useEffect(() => {

    loadLeaderboard();

    const interval =
      setInterval(
        loadLeaderboard,
        5000
      );

    return () =>
      clearInterval(
        interval
      );

  }, []);

  async function loadLeaderboard() {

    const res =
      await fetch(
        `http://localhost:8000/contests/${params.id}/leaderboard`
      );

    const data =
      await res.json();

    setLeaderboard(data);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      <h1 className="text-4xl font-bold mb-8">
        Live Leaderboard
      </h1>

      <div className="bg-slate-900 rounded-xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-800">

            <tr>

              <th className="p-4 text-left">
                Rank
              </th>

              <th className="p-4 text-left">
                User
              </th>

              <th className="p-4 text-left">
                Score
              </th>

              <th className="p-4 text-left">
                Solved
              </th>

              <th className="p-4 text-left">
                Penalty
              </th>

            </tr>

          </thead>

          <tbody>

            {leaderboard.map(
              (
                row,
                index
              ) => (
                <tr
                  key={`${row.user_id}-${index}`}
                  className="border-t border-slate-800"
                >

                  <td className="p-4">
                    {row.rank}
                  </td>

                  <td className="p-4">
                    {row.user_id}
                  </td>

                  <td className="p-4">
                    {row.total_score}
                  </td>

                  <td className="p-4">
                    {row.solved}
                  </td>

                  <td className="p-4">
                    {row.penalty}
                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}