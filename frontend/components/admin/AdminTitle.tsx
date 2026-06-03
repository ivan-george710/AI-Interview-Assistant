interface Props {
  title: string;
  subtitle: string;
}

export default function AdminTitle({
  title,
  subtitle,
}: Props) {
  return (
    <div>
      <h1 className="text-5xl font-bold">
        {title}
      </h1>

      <p className="text-slate-400 mt-2">
        {subtitle}
      </p>
    </div>
  );
}