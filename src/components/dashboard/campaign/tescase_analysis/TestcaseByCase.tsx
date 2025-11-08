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
  Box,
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

const TestcaseByCase: React.FC<Props> = ({ data }) => {
  const grouped = useMemo(() => {
    const map: Record<string, { title: string; items: TestExecution[] }> = {};
    data.forEach((item) => {
      const key = item.testCaseId.toString();
      if (!map[key]) map[key] = { title: item.testCaseTitle, items: [] };
      map[key].items.push(item);
    });
    return map;
  }, [data]);

  return (
    <>
      {Object.entries(grouped).map(([key, group]) => (
        <Accordion key={key} sx={{ mb: 1 }} component={Paper}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>🧾 {group.title}</Typography>
            <Chip
              label={`${group.items.length} người test`}
              size="small"
              sx={{ ml: 2 }}
              color="primary"
              variant="outlined"
            />
          </AccordionSummary>

          <AccordionDetails sx={{ backgroundColor: "#fafafa" }}>
            {group.items.map((item) => (
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
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar
                      sx={{
                        bgcolor: item.status ? "success.light" : "error.light",
                      }}
                    >
                      {item.userEmail.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography fontWeight={600}>{item.userEmail}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(item.createdAt).toLocaleString("vi-VN")}
                      </Typography>
                    </Box>
                  </Stack>
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
              </Paper>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};

export default TestcaseByCase;
