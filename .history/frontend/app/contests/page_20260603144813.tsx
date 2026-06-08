"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import ContestCard from "@/components/ContestCard";

import {
  getContests,
  registerContest,
} from "@/lib/contestApi";

export default function ContestsPage() {
  const [contests, setContests] = useState<any[]>([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    loadContests();
    loadUser();
  }, []);

  async function loadUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      setUserId(user.id);
    }
  }

  async function loadContests() {
    try {
      const data = await getContests();
      setContests(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleRegister(
    contestId: string
  ) {
    const result =
      await registerContest(
        contestId,
        userId
      );

    alert(result.message);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">
        Weekly Contests
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {contests.map((contest) => (
          <ContestCard
            key={contest.id}
            title={contest.title}
            description={
              contest.description
            }
            startTime={
              contest.start_time
            }
            endTime={contest.end_time}
            onRegister={() =>
              handleRegister(contest.id)
            }
          />
        ))}
      </div>
    </div>
  );
}