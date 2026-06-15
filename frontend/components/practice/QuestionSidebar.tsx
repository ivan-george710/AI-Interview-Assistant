"use client";

import {
  CheckCircle,
  Heart,
  Bookmark,
} from "lucide-react";

interface Props {
  questions: Array<{
    id: number | string;
    title: string;
    difficulty?: string;
  }>;

  currentQuestionId:
    string;

  solvedIds: string[];

  favoriteIds: string[];

  bookmarkIds: string[];

  onSelect: (
    questionId: string
  ) => void;
}

export default function QuestionSidebar({
  questions,
  currentQuestionId,
  solvedIds,
  favoriteIds,
  bookmarkIds,
  onSelect,
}: Props) {
  return (
    <div className="w-80 bg-slate-900 border-r border-slate-800 overflow-y-auto">

      <div className="p-4 border-b border-slate-800">

        <h2 className="font-bold text-lg">
          Problems
        </h2>

        <p className="text-slate-400 text-sm">
          {questions.length} Questions
        </p>

      </div>

      <div className="space-y-1 p-2">

        {questions.map(
          (question) => {

            const questionId =
              String(question.id);

            const solved =
              solvedIds.includes(
                questionId
              );

            const favorite =
              favoriteIds.includes(
                questionId
              );

            const bookmarked =
              bookmarkIds.includes(
                questionId
              );

            return (
              <button
                key={question.id}
                onClick={() =>
                  onSelect(
                    questionId
                  )
                }
                className={`w-full text-left p-3 rounded-xl transition border ${
                  currentQuestionId ===
                  questionId
                    ? "bg-cyan-500/10 border-cyan-500"
                    : "bg-slate-950 border-slate-800 hover:border-slate-600"
                }`}
              >
                <div className="flex justify-between items-start">

                  <div>

                    <h3 className="font-medium">
                      {
                        question.title
                      }
                    </h3>

                    <p
                      className={`text-xs mt-1 ${
                        question.difficulty ===
                        "Easy"
                          ? "text-green-400"
                          : question.difficulty ===
                            "Medium"
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      {
                        question.difficulty
                      }
                    </p>

                  </div>

                  <div className="flex gap-1">

                    {solved && (
                      <CheckCircle
                        size={16}
                        className="text-green-400"
                      />
                    )}

                    {favorite && (
                      <Heart
                        size={16}
                        className="fill-red-500 text-red-500"
                      />
                    )}

                    {bookmarked && (
                      <Bookmark
                        size={16}
                        className="fill-cyan-400 text-cyan-400"
                      />
                    )}

                  </div>

                </div>
              </button>
            );
          }
        )}

      </div>

    </div>
  );
}
