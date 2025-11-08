import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
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

const SummaryTestcaseRateChart: React.FC<Props> = ({ data }) => {
  const chartData = useMemo(() => {
    const grouped: Record<
      number,
      {
        id: number;
        name: string;
        passed: number;
        failed: number;
        total: number;
      }
    > = {};

    // ✅ Gom nhóm theo testCaseId (đảm bảo duy nhất)
    data.forEach((item) => {
      const id = item.testCaseId;
      if (!grouped[id]) {
        grouped[id] = {
          id,
          name: item.testCaseTitle,
          passed: 0,
          failed: 0,
          total: 0,
        };
      }
      grouped[id].total++;
      if (item.status) grouped[id].passed++;
      else grouped[id].failed++;
    });

    // 🔢 Chuyển sang dạng phần trăm để hiển thị
    return Object.values(grouped).map((tc) => ({
      name: tc.name,
      passedRate: parseFloat(((tc.passed / tc.total) * 100).toFixed(1)),
      failedRate: parseFloat(((tc.failed / tc.total) * 100).toFixed(1)),
    }));
  }, [data]);

  return (
    <Box sx={{ width: "100%", height: 700, mt: 3 }}>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Tỷ lệ Passed / Failed theo từng Testcase (%)
      </Typography>

      {chartData.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Không có dữ liệu testcase nào.
        </Typography>
      ) : (
        <ResponsiveContainer>
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 20, right: 20, bottom: 10, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={260}
              tick={{ fontSize: 12 }}
            />
            <Tooltip formatter={(v) => `${v}%`} />
            <Legend />
            <Bar dataKey="passedRate" fill="#2e7d32" name="Passed (%)" />
            <Bar dataKey="failedRate" fill="#d32f2f" name="Failed (%)" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default SummaryTestcaseRateChart;
