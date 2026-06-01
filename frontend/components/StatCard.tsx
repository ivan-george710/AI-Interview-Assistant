interface StatCardProps {
  title: string;
  value: string;
}

export default function StatCard({
  title,
  value,
}: StatCardProps) {
  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-cyan-500 transition">
      <p className="text-slate-400">{title}</p>

      <h2 className="text-3xl font-bold mt-3">
        {value}
      </h2>
    </div>
  );
}