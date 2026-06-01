import { Target, Code2, BookOpen, CheckCircle2, Circle } from "lucide-react";

export default function DailyCodingGoals() {
  const goals = [
    { id: 1, title: "Solve 2 Medium Problems", type: "coding", icon: Code2, completed: true, points: 100 },
    { id: 2, title: "Review System Design: Caching", type: "learning", icon: BookOpen, completed: false, points: 50 },
    { id: 3, title: "Complete 1 Mock Interview", type: "practice", icon: Target, completed: false, points: 150 },
  ];

  const totalPoints = goals.reduce((acc, goal) => acc + (goal.completed ? goal.points : 0), 0);
  const progress = (goals.filter(g => g.completed).length / goals.length) * 100;

  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-cyan-500/50 transition duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Target className="text-cyan-400 w-5 h-5" />
          Daily Coding Goals
        </h2>
        <span className="text-sm font-semibold bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full">
          {totalPoints} XP Today
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2 text-slate-400">
          <span>Daily Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {goals.map((goal) => {
          const Icon = goal.icon;
          return (
            <div
              key={goal.id}
              className={`flex items-center gap-4 p-3 rounded-xl border transition-colors ${
                goal.completed
                  ? "bg-slate-800/50 border-slate-700/50"
                  : "bg-slate-800 border-slate-700 hover:border-cyan-500/50"
              }`}
            >
              <button className="text-slate-400 hover:text-cyan-400 transition-colors">
                {goal.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                ) : (
                  <Circle className="w-6 h-6" />
                )}
              </button>
              
              <div className="flex-1">
                <p className={`font-medium ${goal.completed ? "text-slate-400 line-through" : "text-white"}`}>
                  {goal.title}
                </p>
                <p className="text-xs text-slate-500 mt-1 capitalize">
                  {goal.type} • {goal.points} XP
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
