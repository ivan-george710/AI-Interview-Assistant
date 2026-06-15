"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import FilterBar from "@/components/practice/FilterBar";
import QuestionSidebar from "@/components/practice/QuestionSidebar";
import QuestionPanel from "@/components/practice/QuestionPanel";
import CodeEditorPanel from "@/components/practice/CodeEditorPanel";
import ConsolePanel from "@/components/practice/ConsolePanel";
import SubmissionHistory from "@/components/practice/SubmissionHistory";
import ProgressHeader from "@/components/practice/ProgressHeader";

type PracticeUser = {
  id: string;
};

type Question = {
  id: number | string;
  problem_id?: number | string;
  title: string;
  description?: string;
  difficulty?: string;
  company?: string;
  tags?: string | string[];
  starter_code?: string | Record<string, string>;
  examples?: string | unknown;
  constraints?: string | unknown;
};

type Submission = {
  id?: number | string;
  problem_id: number | string;
  status: string;
  score?: number;
  xp_earned?: number;
  submitted_at?: string;
};

type Metrics = {
  time: string;
  memory: string;
};

function getErrorMessage(
  payload: {
    message?: string;
    detail?: string | {
      message?: string;
      error?: string;
      hint?: string;
    };
  }
) {
  if (payload.message) {
    return payload.message;
  }

  if (typeof payload.detail === "string") {
    return payload.detail;
  }

  if (payload.detail) {
    return [
      payload.detail.message,
      payload.detail.error,
      payload.detail.hint
    ]
      .filter(Boolean)
      .join("\n");
  }

  return "Failed to save submission";
}

export default function PracticePage() {

  const [loading, setLoading] =
    useState(true);

  const [user, setUser] =
    useState<PracticeUser | null>(null);

  const [questions, setQuestions] =
    useState<Question[]>([]);

  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(0);

  const [favorites, setFavorites] =
    useState<string[]>([]);

  const [bookmarks, setBookmarks] =
    useState<string[]>([]);

  const [solvedIds, setSolvedIds] =
    useState<string[]>([]);

  const [submissionHistory, setSubmissionHistory] =
    useState<Submission[]>([]);

  const [profileXp, setProfileXp] =
    useState(0);

  const [language, setLanguage] =
    useState("javascript");

  const [code, setCode] =
    useState("");

  const [output, setOutput] =
    useState("");

  const [customInput, setCustomInput] =
    useState("");

  const [metrics, setMetrics] =
    useState<Metrics | null>(null);

  const [isExecuting, setIsExecuting] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [difficultyFilter, setDifficultyFilter] =
    useState("All");

  const [companyFilter, setCompanyFilter] =
    useState("All");

  const [topicFilter, setTopicFilter] =
    useState("All");

  useEffect(() => {
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  async function initialize() {

    const {
      data: { user }
    } =
      await supabase.auth.getUser();

    setUser(user);

    await fetchQuestions();

    if (user) {

      await loadFavorites(
        user.id
      );

      await loadBookmarks(
        user.id
      );

      await loadSolvedProblems(
        user.id
      );

      await loadProfile(
        user.id
      );

    }

    setLoading(false);
  }

  async function fetchQuestions() {

    const {
      data,
      error
    } =
      await supabase
        .from("questions")
        .select("*");

    if (!error) {

      setQuestions(
        data || []
      );

      if (
        data &&
        data.length > 0
      ) {

        setCode(
          getStarterCode(
            data[0],
            language
          )
        );

      }
    }
  }

  async function loadProfile(
    userId: string
  ) {

    const {
      data
    } =
      await supabase
        .from(
          "profiles"
        )
        .select(
          "xp"
        )
        .eq(
          "id",
          userId
        )
        .single();

    setProfileXp(
      data?.xp || 0
    );
  }

  async function loadFavorites(
    userId: string
  ) {

    const {
      data
    } =
      await supabase
        .from(
          "favorite_questions"
        )
        .select(
          "question_id"
        )
        .eq(
          "user_id",
          userId
        );

    setFavorites(
      data?.map(
        (item) =>
          String(
            item.question_id
          )
      ) || []
    );
  }

  async function loadBookmarks(
    userId: string
  ) {

    const {
      data
    } =
      await supabase
        .from(
          "bookmarked_questions"
        )
        .select(
          "question_id"
        )
        .eq(
          "user_id",
          userId
        );

    setBookmarks(
      data?.map(
        (item) =>
          String(
            item.question_id
          )
      ) || []
    );
  }

  async function loadSolvedProblems(
    userId: string
  ) {

    const {
      data
    } =
      await supabase
        .from(
          "submissions"
        )
        .select(
          "problem_id,status"
        )
        .eq(
          "user_id",
          userId
        )
        .eq(
          "status",
          "Accepted"
        );

    setSolvedIds(
      data?.map(
        (item) =>
          String(
            item.problem_id
          )
      ) || []
    );
  }

  const filteredQuestions =
    questions.filter(
      (question) => {

        const searchMatch =
          question.title
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const difficultyMatch =
          difficultyFilter ===
            "All" ||
          question.difficulty ===
            difficultyFilter;

        const companyMatch =
          companyFilter ===
            "All" ||
          question.company ===
            companyFilter;

        const topicMatch =
          topicFilter ===
            "All" ||
          question.tags?.includes(
            topicFilter
          );

        return (
          searchMatch &&
          difficultyMatch &&
          companyMatch &&
          topicMatch
        );
      }
    );

  const question =
    filteredQuestions[
      currentQuestionIndex
    ];

  function getQuestionProblemId(
    selectedQuestion: Question | null | undefined
  ): string | null {

    const rawId =
      selectedQuestion?.id;

    if (
      typeof rawId === "string" &&
      rawId.trim()
    ) {
      return rawId;
    }

    return rawId == null
      ? null
      : String(rawId);
  }

  function getStarterCode(
    selectedQuestion: Question | null | undefined,
    selectedLanguage: string
  ): string {

    const starterCode =
      selectedQuestion?.starter_code;

    if (
      starterCode &&
      typeof starterCode ===
        "object" &&
      !Array.isArray(starterCode)
    ) {
      return (
        starterCode[
          selectedLanguage
        ] || ""
      );
    }

    return typeof starterCode ===
      "string"
      ? starterCode
      : "";
  }

  useEffect(() => {
    // Reset the selected row when filters change so the index stays inside the filtered list.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentQuestionIndex(0);
  }, [
    search,
    difficultyFilter,
    companyFilter,
    topicFilter
  ]);

  useEffect(() => {

  if (!question)
    return;

  // Keep the editor in sync with question/language switches.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setCode(
    getStarterCode(
      question,
      language
    )
  );

  if (
    user &&
    question
  ) {

    const problemId =
      getQuestionProblemId(
        question
      );

    if (problemId) {
      loadSubmissionHistory(
        problemId
      );
    }

  }

// eslint-disable-next-line react-hooks/exhaustive-deps
}, [
  currentQuestionIndex,
  question?.id,
  language,
  user?.id
]);
  async function loadSubmissionHistory(
    problemId: string
  ) {

    if (!user) return;

    const {
      data
    } =
      await supabase
        .from(
          "submissions"
        )
        .select("*")
        .eq(
          "user_id",
          user.id
        )
        .eq(
          "problem_id",
          problemId
        )
        .order(
          "submitted_at",
          {
            ascending: false,
          }
        );

    setSubmissionHistory(
      data || []
    );
  }
    async function toggleFavorite() {

    if (!user || !question)
      return;

    const questionId =
      String(question.id);

    const isFavorite =
      favorites.includes(
        questionId
      );

    if (isFavorite) {

      await supabase
        .from(
          "favorite_questions"
        )
        .delete()
        .eq(
          "user_id",
          user.id
        )
        .eq(
          "question_id",
          question.id
        );

      setFavorites(
        favorites.filter(
          (id) =>
            id !==
            questionId
        )
      );

    } else {

      await supabase
        .from(
          "favorite_questions"
        )
        .insert({
          user_id:
            user.id,
          question_id:
            question.id,
        });

      setFavorites([
        ...favorites,
        questionId,
      ]);

    }
  }

  async function toggleBookmark() {

    if (!user || !question)
      return;

    const questionId =
      String(question.id);

    const isBookmarked =
      bookmarks.includes(
        questionId
      );

    if (
      isBookmarked
    ) {

      await supabase
        .from(
          "bookmarked_questions"
        )
        .delete()
        .eq(
          "user_id",
          user.id
        )
        .eq(
          "question_id",
          question.id
        );

      setBookmarks(
        bookmarks.filter(
          (id) =>
            id !==
            questionId
        )
      );

    } else {

      await supabase
        .from(
          "bookmarked_questions"
        )
        .insert({
          user_id:
            user.id,
          question_id:
            question.id,
        });

      setBookmarks([
        ...bookmarks,
        questionId,
      ]);

    }
  }

  function nextQuestion() {

    if (
      currentQuestionIndex <
      filteredQuestions.length -
        1
    ) {

      setCurrentQuestionIndex(
        (
          prev
        ) =>
          prev + 1
      );

    }
  }

  function previousQuestion() {

    if (
      currentQuestionIndex >
      0
    ) {

      setCurrentQuestionIndex(
        (
          prev
        ) =>
          prev - 1
      );

    }
  }

  function randomQuestion() {

    if (
      filteredQuestions.length ===
      0
    )
      return;

    const randomIndex =
      Math.floor(
        Math.random() *
          filteredQuestions.length
      );

    setCurrentQuestionIndex(
      randomIndex
    );
  }

  async function executeCode(
    type:
      | "run"
      | "submit"
  ) {

    if (!question)
      return;

    const problemId =
      getQuestionProblemId(
        question
      );

    if (
      type === "submit" &&
      !problemId
    ) {
      setOutput(
        "This question is missing a question id. Submissions require submissions.problem_id to reference questions.id."
      );
      return;
    }

    if (
      type === "submit" &&
      !user
    ) {
      setOutput(
        "Please sign in before submitting."
      );
      return;
    }

    setIsExecuting(
      true
    );

    setMetrics(
      null
    );

    setOutput(
      type ===
        "submit"
        ? "Evaluating against hidden test cases..."
        : "Running..."
    );

    try {

      const response =
        await fetch(
          "/api/execute",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              {
                language,
                code,
                stdin:
                customInput,
                type,
                questionId:
                  type === "submit"
                    ? problemId
                    : question.id,
              }
            ),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok
      ) {

        setOutput(
          `Error: ${
            data.error ||
            "Execution failed"
          }`
        );

        return;
      }

      if (
        data.success
      ) {

        setOutput(
          type ===
            "submit"
            ? `Accepted!\n\n${data.output}`
            : data.output
        );

        if (
          type ===
            "submit"
        ) {

          try {

            const submitResponse =
              await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/submit`,
              {
                method:
                  "POST",

                headers:
                  {
                    "Content-Type":
                      "application/json",
                  },

                body: JSON.stringify(
                  {
                    user_id:
                      user?.id,

                    problem_id:
                      problemId,
                  }
                ),
              }
            );

            const submitData =
              await submitResponse.json();

            if (
              !submitResponse.ok ||
              !submitData.success
            ) {
              throw new Error(
                getErrorMessage(
                  submitData
                )
              );
            }

            if (
              user
            ) {

              await loadSolvedProblems(
                user.id
              );

              await loadSubmissionHistory(
                problemId as string
              );

              await loadProfile(
                user.id
              );

            }

          } catch (
            err
          ) {

            console.error(
              err
            );

            setOutput(
              `Accepted, but saving the submission failed: ${
                err instanceof Error
                  ? err.message
                  : "Unknown error"
              }`
            );

          }
        }

        setMetrics({
          time:
            data.metrics?.time?.toString() ||
            "0",

          memory:
            data.metrics?.memory?.toString() ||
            "0",
        });
      }

    } catch (
      err: unknown
    ) {

      setOutput(
        `Error: ${
          err instanceof Error
            ? err.message
            : "Unknown error"
        }`
      );

    } finally {

      setIsExecuting(
        false
      );

    }
  }

  async function getHint() {

    if (!question)
      return;

    try {

      const response =
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/ai/hint`,
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              {
                questionTitle:
                  question.title,

                questionDescription:
                  question.description,

                language,
              }
            ),
          }
        );

      const data =
        await response.json();

      alert(
        data.hint ||
          "No hint available"
      );

    } catch (
      err
    ) {

      console.error(
        err
      );

    }
  }

  async function reviewCode() {

    if (!question)
      return;

    try {

      const response =
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/ai/review`,
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              {
                questionTitle:
                  question.title,

                questionDescription:
                  question.description,

                code,

                language,
              }
            ),
          }
        );

      const data =
        await response.json();

      alert(
        data.review ||
          "No review available"
      );

    } catch (
      err
    ) {

      console.error(
        err
      );

    }
  }

  if (
    loading
  ) {

    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading...
      </div>
    );

  }
    return (
    <div className="min-h-screen bg-slate-950 text-white">

      <div className="p-6 space-y-6">

        <ProgressHeader
          solved={solvedIds.length}
          total={questions.length}
          xp={profileXp}
          favorites={
            favorites.length
          }
          bookmarks={
            bookmarks.length
          }
        />

        <FilterBar
          search={search}
          setSearch={setSearch}
          difficultyFilter={
            difficultyFilter
          }
          setDifficultyFilter={
            setDifficultyFilter
          }
          companyFilter={
            companyFilter
          }
          setCompanyFilter={
            setCompanyFilter
          }
          topicFilter={
            topicFilter
          }
          setTopicFilter={
            setTopicFilter
          }
        />

        <div className="grid grid-cols-12 gap-6">

          {/* Sidebar */}

          <div className="col-span-3">

            <QuestionSidebar
              questions={
                filteredQuestions
              }
              currentQuestionId={
                question?.id?.toString() ||
                ""
              }
              solvedIds={
                solvedIds
              }
              favoriteIds={
                favorites
              }
              bookmarkIds={
                bookmarks
              }
              onSelect={(
                questionId
              ) => {

                const index =
                  filteredQuestions.findIndex(
                    (q) =>
                      String(
                        q.id
                      ) ===
                      questionId
                  );

                if (
                  index !==
                  -1
                ) {
                  setCurrentQuestionIndex(
                    index
                  );
                }
              }}
            />

          </div>

          {/* Main Content */}

          <div className="col-span-9 space-y-6">

            <div className="flex gap-3">

              <button
                onClick={
                  previousQuestion
                }
                className="bg-slate-800 px-4 py-2 rounded-xl"
              >
                Previous
              </button>

              <button
                onClick={
                  nextQuestion
                }
                className="bg-slate-800 px-4 py-2 rounded-xl"
              >
                Next
              </button>

              <button
                onClick={
                  randomQuestion
                }
                className="bg-cyan-600 px-4 py-2 rounded-xl"
              >
                Random
              </button>

            </div>

           <div className="grid grid-cols-2 gap-6">

  <QuestionPanel
    question={question}
    isFavorite={favorites.includes(
      String(question?.id)
    )}
    isBookmarked={bookmarks.includes(
      String(question?.id)
    )}
    onToggleFavorite={toggleFavorite}
    onToggleBookmark={toggleBookmark}
  />

  <CodeEditorPanel
    language={language}
    setLanguage={setLanguage}
    code={code}
    setCode={setCode}
    isExecuting={isExecuting}
    onRun={() =>
      executeCode("run")
    }
    onSubmit={() =>
      executeCode("submit")
    }
    onHint={getHint}
    onReview={reviewCode}
  />

</div>

<ConsolePanel
  output={output}
  customInput={customInput}
  setCustomInput={setCustomInput}
  metrics={metrics}
/>

<SubmissionHistory
  submissions={submissionHistory}
/>

          </div>

        </div>

      </div>

    </div>
  );
}
