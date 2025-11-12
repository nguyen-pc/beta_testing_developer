import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  CircularProgress,
  Alert,
  CardActions,
  Chip,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { callGetSurveysByCampaign } from "../../../config/api"; // import API

export default function SurveyListByCampaign() {
  const { projectId, campaignId } = useParams();
  const navigate = useNavigate();

  const [surveys, setSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!campaignId) return;
        const res = await callGetSurveysByCampaign(campaignId);
        if (res.statusCode === 200) {
          setSurveys(res.data);
        } else {
          setError("Failed to load surveys");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching survey list");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [campaignId]);

  if (loading)
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
        <Typography mt={2}>Loading surveys...</Typography>
      </Box>
    );

  if (error)
    return (
      <Box textAlign="center" mt={10}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  if (!surveys || surveys.length === 0)
    return (
      <Box textAlign="center" mt={10}>
        <Typography>No surveys found for this campaign.</Typography>
      </Box>
    );

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>
        Surveys in Campaign #{campaignId}
      </Typography>

      <Grid container spacing={3}>
        {surveys.map((survey) => (
          <Grid  item size={{ xs: 12, md: 6, lg: 6 }} key={survey.surveyId}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                "&:hover": { boxShadow: "0 5px 12px rgba(0,0,0,0.2)" },
                p: 4,
              }}
            >
              <CardContent>
                <Typography
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                >
                  {survey.surveyName}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  dangerouslySetInnerHTML={{
                    __html: survey.subTitle || "",
                  }}
                />

                <Box mt={2}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3, // ✅ giới hạn 2 dòng
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      minHeight: "40px", // ✅ để chiều cao đồng đều hơn
                    }}
                    dangerouslySetInnerHTML={{
                      __html: survey.description || "",
                    }}
                  />
                </Box>

                <Stack direction="row" spacing={1} mt={2}>
                  <Chip
                    label={`Start: ${new Date(
                      survey.startDate
                    ).toLocaleDateString("vi-VN")}`}
                    color="success"
                    variant="outlined"
                    size="small"
                  />
                  <Chip
                    label={`End: ${new Date(survey.endDate).toLocaleDateString(
                      "vi-VN"
                    )}`}
                    color="error"
                    variant="outlined"
                    size="small"
                  />
                </Stack>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  mt={2}
                >
                  Created by: {survey.createdBy}
                </Typography>
              </CardContent>

              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() =>
                    navigate(
                      `/dashboard/projects/${projectId}/campaigns/${campaignId}/survey/${survey.surveyId}/results`
                    )
                  }
                >
                  View Results
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
