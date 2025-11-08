import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
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


interface Props {
  data: TestExecution[];
}

const SummaryBarChart: React.FC<Props> = ({ data }) => {
  const chartData = useMemo(() => {
    const grouped: Record<string, { user: string; passed: number; failed: number }> = {};
    data.forEach((item) => {
      if (!grouped[item.userEmail]) {
        grouped[item.userEmail] = { user: item.userEmail, passed: 0, failed: 0 };
      }
      if (item.status) grouped[item.userEmail].passed++;
      else grouped[item.userEmail].failed++;
    });
    return Object.values(grouped);
  }, [data]);

  return (
    <Box sx={{ width: "100%", height: 320 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
     Số lượng Testcase theo người dùng
      </Typography>
      <ResponsiveContainer>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="user" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="passed" stackId="a" fill="#2e7d32" name="Passed" />
          <Bar dataKey="failed" stackId="a" fill="#d32f2f" name="Failed" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default SummaryBarChart;
