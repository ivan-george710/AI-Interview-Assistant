interface Props {
  title: string;
  value: string;
}

export default function AdminStatCard({
  title,
  value,
}: Props) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-cyan-500 transition">
      <p className="text-slate-400 text-sm uppercase tracking-wider">
        {title}
      </p>

      <h2 className="text-5xl font-bold text-cyan-400 mt-4">
        {value}
      </h2>
    </div>
  );
}