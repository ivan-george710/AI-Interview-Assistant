"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import XPProgressChart from "@/components/XPProgressChart";
import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import AnalyticsCard from "@/components/AnalyticsCard";
import TopicProgress from "@/components/TopicProgress";

export default function AnalyticsPage() {
  const { user, loading } = useAuth();

  const [analytics, setAnalytics] = useState({
    attempts: 0,
    accepted: 0,
    xp: 0,
    acceptanceRate: 0,
  });

  const [topicStats, setTopicStats] =
    useState<Record<
      string,
      {
        attempts: number;
        accepted: number;
      }
    >>({});

  const [weakAreas, setWeakAreas] =
    useState<string[]>([]);

  const [readinessScore, setReadinessScore] =
    useState(0);

  const [xpProgress, setXpProgress] =
    useState<any[]>([]);

  const [difficultyStats, setDifficultyStats] =
  useState<Record<
    string,
    {
      attempts: number;
      accepted: number;
    }
  >>({});

  useEffect(() => {
    console.log("Auth User:", user);

    if (!user) return;

    fetchAnalytics();
  }, [user]);

  async function fetchAnalytics() {
    console.log("Current User:", user);

    const {
      data: submissions,
      error,
    } = await supabase
      .from("submissions")
      .select(`
        *,

        problems (
        id,
        title,
        topic,
        difficulty
      )
    `)
  .eq("user_id", user?.id);

console.log(
  "Joined Submissions:",
  submissions
);

if (error) {
  console.error(error);
  return;
}

    console.log(
      "Joined Submissions:",
       submissions
    );

    if (error) {
      console.error(error);
      return;
    }

    const attempts = submissions?.length || 0;

    const accepted =
      submissions?.filter(
        (s) => s.status === "Accepted"
      ).length || 0;

    const xp =
      submissions?.reduce(
        (sum, s) => sum + (s.xp_earned || 0),
        0
      ) || 0;

    const acceptanceRate =
      attempts > 0
        ? (accepted / attempts) * 100
        : 0;

    setAnalytics({
      attempts,
      accepted,
      xp,
      acceptanceRate,
    });
    
    const stats: Record<
      string,
      {
        attempts: number;
        accepted: number;
      }
    > = {};

    const difficultyData: Record<
      string,
      {
        attempts: number;
        accepted: number;
      }
    > = {};

    submissions?.forEach((submission: any) => {
      const topic =
        submission.problems?.topic ||
        "Unknown";

      const difficulty =
        submission.problems?.difficulty ||
        "Unknown";

      if (!difficultyData[difficulty]) {
        difficultyData[difficulty] = {
          attempts: 0,
          accepted: 0,
        };
      }

      difficultyData[difficulty].attempts++;

      if (
        submission.status ===
        "Accepted"
      ) {
        difficultyData[difficulty].accepted++;
      }

      if (!stats[topic]) {
        stats[topic] = {
          attempts: 0,
          accepted: 0,
        };
      }

      stats[topic].attempts++;

      if (
        submission.status ===
        "Accepted"
      ) {
        stats[topic].accepted++;
      }
    });

    setTopicStats(stats);
    setDifficultyStats(
      difficultyData
    );
    const totalTopics = 3;
    const coveredTopics =
      Object.keys(stats).length;
    
    const difficultyAccuracy =
      Object.values(
        difficultyData
      ).reduce(
        (sum, diff) =>
          sum +
          (diff.accepted /
            diff.attempts) *
            100,
        0
      ) /
      Math.max(
        Object.keys(
          difficultyData
        ).length,
        1
      );
    
    const xpScore =
      Math.min(
        (xp / 500) * 100,
        100
      );

    const readiness =
      acceptanceRate * 0.4 +
      (coveredTopics /
        totalTopics) *
        100 *
        0.3 +
      difficultyAccuracy *
        0.2 +
      xpScore * 0.1;

    setReadinessScore(
      Math.round(
        readiness
      )
    );
    const sortedSubmissions =
      [...submissions].sort(
        (a: any, b: any) =>
          new Date(
            a.submitted_at
          ).getTime() -
          new Date(
            b.submitted_at
          ).getTime()
        );

      let runningXP = 0;

      const xpTrend =
        sortedSubmissions.map(
          (submission: any) => {
            runningXP +=
              submission.xp_earned || 0;

            return {
              date:
                submission.submitted_at.split(
                  "T"
                )[0],
              xp: runningXP,
            };
          }
        );

    setXpProgress(xpTrend);
    const weakTopics = Object.entries(stats)
      .filter(
        ([_, data]) =>
          ((data.accepted /
            data.attempts) *
            100) <=
          50
      )
      .map(([topic]) => topic);

    setWeakAreas(weakTopics);
  }
  

  if (loading) {
    return <div>Loading...</div>;
  }

return (
  <div className="flex min-h-screen bg-slate-950 text-white">
    <Sidebar />

    <main className="flex-1 p-8 max-w-7xl mx-auto overflow-y-auto">

      <h1 className="text-3xl font-bold mb-8">
        Analytics Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard
          title="Attempts"
          value={analytics.attempts.toString()}
        />

        <StatCard
          title="Accepted"
          value={analytics.accepted.toString()}
        />

        <StatCard
          title="XP"
          value={analytics.xp.toString()}
        />

        <StatCard
          title="Acceptance Rate"
          value={`${analytics.acceptanceRate.toFixed(
            1
          )}%`}
        />

        <StatCard
          title="Readiness"
          value={`${readinessScore}/100`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 space-y-6">

          <AnalyticsCard title="Topic Performance">
            <div>
              {Object.entries(topicStats).map(
                ([topic, data]: any) => {
                  const accuracy =
                    (data.accepted /
                      data.attempts) *
                    100;

                  return (
                    <TopicProgress
                      key={topic}
                      topic={topic}
                      accuracy={accuracy}
                    />
                  );
                }
              )}
            </div>
          </AnalyticsCard>

          <AnalyticsCard title="XP Progress">
            <XPProgressChart
              data={xpProgress}
            />
          </AnalyticsCard>

        </div>

        <div className="space-y-6">

          <AnalyticsCard title="Weak Areas">

            {weakAreas.length === 0 ? (
              <p>
                No weak areas detected.
              </p>
            ) : (
              <div className="space-y-3">
                {weakAreas.map(
                  (topic) => (
                    <div
                      key={topic}
                      className="bg-red-500/10 border border-red-500/20 rounded-xl p-3"
                    >
                      {topic}
                    </div>
                  )
                )}
              </div>
            )}

          </AnalyticsCard>

        </div>

      </div>

    </main>
  </div>
);
}