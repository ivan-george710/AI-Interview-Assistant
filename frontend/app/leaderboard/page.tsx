"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function LeaderboardPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard =
    async () => {
      try {
        const response =
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/leaderboard`
          );

        const data =
          await response.json();

        setUsers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      <Sidebar />

      <main className="flex-1 p-8">

        <h1 className="text-4xl font-bold mb-8">
          Leaderboard
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">

            <table className="w-full">

              <thead className="bg-slate-800">

                <tr>
                  <th className="p-4 text-left">
                    Rank
                  </th>

                  <th className="p-4 text-left">
                    Name
                  </th>

                  <th className="p-4 text-left">
                    Username
                  </th>

                  <th className="p-4 text-left">
                    XP
                  </th>
                </tr>

              </thead>

              <tbody>

                {users.map(
                  (
                    user,
                    index
                  ) => (
                    <tr
                      key={
                        user.id
                      }
                      className="border-t border-slate-800"
                    >
                      <td className="p-4">
                        #{index + 1}
                      </td>

                      <td className="p-4">
                        {user.full_name ||
                          "Unknown"}
                      </td>

                      <td className="p-4">
                        {user.username ||
                          "-"}
                      </td>

                      <td className="p-4 text-cyan-400 font-bold">
                        {user.xp}
                      </td>
                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </main>

    </div>
  );
}