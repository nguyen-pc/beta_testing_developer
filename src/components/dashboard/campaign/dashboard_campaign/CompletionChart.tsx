import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import { areaElementClasses } from "@mui/x-charts/LineChart";
import { callGetCompletionStats } from "../../../../config/api";

export default function TesterCompletionCard({
  campaignId,
}: {
  campaignId: number;
}) {
  const theme = useTheme();
  const [data, setData] = React.useState<number[]>([]);
  const [labels, setLabels] = React.useState<string[]>([]);
  const [total, setTotal] = React.useState(0);

  React.useEffect(() => {
    const fetchData = async () => {
      const res = await callGetCompletionStats(campaignId);
      console.log("Completion stats data:", res);

      if (res?.data) {
        const raw = res.data;
        const counts = raw.map((d: any) => d.completedCount || 0);
        const dates = raw.map((d: any) =>
          new Date(d.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        );
        const totalCount = counts.reduce((a: number, b: number) => a + b, 0);
        setData(counts);
        setLabels(dates);
        setTotal(totalCount);
      }
    };
    fetchData();
  }, [campaignId]);

  return (
    <Card
      variant="outlined"
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
         Tester Completions
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h4">{total.toLocaleString()}</Typography>
        </Stack>

        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          Last 30 days
        </Typography>

        <SparkLineChart
          height={100}
          data={data}
          area
          color={theme.palette.error.main}
          showHighlight
          showTooltip
          xAxis={{
            scaleType: "band",
            data: labels,
          }}
          sx={{
            [`& .${areaElementClasses.root}`]: {
              fill: `url(#gradient-completion)`,
            },
          }}
        >
          <defs>
            <linearGradient
              id="gradient-completion"
              x1="50%"
              y1="0%"
              x2="50%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor={theme.palette.error.main}
                stopOpacity={0.3}
              />
              <stop
                offset="100%"
                stopColor={theme.palette.error.main}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
        </SparkLineChart>
      </CardContent>
    </Card>
  );
}
