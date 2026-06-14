"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Editor from "@monaco-editor/react";
import {
  Play,
  Send,
  Lightbulb,
  MessageSquareCode,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Heart, 
  Bookmark
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export default function PracticePage() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<any[]>([]);
  const [search, setSearch] =
  useState("");

const [difficultyFilter,
setDifficultyFilter] =
  useState("All");

const [companyFilter,
setCompanyFilter] =
  useState("All");
  const [topicFilter,
setTopicFilter] =
  useState("All");

  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [startedAt, setStartedAt] =
    useState(
      new Date().toISOString()
    );

  const [language, setLanguage] = useState<"javascript" | "python" | "java" | "cpp">("javascript");
  const [code, setCode] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [output, setOutput] = useState("Code execution output will appear here...");
  const [isExecuting, setIsExecuting] = useState(false);
  const [metrics, setMetrics] = useState<{ time: string; memory: string } | null>(null);

  const [hint, setHint] = useState("");
  const [review, setReview] = useState("");
  const [isLoadingHint, setIsLoadingHint] = useState(false);
  const [isLoadingReview, setIsLoadingReview] = useState(false);
  
  const [showHintModal, setShowHintModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [favorites,
setFavorites] =
  useState<string[]>([]);

  const [bookmarks, setBookmarks] =
  useState<string[]>([]);

  // Fetch questions from Supabase
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .order('title'); // Or some ordering logic
        
        if (error) throw error;
        
        console.log("Questions fetched:", data);
        if (data && data.length > 0) {
          setQuestions(data);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  

  const question = questions[currentQuestionIndex];
  const filteredQuestions =
  questions.filter(
    (question) => {

      const matchesSearch =
        question.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesDifficulty =
        difficultyFilter ===
          "All" ||
        question.difficulty ===
          difficultyFilter;

      const matchesCompany =
        companyFilter ===
          "All" ||
        question.company ===
          companyFilter;
          const matchesTopic =
  topicFilter ===
    "All" ||
  question.tags?.includes(
    topicFilter
  );

      return (
  matchesSearch &&
  matchesDifficulty &&
  matchesCompany &&
  matchesTopic
);
    }
  );


  // Update code when question or language changes
  useEffect(() => {
    if (question) {
      let fallbackCode = "";
      if (language === "java") {
        fallbackCode = `class Solution {\n    public Object ${question.function_name}() {\n        // Your code here\n        return null;\n    }\n}`;
      } else if (language === "cpp") {
        fallbackCode = `class Solution {\npublic:\n    auto ${question.function_name}() {\n        // Your code here\n        return 0;\n    }\n};`;
      }
      
      setCode(question.starter_code?.[language] || fallbackCode);
      setOutput("Code execution output will appear here...");
      setMetrics(null);
    }
  }, [currentQuestionIndex, language, question]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
        <Loader2 className="animate-spin mr-2" />
        Loading questions...
      </div>
    );
  }

  if (!question) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
        No questions found.
      </div>
    );
  }

  async function loadFavorites() {

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) return;

    const {
      data,
      error,
    } = await supabase
      .from(
        "favorite_questions"
      )
      .select(
        "question_id"
      )
      .eq(
        "user_id",
        user.id
      );

    if (error) {
      console.log(error);
      return;
    }

    setFavorites(
      data.map(
        (item) =>
          item.question_id
      )
    );
  };

  

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as any);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const navigateQuestion = (
    direction: 1 | -1
  ) => {
    const newIndex =
      currentQuestionIndex +
      direction;

    if (
      newIndex >= 0 &&
      newIndex < questions.length
    ) {
      setStartedAt(
        new Date().toISOString()
      );

      setCurrentQuestionIndex(
        newIndex
      );
    }
  };

  

  const executeCode = async (type: "run" | "submit") => {
    if (!question) return;

    setIsExecuting(true);
    setMetrics(null);
    setOutput(type === "submit" ? "Evaluating against hidden test cases..." : "Sending to execution engine...");
    
    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          code,
          stdin: customInput,
          type,
          questionId: question.id
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        setOutput(`Error: ${data.error || 'Failed to execute code'}`);
        setIsExecuting(false);
        return;
      }

      if (data.success) {

  setOutput(
    `Accepted!\n\nYour code successfully passed all hidden test cases.\n\nConsole Output:\n${data.output}`
  );

  try {

    await fetch(
      "http://localhost:8000/submit",
      {
        method: "POST",
        headers: {
          "Content-Type":
          "application/json",
        },
        body: JSON.stringify({
          user_id: user?.id,
          problem_id: question.id,
          
        }),
      }
    );


  } catch (err) {

    console.error(
      "Failed to save submission",
      err
    );

  }
}

      setMetrics({
        time: data.metrics?.time?.toString() || "0",
        memory: data.metrics?.memory?.toString() || "0"
      });

    } catch (err: any) {
      setOutput(`Failed to connect to execution server: ${err.message}`);
    } finally {
      setIsExecuting(false);
    }
  };
  const getHint = async () => {
  if (!question) return;

  setIsLoadingHint(true);

  try {
    const response = await fetch(
      "http://localhost:8000/api/ai/hint",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionTitle: question.title,
          questionDescription: question.description,
          language,
        }),
      }
    );

    const data = await response.json();

    setHint(data.hint);
    setShowHintModal(true); // OPEN MODAL
  } catch (error) {
    console.error(error);
    setHint("Failed to generate hint.");
    setShowHintModal(true); // SHOW ERROR
  } finally {
    setIsLoadingHint(false);
  }
};
   
const toggleFavorite = async () => {
  if (!question) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const isFavorite =
    favorites.includes(question.id);

  if (isFavorite) {

    await supabase
      .from("favorite_questions")
      .delete()
      .eq("user_id", user.id)
      .eq("question_id", question.id);

    setFavorites(
      favorites.filter(
        (id) => id !== question.id
      )
    );

  } else {

    await supabase
      .from("favorite_questions")
      .insert({
        user_id: user.id,
        question_id: question.id,
      });

    setFavorites([
      ...favorites,
      question.id,
    ]);
  }
};
  
const reviewCode = async () => {
  if (!question) return;

  const toggleFavorite = async () => {
  if (!question) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const isFavorite =
    favorites.includes(question.id);

  if (isFavorite) {
    const { error } =
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

    if (error) {
      console.log(error);
      return;
    }

    setFavorites(
      favorites.filter(
        (id) => id !== question.id
      )
    );
  } else {
    const { error } =
      await supabase
        .from(
          "favorite_questions"
        )
        .insert({
          user_id: user.id,
          question_id:
            question.id,
        });

    if (error) {
      console.log(error);
      return;
    }

    setFavorites([
      ...favorites,
      question.id,
    ]);
  }
};

  setIsLoadingReview(true);

  try {
    const response = await fetch(
      "http://localhost:8000/api/ai/review",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionTitle: question.title,
          questionDescription: question.description,
          userCode: code,
          language,
        }),
      }
    );

    const data = await response.json();

    setReview(data.review);
    setShowReviewModal(true); // OPEN MODAL
  } catch (error) {
    console.error(error);
    setReview("Failed to generate review.");
    setShowReviewModal(true); // SHOW ERROR
  } finally {
    setIsLoadingReview(false);
  }
};  
return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      <Sidebar />

      <main className="flex-1 p-6 flex flex-col overflow-hidden">
        <header className="mb-6 shrink-0 flex justify-between items-end">
        <div className="flex flex-wrap gap-3 mt-4">

  <input
    type="text"
    placeholder="Search Questions..."
    value={search}
    onChange={(e) =>
      setSearch(
        e.target.value
      )
    }
    className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2"
  />

  <select
    value={
      difficultyFilter
    }
    onChange={(e) =>
      setDifficultyFilter(
        e.target.value
      )
    }
    className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2"
  >
    <option>
      All
    </option>
    <option>
      Easy
    </option>
    <option>
      Medium
    </option>
    <option>
      Hard
    </option>
  </select>

  <select
    value={companyFilter}
    onChange={(e) =>
      setCompanyFilter(
        e.target.value
      )
    }
    className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2"
  >
    <option>
      All
    </option>

    <option>
      Google
    </option>

    <option>
      Amazon
    </option>

    <option>
      Microsoft
    </option>

    <option>
      Meta
    </option>
  </select>

  <button
    onClick={() => {

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

      const randomQuestion =
        filteredQuestions[
          randomIndex
        ];

      const index =
        questions.findIndex(
          (q) =>
            q.id ===
            randomQuestion.id
        );

      setCurrentQuestionIndex(
        index
      );
    }}
    className="bg-cyan-500 text-black px-4 py-2 rounded-xl font-semibold"
  >
    Random Question
  </button>

</div>
          <div>
            <h1 className="text-3xl font-bold">Coding Practice</h1>
            <p className="text-slate-400 mt-2">Solve coding problems with real test-case validation.</p>
          </div>
          
          <div className="flex gap-2">
             <button 
                onClick={() => navigateQuestion(-1)}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-300 px-4 py-2 rounded-xl text-sm hover:bg-slate-800 transition disabled:opacity-50"
             >
                <ChevronLeft size={16} /> Prev Question
             </button>
             <button 
                onClick={() => navigateQuestion(1)}
                disabled={currentQuestionIndex === questions.length - 1}
                className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-300 px-4 py-2 rounded-xl text-sm hover:bg-slate-800 transition disabled:opacity-50"
             >
                Next Question <ChevronRight size={16} />
             </button>
          </div>
        </header>

        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
          
          {/* Left Panel: Question */}
          <div className="col-span-3 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-800 bg-slate-900/50 shrink-0">
            <div className="flex justify-between items-center">

  <h2 className="text-xl font-bold">
    {question.title}
  </h2>

  <button
  onClick={toggleFavorite}
>
    <Heart
      className={`w-5 h-5 ${
        favorites.includes(
          question.id
        )
          ? "fill-red-500 text-red-500"
          : "text-slate-400"
      }`}
    />
  </button>

</div>
               <div className="flex flex-wrap gap-2 mt-2">
                 <span className={`px-2 py-1 rounded-md text-xs font-medium ${question.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' : question.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'}`}>
                    {question.difficulty}
                 </span>
                 {question.tags?.map((tag: string) => (
                   <span key={tag} className="px-2 py-1 bg-slate-800 text-slate-300 rounded-md text-xs font-medium">{tag}</span>
                 ))}
               </div>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              <div 
                className="text-slate-300 mb-6 leading-relaxed text-sm"
                dangerouslySetInnerHTML={{ __html: question.description }}
              />

              {question.examples?.map((ex: any, i: number) => (
                <div key={i} className="mb-6">
                  <h3 className="font-semibold mb-3 text-slate-200">Example {i + 1}:</h3>
                  <div className="bg-slate-950 p-4 rounded-xl font-mono text-sm border border-slate-800 text-slate-300">
                    <span className="text-slate-500">Input:</span> {ex.input}<br/>
                    <span className="text-slate-500">Output:</span> {ex.output}<br/>
                    {ex.explanation && (
                       <><span className="text-slate-500">Explanation:</span> {ex.explanation}</>
                    )}
                  </div>
                </div>
              ))}

              <h3 className="font-semibold mb-3 text-slate-200">Constraints:</h3>
              <ul className="list-disc list-inside text-slate-400 text-sm space-y-2 font-mono">
                {question.constraints?.map((c: string, i: number) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: c }} />
                ))}
              </ul>
            </div>
          </div>

          {/* Right Panel: Editor & Output */}
          <div className="col-span-9 flex flex-col gap-4 min-h-0">
            
            {/* Editor Container */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 flex-1 flex flex-col overflow-hidden">
              <div className="p-3 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center shrink-0">
                 <div className="flex items-center gap-3">
                   <select 
                     value={language}
                     onChange={handleLanguageChange}
                     className="bg-slate-950 border border-slate-700 text-sm rounded-lg px-3 py-1.5 outline-none focus:border-cyan-500 text-slate-300 cursor-pointer font-medium"
                   >
                     <option value="javascript">JavaScript</option>
                     <option value="python">Python 3</option>
                     <option value="java">Java</option>
                     <option value="cpp">C++</option>
                   </select>
                   <span className="text-xs text-slate-500 font-mono hidden sm:inline-block">Monaco Engine</span>
                 </div>
                 
                 <div className="flex gap-2">
                    <button
  onClick={async () => {
    await reviewCode();
  }}
                      disabled={isLoadingReview}
                      className="flex items-center gap-2 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-sm hover:bg-slate-800 transition"
                    >
                      <MessageSquareCode size={16} className="text-blue-400" />
                      <span className="hidden lg:inline">
                        {isLoadingReview ? "Reviewing..." : "AI Review"}
                      </span>
                    </button>
                    <button
  onClick={async () => {
    await getHint();
  }}
                      disabled={isLoadingHint}
                      className="flex items-center gap-2 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-sm hover:bg-slate-800 transition"
                    >
                      <Lightbulb size={16} className="text-yellow-400" />
                      <span className="hidden lg:inline">
                        {isLoadingHint ? "Generating..." : "Hint"}
                      </span>
                    </button>
                 </div>
              </div>
              
              <div className="flex-1 relative">
                 <Editor
                   height="100%"
                   language={language === "cpp" ? "cpp" : language}
                   theme="vs-dark"
                   value={code}
                   onChange={handleEditorChange}
                   loading={<div className="h-full w-full flex items-center justify-center text-slate-500">Loading Editor...</div>}
                   options={{
                     minimap: { enabled: false },
                     fontSize: 14,
                     fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                     padding: { top: 16 },
                     scrollBeyondLastLine: false,
                     smoothScrolling: true,
                     cursorBlinking: "smooth",
                     renderLineHighlight: "all"
                   }}
                 />
              </div>
            </div>

          

            

            {/* Terminal / Output Container */}
            <div className="h-52 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col shrink-0 overflow-hidden">
               <div className="p-3 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 shrink-0">
                  <div className="flex gap-4">
                     <span className="text-sm font-semibold text-slate-300">Console & Test Cases</span>
                  </div>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={() => executeCode("run")}
                      disabled={isExecuting}
                      className="flex items-center gap-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 px-4 py-1.5 rounded-lg text-sm font-medium transition disabled:opacity-50"
                    >
                      <Play size={16} className={isExecuting ? "animate-pulse text-cyan-400" : "text-cyan-400"} /> 
                      {isExecuting ? "Executing..." : "Run Code"}
                    </button>
                    
                    <button 
                      onClick={() => executeCode("submit")}
                      disabled={isExecuting}
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition bg-cyan-500 hover:bg-cyan-400 text-black disabled:opacity-50`}
                    >
                      <Send size={16} /> 
                      Submit
                    </button>
                  </div>
               </div>

               <div className="flex flex-1 overflow-hidden">
                 {/* Custom Input */}
                 <div className="w-1/3 border-r border-slate-800 p-4 flex flex-col bg-slate-900/30">
                   <label className="text-xs text-slate-500 mb-2 font-semibold uppercase tracking-wider flex justify-between items-center">
                     Custom Input
                     <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">stdin</span>
                   </label>
                   <textarea 
                     value={customInput}
                     onChange={(e) => setCustomInput(e.target.value)}
                     className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm font-mono text-slate-300 outline-none focus:border-slate-700 resize-none placeholder:text-slate-700"
                     placeholder="Enter raw test data to pass via stdin..."
                   />
                 </div>
                 
                 {/* Output & Metrics */}
                 <div className="w-2/3 p-4 flex flex-col bg-[#0d1117]">
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Execution Result</label>
                      
                      {metrics && (
                        <div className="flex gap-3 text-xs font-mono">
                           <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-md border border-emerald-500/20 flex items-center gap-1.5">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> {metrics.time} ms
                           </span>
                           <span className="bg-cyan-500/10 text-cyan-400 px-2.5 py-1 rounded-md border border-cyan-500/20 flex items-center gap-1.5">
                             <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div> {metrics.memory} MB
                           </span>
                        </div>
                      )}
                    </div>
                    
                    <pre className={`flex-1 overflow-auto text-sm font-mono p-1 rounded ${output.includes("Accepted") ? "text-emerald-400" : output.includes("Wrong Answer") || output.includes("Error") || output.includes("error:") ? "text-red-400" : "text-slate-300"}`}>
                      {output}
                    </pre>
                 </div>
               </div>
            </div>

          </div>
        </div>
        {showHintModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-[700px] max-w-[90vw]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-yellow-400">
                  AI Hint
                </h2>

                <button
                  onClick={() => setShowHintModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <p className="text-slate-200 whitespace-pre-wrap">
                {hint}
              </p>
            </div>
          </div>
      )}

      {showReviewModal && (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-[900px] max-w-[95vw] max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-blue-400">
              AI Review
            </h2>

            <button
              onClick={() => setShowReviewModal(false)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <pre className="text-slate-200 whitespace-pre-wrap">
            {review}
          </pre>
        </div>
      </div>
      )} 
      </main>
    </div>
  );
}