"use client";

import { useEffect, useState } from "react";

interface Props {
  params: {
    id: string;
  };
}

export default function ContestDetailsPage({
  params,
}: Props) {

  const [contest, setContest] =
    useState<any>(null);

  const [problems, setProblems] =
    useState<any[]>([]);

  const [participants, setParticipants] =
    useState(0);

  const [timeLeft, setTimeLeft] =
    useState("");

  useEffect(() => {
    loadContest();
  }, []);

  useEffect(() => {

    if (!contest)
      return;

    const interval =
      setInterval(() => {

        const now =
          new Date().getTime();

        const start =
          new Date(
            contest.start_time
          ).getTime();

        const end =
          new Date(
            contest.end_time
          ).getTime();

        if (now < start) {

          const diff =
            start - now;

          const hours =
            Math.floor(
              diff /
                1000 /
                60 /
                60
            );

          const minutes =
            Math.floor(
              (
                diff /
                1000 /
                60
              ) % 60
            );

          const seconds =
            Math.floor(
              (
                diff /
                1000
              ) % 60
            );

          setTimeLeft(
            `Starts in ${hours}h ${minutes}m ${seconds}s`
          );

          return;
        }

        if (now > end) {

          setTimeLeft(
            "Contest Ended"
          );

          return;
        }

        const diff =
          end - now;

        const hours =
          Math.floor(
            diff /
              1000 /
              60 /
              60
          );

        const minutes =
          Math.floor(
            (
              diff /
              1000 /
              60
            ) % 60
          );

        const seconds =
          Math.floor(
            (
              diff /
              1000
            ) % 60
          );

        setTimeLeft(
          `${hours}h ${minutes}m ${seconds}s remaining`
        );

      }, 1000);

    return () =>
      clearInterval(
        interval
      );

  }, [contest]);

  async function loadContest() {

    const contestRes =
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/contests/${params.id}`
      );

    const contestData =
      await contestRes.json();

    setContest(
      contestData
    );

    const problemRes =
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/contests/${params.id}/problems`
      );

    const problemData =
      await problemRes.json();

    setProblems(
      problemData
    );

    const statsRes =
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/contests/${params.id}/stats`
      );

    const statsData =
      await statsRes.json();

    setParticipants(
      statsData.participants
    );
  }

  if (!contest) {

    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading...
      </div>
    );

  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      <div className="flex justify-between items-start mb-8">

        <div>

          <h1 className="text-4xl font-bold mb-2">
            {contest.title}
          </h1>

          <p className="text-slate-400">
            {contest.description}
          </p>

        </div>

        <a
          href={`/contests/${params.id}/leaderboard`}
          className="bg-cyan-600 hover:bg-cyan-500 px-6 py-3 rounded-xl font-semibold"
        >
          View Leaderboard
        </a>

      </div>

      <div className="bg-cyan-600 rounded-xl p-5 mb-8">

        <h2 className="font-semibold text-lg">
          Contest Timer
        </h2>

        <p className="text-2xl font-bold mt-2">
          {timeLeft}
        </p>

      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">

        <div className="bg-slate-900 p-5 rounded-xl">

          <h3 className="font-semibold mb-2">
            Start Time
          </h3>

          <p>
            {new Date(
              contest.start_time
            ).toLocaleString()}
          </p>

        </div>

        <div className="bg-slate-900 p-5 rounded-xl">

          <h3 className="font-semibold mb-2">
            End Time
          </h3>

          <p>
            {new Date(
              contest.end_time
            ).toLocaleString()}
          </p>

        </div>

        <div className="bg-slate-900 p-5 rounded-xl">

          <h3 className="font-semibold mb-2">
            Participants
          </h3>

          <p className="text-xl">
            {participants}
          </p>

        </div>

      </div>

      <h2 className="text-2xl font-bold mb-6">
        Contest Problems
      </h2>

      <div className="space-y-4">

        {problems.map(
          (problem: any) => (

            <a
              key={problem.id}
              href={`/contests/${params.id}/problem/${problem.id}`}
            >

              <div className="bg-slate-900 hover:bg-slate-800 transition rounded-xl p-5 cursor-pointer">

                <div className="flex justify-between items-center">

                  <div>

                    <h3 className="text-lg font-semibold">
                      {problem.title}
                    </h3>

                    <p className="text-slate-400 text-sm mt-1">
                      {problem.difficulty}
                    </p>

                  </div>

                  <div className="text-cyan-400 font-bold">

                    {problem.points}
                    {" "}
                    pts

                  </div>

                </div>

              </div>

            </a>

          )
        )}

      </div>

    </div>
  );
}