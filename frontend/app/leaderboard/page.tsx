"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { getLeaderboard } from "@/lib/api";

import Sidebar from "@/components/Sidebar";

interface LeaderboardUser {
  id: string;
  full_name: string;
  username: string;
  xp: number;
  rank: string;
}

export default function LeaderboardPage() {
  const router = useRouter();

  const [users, setUsers] = useState<
    LeaderboardUser[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [userPosition, setUserPosition] =
    useState(0);

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);

        // Check auth
        const {
          data: { user },
        } =
          await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        // Fetch leaderboard
        const leaderboardData =
          await getLeaderboard();

        setUsers(leaderboardData);

        // Find user's position
        const position =
          leaderboardData.findIndex(
            (u: LeaderboardUser) =>
              u.id === user.id
          ) + 1;

        setUserPosition(
          position > 0 ? position : 0
        );

        setError("");
      } catch (err) {
        console.error(
          "Error loading leaderboard:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load leaderboard"
        );
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [router]);

  const getRankColor = (rank: string) => {
    switch (rank) {
      case "Expert":
        return "from-yellow-500 to-orange-500";
      case "Interview Ready":
        return "from-cyan-500 to-blue-500";
      case "Problem Solver":
        return "from-emerald-500 to-cyan-500";
      case "Explorer":
        return "from-purple-500 to-pink-500";
      case "Learner":
        return "from-blue-500 to-cyan-500";
      default:
        return "from-slate-500 to-slate-600";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-950 text-white">
        <Sidebar />

        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-500 mx-auto mb-4"></div>
            <p>Loading leaderboard...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500/30">
      <Sidebar />

      <main className="flex-1 p-8 max-w-5xl mx-auto overflow-y-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-cyan-400" />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
              Global Leaderboard
            </h1>
          </div>

          <p className="text-slate-400">
            Top performers in the AI
            Interview Assistant community
          </p>
        </div>

        {/* Current User Position */}
        {userPosition > 0 && (
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 rounded-2xl p-6 mb-8">
            <p className="text-slate-300">
              Your Position
            </p>
            <p className="text-3xl font-bold text-cyan-400">
              #{userPosition}
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl mb-8">
            {error}
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="space-y-3">
          {users.length === 0 ? (
            <div className="text-center text-slate-400 py-12">
              No users on leaderboard yet
            </div>
          ) : (
            users.map(
              (
                user: LeaderboardUser,
                index: number
              ) => (
                <div
                  key={user.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition ${
                    index < 3
                      ? "bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-cyan-500/50"
                      : "bg-slate-900/30 border-slate-800/50 hover:border-slate-700/50"
                  }`}
                >
                  {/* Rank Badge */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-lg font-bold">
                    {index < 3 ? (
                      index ===
                      0 ? (
                        "🥇"
                      ) : index ===
                      1 ? (
                        "🥈"
                      ) : (
                        "🥉"
                      )
                    ) : (
                      <span className="text-slate-400">
                        #{index + 1}
                      </span>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <p className="font-semibold text-lg">
                      {user.full_name ||
                        user.username}
                    </p>

                    <p className="text-sm text-slate-400">
                      @{user.username}
                    </p>
                  </div>

                  {/* Rank Badge */}
                  <div
                    className={`hidden md:inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getRankColor(
                      user.rank
                    )}`}
                  >
                    {user.rank}
                  </div>

                  {/* XP */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-cyan-400">
                      {user.xp.toLocaleString()}
                    </p>

                    <p className="text-xs text-slate-400">
                      XP
                    </p>
                  </div>
                </div>
              )
            )
          )}
        </div>
      </main>
    </div>
  );
}
