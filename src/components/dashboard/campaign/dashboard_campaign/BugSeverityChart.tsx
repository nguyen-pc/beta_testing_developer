import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { LineChart } from "@mui/x-charts/LineChart";
import { callGetBugTrendBySeverity } from "../../../../config/api";

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

export default function BugSeverityChart({ campaignId }: { campaignId: number }) {
  const theme = useTheme();
  const [chartData, setChartData] = React.useState<any[]>([]);
  const [totalBugs, setTotalBugs] = React.useState<number>(0);

  const colorPalette = {
    MINOR: "#8ecae6",
    MAJOR: "#219ebc",
    CRITICAL: "#fb8500",
    TRIVIAL: "#adb5bd",
  };

  React.useEffect(() => {
    const fetchData = async () => {
      const res = await callGetBugTrendBySeverity(campaignId);
      console.log("Bug severity trend data:", res); 
      if (res?.data) {
        // group by date
        const grouped: Record<string, any> = {};
        let total = 0;
        res.data.forEach((item: any) => {
          const d = item.date;
          if (!grouped[d]) grouped[d] = { date: d };
          grouped[d][item.severity] = item.count;
          total += item.count;
        });
        setChartData(Object.values(grouped));
        setTotalBugs(total);
      }
    };
    fetchData();
  }, [campaignId]);

  const xAxisData = chartData.map((d) => d.date);

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Bug Reports (By Severity)
        </Typography>
        <Stack sx={{ justifyContent: "space-between" }}>
          <Stack
            direction="row"
            sx={{
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              {totalBugs.toLocaleString()}
            </Typography>
            <Chip size="small" color="error" label="Last 30 days" />
          </Stack>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Bugs per day grouped by severity
          </Typography>
        </Stack>

        <LineChart
          xAxis={[
            {
              scaleType: "point",
              data: xAxisData,
              tickInterval: (v, i) => (i + 1) % 5 === 0,
              height: 24,
            },
          ]}
          yAxis={[{ width: 50 }]}
          series={[
            {
              id: "MINOR",
              label: "Minor",
              showMark: false,
              curve: "linear",
              area: true,
              data: chartData.map((d) => d.MINOR || 0),
              color: colorPalette.MINOR,
            },
            {
              id: "MAJOR",
              label: "Major",
              showMark: false,
              curve: "linear",
              area: true,
              data: chartData.map((d) => d.MAJOR || 0),
              color: colorPalette.MAJOR,
            },
            {
              id: "CRITICAL",
              label: "Critical",
              showMark: false,
              curve: "linear",
              area: true,
              data: chartData.map((d) => d.CRITICAL || 0),
              color: colorPalette.CRITICAL,
            },
            {
              id: "TRIVIAL",
              label: "Trivial",
              showMark: false,
              curve: "linear",
              area: true,
              data: chartData.map((d) => d.TRIVIAL || 0),
              color: colorPalette.TRIVIAL,
            },
          ]}
          height={260}
          margin={{ left: 0, right: 20, top: 20, bottom: 0 }}
          grid={{ horizontal: true }}
          sx={{
            "& .MuiAreaElement-series-MINOR": {
              fill: "url('#minor')",
            },
            "& .MuiAreaElement-series-MAJOR": {
              fill: "url('#major')",
            },
            "& .MuiAreaElement-series-CRITICAL": {
              fill: "url('#critical')",
            },
            "& .MuiAreaElement-series-TRIVIAL": {
              fill: "url('#trivial')",
            },
          }}
          hideLegend={false}
        >
          <AreaGradient color={colorPalette.MINOR} id="minor" />
          <AreaGradient color={colorPalette.MAJOR} id="major" />
          <AreaGradient color={colorPalette.CRITICAL} id="critical" />
          <AreaGradient color={colorPalette.TRIVIAL} id="trivial" />
        </LineChart>
      </CardContent>
    </Card>
  );
}
