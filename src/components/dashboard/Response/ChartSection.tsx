import React, { useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Box } from "@mui/material";
import ChartToggle from "./ChartToggle";

const COLORS = ["#1976d2", "#42a5f5", "#9ccc65", "#ffb74d", "#ef5350"];

export default function ChartSection({ data }: { data: { name: string; value: number }[] }) {
  const [type, setType] = useState<"bar" | "pie">("bar");

  return (
    <Box sx={{ width: "100%", height: 300 }}>
      <ChartToggle value={type} onChange={setType} />
      <ResponsiveContainer>
        {type === "bar" ? (
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#1976d2" />
          </BarChart>
        ) : (
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        )}
      </ResponsiveContainer>
    </Box>
  );
}
