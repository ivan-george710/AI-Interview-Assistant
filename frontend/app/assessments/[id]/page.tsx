"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  supabase,
} from "@/lib/supabase";

export default function AssessmentPage() {

  const params =
    useParams();

  const router =
    useRouter();

  const [
    questions,
    setQuestions,
  ] =
    useState<any[]>([]);

  const [
    answers,
    setAnswers,
  ] =
    useState<
      Record<
        string,
        string
      >
    >({});

  const [
    timeLeft,
    setTimeLeft,
  ] =
    useState(0);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  useEffect(() => {
    loadAssessment();
  }, []);

  useEffect(() => {

    if (
      timeLeft <= 0
    )
      return;

    const timer =
      setInterval(() => {

        setTimeLeft(
          (
            prev
          ) =>
            prev - 1
        );

      }, 1000);

    return () =>
      clearInterval(
        timer
      );

  }, [timeLeft]);

  const loadAssessment =
    async () => {

      const {
        data:
          assessment,
      } =
        await supabase
          .from(
            "assessments"
          )
          .select("*")
          .eq(
            "id",
            params.id
          )
          .single();

      if (
        assessment
      ) {

        setTimeLeft(
          assessment.duration_minutes *
            60
        );
      }

      const {
        data,
        error,
      } =
        await supabase
          .from(
            "assessment_question_mapping"
          )
          .select(`
            question_id,
            assessment_questions (
              *
            )
          `)
          .eq(
            "assessment_id",
            params.id
          );

      console.log(
        data
      );

      console.log(
        error
      );

      setQuestions(
        data || []
      );

      setLoading(
        false
      );
    };

  const submitAssessment =
    async () => {

      let score = 0;

      questions.forEach(
        (
          item: any
        ) => {

          const q =
            item.assessment_questions;

          if (
            answers[
              q.id
            ] ===
            q.correct_answer
          ) {

            score++;
          }

        }
      );

      const {
        data: {
          user,
        },
      } =
        await supabase.auth.getUser();

      if (
        !user
      )
        return;

      await supabase
  .from(
    "assessment_attempts"
  )
  .update({
    score,
    completed_at:
      new Date().toISOString(),
  })
        .eq(
          "user_id",
          user.id
        )
        .eq(
          "assessment_id",
          params.id
        );

      alert(
        `Score: ${score}/${questions.length}`
      );

      router.push(
        "/assessments"
      );
    };

  if (loading) {

    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-slate-950 text-white p-8">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          Assessment
        </h1>

        <div className="flex items-center gap-4">

          <div className="text-cyan-400 font-bold text-xl">

            {Math.floor(
              timeLeft /
                60
            )}

            :

            {(timeLeft %
              60)
              .toString()
              .padStart(
                2,
                "0"
              )}

          </div>

          <button
            onClick={() => {

              const confirmExit =
                window.confirm(
                  "Are you sure you want to exit the assessment?"
                );

              if (
                confirmExit
              ) {

                router.push(
                  "/assessments"
                );

              }

            }}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold transition"
          >
            Exit Test
          </button>

        </div>

      </div>

      <div className="space-y-8">

        {questions.map(
          (
            item: any,
            index
          ) => {

            const q =
              item.assessment_questions;

            if (!q)
              return null;

            return (

              <div
                key={
                  q.id
                }
                className="bg-slate-900 rounded-xl p-6 border border-slate-800"
              >

                <h2 className="font-bold text-lg mb-4">

                  Question{" "}
                  {index +
                    1}

                </h2>

                <p className="text-lg mb-2">
                  {q.title}
                </p>

                <p className="text-slate-400 mb-4">
                  {q.description}
                </p>

                <div className="space-y-3">

                  {[
                    q.option_a,
                    q.option_b,
                    q.option_c,
                    q.option_d,
                  ].map(
                    (
                      option
                    ) => (

                      <label
                        key={
                          option
                        }
                        className="block bg-slate-800 hover:bg-slate-700 p-3 rounded-lg cursor-pointer transition"
                      >

                        <input
                          type="radio"
                          name={
                            q.id
                          }
                          value={
                            option
                          }
                          checked={
                            answers[
                              q.id
                            ] ===
                            option
                          }
                          onChange={() =>
                            setAnswers(
                              (
                                prev
                              ) => ({
                                ...prev,
                                [
                                  q.id
                                ]:
                                  option,
                              })
                            )
                          }
                          className="mr-3"
                        />

                        {option}

                      </label>
                    )
                  )}

                </div>

              </div>
            );
          }
        )}

        <button
          onClick={
            submitAssessment
          }
          className="w-full bg-cyan-500 hover:bg-cyan-400 text-black py-4 rounded-xl font-bold transition"
        >
          Submit Assessment
        </button>

      </div>

    </div>
  );
}