"use client";

import Link from "next/link";

import Hero from "@/components/Hero";
import FeatureCard from "@/components/FeatureCard";
import ProgressChart from "@/components/ProgressChart";

export default function Home() {
return ( <main className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
{/* Hero */} <Hero />


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
          Success Rate
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
        description="Receive instant feedback on your coding performance and solutions."
      />

      <FeatureCard
        title="Progress Analytics"
        description="Track strengths, weaknesses, and readiness scores over time."
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
        Visualize your growth, track performance, and identify areas for improvement.
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
        Join thousands of candidates improving their interview skills with AI-powered practice and feedback.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link
          href="/login"
          className="px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 transition font-semibold text-slate-950"
        >
          Login
        </Link>

        <Link
          href="/signup"
          className="px-8 py-4 rounded-xl border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 transition font-semibold"
        >
          Sign Up
        </Link>
      </div>
    </div>
  </section>
</main>


);
}
