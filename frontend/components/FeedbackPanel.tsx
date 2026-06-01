export default function FeedbackPanel() {
  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
      <h2 className="text-2xl font-bold mb-4">
        AI Feedback
      </h2>

      <div className="space-y-4">

        <div>
          <h3 className="font-semibold text-green-400">
            Strengths
          </h3>

          <p className="text-slate-300">
            Good explanation of traversal order and use cases.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-yellow-400">
            Improvements
          </h3>

          <p className="text-slate-300">
            Mention space complexity differences more clearly.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-cyan-400">
            Communication Score
          </h3>

          <p className="text-slate-300">
            8.5 / 10
          </p>
        </div>

      </div>
    </div>
  );
}