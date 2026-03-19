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
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.15)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "rgba(255,255,255,0.75)", fontSize: 12 }}
          />
          <PolarRadiusAxis domain={[0, 9]} tick={false} axisLine={false} />
          <Radar
            dataKey="value"
            stroke="#7dd3fc"
            fill="#8b5cf6"
            fillOpacity={0.45}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
