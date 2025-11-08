import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Box, Typography } from "@mui/material";

export interface TestExecution {
  id: number;
  note: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  campaignId: number;
  campaignTitle: string;
  userId: number;
  userEmail: string;
  testCaseId: number;
  testCaseTitle: string;
}


const COLORS = ["#2e7d32", "#d32f2f"];

interface Props {
  data: TestExecution[];
}

const SummaryPieChart: React.FC<Props> = ({ data }) => {
  const chartData = useMemo(() => {
    const passed = data.filter((i) => i.status).length;
    const failed = data.length - passed;
    return [
      { name: "Passed", value: passed },
      { name: "Failed", value: failed },
    ];
  }, [data]);

  return (
    <Box sx={{ width: "100%", height: 300 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Tỷ lệ Passed / Failed
      </Typography>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label
          >
            {chartData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default SummaryPieChart;
