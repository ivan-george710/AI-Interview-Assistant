import { BarChart3 } from "lucide-react";

export default function TopicPerformance() {
  const topics = [
    { name: "Arrays & Hashing", value: 90, color: "from-cyan-400 to-blue-500" },
    { name: "Two Pointers", value: 85, color: "from-blue-400 to-indigo-500" },
    { name: "Trees", value: 70, color: "from-indigo-400 to-purple-500" },
    { name: "Graphs", value: 60, color: "from-purple-400 to-pink-500" },
    { name: "Dynamic Programming", value: 45, color: "from-pink-400 to-rose-500" },
  ];

  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-cyan-500/50 transition duration-300">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <BarChart3 className="text-cyan-400 w-5 h-5" />
        Skill Progress Analytics
      </h2>

      <div className="space-y-5">
        {topics.map((topic) => (
          <div key={topic.name} className="group">
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-slate-200 group-hover:text-white transition-colors">{topic.name}</span>
              <span className="text-slate-400 group-hover:text-cyan-400 transition-colors font-medium">{topic.value}%</span>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className={`bg-gradient-to-r ${topic.color} h-full rounded-full transition-all duration-1000 ease-out relative`}
                style={{ width: `${topic.value}%` }}
              >
                <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}