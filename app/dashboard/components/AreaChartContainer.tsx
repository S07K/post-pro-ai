"use client";
import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartProps {
  id: string;
  title: string;
  subtitle?: string;
  chartColor: string;
  data: {
    name: string;
    value: number;
  }[];
}

// Axis and grid colors use currentColor so they follow the light/dark theme
const axisTick = { fill: "currentColor", fontSize: 12 };

const AreaChartContainer: React.FC<ChartProps> = ({ id, title, subtitle, chartColor, data }) => {
  return (
    <div className="rounded-lg border border-divider bg-content1 p-4">
      <p className="text-[15px] font-semibold text-default-900">{title}</p>
      {subtitle ? <p className="text-[13px] text-default-600">{subtitle}</p> : null}
      <div className="mt-3 h-[240px] text-default-500">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.25} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="currentColor" strokeOpacity={0.2} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} tick={axisTick} />
            <YAxis tickLine={false} axisLine={false} tick={axisTick} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "1px solid hsl(var(--nextui-divider))",
                background: "hsl(var(--nextui-content1))",
                color: "hsl(var(--nextui-foreground))",
                fontSize: 13,
              }}
              cursor={{ stroke: "currentColor", strokeOpacity: 0.3 }}
            />
            <Area type="monotone" dataKey="value" stroke={chartColor} strokeWidth={2} fillOpacity={1} fill={`url(#${id})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AreaChartContainer;
