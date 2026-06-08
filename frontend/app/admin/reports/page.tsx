"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ReportsPage() {
  const [reports, setReports] =
    useState<any[]>([]);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    const { data } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    setReports(data || []);
  };

  const resolveReport = async (
    id: string
  ) => {
    await supabase
      .from("reports")
      .update({
        status: "resolved",
      })
      .eq("id", id);

    loadReports();
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-4xl font-bold mb-6">
        Report Monitoring
      </h1>

      {reports.map((report) => (
        <div
          key={report.id}
          className="bg-slate-900 p-4 rounded mb-4"
        >
          <p>
            Reason:
            {" "}
            {report.reason}
          </p>

          <p>
            Status:
            {" "}
            {report.status}
          </p>

          <button
            onClick={() =>
              resolveReport(
                report.id
              )
            }
            className="bg-cyan-500 text-black px-4 py-2 rounded mt-3"
          >
            Resolve
          </button>
        </div>
      ))}
    </div>
  );
}