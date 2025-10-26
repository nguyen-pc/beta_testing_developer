import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import PieChartIcon from "@mui/icons-material/PieChart";

export default function ChartToggle({ value, onChange }) {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={(_, val) => val && onChange(val)}
      size="small"
      sx={{ mb: 1 }}
    >
      <ToggleButton value="bar">
        <BarChartIcon />
      </ToggleButton>
      <ToggleButton value="pie">
        <PieChartIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
