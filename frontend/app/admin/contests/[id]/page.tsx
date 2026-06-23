"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ContestDetailsPage() {

  const params =
    useParams();

  const contestId =
    params.id as string;

  const [contest, setContest] =
    useState<any>(null);

  const [questions, setQuestions] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    if (contestId) {
      loadContest();
    }

  }, [contestId]);

  async function loadContest() {

    const {
      data: contestData
    } =
      await supabase
        .from("contests")
        .select("*")
        .eq(
          "id",
          contestId
        )
        .single();

    setContest(
      contestData
    );

    const {
      data: contestProblems
    } =
      await supabase
        .from(
          "contest_problems"
        )
        .select("*")
        .eq(
          "contest_id",
          contestId
        );

    if (
      contestProblems &&
      contestProblems.length > 0
    ) {

      const ids =
        contestProblems.map(
          (
            problem
          ) =>
            problem.problem_id
        );

      const {
        data:
          questionData
      } =
        await supabase
          .from(
            "questions"
          )
          .select("*")
          .in(
            "id",
            ids
          );

      const merged =
        contestProblems.map(
          (
            cp
          ) => ({

            ...cp,

            question:
              questionData?.find(
                (
                  q
                ) =>
                  q.id ===
                  cp.problem_id
              )

          })
        );

      setQuestions(
        merged
      );
    }

    setLoading(
      false
    );
  }

  if (loading) {

    return (

      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">

        Loading...

      </div>

    );
  }

  if (!contest) {

    return (

      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">

        Contest not found

      </div>

    );
  }

  const totalPoints =
    questions.reduce(
      (
        sum,
        q
      ) =>
        sum +
        (
          q.points ||
          0
        ),
      0
    );

  return (

    <div className="min-h-screen bg-slate-950 text-white p-8">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold mb-2">
          {contest.title}
        </h1>

        <p className="text-slate-400 mb-8">
          {contest.description}
        </p>

        <div className="grid md:grid-cols-4 gap-6 mb-10">

          <div className="bg-slate-900 rounded-2xl p-6">

            <p className="text-slate-400">
              Questions
            </p>

            <h2 className="text-3xl font-bold">
              {questions.length}
            </h2>

          </div>

          <div className="bg-slate-900 rounded-2xl p-6">

            <p className="text-slate-400">
              Total Points
            </p>

            <h2 className="text-3xl font-bold text-cyan-400">
              {totalPoints}
            </h2>

          </div>

          <div className="bg-slate-900 rounded-2xl p-6">

            <p className="text-slate-400">
              Visibility
            </p>

            <h2 className="text-xl font-bold">
              {contest.visibility}
            </h2>

          </div>

          <div className="bg-slate-900 rounded-2xl p-6">

            <p className="text-slate-400">
              Status
            </p>

            <h2 className="text-xl font-bold">
              {contest.status}
            </h2>

          </div>

        </div>

        <div className="bg-slate-900 rounded-3xl p-6">

          <h2 className="text-2xl font-bold mb-6">
            Contest Problems
          </h2>

          <div className="space-y-4">

            {questions.map(
              (
                item
              ) => (

                <div
                  key={
                    item.id
                  }
                  className="bg-slate-800 rounded-2xl p-5"
                >

                  <div className="flex justify-between">

                    <div>

                      <h3 className="text-xl font-semibold">

                        {
                          item.question
                            ?.title
                        }

                      </h3>

                      <p className="text-slate-400 mt-2">

                        {
                          item.question
                            ?.difficulty
                        }

                      </p>

                    </div>

                    <div className="text-cyan-400 font-bold">

                      {
                        item.points
                      }
                      pts

                    </div>

                  </div>

                </div>

              )
            )}

            {questions.length ===
              0 && (

              <div className="text-slate-400">

                No questions linked to this contest.

              </div>

            )}

          </div>

        </div>

      </div>

    </div>

  );
}