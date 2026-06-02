"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Temporary login
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-3xl border border-slate-800">
        <h1 className="text-3xl font-bold mb-2">
          Welcome Back
        </h1>

        <p className="text-slate-400 mb-6">
          Login to continue
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label>Email</label>

            <input
              type="email"
              required
              className="w-full mt-2 p-3 rounded-xl bg-slate-800 border border-slate-700"
            />
          </div>

          <div>
            <label>Password</label>

            <input
              type="password"
              required
              className="w-full mt-2 p-3 rounded-xl bg-slate-800 border border-slate-700"
            />
          </div>

          <p className="text-right text-sm">
            <Link
              href="/forgot-password"
              className="text-cyan-400 hover:underline"
            >
              Forgot Password?
            </Link>
          </p>

          <button
            type="submit"
            className="w-full bg-cyan-500 text-black p-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-slate-400">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-cyan-400 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}