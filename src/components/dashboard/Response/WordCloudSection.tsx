import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import ReactWordcloud from "react-wordcloud";

export default function WordCloudSection({ keyPhrases, words }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
         Key Phrases
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
        {keyPhrases.map((k, i) => (
          <Chip key={i} label={`${k.text} (${k.score})`} color="primary" />
        ))}
      </Box>

      <Typography variant="subtitle1" sx={{ mb: 1 }}>
         Word Cloud
      </Typography>
      <Box sx={{ height: 250 }}>
        <ReactWordcloud
          words={words}
          options={{
            rotations: 2,
            rotationAngles: [0, 90],
            fontSizes: [16, 60],
          }}
        />
      </Box>
    </Box>
  );
}
