import Link from "next/link";
import { User, Bell, Search, LogOut } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import DailyCodingGoals from "@/components/DailyCodingGoals";
import RecentActivity from "@/components/RecentActivity";
import ProgressChart from "@/components/ProgressChart";
import ReadinessScore from "@/components/ReadinessScore";
import TopicPerformance from "@/components/TopicPerformance";

export default function Dashboard() {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good Morning" : currentHour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="flex min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500/30">
      <Sidebar />

      <main className="flex-1 p-8 max-w-7xl mx-auto overflow-y-auto">
        {/* Top Navigation / Header */}
        <header className="flex justify-between items-center mb-10 bg-slate-900/50 p-4 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-xl font-bold shadow-lg shadow-cyan-500/20">
              JS
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                {greeting}, John! 👋
              </h1>
              <p className="text-slate-400 text-sm">
                Ready to crush your next interview?
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
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <Link
              href="/"
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-red-500/50 text-slate-300 hover:text-red-400 px-4 py-2 rounded-xl text-sm font-semibold transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Link>
          </div>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Questions Solved"
            value="143"
          />
          <StatCard
            title="Current Streak"
            value="15 Days"
          />
          <StatCard
            title="Global Rank"
            value="#52"
          />
          <StatCard
            title="Total XP"
            value="12,450"
          />
        </div>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column (takes up 2 columns on large screens) */}
          <div className="lg:col-span-2 space-y-6">
            <ProgressChart />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DailyCodingGoals />
              <ReadinessScore />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <TopicPerformance />
            <RecentActivity />
          </div>
        </div>
      </main>
    </div>
  );
}