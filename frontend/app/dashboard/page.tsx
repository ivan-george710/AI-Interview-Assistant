"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Search,
  LogOut,
  Trophy,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import {
  getUserProfile,
  getUserRank,
} from "@/lib/api";

import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import DailyCodingGoals from "@/components/DailyCodingGoals";
import RecentActivity from "@/components/RecentActivity";
import ProgressChart from "@/components/ProgressChart";
import ReadinessScore from "@/components/ReadinessScore";
import TopicPerformance from "@/components/TopicPerformance";

export default function Dashboard() {
  const router = useRouter();

  const [userName, setUserName] =
    useState("User");

  const [userId, setUserId] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [questionsSolved, setQuestionsSolved] =
    useState(0);

  const [totalXP, setTotalXP] =
    useState(0);

  const [currentStreak, setCurrentStreak] =
    useState(0);

  const [globalRank, setGlobalRank] =
    useState(0);

  const [rankPosition, setRankPosition] =
    useState(0);

  const [userRank, setUserRank] =
    useState("Beginner");

  const currentHour =
    new Date().getHours();

  const greeting =
    currentHour < 12
      ? "Good Morning"
      : currentHour < 18
      ? "Good Afternoon"
      : "Good Evening";

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);

        const {
          data: { user },
        } =
          await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        setUserId(user.id);

        setUserName(
          user.user_metadata
            ?.full_name ||
            user.email ||
            "User"
        );

        // Fetch user profile for stats
        const profile =
          await getUserProfile(
            user.id
          );

        setTotalXP(profile.xp || 0);
        setCurrentStreak(
          profile.current_streak || 0
        );
        setUserRank(
          profile.rank || "Beginner"
        );

        // Fetch rank position
        const rankData =
          await getUserRank(user.id);

        setRankPosition(
          rankData.position || 0
        );

        // Get question count from submissions
        const {
          data: submissions,
          error: submissionError,
        } =
          await supabase
            .from(
              "submissions"
            )
            .select("*")
            .eq("user_id", user.id)
            .eq("status", "accepted");

        if (!submissionError) {
          setQuestionsSolved(
            submissions?.length || 0
          );
        }

        setError("");
      } catch (err) {
        console.error(
          "Error loading dashboard:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-500 mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const initials = userName
    .split(" ")
    .map((word) =>
      word[0]
    )
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500/30">
      <Sidebar />

      <main className="flex-1 p-8 max-w-7xl mx-auto overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-10 bg-slate-900/50 p-4 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-xl font-bold shadow-lg shadow-cyan-500/20">
              {initials}
            </div>

            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                {greeting},{" "}
                {userName}! 👋
              </h1>

              <p className="text-slate-400 text-sm">
                Ready to crush your
                next interview?
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

              <input
                type="text"
                placeholder="Search resources..."
                className="bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:border-cyan-500 transition w-64"
              />
            </div>

            <button className="p-2 rounded-xl bg-slate-800 border border-slate-700 hover:text-cyan-400 transition relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-red-500/50 text-slate-300 hover:text-red-400 px-4 py-2 rounded-xl text-sm font-semibold transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">
                Sign Out
              </span>
            </button>
          </div>
        </header>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl mb-8">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Questions Solved"
            value={
              questionsSolved.toString()
            }
          />

          <StatCard
            title="Current Streak"
            value={
              currentStreak > 0
                ? `${currentStreak} Days`
                : "0 Days"
            }
          />

          <StatCard
            title="Global Rank"
            value={`#${rankPosition}`}
          />

          <StatCard
  title="Total XP"
  value={totalXP.toLocaleString()}
/>
</div>

{/* Weekly Contest */}
      {/* Weekly Contest */}
      <div className="mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="text-yellow-400" />
                <h2 className="text-xl font-bold">
                  Weekly Contest
                </h2>
              </div>

              <p className="text-slate-400">
                Participate in coding contests,
                earn XP, unlock badges and climb
                the leaderboard.
              </p>
            </div>

            <button
              onClick={() => router.push("/contests")}
              className="bg-cyan-600 hover:bg-cyan-500 px-5 py-2 rounded-xl font-semibold transition"
            >
              View Contests
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ProgressChart />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DailyCodingGoals />
            <ReadinessScore />
          </div>
        </div>

        <div className="space-y-6">
          <TopicPerformance />
          <RecentActivity />
        </div>
      </div>
    </main>
  </div>

);

}

