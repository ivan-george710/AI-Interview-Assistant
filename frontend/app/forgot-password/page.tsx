"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: resetError } =
      await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

    setLoading(false);

    if (resetError) {
      setError(
        resetError.message ||
          "Failed to send reset email"
      );
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8">
        <h1 className="text-3xl font-bold mb-2">
          Forgot Password?
        </h1>

        <p className="text-slate-400 mb-6">
          Enter your email to receive a password
          reset link.
        </p>

        {submitted ? (
          <div className="bg-emerald-500/20 text-emerald-400 p-4 rounded-xl border border-emerald-500/30 text-center mb-6">
            <p className="font-semibold mb-2">
              Check your email
            </p>
            <p className="text-sm">
              We've sent a password reset link to{" "}
              <span className="font-semibold">
                {email}
              </span>
              . Follow the link to reset your
              password.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {error && (
              <div className="bg-red-500/20 text-red-400 p-3 rounded-xl border border-red-500/30 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="text-sm text-slate-300">
                Email
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="john@example.com"
                disabled={loading}
                className="w-full mt-2 p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500 disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 text-black font-semibold p-3 rounded-xl hover:opacity-90 transition disabled:opacity-50"
            >
              {loading
                ? "Sending..."
                : "Send Reset Link"}
            </button>
          </form>
        )}

        <p className="text-center mt-6 text-slate-400">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-cyan-400 hover:underline"
          >
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
