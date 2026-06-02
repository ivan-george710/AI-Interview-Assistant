"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] =
    useState("");

  const handleRegister = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    setLoading(true);

    const { error } =
      await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    alert(
      "Registration successful. Check your email for verification."
    );

    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8">
        <h1 className="text-3xl font-bold mb-2">
          Create Account
        </h1>

        <p className="text-slate-400 mb-6">
          Start your interview preparation journey
        </p>

        <form
          onSubmit={handleRegister}
          className="space-y-4"
        >
          <div>
            <label className="text-sm text-slate-300">
              Full Name
            </label>

            <input
              type="text"
              required
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
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
              required
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
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
              required
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
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
              required
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              placeholder="********"
              className="w-full mt-2 p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500"
            />
          </div>

          {errorMsg && (
            <p className="text-red-400 text-sm">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 text-black font-semibold p-3 rounded-xl hover:scale-105 transition disabled:opacity-50"
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
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