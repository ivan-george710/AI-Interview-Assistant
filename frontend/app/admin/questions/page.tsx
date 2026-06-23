"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function QuestionsPage() {

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [difficulty, setDifficulty] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [questions, setQuestions] =
    useState<any[]>([]);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions =
    async () => {

      const { data } =
        await supabase
          .from("questions")
          .select("*")
          .order(
            "created_at",
            {
              ascending: false
            }
          );

      setQuestions(
        data || []
      );
    };

  const resetForm =
    () => {

      setTitle("");
      setDescription("");
      setDifficulty("");
      setEditingId(null);

    };

  const saveQuestion =
    async () => {

      if (!title)
        return;

      if (
        editingId
      ) {

        await supabase
          .from(
            "questions"
          )
          .update({

            title,
            description,
            difficulty

          })
          .eq(
            "id",
            editingId
          );

      } else {

        await supabase
          .from(
            "questions"
          )
          .insert([
            {

              title,
              description,
              difficulty

            }
          ]);

      }

      resetForm();

      loadQuestions();
    };

  const editQuestion =
    (
      question: any
    ) => {

      setEditingId(
        question.id
      );

      setTitle(
        question.title
      );

      setDescription(
        question.description
      );

      setDifficulty(
        question.difficulty
      );
    };

  const deleteQuestion =
    async (
      id: string
    ) => {

      const confirmDelete =
        confirm(
          "Delete question?"
        );

      if (
        !confirmDelete
      )
        return;

      await supabase
        .from(
          "questions"
        )
        .delete()
        .eq(
          "id",
          id
        );

      loadQuestions();
    };

  const filteredQuestions =
    questions.filter(
      (q) =>
        (
          q.title ||
          ""
        )
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  const easyCount =
    questions.filter(
      (q) =>
        q.difficulty?.toLowerCase() ===
        "easy"
    ).length;

  const mediumCount =
    questions.filter(
      (q) =>
        q.difficulty?.toLowerCase() ===
        "medium"
    ).length;

  const hardCount =
    questions.filter(
      (q) =>
        q.difficulty?.toLowerCase() ===
        "hard"
    ).length;

  return (

    <div className="min-h-screen bg-slate-950 text-white p-8">

      <h1 className="text-4xl font-bold mb-6">
        Question Bank Management
      </h1>

      <div className="grid md:grid-cols-4 gap-4 mb-8">

        <div className="bg-slate-900 p-5 rounded-2xl">
          <p className="text-slate-400">
            Total Questions
          </p>
          <h2 className="text-3xl font-bold text-cyan-400">
            {questions.length}
          </h2>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl">
          <p className="text-slate-400">
            Easy
          </p>
          <h2 className="text-3xl font-bold text-green-400">
            {easyCount}
          </h2>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl">
          <p className="text-slate-400">
            Medium
          </p>
          <h2 className="text-3xl font-bold text-yellow-400">
            {mediumCount}
          </h2>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl">
          <p className="text-slate-400">
            Hard
          </p>
          <h2 className="text-3xl font-bold text-red-400">
            {hardCount}
          </h2>
        </div>

      </div>

      <div className="bg-slate-900 rounded-3xl p-6 mb-8">

        <h2 className="text-2xl font-bold mb-5">

          {editingId
            ? "Edit Question"
            : "Create Question"}

        </h2>

        <div className="space-y-4">

          <input
            placeholder="Question Title"
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
            className="w-full p-3 bg-slate-800 rounded-xl"
          />

          <textarea
            placeholder="Question Description"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            className="w-full p-3 bg-slate-800 rounded-xl"
          />

          <select
            value={difficulty}
            onChange={(e) =>
              setDifficulty(
                e.target.value
              )
            }
            className="w-full p-3 bg-slate-800 rounded-xl"
          >
            <option value="">
              Select Difficulty
            </option>

            <option value="Easy">
              Easy
            </option>

            <option value="Medium">
              Medium
            </option>

            <option value="Hard">
              Hard
            </option>

          </select>

          <div className="flex gap-3">

            <button
              onClick={
                saveQuestion
              }
              className="bg-green-600 px-6 py-3 rounded-xl"
            >
              {
                editingId
                  ? "Update"
                  : "Create"
              }
            </button>

            {editingId && (

              <button
                onClick={
                  resetForm
                }
                className="bg-slate-700 px-6 py-3 rounded-xl"
              >
                Cancel
              </button>

            )}

          </div>

        </div>

      </div>

      <input
        placeholder="Search Questions..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        className="w-full p-3 bg-slate-900 rounded-xl mb-6"
      />

      <div className="space-y-4">

        {filteredQuestions.map(
          (q) => (

            <div
              key={q.id}
              className="bg-slate-900 p-6 rounded-2xl border border-slate-800"
            >

              <div className="flex justify-between items-start">

                <div>

                  <h3 className="text-xl font-bold">
                    {q.title}
                  </h3>

                  <p className="text-slate-400 mt-2">
                    {q.description}
                  </p>

                </div>

                <span
                  className={`px-3 py-1 rounded-lg ${
                    q.difficulty ===
                    "Easy"
                      ? "bg-green-500 text-black"
                      : q.difficulty ===
                        "Medium"
                      ? "bg-yellow-500 text-black"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {q.difficulty}
                </span>

              </div>

              <div className="flex gap-3 mt-5">

                <button
                  onClick={() =>
                    editQuestion(
                      q
                    )
                  }
                  className="bg-cyan-600 px-4 py-2 rounded-lg"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteQuestion(
                      q.id
                    )
                  }
                  className="bg-red-600 px-4 py-2 rounded-lg"
                >
                  Delete
                </button>

              </div>

            </div>

          )
        )}

      </div>

    </div>

  );
}