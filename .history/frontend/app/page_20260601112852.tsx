"use client";

import { supabase } from "@/lib/supabase";

export default function Home() {
  const testSupabase = async () => {
    const { data, error } =
      await supabase.auth.getSession();

    console.log(data);
    console.log(error);

    alert("Check browser console");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Supabase Test</h1>

      <button onClick={testSupabase}>
        Test Connection
      </button>
    </div>
  );
}