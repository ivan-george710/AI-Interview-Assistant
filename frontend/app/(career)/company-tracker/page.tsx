"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CompanyTrackerPage() {
  const [companies, setCompanies] =
    useState<any[]>([]);

  const [company, setCompany] =
    useState("");

  const [status, setStatus] =
    useState("Preparing");

  const [notes, setNotes] =
    useState("");

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } =
      await supabase
        .from("company_tracker")
        .select("*")
        .eq("user_id", user.id)
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    if (error) {
      console.log(error);
      return;
    }

    setCompanies(data || []);
  };

  const addCompany = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    if (!company) {
      alert(
        "Enter company name"
      );
      return;
    }

    const { error } =
      await supabase
        .from("company_tracker")
        .insert({
          user_id: user.id,
          company_name: company,
          status,
          notes,
        });

    if (error) {
      console.log(error);
      alert(error.message);
      return;
    }

    setCompany("");
    setStatus("Preparing");
    setNotes("");

    loadCompanies();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      <h1 className="text-4xl font-bold mb-8">
        Company Preparation Tracker
      </h1>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">

        <div className="grid md:grid-cols-2 gap-4">

          <input
            value={company}
            onChange={(e) =>
              setCompany(
                e.target.value
              )
            }
            placeholder="Company Name"
            className="bg-slate-800 p-3 rounded-xl"
          />

          <select
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value
              )
            }
            className="bg-slate-800 p-3 rounded-xl"
          >
            <option>
              Preparing
            </option>
            <option>
              Applied
            </option>
            <option>
              OA Completed
            </option>
            <option>
              Interview Scheduled
            </option>
            <option>
              Rejected
            </option>
            <option>
              Selected
            </option>
          </select>

        </div>

        <textarea
          value={notes}
          onChange={(e) =>
            setNotes(
              e.target.value
            )
          }
          placeholder="Notes..."
          className="w-full mt-4 bg-slate-800 p-3 rounded-xl h-32"
        />

        <button
          onClick={addCompany}
          className="mt-4 bg-cyan-500 text-black px-6 py-3 rounded-xl font-semibold"
        >
          Add Company
        </button>

      </div>

      <div className="space-y-4">

        {companies.map(
          (company) => (
            <div
              key={company.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5"
            >
              <h2 className="text-xl font-bold">
                {
                  company.company_name
                }
              </h2>

              <p className="text-cyan-400 mt-2">
                {
                  company.status
                }
              </p>

              <p className="mt-3 text-slate-300">
                {
                  company.notes
                }
              </p>
            </div>
          )
        )}

      </div>

    </div>
  );
}