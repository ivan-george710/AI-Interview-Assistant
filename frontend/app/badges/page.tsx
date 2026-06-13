"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Award } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { getUserBadges } from "@/lib/api";

import Sidebar from "@/components/Sidebar";

interface Badge {
  id: string;
  name: string;
  description?: string;
}

export default function BadgesPage() {
  const router = useRouter();

  const [badges, setBadges] =
    useState<Badge[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [userName, setUserName] =
    useState("User");

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

        setUserName(
          user.user_metadata
            ?.full_name ||
            user.email ||
            "User"
        );

        // Fetch badges
        const badgesData =
          await getUserBadges(user.id);

        setBadges(badgesData);

        setError("");
      } catch (err) {
        console.error(
          "Error loading badges:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load badges"
        );
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [router]);

  const getBadgeIcon = (
    badgeName: string
  ) => {
    const name =
      badgeName.toLowerCase();

    if (name.includes("100")) {
      return "🔥";
    } else if (
      name.includes("500")
    ) {
      return "⚡";
    } else if (
      name.includes("first")
    ) {
      return "🚀";
    } else if (
      name.includes("streak")
    ) {
      return "🎯";
    } else if (
      name.includes("master")
    ) {
      return "👑";
    }

    return "🏆";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-950 text-white">
        <Sidebar />

        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-500 mx-auto mb-4"></div>
            <p>Loading badges...</p>
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
            <Award className="w-8 h-8 text-emerald-400" />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
              Achievements
            </h1>
          </div>

          <p className="text-slate-400">
            {userName}, you have unlocked{" "}
            <span className="text-emerald-400 font-semibold">
              {badges.length}
            </span>{" "}
            badges so far
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl mb-8">
            {error}
          </div>
        )}

        {/* Badges Grid */}
        {badges.length === 0 ? (
          <div className="text-center py-20">
            <Star className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-4">
              No badges unlocked yet
            </p>
            <p className="text-sm text-slate-500">
              Start solving problems to
              earn badges!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map(
              (badge: Badge) => (
                <div
                  key={badge.id}
                  className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/50 rounded-2xl p-6 hover:border-emerald-400/50 transition group cursor-pointer"
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition">
                    {getBadgeIcon(
                      badge.name
                    )}
                  </div>

                  <h3 className="text-lg font-bold mb-2">
                    {badge.name}
                  </h3>

                  <p className="text-sm text-slate-400">
                    {badge.description ||
                      "Achievement unlocked"}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-700/50">
                    <p className="text-xs text-emerald-400 font-semibold">
                      ✓ UNLOCKED
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </main>
    </div>
  );
}
