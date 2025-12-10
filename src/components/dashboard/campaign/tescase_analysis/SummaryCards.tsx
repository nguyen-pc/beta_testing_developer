import React, { useMemo } from "react";
import { Card, CardContent, Grid, Typography, Stack, Box } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import PercentRoundedIcon from "@mui/icons-material/PercentRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";

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

const SummaryCards: React.FC<Props> = ({ data }) => {
  const summary = useMemo(() => {
    const total = data.length;
    const passed = data.filter((i) => i.status).length;
    const failed = total - passed;
    const successRate = total > 0 ? Math.round((passed / total) * 100) : 0;
    const uniqueUsers = new Set(data.map((i) => i.userId)).size;

    return { total, passed, failed, successRate, uniqueUsers };
  }, [data]);

  const cards = [
    {
      title: "Người tham gia",
      value: summary.uniqueUsers,
      color: "#0288d1",
      icon: <PeopleAltRoundedIcon sx={{ color: "#0288d1", fontSize: 32 }} />,
    },
    {
      title: "Tổng Testcase",
      value: summary.total,
      color: "#1976d2",
      icon: <QueryStatsRoundedIcon sx={{ color: "#1976d2", fontSize: 32 }} />,
    },
    {
      title: " Passed",
      value: summary.passed,
      color: "#2e7d32",
      icon: <CheckCircleRoundedIcon sx={{ color: "#2e7d32", fontSize: 32 }} />,
    },
    {
      title: " Failed",
      value: summary.failed,
      color: "#d32f2f",
      icon: <CancelRoundedIcon sx={{ color: "#d32f2f", fontSize: 32 }} />,
    },
    {
      title: "Tỷ lệ thành công",
      value: `${summary.successRate}%`,
      color: "#8e24aa",
      icon: <PercentRoundedIcon sx={{ color: "#8e24aa", fontSize: 32 }} />,
    },
  ];

  return (
    <Grid container spacing={2}>
      {cards.map((item) => (
        <Grid item xs={12} sm={6} md={3} key={item.title}>
          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
              boxShadow: "0px 2px 6px rgba(0,0,0,0.05)",
              "&:hover": { boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" },
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                {item.icon}
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    {item.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.title}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SummaryCards;
