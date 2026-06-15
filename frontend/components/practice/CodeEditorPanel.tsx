"use client";

import CodeMirror from "@uiw/react-codemirror";

import { oneDark } from "@codemirror/theme-one-dark";

import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";

import {
  Play,
  Send,
  Lightbulb,
  MessageSquareCode,
} from "lucide-react";

interface Props {
  language: string;

  setLanguage: (
    language: string
  ) => void;

  code: string;

  setCode: (
    code: string
  ) => void;

  isExecuting: boolean;

  onRun: () => void;

  onSubmit: () => void;

  onHint: () => void;

  onReview: () => void;
}

export default function CodeEditorPanel({
  language,
  setLanguage,
  code,
  setCode,
  isExecuting,
  onRun,
  onSubmit,
  onHint,
  onReview,
}: Props) {
  const getLanguageExtension =
    () => {

      switch (
        language
      ) {

        case "python":
          return python();

        case "java":
          return java();

        case "cpp":
          return cpp();

        default:
          return javascript();
      }
    };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

      <div className="flex justify-between items-center p-4 border-b border-slate-800">

        <select
          value={language}
          onChange={(e) =>
            setLanguage(
              e.target.value
            )
          }
          className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2"
        >
          <option value="javascript">
            JavaScript
          </option>

          <option value="python">
            Python
          </option>

          <option value="java">
            Java
          </option>

          <option value="cpp">
            C++
          </option>

        </select>

        <div className="flex gap-2">

          <button
            onClick={onHint}
            className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded-xl font-semibold"
          >
            <Lightbulb
              size={16}
            />
            Hint
          </button>

          <button
            onClick={onReview}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-xl font-semibold"
          >
            <MessageSquareCode
              size={16}
            />
            Review
          </button>

          <button
            onClick={onRun}
            disabled={
              isExecuting
            }
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-xl font-semibold disabled:opacity-50"
          >
            <Play size={16} />
            Run
          </button>

          <button
            onClick={onSubmit}
            disabled={
              isExecuting
            }
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 px-4 py-2 rounded-xl font-semibold disabled:opacity-50"
          >
            <Send size={16} />
            Submit
          </button>

        </div>

      </div>

      <CodeMirror
        value={code}
        height="600px"
        theme={oneDark}
        extensions={[
          getLanguageExtension(),
        ]}
        onChange={(
          value
        ) =>
          setCode(
            value
          )
        }
      />

    </div>
  );
}