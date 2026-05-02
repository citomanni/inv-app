"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { year: "2018", returnOfCapital: 0, distributions: 0 },
  { year: "2019", returnOfCapital: 0, distributions: 195 },
  { year: "2020", returnOfCapital: 0, distributions: 210 },
  { year: "2021", returnOfCapital: 0, distributions: 195 },
  { year: "2022", returnOfCapital: 0, distributions: 185 },
];

const timeRanges = ["Last 5 Years", "Last 3 Years", "Last Year", "All Time"];

export function DistributionsHistory() {
  const [selectedRange, setSelectedRange] = useState("Last 5 Years");

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-normal text-gray-700">
          Distributions History
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">YEAR</span>
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {timeRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={0} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="year"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 14 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 14 }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
            cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
            contentStyle={{
                backgroundColor: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "6px",
            }}
            formatter={(value: number | undefined) => [
                value != null ? `$${value}` : "$0",
                "",
            ]}
            />
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="rect"
              wrapperStyle={{ paddingTop: "20px" }}
              formatter={(value) =>
                value === "returnOfCapital"
                  ? "Return of Capital"
                  : "Distributions"
              }
            />
            <Bar
              dataKey="returnOfCapital"
              fill="#D1FAE5"
              radius={[4, 4, 0, 0]}
            />
            <Bar dataKey="distributions" fill="#4ADE80" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-right mt-4">
        <span className="text-xs text-gray-400">Chart Updates Hourly</span>
      </div>
    </div>
  );
}