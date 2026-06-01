import { CheckCircle, AlertCircle, TrendingUp } from "lucide-react";

export default function ReadinessScore() {
  const score = 85;

  // Simple calculation for SVG circle
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-cyan-500/50 transition duration-300 flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <TrendingUp className="text-cyan-400 w-5 h-5" />
        Interview Readiness
      </h2>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center w-32 h-32 mb-4">
          {/* Background Circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-slate-800"
            />
            {/* Progress Circle */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="text-cyan-500 transition-all duration-1000 ease-out"
              strokeLinecap="round"
            />
          </svg>
          {/* Inner Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-white">{score}%</span>
          </div>
        </div>

        <p className="text-slate-400 text-center text-sm mb-4">
          You are well-prepared! Keep practicing system design to reach 90%.
        </p>

        <div className="w-full space-y-2 mt-auto">
          <div className="flex items-center gap-2 text-sm text-green-400 bg-green-400/10 p-2 rounded-lg">
            <CheckCircle className="w-4 h-4" />
            <span>Strong in Data Structures</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-amber-400 bg-amber-400/10 p-2 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            <span>Review Dynamic Programming</span>
          </div>
        </div>
      </div>
    </div>
  );
}
