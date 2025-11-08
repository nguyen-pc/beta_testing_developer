import React, { useMemo } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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

const TestcaseByUser: React.FC<Props> = ({ data }) => {
  const grouped = useMemo(() => {
    const map: Record<string, TestExecution[]> = {};
    data.forEach((item) => {
      if (!map[item.userEmail]) map[item.userEmail] = [];
      map[item.userEmail].push(item);
    });
    return map;
  }, [data]);

  return (
    <>
      {Object.entries(grouped).map(([email, items]) => (
        <Accordion key={email} sx={{ mb: 1 }} component={Paper}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Avatar sx={{ bgcolor: "primary.light" }}>
                {email.charAt(0).toUpperCase()}
              </Avatar>
              <Typography fontWeight={600}>{email}</Typography>
            </Stack>
            <Chip
              label={`${items.length} testcase`}
              size="small"
              sx={{ ml: 2 }}
              color="primary"
              variant="outlined"
            />
          </AccordionSummary>

          <AccordionDetails sx={{ backgroundColor: "#fafafa" }}>
            {items.map((item) => (
              <Paper
                key={item.id}
                variant="outlined"
                sx={{
                  p: 2,
                  mb: 1.5,
                  borderRadius: 2,
                  backgroundColor: "white",
                }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "center" }}
                >
                  <Typography>
                    <b>Testcase:</b> {item.testCaseTitle}
                  </Typography>
                  <Chip
                    label={item.status ? "✅ Passed" : "❌ Failed"}
                    color={item.status ? "success" : "error"}
                    variant="outlined"
                    size="small"
                  />
                </Stack>

                <Divider sx={{ my: 1.5 }} />
                <Typography variant="body2">
                  <b>Chiến dịch:</b> {item.campaignTitle}
                </Typography>
                <Typography variant="body2">
                  <b>Ghi chú:</b> {item.note || "—"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <b>Ngày thực hiện:</b>{" "}
                  {new Date(item.createdAt).toLocaleString("vi-VN")}
                </Typography>
              </Paper>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};

export default TestcaseByUser;
