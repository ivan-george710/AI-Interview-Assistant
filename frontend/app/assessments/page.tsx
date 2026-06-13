"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Play,
  CheckCircle,
  Clock,
  Trophy,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import {
  getAssessments,
  startAssessment,
  getAssessmentLeaderboard,
} from "@/lib/api";

import Sidebar from "@/components/Sidebar";

interface Assessment {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

interface LeaderboardEntry {
  user_id: string;
  full_name: string;
  username: string;
  score: number;
  completed_at: string;
}

export default function AssessmentsPage() {
  const router = useRouter();

  const [assessments, setAssessments] =
    useState<Assessment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [userId, setUserId] =
    useState("");

  const [selectedAssessment, setSelectedAssessment] =
    useState<Assessment | null>(null);

  const [leaderboard, setLeaderboard] =
    useState<LeaderboardEntry[]>([]);

  const [showLeaderboard, setShowLeaderboard] =
    useState(false);

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

        setUserId(user.id);

        // Fetch assessments
        const assessmentsData =
          await getAssessments();

        setAssessments(
          assessmentsData
        );

        setError("");
      } catch (err) {
        console.error(
          "Error loading assessments:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load assessments"
        );
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [router]);

  const handleStartAssessment = async (
    assessment: Assessment
  ) => {
    try {
      const result =
        await startAssessment(
          assessment.id,
          userId
        );

      // In a real app, navigate to assessment taker
      // For now, show success message
      alert(
        `Assessment started! Attempt ID: ${result.attempt_id}`
      );

      setSelectedAssessment(null);
    } catch (err) {
      alert(
        `Error starting assessment: ${
          err instanceof Error
            ? err.message
            : "Unknown error"
        }`
      );
    }
  };

  const handleViewLeaderboard = async (
    assessment: Assessment
  ) => {
    try {
      const leaderboardData =
        await getAssessmentLeaderboard(
          assessment.id
        );

      setLeaderboard(
        leaderboardData
      );

      setSelectedAssessment(
        assessment
      );

      setShowLeaderboard(true);
    } catch (err) {
      alert(
        `Error loading leaderboard: ${
          err instanceof Error
            ? err.message
            : "Unknown error"
        }`
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-950 text-white">
        <Sidebar />

        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-500 mx-auto mb-4"></div>
            <p>
              Loading assessments...
            </p>
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
            <BookOpen className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
              Assessments
            </h1>
          </div>

          <p className="text-slate-400">
            Take structured assessments to
            evaluate your skills
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl mb-8">
            {error}
          </div>
        )}

        {assessments.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-4">
              No assessments available
            </p>
            <p className="text-sm text-slate-500">
              Check back later for new
              assessments
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {assessments.map(
              (assessment: Assessment) => (
                <div
                  key={assessment.id}
                  className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-blue-500/50 rounded-2xl p-6 hover:border-blue-400/50 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">
                        {
                          assessment.title
                        }
                      </h3>

                      <p className="text-slate-400 mb-4">
                        {
                          assessment.description
                        }
                      </p>

                      <div className="flex gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Created:{" "}
                          {new Date(
                            assessment.created_at
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          handleViewLeaderboard(
                            assessment
                          )
                        }
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-300 px-4 py-2 rounded-xl text-sm font-semibold transition"
                      >
                        <Trophy className="w-4 h-4" />
                        Leaderboard
                      </button>

                      <button
                        onClick={() =>
                          handleStartAssessment(
                            assessment
                          )
                        }
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
                      >
                        <Play className="w-4 h-4" />
                        Take Assessment
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* Leaderboard Modal */}
        {showLeaderboard &&
        selectedAssessment ? (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-400">
                  {
                    selectedAssessment.title
                  }{" "}
                  - Leaderboard
                </h2>

                <button
                  onClick={() =>
                    setShowLeaderboard(
                      false
                    )
                  }
                  className="text-slate-400 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>

              {leaderboard.length ===
              0 ? (
                <p className="text-slate-400 text-center py-8">
                  No submissions yet
                </p>
              ) : (
                <div className="space-y-3">
                  {leaderboard.map(
                    (
                      entry: LeaderboardEntry,
                      index: number
                    ) => (
                      <div
                        key={
                          entry.user_id
                        }
                        className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-sm font-bold">
                          {index +
                            1}
                        </div>

                        <div className="flex-1">
                          <p className="font-semibold">
                            {
                              entry.full_name
                            }
                          </p>

                          <p className="text-sm text-slate-400">
                            @
                            {
                              entry.username
                            }
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-bold text-cyan-400">
                            {
                              entry.score
                            }
                          </p>

                          <p className="text-xs text-slate-400">
                            Score
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
