"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export default function Sidebar() {
  const { user } = useAuth();

  const [isAdmin, setIsAdmin] =
    useState(false);

  const [open, setOpen] =
    useState(false);

  useEffect(() => {
    checkRole();
  }, [user]);

  async function checkRole() {
    if (!user) return;

    const { data } =
      await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    setIsAdmin(
      data?.role === "admin"
    );
  }

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
      name: "Assessment History",
      path: "/assessment-history",
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
      name: "Achievements",
      path: "/achievements",
    },
    {
      name: "Profile",
      path: "/profile",
    },
    {
      name: "Settings",
      path: "/settings",
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
  name: "Job Recommendations",
  path: "/job-recommendations",
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
    <>
      {/* Hamburger */}

      <button
        onClick={() =>
          setOpen(!open)
        }
        className="
          fixed
          top-4
          left-4
          z-50
          bg-slate-900
          border
          border-slate-700
          p-2
          rounded-lg
          shadow-lg
        "
      >
        {open ? (
          <X size={22} />
        ) : (
          <Menu size={22} />
        )}
      </button>

      {/* Overlay */}

      {open && (
        <div
          className="
            fixed
            inset-0
            bg-black/50
            z-40
          "
          onClick={() =>
            setOpen(false)
          }
        />
      )}

      {/* Sidebar */}

      <aside
        className={`
          fixed
          top-0
          left-0
          h-screen
          w-72
          overflow-y-auto
          bg-slate-900
          border-r
          border-slate-800
          z-50
          transition-transform
          duration-300
          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <div className="p-6 mt-12">

          <h1 className="text-2xl font-bold text-cyan-400 mb-8">
            AI Interview
          </h1>

          <nav className="space-y-2 pb-12">

            {menuItems.map(
              (item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() =>
                    setOpen(false)
                  }
                  className="
                    block
                    p-3
                    rounded-xl
                    hover:bg-slate-800
                    transition
                  "
                >
                  {item.name}
                </Link>
              )
            )}

            {isAdmin && (
              <Link
                href="/admin"
                onClick={() =>
                  setOpen(false)
                }
                className="
                  block
                  p-3
                  rounded-xl
                  bg-cyan-500
                  text-black
                  font-semibold
                  mt-4
                "
              >
                Admin Panel
              </Link>
            )}

          </nav>

        </div>
      </aside>
    </>
  );
}