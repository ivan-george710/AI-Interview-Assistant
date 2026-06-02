"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeatureCard from "@/components/FeatureCard";
import ProgressChart from "@/components/ProgressChart";


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
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <Hero />

      <section className="max-w-6xl mx-auto px-8 pb-20">
        <h2 className="text-4xl font-bold text-center mb-10">
          Features
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            title="AI Mock Interviews"
            description="Practice with AI interviewers."
          />

          <FeatureCard
            title="Code Reviews"
            description="Receive instant AI feedback."
          />

          <FeatureCard
            title="Progress Analytics"
            description="Track your readiness score."
          />
        </div>
      </section>
    </main>
  );
}