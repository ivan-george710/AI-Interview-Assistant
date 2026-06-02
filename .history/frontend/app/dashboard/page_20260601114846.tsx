"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const router = useRouter();

  const { user, loading } =
    useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const logout = async () => {
    await supabase.auth.signOut();

    router.push("/login");
  };

  if (loading)
    return <h2>Loading...</h2>;

  return (
    <div style={{ padding: 40 }}>
      <h1>Dashboard</h1>

      <p>
        Email: {user?.email}
      </p>

      <p>
        User ID: {user?.id}
      </p>

      <button onClick={logout}>
        Logout
      </button>
    </div>
  );
}