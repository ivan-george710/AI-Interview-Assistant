"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ReportsPage() {

  const [reports, setReports] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports =
    async () => {

      const { data } =
        await supabase
          .from("reports")
          .select("*")
          .order(
            "created_at",
            {
              ascending: false,
            }
          );

      setReports(
        data || []
      );

      setLoading(
        false
      );
    };

  const resolveReport =
    async (
      id: string
    ) => {

      await supabase
        .from("reports")
        .update({
          status:
            "resolved",
        })
        .eq(
          "id",
          id
        );

      loadReports();
    };

  const deleteReport =
    async (
      id: string
    ) => {

      const confirmed =
        window.confirm(
          "Delete this report?"
        );

      if (!confirmed)
        return;

      await supabase
        .from("reports")
        .delete()
        .eq(
          "id",
          id
        );

      loadReports();
    };

  if (loading) {

    return (

      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">

        Loading...

      </div>

    );
  }

  const filteredReports =
    reports.filter(
      (report) => {

        const matchesSearch =
          (
            report.reason ||
            ""
          )
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchesFilter =
          filter ===
          "all"
            ? true
            : report.status ===
              filter;

        return (
          matchesSearch &&
          matchesFilter
        );
      }
    );

  const totalReports =
    reports.length;

  const pendingReports =
    reports.filter(
      (
        report
      ) =>
        report.status !==
        "resolved"
    ).length;

  const resolvedReports =
    reports.filter(
      (
        report
      ) =>
        report.status ===
        "resolved"
    ).length;

  const criticalReports =
    reports.filter(
      (
        report
      ) =>
        (
          report.reason ||
          ""
        )
          .toLowerCase()
          .includes(
            "abuse"
          ) ||
        (
          report.reason ||
          ""
        )
          .toLowerCase()
          .includes(
            "cheat"
          ) ||
        (
          report.reason ||
          ""
        )
          .toLowerCase()
          .includes(
            "spam"
          )
    ).length;

  return (

    <div className="min-h-screen bg-slate-950 text-white p-8">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold mb-2">
          Report Monitoring
        </h1>

        <p className="text-slate-400 mb-8">
          Monitor and manage platform reports
        </p>

        <div className="grid md:grid-cols-4 gap-6 mb-8">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <p className="text-slate-400">
              Total Reports
            </p>

            <h2 className="text-4xl font-bold text-cyan-400">
              {
                totalReports
              }
            </h2>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <p className="text-slate-400">
              Pending
            </p>

            <h2 className="text-4xl font-bold text-yellow-400">
              {
                pendingReports
              }
            </h2>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <p className="text-slate-400">
              Resolved
            </p>

            <h2 className="text-4xl font-bold text-green-400">
              {
                resolvedReports
              }
            </h2>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <p className="text-slate-400">
              Critical
            </p>

            <h2 className="text-4xl font-bold text-red-400">
              {
                criticalReports
              }
            </h2>

          </div>

        </div>

        <div className="flex gap-4 mb-6">

          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="flex-1 p-3 rounded-xl bg-slate-900 border border-slate-700"
          />

          <select
            value={filter}
            onChange={(e) =>
              setFilter(
                e.target.value
              )
            }
            className="bg-slate-900 border border-slate-700 rounded-xl px-4"
          >

            <option value="all">
              All
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="resolved">
              Resolved
            </option>

          </select>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">

          <table className="w-full">

            <thead>

              <tr className="border-b border-slate-800 bg-slate-950">

                <th className="p-4 text-left">
                  ID
                </th>

                <th className="p-4 text-left">
                  Reason
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-left">
                  Date
                </th>

                <th className="p-4 text-left">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredReports.map(
                (
                  report
                ) => (

                  <tr
                    key={
                      report.id
                    }
                    className="border-b border-slate-800"
                  >

                    <td className="p-4 text-xs">
                      {
                        report.id
                      }
                    </td>

                    <td className="p-4">
                      {
                        report.reason
                      }
                    </td>

                    <td className="p-4">

                      <span
                        className={`px-3 py-1 rounded-lg text-sm ${
                          report.status ===
                          "resolved"
                            ? "bg-green-600"
                            : "bg-yellow-600"
                        }`}
                      >

                        {
                          report.status
                        }

                      </span>

                    </td>

                    <td className="p-4">

                      {
                        report.created_at
                          ? new Date(
                              report.created_at
                            ).toLocaleString()
                          : "-"
                      }

                    </td>

                    <td className="p-4">

                      <div className="flex gap-2">

                        {report.status !==
                          "resolved" && (

                          <button
                            onClick={() =>
                              resolveReport(
                                report.id
                              )
                            }
                            className="bg-cyan-500 text-black px-3 py-2 rounded-lg"
                          >
                            Resolve
                          </button>

                        )}

                        <button
                          onClick={() =>
                            deleteReport(
                              report.id
                            )
                          }
                          className="bg-red-600 px-3 py-2 rounded-lg"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}