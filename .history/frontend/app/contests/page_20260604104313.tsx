"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import ContestCard from "@/components/ContestCard";
import Toast from "@/components/Toast";

import {
  getContests,
  getUserContests,
  registerContest,
} from "@/lib/contestApi";

export default function ContestsPage() {
  const [contests, setContests] = useState<any[]>([]);
  const [registeredIds, setRegisteredIds] =
    useState<string[]>([]);

  const [userId, setUserId] =
    useState("");

  const [activeTab, setActiveTab] =
    useState("all");

  const [toast, setToast] = useState({
    show: false,
    message: "",
  });

  useEffect(() => {
    loadUser();
    loadContests();
  }, []);

  useEffect(() => {
    if (userId) {
      loadMyContests();
    }
  }, [userId]);

  async function loadUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      setUserId(user.id);
    }
  }

  async function loadContests() {
    const data = await getContests();
    setContests(data);
  }

  async function loadMyContests() {
    const data =
      await getUserContests(userId);

    setRegisteredIds(
      data.map(
        (item: any) =>
          item.contest_id
      )
    );
  }

  async function handleRegister(
    contestId: string
  ) {
    const result =
      await registerContest(
        contestId,
        userId
      );

    setToast({
      show: true,
      message: result.message,
    });

    setTimeout(() => {
      setToast({
        show: false,
        message: "",
      });
    }, 3000);

    loadMyContests();
  }

  const visibleContests =
    activeTab === "registered"
      ? contests.filter((contest) =>
          registeredIds.includes(
            contest.id
          )
        )
      : contests;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      {toast.show && (
        <Toast
          message={toast.message}
        />
      )}

      <h1 className="text-3xl font-bold mb-8">
        Weekly Contests
      </h1>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() =>
            setActiveTab("all")
          }
          className={`px-4 py-2 rounded-xl ${
            activeTab === "all"
              ? "bg-cyan-600"
              : "bg-slate-800"
          }`}
        >
          All Contests
        </button>

        <button
          onClick={() =>
            setActiveTab(
              "registered"
            )
          }
          className={`px-4 py-2 rounded-xl ${
            activeTab ===
            "registered"
              ? "bg-cyan-600"
              : "bg-slate-800"
          }`}
        >
          My Contests
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {visibleContests.map(
          (contest) => (
            <ContestCard
              key={contest.id}
              title={contest.title}
              description={
                contest.description
              }
              startTime={
                contest.start_time
              }
              endTime={
                contest.end_time
              }
              isRegistered={registeredIds.includes(
                contest.id
              )}
              onRegister={() =>
                handleRegister(
                  contest.id
                )
              }
            />
          )
        )}
      </div>
    </div>
  );
}