import Sidebar from "@/components/Sidebar";
import FeedbackPanel from "@/components/FeedbackPanel";

export default function MockInterviewPage() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      <Sidebar />

      <main className="flex-1 p-8">

        <h1 className="text-4xl font-bold">
          AI Mock Interview
        </h1>

        <p className="text-slate-400 mt-2">
          Practice technical interviews with AI.
        </p>

        {/* Progress */}

        <div className="mt-8 bg-slate-900 p-6 rounded-2xl border border-slate-800">

          <div className="flex justify-between mb-3">
            <span>Question 3 of 10</span>
            <span>30%</span>
          </div>

          <div className="w-full bg-slate-700 h-3 rounded-full">
            <div className="bg-cyan-500 h-3 rounded-full w-[30%]"></div>
          </div>

        </div>

        {/* Interview Section */}

        <div className="grid lg:grid-cols-3 gap-6 mt-8">

          {/* AI Interviewer */}

          <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 flex flex-col items-center">

            <div className="w-36 h-36 rounded-full bg-cyan-500 flex items-center justify-center text-6xl animate-pulse">
              🤖
            </div>

            <h2 className="text-2xl font-bold mt-6">
              AI Interviewer
            </h2>

            <p className="text-slate-400 mt-2 text-center">
              Ready to evaluate your answer.
            </p>

          </div>

          {/* Question */}

          <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-8 border border-slate-800">

            <h2 className="text-2xl font-bold mb-4">
              Technical Question
            </h2>

            <div className="bg-slate-800 p-6 rounded-xl">
              Explain the difference between
              Breadth First Search (BFS)
              and Depth First Search (DFS).
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-8">

              <div className="bg-slate-800 rounded-xl p-4">
                <p className="text-slate-400">
                  Time Remaining
                </p>

                <h3 className="text-3xl font-bold mt-2">
                  12:34
                </h3>
              </div>

              <div className="bg-slate-800 rounded-xl p-4">
                <p className="text-slate-400">
                  Confidence Score
                </p>

                <h3 className="text-3xl font-bold mt-2 text-cyan-400">
                  85%
                </h3>
              </div>

            </div>

          </div>

        </div>

        {/* Answer Area */}

        <div className="mt-8 bg-slate-900 rounded-2xl p-8 border border-slate-800">

          <h2 className="text-2xl font-bold mb-4">
            Your Answer
          </h2>

          <textarea
            placeholder="Type your answer here..."
            className="w-full h-56 bg-slate-950 border border-slate-700 rounded-xl p-4 resize-none"
          />

          <div className="flex gap-4 mt-6">

            <button className="bg-cyan-500 text-black px-6 py-3 rounded-xl font-semibold">
              Submit Answer
            </button>

            <button className="border border-slate-700 px-6 py-3 rounded-xl">
              Get Hint
            </button>

            <button className="border border-slate-700 px-6 py-3 rounded-xl">
              Next Question
            </button>

          </div>
          <div className="mt-8">
            <FeedbackPanel />
          </div>

        </div>

      </main>

    </div>
  );
}