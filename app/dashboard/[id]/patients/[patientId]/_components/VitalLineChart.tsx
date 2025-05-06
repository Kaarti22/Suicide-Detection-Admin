"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Vital } from "@/lib/types";

interface VitalLineChartProps {
  data: Vital[];
  dataKey: "temperature" | "heartRate" | "SpO2";
  color: string;
  unit: string;
}

const VitalLineChart = ({
  data,
  dataKey,
  color,
  unit,
}: VitalLineChartProps) => {
  const formattedData = data.map((item) => ({
    value: item[dataKey],
    date: new Date(item.timestamp.seconds * 1000).toLocaleDateString(),
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip formatter={(value: number) => `${value} ${unit}`} />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={3}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default VitalLineChart;
