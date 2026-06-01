interface Props {
  title: string;
  description: string;
}

export default function FeatureCard({
  title,
  description,
}: Props) {
  return (
    <div className="bg-slate-900 p-6 rounded-2xl hover:scale-105 transition">
      <h3 className="text-xl font-bold">
        {title}
      </h3>

      <p className="text-slate-400 mt-3">
        {description}
      </p>
    </div>
  );
}