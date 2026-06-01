import { Activity, Code, Video, Trophy } from "lucide-react";

export default function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: "solved",
      title: "Solved 'Two Sum'",
      time: "2 hours ago",
      icon: Code,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
    {
      id: 2,
      type: "interview",
      title: "Completed Mock Interview",
      time: "5 hours ago",
      icon: Video,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
    },
    {
      id: 3,
      type: "achievement",
      title: "15 Day Streak Reached!",
      time: "1 day ago",
      icon: Trophy,
      color: "text-amber-400",
      bgColor: "bg-amber-400/10",
    },
    {
      id: 4,
      type: "solved",
      title: "Solved 'Valid Palindrome'",
      time: "1 day ago",
      icon: Code,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
  ];

  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-cyan-500/50 transition duration-300">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Activity className="text-cyan-400 w-5 h-5" />
        Recent Activity
      </h2>

      <div className="space-y-6 relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-2 bottom-2 w-px bg-slate-800 -z-10" />

        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex gap-4 items-start">
              <div className={`p-3 rounded-xl ${activity.bgColor} ${activity.color} shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              
              <div className="flex-1 pt-2">
                <p className="font-medium text-white">{activity.title}</p>
                <p className="text-sm text-slate-500 mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}