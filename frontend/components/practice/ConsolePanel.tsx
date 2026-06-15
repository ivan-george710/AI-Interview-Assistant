"use client";

interface Props {
  output: string;

  customInput: string;

  setCustomInput: (
    value: string
  ) => void;

  metrics: {
    time: string;
    memory: string;
  } | null;
}

export default function ConsolePanel({
  output,
  customInput,
  setCustomInput,
  metrics,
}: Props) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

      <div className="p-4 border-b border-slate-800">

        <h2 className="font-semibold">
          Console
        </h2>

      </div>

      <div className="grid grid-cols-2">

        <div className="p-4 border-r border-slate-800">

          <h3 className="text-sm text-slate-400 mb-2">
            Custom Input
          </h3>

          <textarea
            value={customInput}
            onChange={(e) =>
              setCustomInput(
                e.target.value
              )
            }
            className="w-full h-40 bg-slate-950 border border-slate-800 rounded-xl p-3"
            placeholder="Enter test input..."
          />

        </div>

        <div className="p-4">

          <h3 className="text-sm text-slate-400 mb-2">
            Output
          </h3>

          <pre className="bg-slate-950 border border-slate-800 rounded-xl p-3 h-40 overflow-auto whitespace-pre-wrap">
            {output}
          </pre>

          {metrics && (

            <div className="mt-3 text-sm text-slate-400">

              <p>
                Runtime:{" "}
                {metrics.time} ms
              </p>

              <p>
                Memory:{" "}
                {metrics.memory} MB
              </p>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}