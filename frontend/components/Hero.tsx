import Link from "next/link";

export default function Hero() {
return ( <section className="text-center py-32 px-6"> <div className="max-w-5xl mx-auto"> <div className="inline-block mb-6 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm font-medium">
AI-Powered Interview Preparation Platform </div>


    <h1 className="text-5xl md:text-7xl font-bold leading-tight">
      Crack Your
      <span className="text-cyan-400">
        {" "}Coding Interview
      </span>
    </h1>

    <p className="mt-8 text-lg md:text-xl text-slate-400 max-w-3xl mx-auto">
      Practice DSA problems, take AI-powered mock interviews,
      receive detailed code reviews, and track your
      interview readiness through personalized analytics.
    </p>

    <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
      <Link
        href="/login"
        className="bg-cyan-500 hover:bg-cyan-400 text-black px-8 py-4 rounded-xl font-semibold transition"
      >
        Login
      </Link>

      <Link
        href="/signup"
        className="border border-slate-700 hover:border-cyan-500 hover:text-cyan-400 px-8 py-4 rounded-xl transition"
      >
        Sign Up
      </Link>
    </div>

    <div className="mt-16 flex flex-wrap justify-center gap-8 text-slate-400">
      <div>
        <span className="text-cyan-400 font-bold text-2xl">
          10K+
        </span>
        <p className="text-sm mt-1">
          Questions
        </p>
      </div>

      <div>
        <span className="text-cyan-400 font-bold text-2xl">
          50K+
        </span>
        <p className="text-sm mt-1">
          Interviews
        </p>
      </div>

      <div>
        <span className="text-cyan-400 font-bold text-2xl">
          24/7
        </span>
        <p className="text-sm mt-1">
          AI Support
        </p>
      </div>
    </div>
  </div>
</section>


);
}
