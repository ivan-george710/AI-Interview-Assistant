import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import ProgressChart from "@/components/ProgressChart"
import TopicPerformance from "@/components/TopicPerformance";;

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <main className="flex-1 p-8">

        <h1 className="text-4xl font-bold">
          Performance Analytics
        </h1>

        <p className="text-slate-400 mt-2">
          Track your coding and interview progress.
        </p>

        <div className="grid grid-cols-4 gap-6 mt-8">

          <StatCard
            title="Accuracy"
            value="87%"
          />

          <StatCard
            title="Avg Time"
            value="12 min"
          />

          <StatCard
            title="Strong Topic"
            value="Arrays"
          />

          <StatCard
            title="Weak Topic"
            value="DP"
          />

        </div>

        <div className="mt-8">
          <ProgressChart />
        </div>
        <div className="mt-8">
            <TopicPerformance />
        </div>
      </main>
    </div>
  );
}