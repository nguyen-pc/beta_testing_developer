import React from "react";
import { Box, Divider, Typography } from "@mui/material";
import SummaryCards from "./SummaryCards";
import SummaryPieChart from "./SummaryPieChart";
import SummaryBarChart from "./SummaryBarChart";
import SummaryTestcaseRateChart from "./SummaryTestcaseRateChart";

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

const SummaryHeader: React.FC<Props> = ({ data }) => {
  return (
    <Box sx={{ mb: 5 }}>
      {/* 🔹 Tổng quan thống kê */}
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Tổng quan kết quả
      </Typography>
      <SummaryCards data={data} />

      <Divider sx={{ my: 3 }} />

      {/* 🔹 Biểu đồ tròn */}
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Tỷ lệ Passed / Failed (Testcase)
      </Typography>
      <SummaryPieChart data={data} />

      <Divider sx={{ my: 5 }} />

      {/* 🔹 Biểu đồ cột */}
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Kết quả theo người kiểm thử
      </Typography>
      <SummaryBarChart data={data} />

      <Divider sx={{ my: 4 }} />
      <SummaryTestcaseRateChart data={data} />
    </Box>
  );
};

export default SummaryHeader;
