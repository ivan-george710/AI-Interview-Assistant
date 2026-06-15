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

return ( <main className="min-h-screen bg-slate-950 text-white overflow-x-hidden"> <Navbar />

```
  {/* Hero */}
  <Hero />

  {/* Stats */}
  <section className="max-w-6xl mx-auto px-8 py-16">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
        <h3 className="text-3xl font-bold text-cyan-400">
          10K+
        </h3>
        <p className="text-slate-400 mt-2">
          Interview Questions
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
        <h3 className="text-3xl font-bold text-cyan-400">
          95%
        </h3>
        <p className="text-slate-400 mt-2">
          Accuracy
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
        <h3 className="text-3xl font-bold text-cyan-400">
          50K+
        </h3>
        <p className="text-slate-400 mt-2">
          Interviews Practiced
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
        <h3 className="text-3xl font-bold text-cyan-400">
          24/7
        </h3>
        <p className="text-slate-400 mt-2">
          AI Availability
        </p>
      </div>
    </div>
  </section>

  {/* Features */}
  <section className="max-w-6xl mx-auto px-8 py-20">
    <h2 className="text-4xl font-bold text-center mb-4">
      Features
    </h2>

    <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
      Everything you need to prepare for technical and behavioral interviews.
    </p>

    <div className="grid md:grid-cols-3 gap-8">
      <FeatureCard
        title="AI Mock Interviews"
        description="Practice realistic interview scenarios powered by AI."
      />

      <FeatureCard
        title="Code Reviews"
        description="Receive detailed feedback and improvement suggestions."
      />

      <FeatureCard
        title="Progress Analytics"
        description="Track performance and identify weak areas."
      />
    </div>
  </section>

  {/* Analytics */}
  <section className="max-w-6xl mx-auto px-8 py-20">
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
      <h2 className="text-3xl font-bold mb-4">
        Performance Dashboard
      </h2>

      <p className="text-slate-400 mb-8">
        Visualize your growth and readiness score over time.
      </p>

      <ProgressChart />
    </div>
  </section>

  {/* CTA */}
  <section className="max-w-4xl mx-auto px-8 py-20">
    <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-slate-900 to-slate-800 p-10 text-center">
      <h2 className="text-4xl font-bold mb-4">
        Ready for Your Next Interview?
      </h2>

      <p className="text-slate-400 mb-8">
        Start practicing today and improve your confidence with AI-powered feedback.
      </p>

      <button
        onClick={testSupabase}
        className="px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 transition font-semibold text-slate-950"
      >
        Get Started
      </button>
    </div>
  </section>
</main>


);
}
