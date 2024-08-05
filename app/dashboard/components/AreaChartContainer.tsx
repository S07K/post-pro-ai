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
  chartColor: string;
  data: {
    name: string;
    value: number;
  }[];
}

const AreaChartContainer: React.FC<ChartProps> = ({id, title, chartColor, data}) => {

  return (
    <>
      <div className="w-full lg:w-[49%] flex justify-center items-center">
        <div className="w-full post-pro bg-default-50 p-5 rounded-3xl">
          <p className="pb-4 text-default-800 font-semibold">{title}</p>
          <ResponsiveContainer minWidth={250} minHeight={200}>
            <AreaChart
              width={730}
              height={250}
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                fillOpacity={1}
                fill={`url(#${id})`}
              />
            </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default AreaChartContainer;
