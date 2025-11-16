import React from "react";
import { Button, Stack } from "@mui/material";

interface Props {
  row: any;
  onPaid: (row: any) => void;
  onFailed: (row: any) => void;
}

const RewardStatusActions: React.FC<Props> = ({ row, onPaid, onFailed }) => {
  const isPending = row.status === "PENDING";

  return (
    <Stack direction="row" spacing={1}>
      <Button
        size="small"
        variant="outlined"
        color="success"
        disabled={!isPending}
        onClick={() => onPaid(row)}
      >
        Paid
      </Button>

      <Button
        size="small"
        variant="outlined"
        color="error"
        disabled={!isPending}
        onClick={() => onFailed(row)}
      >
        Failed
      </Button>

      {row.status === "PAID" && row.evidenceUrl && (
        <Button
          size="small"
          variant="text"
          onClick={() => window.open(row.evidenceUrl, "_blank")}
        >
          View
        </Button>
      )}
    </Stack>
  );
};

export default RewardStatusActions;
