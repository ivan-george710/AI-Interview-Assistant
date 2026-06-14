"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export default function Sidebar() {
  const { user } = useAuth();

  const [isAdmin, setIsAdmin] =
    useState(false);

  useEffect(() => {
    checkRole();
  }, [user]);

  const checkRole = async () => {
    if (!user) return;

    const { data, error } =
      await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (error) {
      console.log(error);
      return;
    }

    setIsAdmin(
      data?.role === "admin"
    );
  };

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
      path: "/Settings",
    },
    {
      name: "Resume",
      path: "/resume",
    },
    {
      name: "Job Readiness",
      path: "/job-readiness",
    },
    {
      name: "Company Tracker",
      path: "/company-tracker",
    },
    {
      name: "Interview Experiences",
      path: "/interview-experiences",
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

        {isAdmin && (
          <Link
            href="/admin"
            className="block p-3 rounded-xl bg-cyan-500 text-black font-semibold"
          >
            Admin
          </Link>
        )}
      </nav>
    </aside>
  );
}