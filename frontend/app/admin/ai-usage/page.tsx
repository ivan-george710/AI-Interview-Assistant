"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AIUsagePage() {

  const [usage, setUsage] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadUsage();
  }, []);

  const loadUsage =
    async () => {

      const { data } =
        await supabase
          .from("ai_usage")
          .select("*")
          .order(
            "created_at",
            {
              ascending: false,
            }
          );

      setUsage(
        data || []
      );

      setLoading(
        false
      );
    };

  if (loading) {

    return (

      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">

        Loading...

      </div>

    );
  }

  const totalRequests =
    usage.length;

  const totalTokens =
    usage.reduce(
      (
        sum,
        item
      ) =>
        sum +
        (
          item.tokens_used ||
          0
        ),
      0
    );

  const resumeReviews =
    usage.filter(
      (
        item
      ) =>
        item.feature ===
        "Resume Review"
    ).length;

  const mockInterviews =
    usage.filter(
      (
        item
      ) =>
        item.feature ===
        "Mock Interview"
    ).length;

  const codingAssistant =
    usage.filter(
      (
        item
      ) =>
        item.feature ===
        "Coding Assistant"
    ).length;

  const featureCounts: Record<
    string,
    number
  > = {};

  usage.forEach(
    (item) => {

      featureCounts[
        item.feature
      ] =
        (
          featureCounts[
            item.feature
          ] || 0
        ) + 1;

    }
  );

  const mostUsedFeature =
    Object.entries(
      featureCounts
    ).sort(
      (
        a,
        b
      ) =>
        b[1] -
        a[1]
    )[0];

  return (

    <div className="min-h-screen bg-slate-950 text-white p-8">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold mb-2">
          AI Usage Analytics
        </h1>

        <p className="text-slate-400 mb-8">
          Monitor AI feature usage across the platform
        </p>

        <div className="grid md:grid-cols-5 gap-6 mb-8">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <p className="text-slate-400">
              AI Requests
            </p>

            <h2 className="text-4xl font-bold text-cyan-400 mt-2">
              {
                totalRequests
              }
            </h2>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <p className="text-slate-400">
              Resume Reviews
            </p>

            <h2 className="text-4xl font-bold text-green-400 mt-2">
              {
                resumeReviews
              }
            </h2>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <p className="text-slate-400">
              Mock Interviews
            </p>

            <h2 className="text-4xl font-bold text-yellow-400 mt-2">
              {
                mockInterviews
              }
            </h2>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <p className="text-slate-400">
              Coding Assistant
            </p>

            <h2 className="text-4xl font-bold text-purple-400 mt-2">
              {
                codingAssistant
              }
            </h2>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <p className="text-slate-400">
              Tokens Used
            </p>

            <h2 className="text-4xl font-bold text-red-400 mt-2">
              {
                totalTokens
              }
            </h2>

          </div>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-8">

          <h2 className="text-2xl font-bold mb-3">
            Most Used AI Feature
          </h2>

          <p className="text-cyan-400 text-3xl font-bold">

            {
              mostUsedFeature
                ? mostUsedFeature[0]
                : "No Data"
            }

          </p>

          <p className="text-slate-400 mt-2">

            Used{" "}

            {
              mostUsedFeature
                ? mostUsedFeature[1]
                : 0
            }

            {" "}times

          </p>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

          <h2 className="text-2xl font-bold mb-6">
            Recent AI Activity
          </h2>

          {usage.length ===
          0 ? (

            <div className="text-slate-400">
              No AI usage recorded.
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="border-b border-slate-700">

                    <th className="text-left p-3">
                      User
                    </th>

                    <th className="text-left p-3">
                      Feature
                    </th>

                    <th className="text-left p-3">
                      Tokens
                    </th>

                    <th className="text-left p-3">
                      Date
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {usage.map(
                    (
                      item
                    ) => (

                      <tr
                        key={
                          item.id
                        }
                        className="border-b border-slate-800"
                      >

                        <td className="p-3">
                          {
                            item.user_id
                          }
                        </td>

                        <td className="p-3 text-cyan-400">
                          {
                            item.feature
                          }
                        </td>

                        <td className="p-3">
                          {
                            item.tokens_used
                          }
                        </td>

                        <td className="p-3">

                          {
                            new Date(
                              item.created_at
                            ).toLocaleString()
                          }

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>

  );
}