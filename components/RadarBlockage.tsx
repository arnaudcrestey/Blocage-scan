"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

type Props = {
  data: { subject: string; value: number }[];
};

export default function RadarBlockage({ data }: Props) {
  return (
    <div className="h-[280px] w-full sm:h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart outerRadius="68%" data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.18)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "rgba(255,255,255,0.82)", fontSize: 12 }}
          />
          <PolarRadiusAxis
            domain={[0, 15]}
            tick={false}
            axisLine={false}
          />
          <Radar
            dataKey="value"
            stroke="#67e8f9"
            fill="#7c3aed"
            fillOpacity={0.5}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
