"use client";

import { useEffect, useState } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer
} from "recharts";

type Props = {
  data: { subject: string; value: number }[];
};

export default function RadarBlockage({ data }: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)");

    const updateViewport = () => {
      setIsMobile(mediaQuery.matches);
    };

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);

    return () => {
      mediaQuery.removeEventListener("change", updateViewport);
    };
  }, []);

  return (
    <div className="h-[280px] w-full sm:h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart
          data={data}
          outerRadius="68%"
          margin={
            isMobile
              ? { top: 10, right: 24, bottom: 10, left: 24 }
              : { top: 0, right: 0, bottom: 0, left: 0 }
          }
        >
          <PolarGrid stroke="rgba(255,255,255,0.18)" />

          <PolarAngleAxis
            dataKey="subject"
            tick={({ payload, x, y, textAnchor }) => {
              const label = String(payload.value);

              if (isMobile && label === "Apaisement") {
                return (
                  <text
                    x={x - 14}
                    y={y}
                    textAnchor="start"
                    fill="rgba(255,255,255,0.82)"
                    fontSize={12}
                  >
                    {label}
                  </text>
                );
              }

              if (isMobile && label === "Sécurité") {
                return (
                  <text
                    x={x + 14}
                    y={y}
                    textAnchor="end"
                    fill="rgba(255,255,255,0.82)"
                    fontSize={12}
                  >
                    {label}
                  </text>
                );
              }

              return (
                <text
                  x={x}
                  y={y}
                  textAnchor={textAnchor}
                  fill="rgba(255,255,255,0.82)"
                  fontSize={12}
                >
                  {label}
                </text>
              );
            }}
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
