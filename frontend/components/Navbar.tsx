import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-10 py-6 border-b border-slate-800">
      <h1 className="text-3xl font-bold text-cyan-400">
        AI Interview Assistant
      </h1>

      <div className="flex items-center gap-10">
        <a href="#features" className="hover:text-cyan-400 transition">
          Features
        </a>

        <Link href="/dashboard" className="hover:text-cyan-400 transition">
          Dashboard
        </Link>

        <a href="#" className="hover:text-cyan-400 transition">
          About
        </a>
      </div>

      <Link
        href="/login"
        className="bg-cyan-500 text-black px-8 py-3 rounded-2xl font-semibold hover:opacity-90 transition"
      >
        Get Started
      </Link>
    </nav>
  );
}