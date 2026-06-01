"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { LineChart as ChartIcon } from "lucide-react";

const data = [
  { day: "Mon", solved: 5 },
  { day: "Tue", solved: 8 },
  { day: "Wed", solved: 6 },
  { day: "Thu", solved: 12 },
  { day: "Fri", solved: 10 },
  { day: "Sat", solved: 15 },
  { day: "Sun", solved: 18 },
];

export default function ProgressChart() {
  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-cyan-500/50 transition duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ChartIcon className="text-cyan-400 w-5 h-5" />
          Progress Overview
        </h2>
        <select className="bg-slate-800 border border-slate-700 text-sm rounded-lg px-3 py-1 outline-none focus:border-cyan-500">
          <option>This Week</option>
          <option>Last Week</option>
          <option>This Month</option>
        </select>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSolved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc' }}
              itemStyle={{ color: '#06b6d4' }}
              cursor={{ stroke: '#1e293b', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Area
              type="monotone"
              dataKey="solved"
              stroke="#06b6d4"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorSolved)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}