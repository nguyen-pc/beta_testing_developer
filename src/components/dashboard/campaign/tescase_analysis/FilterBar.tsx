import React from "react";
import { Stack, TextField, MenuItem } from "@mui/material";

interface Props {
  search: string;
  setSearch: (value: string) => void;
  statusFilter: "all" | "passed" | "failed";
  setStatusFilter: (value: "all" | "passed" | "failed") => void;
}

const FilterBar: React.FC<Props> = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
}) => {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3}>
      <TextField
        label="Tìm kiếm testcase..."
        variant="outlined"
        size="small"
        width="500px"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <TextField
        select
        label="Trạng thái"
        value={statusFilter}
        onChange={(e) =>
          setStatusFilter(e.target.value as "all" | "passed" | "failed")
        }
        size="small"
        sx={{ width: 180 }}
      >
        <MenuItem value="all">Tất cả</MenuItem>
        <MenuItem value="passed">✅ Passed</MenuItem>
        <MenuItem value="failed">❌ Failed</MenuItem>
      </TextField>
    </Stack>
  );
};

export default FilterBar;
