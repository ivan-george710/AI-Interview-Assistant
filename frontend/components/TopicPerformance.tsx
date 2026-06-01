export default function TopicPerformance() {
  const topics = [
    { name: "Arrays", value: 90 },
    { name: "Strings", value: 85 },
    { name: "Trees", value: 70 },
    { name: "Graphs", value: 60 },
    { name: "Dynamic Programming", value: 45 },
  ];

  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
      <h2 className="text-xl font-bold mb-6">
        Topic Performance
      </h2>

      {topics.map((topic) => (
        <div key={topic.name} className="mb-5">

          <div className="flex justify-between mb-2">
            <span>{topic.name}</span>
            <span>{topic.value}%</span>
          </div>

          <div className="w-full bg-slate-700 rounded-full h-3">
            <div
              className="bg-cyan-500 h-3 rounded-full"
              style={{ width: `${topic.value}%` }}
            />
          </div>

        </div>
      ))}
    </div>
  );
}