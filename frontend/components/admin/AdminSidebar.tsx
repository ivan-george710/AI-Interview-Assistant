import Link from "next/link";

export default function AdminSidebar() {

  const menuItems = [

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
      name: "Assessments",
      path: "/admin/assessments",
    },

    {
      name: "Reports",
      path: "/admin/reports",
    },

    {
      name: "AI Usage",
      path: "/admin/ai-usage",
    },

    {
      name: "Analytics",
      path: "/admin/analytics",
    },

  ];

  return (

    <aside className="w-72 bg-slate-900 border-r border-slate-800 p-6">

      <h1 className="text-2xl font-bold text-cyan-400 mb-10">
        Admin Panel
      </h1>

      <nav className="space-y-3">

        {menuItems.map(
          (item) => (

            <Link
              key={item.name}
              href={item.path}
              className="block p-4 rounded-xl hover:bg-slate-800 transition"
            >

              {item.name}

            </Link>

          )
        )}

      </nav>

      <div className="mt-10 pt-6 border-t border-slate-800">

        <Link
          href="/login"
          className="block p-4 rounded-xl bg-red-600 hover:bg-red-500 text-center transition"
        >
          Logout
        </Link>

      </div>

    </aside>

  );
}