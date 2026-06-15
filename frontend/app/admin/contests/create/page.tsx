"use client";

import { useEffect, useState } from "react";

export default function CreateContestPage() {

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [startTime, setStartTime] =
    useState("");

  const [endTime, setEndTime] =
    useState("");

  const [questions, setQuestions] =
    useState<any[]>([]);

  const [selectedQuestions, setSelectedQuestions] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  async function loadQuestions() {

    try {

      const res =
        await fetch(
          "http://localhost:8000/questions"
        );

      const data =
        await res.json();

      setQuestions(data);

    } catch (error) {

      console.error(
        "Failed to load questions",
        error
      );

    }
  }

  function toggleQuestion(
    question: any
  ) {

    const exists =
      selectedQuestions.find(
        (q) =>
          q.id ===
          question.id
      );

    if (exists) {

      setSelectedQuestions(
        selectedQuestions.filter(
          (q) =>
            q.id !==
            question.id
        )
      );

      return;
    }

    setSelectedQuestions([
      ...selectedQuestions,
      {
        ...question,
        points: 100,
      },
    ]);
  }

  function updatePoints(
    questionId: string,
    points: number
  ) {

    setSelectedQuestions(
      selectedQuestions.map(
        (q) =>
          q.id ===
          questionId
            ? {
                ...q,
                points,
              }
            : q
      )
    );
  }

  async function createContest() {

    setLoading(true);

    try {

      const adminId =
        prompt(
          "Enter Admin User ID"
        ) || "";

      const contestRes =
        await fetch(
          `http://localhost:8000/contests?admin_id=${adminId}`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              title,
              description,
              start_time:
                startTime,
              end_time:
                endTime,
            }),
          }
        );

      const contestData =
        await contestRes.json();

      if (
        !contestData.success
      ) {

        alert(
          contestData.message
        );

        return;
      }

      const contestId =
        contestData.contest.id;

      for (
        const question
        of selectedQuestions
      ) {

        await fetch(
          "http://localhost:8000/contest-problems",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              contest_id:
                contestId,

              problem_id:
                question.id,

              points:
                question.points,
            }),
          }
        );
      }

      alert(
        "Contest Created Successfully"
      );

      setTitle("");
      setDescription("");
      setStartTime("");
      setEndTime("");
      setSelectedQuestions([]);

    } catch (error) {

      console.error(error);

      alert(
        "Failed to create contest"
      );

    } finally {

      setLoading(false);

    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      <h1 className="text-4xl font-bold mb-8">
        Create Contest
      </h1>

      <div className="grid md:grid-cols-2 gap-8">

        <div className="space-y-4">

          <input
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
            placeholder="Contest Title"
            className="w-full bg-slate-900 p-3 rounded-xl"
          />

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            placeholder="Contest Description"
            className="w-full bg-slate-900 p-3 rounded-xl h-32"
          />

          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) =>
              setStartTime(
                e.target.value
              )
            }
            className="w-full bg-slate-900 p-3 rounded-xl"
          />

          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) =>
              setEndTime(
                e.target.value
              )
            }
            className="w-full bg-slate-900 p-3 rounded-xl"
          />

          <button
            onClick={
              createContest
            }
            disabled={loading}
            className="bg-cyan-600 hover:bg-cyan-500 px-6 py-3 rounded-xl font-semibold"
          >
            {loading
              ? "Creating..."
              : "Create Contest"}
          </button>

        </div>

        <div>

          <h2 className="text-2xl font-bold mb-4">
            Select Questions
          </h2>

          <div className="space-y-3">

            {questions.map(
              (
                question
              ) => {

                const selected =
                  selectedQuestions.find(
                    (
                      q
                    ) =>
                      q.id ===
                      question.id
                  );

                return (
                  <div
                    key={
                      question.id
                    }
                    className={`p-4 rounded-xl cursor-pointer ${
                      selected
                        ? "bg-cyan-600"
                        : "bg-slate-900"
                    }`}
                    onClick={() =>
                      toggleQuestion(
                        question
                      )
                    }
                  >

                    <div className="flex justify-between">

                      <div>

                        <h3 className="font-semibold">
                          {
                            question.title
                          }
                        </h3>

                        <p className="text-sm text-slate-300">
                          {
                            question.difficulty
                          }
                        </p>

                      </div>

                      {selected && (

                        <input
                          type="number"
                          value={
                            selected.points
                          }
                          onClick={(
                            e
                          ) =>
                            e.stopPropagation()
                          }
                          onChange={(
                            e
                          ) =>
                            updatePoints(
                              question.id,
                              Number(
                                e.target
                                  .value
                              )
                            )
                          }
                          className="w-20 bg-slate-800 rounded px-2"
                        />

                      )}

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </div>

      </div>

    </div>
  );
}