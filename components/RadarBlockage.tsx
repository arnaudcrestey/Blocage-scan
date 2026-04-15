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

  const responsiveData = data.map((item) => {
    if (!isMobile) return item;

    if (item.subject === "Apaisement") {
      return { ...item, subject: "Calme" };
    }

    return item;
  });

  return (
    <div className="h-[280px] w-full sm:h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart outerRadius="68%" data={responsiveData}>
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
