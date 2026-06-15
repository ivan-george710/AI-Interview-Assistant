"use client";

import {
  Heart,
  Bookmark,
} from "lucide-react";

interface Props {
  question: any;

  isFavorite: boolean;

  isBookmarked: boolean;

  onToggleFavorite: () => void;

  onToggleBookmark: () => void;
}

export default function QuestionPanel({
  question,
  isFavorite,
  isBookmarked,
  onToggleFavorite,
  onToggleBookmark,
}: Props) {
  if (!question) {
    return (
      <div className="p-6 text-slate-400">
        Select a question
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-full overflow-y-auto">

      {/* Header */}

      <div className="flex justify-between items-start mb-4">

        <div>

          <h1 className="text-2xl font-bold mb-2">
            {question.title}
          </h1>

          <div className="flex gap-2">

            <span
              className={`px-3 py-1 rounded-lg text-sm ${
                question.difficulty === "Easy"
                  ? "bg-green-500/20 text-green-400"
                  : question.difficulty ===
                    "Medium"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {question.difficulty}
            </span>

            {question.tags && (
              <span className="px-3 py-1 rounded-lg text-sm bg-slate-800">
                {question.tags}
              </span>
            )}

            {question.company && (
              <span className="px-3 py-1 rounded-lg text-sm bg-cyan-500/20 text-cyan-400">
                {question.company}
              </span>
            )}

          </div>

        </div>

        <div className="flex gap-3">

          <button
            onClick={
              onToggleFavorite
            }
          >
            <Heart
              className={`${
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-slate-400"
              }`}
            />
          </button>

          <button
            onClick={
              onToggleBookmark
            }
          >
            <Bookmark
              className={`${
                isBookmarked
                  ? "fill-cyan-500 text-cyan-500"
                  : "text-slate-400"
              }`}
            />
          </button>

        </div>

      </div>

      {/* Description */}

      <div className="mb-6">

        <h2 className="font-semibold mb-2">
          Description
        </h2>

        <div className="text-slate-300 whitespace-pre-wrap">
          {question.description}
        </div>

      </div>

      {/* Examples */}

      {question.examples && (

        <div className="mb-6">

          <h2 className="font-semibold mb-2">
            Examples
          </h2>

          <pre className="bg-slate-950 border border-slate-800 p-4 rounded-xl overflow-x-auto text-sm">
  {typeof question.examples === "string"
    ? question.examples
    : JSON.stringify(
        question.examples,
        null,
        2
      )}
</pre>

        </div>

      )}

      {/* Constraints */}

      {question.constraints && (

        <div className="mb-6">

          <h2 className="font-semibold mb-2">
            Constraints
          </h2>

          <pre className="bg-slate-950 border border-slate-800 p-4 rounded-xl overflow-x-auto text-sm">
  {typeof question.constraints === "string"
    ? question.constraints
    : JSON.stringify(
        question.constraints,
        null,
        2
      )}
</pre>

        </div>

      )}

    </div>
  );
}