"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", solved: 5 },
  { day: "Tue", solved: 8 },
  { day: "Wed", solved: 6 },
  { day: "Thu", solved: 12 },
  { day: "Fri", solved: 10 },
  { day: "Sat", solved: 15 },
];

export default function ProgressChart() {
  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
      <h2 className="text-xl font-bold mb-4">
        Questions Solved Per Day
      </h2>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="solved"
              stroke="#06b6d4"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}