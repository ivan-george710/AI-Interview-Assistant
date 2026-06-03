import Link from "next/link";

export default function AdminSidebar() {
  const menuItems = [
    {
      name: "User Dashboard",
      path: "/dashboard",
    },
    {
      name: "Admin Dashboard",
      path: "/admin",
    },
    {
      name: "Users",
      path: "/admin/users",
    },
    {
      name: "Questions",
      path: "/admin/questions",
    },
    {
      name: "Contests",
      path: "/admin/contests",
    },
    {
      name: "Reports",
      path: "/admin/reports",
    },
    {
      name: "AI Usage",
      path: "/admin/ai-usage",
    },
  ];

  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 p-6">

      <h1 className="text-2xl font-bold text-cyan-400 mb-10">
        Admin Panel
      </h1>

      <nav className="space-y-3">

        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className="block p-4 rounded-xl hover:bg-slate-800 transition"
          >
            {item.name}
          </Link>
        ))}

      </nav>

    </aside>
  );
}