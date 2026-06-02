"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Simulate sending password reset email
      setIsSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8">
        <h1 className="text-3xl font-bold mb-2">Reset Password</h1>

        <p className="text-slate-400 mb-6">
          Enter your email to receive a password reset link.
        </p>

        {isSubmitted ? (
          <div className="bg-emerald-500/20 text-emerald-400 p-4 rounded-xl border border-emerald-500/30 text-center mb-6">
            If an account exists for {email}, you will receive a reset link shortly.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-slate-300">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full mt-2 p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-500 text-black font-semibold p-3 rounded-xl hover:scale-105 transition"
            >
              Send Reset Link
            </button>
          </form>
        )}

        <p className="text-center mt-6 text-slate-400">
          Remember your password?{" "}
          <Link href="/login" className="text-cyan-400 hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}