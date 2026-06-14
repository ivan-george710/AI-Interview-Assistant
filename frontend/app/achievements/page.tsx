"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";

export default function AchievementsPage() {
  const [badges, setBadges] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = async () => {
    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) return;

    const { data: allBadges } =
      await supabase
        .from("badges")
        .select("*");

    const {
      data: earnedBadges,
    } =
      await supabase
        .from("user_badges")
        .select("*")
        .eq(
          "user_id",
          user.id
        );

    const earnedIds =
      earnedBadges?.map(
        (b) => b.badge_id
      ) || [];

    const merged =
      allBadges?.map(
        (badge) => ({
          ...badge,
          unlocked:
            earnedIds.includes(
              badge.id
            ),
          earnedAt:
            earnedBadges?.find(
              (e) =>
                e.badge_id ===
                badge.id
            )?.earned_at,
        })
      ) || [];

    setBadges(merged);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <main className="flex-1 p-8">
        <h1 className="text-4xl font-bold mb-8">
          Achievements
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map(
              (badge) => (
                <div
                  key={badge.id}
                  className={`rounded-2xl p-6 border ${
                    badge.unlocked
                      ? "bg-slate-900 border-cyan-500"
                      : "bg-slate-900 border-slate-800 opacity-60"
                  }`}
                >
                  <h2 className="text-xl font-bold mb-2">
                    {badge.name}
                  </h2>

                  <p className="text-slate-400 mb-4">
                    {badge.description}
                  </p>

                  {badge.unlocked ? (
                    <div className="text-cyan-400">
                      Unlocked
                      <div className="text-sm text-slate-500 mt-1">
                        {new Date(
                          badge.earnedAt
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-500">
                      Locked
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        )}
      </main>
    </div>
  );
}