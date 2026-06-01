import Sidebar from "@/components/Sidebar";

export default function PracticePage() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <main className="flex-1 p-8">
        <h1 className="text-4xl font-bold">
          Coding Practice
        </h1>

        <p className="text-slate-400 mt-2">
          Solve coding problems and get AI-powered feedback.
        </p>

        <div className="grid grid-cols-12 gap-6 mt-8">

          {/* Question Panel */}

          <div className="col-span-4 bg-slate-900 rounded-2xl p-6 border border-slate-800">

            <h2 className="text-2xl font-bold mb-4">
              Two Sum
            </h2>

            <p className="text-slate-300">
              Given an array of integers nums and an integer target,
              return indices of the two numbers such that they add up
              to target.
            </p>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">
                Example
              </h3>

              <div className="bg-slate-800 p-4 rounded-xl">
                Input: nums = [2,7,11,15]
                <br />
                Target = 9
                <br />
                Output: [0,1]
              </div>
            </div>

          </div>

          {/* Editor */}

          <div className="col-span-8 bg-slate-900 rounded-2xl p-6 border border-slate-800">

            <h2 className="text-xl font-bold mb-4">
              Code Editor
            </h2>

            <textarea
              className="w-full h-96 bg-slate-950 border border-slate-700 rounded-xl p-4 font-mono"
              defaultValue={`function twoSum(nums, target) {

}`}
            />

            <div className="flex gap-4 mt-6">

              <button className="bg-cyan-500 text-black px-5 py-2 rounded-xl font-semibold">
                Run Code
              </button>

              <button className="bg-green-500 text-black px-5 py-2 rounded-xl font-semibold">
                Submit
              </button>

              <button className="border border-slate-700 px-5 py-2 rounded-xl">
                AI Review
              </button>

              <button className="border border-slate-700 px-5 py-2 rounded-xl">
                Get Hint
              </button>

            </div>

          </div>

        </div>

        {/* Output */}

        <div className="mt-6 bg-slate-900 rounded-2xl p-6 border border-slate-800">

          <h2 className="text-xl font-bold mb-4">
            Output
          </h2>

          <div className="bg-slate-950 rounded-xl p-4 text-green-400">
            Code execution output will appear here...
          </div>

        </div>

      </main>
    </div>
  );
}