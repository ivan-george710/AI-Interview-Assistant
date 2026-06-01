import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import DailyChallenge from "@/components/DailyChallenge";
import RecentActivity from "@/components/RecentActivity";
import ProgressChart from "@/components/ProgressChart";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold">
              Welcome Back 👋
            </h1>

            <p className="text-slate-400 mt-2">
              Track your interview preparation progress.
            </p>
          </div>

          <Link
            href="/"
            className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-xl font-semibold transition"
          >
            Logout
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mt-10">
          <StatCard
            title="Questions Solved"
            value="143"
          />

          <StatCard
            title="Readiness Score"
            value="85%"
          />

          <StatCard
            title="Current Streak"
            value="15 Days"
          />

          <StatCard
            title="Rank"
            value="#52"
          />
        </div>

        {/* Challenge + Activity */}
        <div className="grid md:grid-cols-2 gap-6 mt-10">
          <DailyChallenge />
          <RecentActivity />
        </div>

        {/* Progress Chart */}
        <div className="mt-8">
          <ProgressChart />
        </div>
      </main>
    </div>
  );
}