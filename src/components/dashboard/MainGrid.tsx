import * as React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Copyright from "../../internals/components/Copyright";
import HighlightedCard from "./HighlightedCard";
import PageViewsBarChart from "./PageViewsBarChart";
import SessionsChart from "./SessionsChart";
import StatCard from "./StatCard";
import type { StatCardProps } from "./StatCard";
import { useAppSelector } from "../../redux/hooks";
import { callGetCompanyDashboard, callGetCompanyUsers } from "../../config/api";
import { PieChart } from "@mui/x-charts/PieChart";

export default function MainGrid() {
  const user = useAppSelector((state) => state.account.user);
  const [dashboard, setDashboard] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchDashboard = async () => {
      try {
        if (!user?.id) return;

        // 1️⃣ Lấy công ty theo userId
        const companyRes = await callGetCompanyUsers(user.id);
        const company = companyRes.data;
        if (!company?.id) return;

        // 2️⃣ Gọi dashboard theo companyId
        const dashboardRes = await callGetCompanyDashboard(company.id);
        setDashboard(dashboardRes.data ? dashboardRes.data : null);
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [user?.id]);

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="70vh"
      >
        <CircularProgress />
      </Box>
    );

  if (!dashboard)
    return (
      <Typography color="text.secondary" align="center" mt={4}>
        No dashboard data available.
      </Typography>
    );

  // Chuẩn hóa dữ liệu PieChart vì backend trả về mảng 2 chiều
  const bugStatusData =
    dashboard.bugStatusDistribution?.map((b: any) => ({
      id: b[0],
      label: b[0],
      value: b[1],
    })) || [];

  const campaignStatusData =
    dashboard.campaignStatusDistribution?.map((c: any) => ({
      id: c[0],
      label: c[0],
      value: c[1],
    })) || [];

  // Chuẩn hóa dữ liệu line chart
  const formatTrendData = (trendArr: any[]) =>
    trendArr?.map((item) => item.count) || [];

  const statCards: StatCardProps[] = [
    {
      title: "Users",
      value: dashboard.totalUsers?.toString() || "0",
      interval: "Last 30 days",
      trend: "up",
      data: dashboard.userTrend || [],
    },
    {
      title: "Projects",
      value: dashboard.totalProjects?.toString() || "0",
      interval: "Last 30 days",
      trend: "neutral",
      data: dashboard.projectTrend || [],
    },
    {
      title: "Campaigns",
      value: dashboard.totalCampaigns?.toString() || "0",
      interval: "Last 30 days",
      trend: "neutral",
      data: dashboard.campaignTrend || [],
    },
    // {
    //   title: "Companies",
    //   value: dashboard.totalCompanies?.toString() || "0",
    //   interval: "Current company",
    //   trend: "neutral",
    //   data: dashboard.companyTrend || [],
    // },
  ];

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* --- Tổng quan --- */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Company Overview
      </Typography>

      <Grid container spacing={2} columns={12} sx={{ mb: 2 }}>
        {statCards.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 4 }}>
            <StatCard {...card} />
          </Grid>
        ))}

        {/* --- Pie Charts --- */}
        <Grid container spacing={2} sx={{ mt: 4 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" mb={1}>
              Bug Status Distribution
            </Typography>
            <PieChart
              size={{ xs: 12, sm: 6, lg: 6 }}
              height={300}
              series={[
                {
                  data: bugStatusData,
                  highlightScope: { faded: "global", highlighted: "item" },
                  faded: { innerRadius: 30, additionalRadius: -30 },
                },
              ]}
              slotProps={{
                legend: { hidden: false },
              }}
            />
          </Grid>

          <Grid>
            <Typography variant="subtitle1" mb={1}>
              Campaign Status Distribution
            </Typography>
            <PieChart
              height={300}
              series={[
                {
                  data: campaignStatusData,
                  highlightScope: { faded: "global", highlighted: "item" },
                  faded: { innerRadius: 30, additionalRadius: -30 },
                },
              ]}
              slotProps={{
                legend: { hidden: false },
              }}
            />
          </Grid>
        </Grid>

        {/* --- Biểu đồ --- */}
        {/* <Grid size={{ xs: 12, md: 6 }}>
          <SessionsChart trendData={dashboard.userTrend} />
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <PageViewsBarChart
            projectTrend={dashboard.projectTrend}
            campaignTrend={dashboard.campaignTrend}
          />
        </Grid> */}
      </Grid>

      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
