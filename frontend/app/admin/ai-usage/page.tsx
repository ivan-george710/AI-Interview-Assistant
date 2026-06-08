"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AIUsagePage() {
  const [usage, setUsage] =
    useState<any[]>([]);

  useEffect(() => {
    loadUsage();
  }, []);

  const loadUsage = async () => {
    const { data } = await supabase
      .from("ai_usage")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    setUsage(data || []);
  };

  return (
    <div className="p-8 text-white">

      <h1 className="text-4xl font-bold mb-6">
        AI Usage Monitoring
      </h1>

      {usage.map((item) => (
        <div
          key={item.id}
          className="bg-slate-900 p-4 rounded mb-4"
        >
          <p>
            User:
            {" "}
            {item.user_id}
          </p>

          <p>
            Feature:
            {" "}
            {item.feature}
          </p>

          <p>
            Tokens:
            {" "}
            {item.tokens_used}
          </p>

          <p>
            Date:
            {" "}
            {item.created_at}
          </p>
        </div>
      ))}
    </div>
  );
}