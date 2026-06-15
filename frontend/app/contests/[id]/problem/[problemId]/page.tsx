"use client";

import { useEffect, useState } from "react";

import QuestionPanel from "@/components/practice/QuestionPanel";
import CodeEditorPanel from "@/components/practice/CodeEditorPanel";
import ConsolePanel from "@/components/practice/ConsolePanel";

interface Props {
  params: {
    id: string;
    problemId: string;
  };
}

export default function ContestProblemPage({
  params,
}: Props) {

  const [question, setQuestion] =
    useState<any>(null);

  const [language, setLanguage] =
    useState("javascript");

  const [code, setCode] =
    useState("");

  const [output, setOutput] =
    useState("");

  const [customInput, setCustomInput] =
    useState("");

  const [metrics, setMetrics] =
    useState<any>(null);

  const [isExecuting, setIsExecuting] =
    useState(false);

  useEffect(() => {
    loadProblem();
  }, []);

  async function loadProblem() {

    const response =
      await fetch(
       `${process.env.NEXT_PUBLIC_API_URL}/contests/problem/${params.problemId}`
      );

    const data =
      await response.json();

    setQuestion(data);

    if (
      typeof data.starter_code ===
      "object"
    ) {

      setCode(
        data.starter_code[
          language
        ] || ""
      );

    }
  }

  async function runCode() {

    setIsExecuting(true);

    try {

      const response =
        await fetch(
          "/api/execute",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              language,
              code,
              stdin:
                customInput,
              type: "run",
              questionId:
                question.id,
            }),
          }
        );

      const data =
        await response.json();

      setOutput(
        data.output ||
        "No output"
      );

      setMetrics(
        data.metrics
      );

    } catch {

      setOutput(
        "Execution failed"
      );

    } finally {

      setIsExecuting(
        false
      );

    }
  }

  async function submitSolution() {

    setIsExecuting(true);

    try {

      const executeResponse =
        await fetch(
          "/api/execute",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              language,
              code,
              type: "submit",
              questionId:
                question.id,
            }),
          }
        );

      const executeData =
        await executeResponse.json();

      if (
        !executeData.success
      ) {

        setOutput(
          executeData.output
        );

        return;
      }

      const {
        data: {
          user
        }
      } =
        await (
          await import(
            "@/lib/supabase"
          )
        ).supabase.auth.getUser();

      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/contests/submit`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            contest_id:
              params.id,

            user_id:
              user?.id,

            problem_id:
              question.id,

            score: 100,

            verdict:
              "Accepted",

            time_taken: 0,
          }),
        }
      );

      setOutput(
        "Accepted ✅\n\nLeaderboard updated."
      );

    } catch {

      setOutput(
        "Submission failed"
      );

    } finally {

      setIsExecuting(
        false
      );

    }
  }

  if (!question) {

    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading...
      </div>
    );

  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      <div className="grid grid-cols-2 gap-6">

        <QuestionPanel
          question={question}
          isFavorite={false}
          isBookmarked={false}
          onToggleFavorite={() => {}}
          onToggleBookmark={() => {}}
        />

        <CodeEditorPanel
          language={language}
          setLanguage={setLanguage}
          code={code}
          setCode={setCode}
          isExecuting={isExecuting}
          onRun={runCode}
          onSubmit={submitSolution}
          onHint={() => {}}
          onReview={() => {}}
        />

      </div>

      <div className="mt-6">

        <ConsolePanel
          output={output}
          customInput={customInput}
          setCustomInput={setCustomInput}
          metrics={metrics}
        />

      </div>

    </div>
  );
}