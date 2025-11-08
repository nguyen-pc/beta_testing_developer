import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import { areaElementClasses } from "@mui/x-charts/LineChart";

export type StatCardProps = {
  title: string;
  value: string;
  interval: string;
  trend: "up" | "down" | "neutral";
  data: { date: string; count: number }[] | number[];
};

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.3} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

// ✅ Hàm định dạng ngày cho đẹp
function formatDate(dateStr: string) {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric", // 👈 hiển thị luôn năm
    });
  } catch {
    return dateStr;
  }
}

export default function StatCard({
  title,
  value,
  interval,
  trend,
  data,
}: StatCardProps) {
  const theme = useTheme();

  const trendColors = {
    up: theme.palette.success.main,
    down: theme.palette.error.main,
    neutral: theme.palette.grey[400],
  };

  const labelColors = {
    up: "success" as const,
    down: "error" as const,
    neutral: "default" as const,
  };

  const chartColor = trendColors[trend];
  const color = labelColors[trend];
  const trendValues = { up: "+25%", down: "-25%", neutral: "+5%" };

  // ✅ Nếu data có dạng [{date, count}], tách ra làm hai mảng (x: ngày, y: giá trị)
  const xAxisLabels =
    typeof data[0] === "object"
      ? (data as any[]).map((d) => formatDate(d.date))
      : Array.from({ length: (data as number[]).length }, (_, i) => `${i + 1}`);

  const yValues =
    typeof data[0] === "object"
      ? (data as any[]).map((d) => d.count)
      : (data as number[]);

  return (
    <Card variant="outlined" sx={{ height: "100%", flexGrow: 1 }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          {title}
        </Typography>

        <Stack
          direction="column"
          sx={{ justifyContent: "space-between", flexGrow: 1, gap: 1 }}
        >
          <Stack sx={{ justifyContent: "space-between" }}>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <Typography variant="h4">{value}</Typography>
              {/* <Chip size="small" color={color} label={trendValues[trend]} /> */}
            </Stack>
            <Typography variant="caption" color="text.secondary">
              {interval}
            </Typography>
          </Stack>

          {/* 📈 Biểu đồ sparkline */}
          <Box sx={{ width: "100%", height: 60 }}>
            <SparkLineChart
              color={chartColor}
              data={yValues}
              area
              showHighlight
              showTooltip
              xAxis={{
                scaleType: "band",
                data: xAxisLabels, // ✅ có cả năm (ví dụ "Nov 07, 2025")
              }}
              sx={{
                [`& .${areaElementClasses.root}`]: {
                  fill: `url(#area-gradient-${title})`,
                },
              }}
            >
              <AreaGradient color={chartColor} id={`area-gradient-${title}`} />
            </SparkLineChart>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
