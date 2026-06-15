"use client";

interface Props {
  submissions: Array<{
    id?: number | string;
    submitted_at?: string;
    status?: string;
    score?: number;
    xp_earned?: number;
  }>;
}

function formatDate(value?: string) {
  if (!value) return "Just now";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

export default function SubmissionHistory({
  submissions,
}: Props) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-slate-800">
        <h2 className="font-semibold">
          Submission History
        </h2>
      </div>

      {submissions.length === 0 ? (
        <div className="p-4 text-sm text-slate-400">
          No submissions for this question yet.
        </div>
      ) : (
        <div className="divide-y divide-slate-800">
          {submissions.map((submission) => (
            <div
              key={submission.id ?? submission.submitted_at}
              className="grid grid-cols-4 gap-3 p-4 text-sm"
            >
              <span
                className={
                  submission.status === "Accepted"
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                {submission.status}
              </span>

              <span className="text-slate-300">
                Score: {submission.score ?? 0}
              </span>

              <span className="text-cyan-300">
                +{submission.xp_earned ?? 0} XP
              </span>

              <span className="text-right text-slate-400">
                {formatDate(submission.submitted_at)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
