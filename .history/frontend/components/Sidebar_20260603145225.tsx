import Link from "next/link";

export default function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Practice",
      path: "/practice",
    },
    {
      name: "Mock Interview",
      path: "/mock-interview",
    },
    {
      name: "Contests",
      path: "/contests",
    },
    {
      name: "Assessments",
      path: "/assessments",
    },
    {
      name: "Analytics",
      path: "/analytics",
    },
    {
      name: "Leaderboard",
      path: "/leaderboard",
    },
    {
      name: "Profile",
      path: "/profile",
    },
    {
      name: "Settings",
      path: "/settings",
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6">
      <h1 className="text-2xl font-bold text-cyan-400 mb-10">
        AI Interview
      </h1>

      <nav className="space-y-4">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className="block p-3 rounded-xl hover:bg-slate-800 transition"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
```
