export default function Hero() {
  return (
    <section className="text-center py-32">
      <h1 className="text-7xl font-bold">
        Crack Your
        <span className="text-cyan-400">
          {" "}Coding Interview
        </span>
      </h1>

      <p className="mt-6 text-xl text-slate-400 max-w-2xl mx-auto">
        Practice DSA, take AI-powered mock interviews,
        receive code reviews, and track your
        interview readiness.
      </p>

      <div className="mt-10 flex justify-center gap-6">
        <button className="bg-cyan-500 text-black px-8 py-4 rounded-xl font-semibold">
          Start Practicing
        </button>

        <button className="border border-slate-700 px-8 py-4 rounded-xl">
          Watch Demo
        </button>
      </div>
    </section>
  );
}