import React from "react";
import { Box, LinearProgress, Typography } from "@mui/material";

export default function SentimentSection({ summary }) {
  if (!summary) return null;
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        💬 Sentiment Analysis
      </Typography>
      <Typography color="success.main">Positive: {summary.positive}%</Typography>
      <LinearProgress
        variant="determinate"
        value={summary.positive}
        sx={{ mb: 1, height: 8, borderRadius: 2 }}
        color="success"
      />
      <Typography color="warning.main">Neutral: {summary.neutral}%</Typography>
      <LinearProgress
        variant="determinate"
        value={summary.neutral}
        sx={{ mb: 1, height: 8, borderRadius: 2 }}
        color="warning"
      />
      <Typography color="error.main">Negative: {summary.negative}%</Typography>
      <LinearProgress
        variant="determinate"
        value={summary.negative}
        sx={{ mb: 1, height: 8, borderRadius: 2 }}
        color="error"
      />
    </Box>
  );
}
