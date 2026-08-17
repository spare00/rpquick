"use client";

import { format } from "date-fns";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatAud } from "@/lib/format";

type Point = { recordedAt: Date | string; price: number };

export function PriceChart({ snapshots }: { snapshots: Point[] }) {
  const data = snapshots.map((row) => ({
    date: format(new Date(row.recordedAt), "MM/dd"),
    price: row.price,
  }));

  if (data.length < 2) {
    return (
      <p className="rounded-xl border border-dashed border-line px-4 py-10 text-center text-sm text-muted">
        No price history yet. The drop curve fills in as we collect more snapshots.
      </p>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c44521" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#c44521" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#6f6458" }} axisLine={false} tickLine={false} />
          <YAxis
            tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`}
            tick={{ fontSize: 12, fill: "#6f6458" }}
            axisLine={false}
            tickLine={false}
            width={44}
          />
          <Tooltip
            formatter={(value) => formatAud(Number(value))}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e0d4c4",
              background: "#fffaf2",
            }}
          />
          <Area type="monotone" dataKey="price" stroke="#c44521" fill="url(#priceFill)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
