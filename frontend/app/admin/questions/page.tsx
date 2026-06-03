"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function QuestionsPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [difficulty, setDifficulty] =
    useState("");

  const [questions, setQuestions] =
    useState<any[]>([]);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    const { data } = await supabase
      .from("questions")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    setQuestions(data || []);
  };

  const addQuestion = async () => {
    if (!title) return;

    await supabase
      .from("questions")
      .insert([
        {
          title,
          description,
          difficulty,
        },
      ]);

    setTitle("");
    setDescription("");
    setDifficulty("");

    loadQuestions();
  };

  const deleteQuestion = async (
    id: string
  ) => {
    await supabase
      .from("questions")
      .delete()
      .eq("id", id);

    loadQuestions();
  };

  return (
    <div className="p-8 text-white">

      <h1 className="text-3xl font-bold mb-6">
        Question Management
      </h1>

      <div className="space-y-3 mb-8">

        <input
          placeholder="Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          className="w-full p-3 bg-slate-900 rounded"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
          className="w-full p-3 bg-slate-900 rounded"
        />

        <input
          placeholder="Difficulty"
          value={difficulty}
          onChange={(e) =>
            setDifficulty(
              e.target.value
            )
          }
          className="w-full p-3 bg-slate-900 rounded"
        />

        <button
          onClick={addQuestion}
          className="bg-green-600 px-4 py-2 rounded"
        >
          Add Question
        </button>

      </div>

      <div>
        {questions.map((q) => (
          <div
            key={q.id}
            className="bg-slate-900 p-4 rounded mb-3"
          >
            <h3 className="font-bold">
              {q.title}
            </h3>

            <p>
              {q.description}
            </p>

            <p>
              Difficulty:{" "}
              {q.difficulty}
            </p>

            <button
              onClick={() =>
                deleteQuestion(
                  q.id
                )
              }
              className="mt-2 bg-red-600 px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}