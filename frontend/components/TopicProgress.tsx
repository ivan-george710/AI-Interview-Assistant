export default function TopicProgress({
  topic,
  accuracy,
}: {
  topic: string;
  accuracy: number;
}) {
  return (
    <div className="mb-5">
      <div className="flex justify-between mb-2">
        <span>{topic}</span>

        <span>
          {accuracy.toFixed(0)}%
        </span>
      </div>

      <div className="w-full bg-slate-800 rounded-full h-3">
        <div
          className="bg-cyan-500 h-3 rounded-full"
          style={{
            width: `${accuracy}%`,
          }}
        />
      </div>
    </div>
  );
}