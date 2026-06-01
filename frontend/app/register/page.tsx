"use client";

import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8">

        <h1 className="text-3xl font-bold mb-2">
          Create Account
        </h1>

        <p className="text-slate-400 mb-6">
          Start your interview preparation journey
        </p>

        <form className="space-y-4">

          <div>
            <label className="text-sm text-slate-300">
              Full Name
            </label>

            <input
              type="text"
              placeholder="John Doe"
              className="w-full mt-2 p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">
              Email
            </label>

            <input
              type="email"
              placeholder="john@example.com"
              className="w-full mt-2 p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">
              Password
            </label>

            <input
              type="password"
              placeholder="********"
              className="w-full mt-2 p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="********"
              className="w-full mt-2 p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-500 text-black font-semibold p-3 rounded-xl hover:scale-105 transition"
          >
            Create Account
          </button>

        </form>

        <p className="text-center mt-6 text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-cyan-400 hover:underline"
          >
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}