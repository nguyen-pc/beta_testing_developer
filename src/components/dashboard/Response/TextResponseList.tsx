import React from "react";
import { Box, Typography, Divider } from "@mui/material";

export default function TextResponseList({ answers }: { answers: any[] }) {
  return (
    <Box sx={{ mt: 2, maxHeight: 300, overflowY: "auto" }}>
      {answers.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Chưa có phản hồi nào.
        </Typography>
      ) : (
        answers.map((ans, i) => (
          <Box key={i} sx={{ mb: 2 }}>
            <Typography variant="subtitle2">{ans.userEmail}</Typography>
            <Typography
              variant="body2"
              dangerouslySetInnerHTML={{ __html: ans.answerText || "" }}
            />
            <Divider sx={{ my: 1 }} />
          </Box>
        ))
      )}
    </Box>
  );
}
