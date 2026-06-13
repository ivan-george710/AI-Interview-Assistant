"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if user came from email link
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      // Supabase handles this automatically
      console.log(
        "Password recovery link detected"
      );
    }
  }, []);

  const handleResetPassword = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters"
      );
      return;
    }

    setLoading(true);

    const { error: updateError } =
      await supabase.auth.updateUser({
        password,
      });

    setLoading(false);

    if (updateError) {
      setError(
        updateError.message ||
          "Failed to reset password"
      );
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8">
        <h1 className="text-3xl font-bold mb-2">
          Reset Password
        </h1>

        <p className="text-slate-400 mb-6">
          Enter your new password below
        </p>

        {success ? (
          <div className="bg-emerald-500/20 text-emerald-400 p-4 rounded-xl border border-emerald-500/30 text-center">
            <p className="font-semibold mb-2">
              Password reset successful!
            </p>
            <p className="text-sm">
              Redirecting to login...
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleResetPassword}
            className="space-y-4"
          >
            {error && (
              <div className="bg-red-500/20 text-red-400 p-3 rounded-xl border border-red-500/30 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="text-sm text-slate-300">
                New Password
              </label>

              <input
                type="password"
                required
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="••••••••"
                disabled={loading}
                className="w-full mt-2 p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">
                Confirm Password
              </label>

              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                placeholder="••••••••"
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
                ? "Resetting..."
                : "Reset Password"}
            </button>
          </form>
        )}

        <p className="text-center mt-6 text-slate-400">
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