import * as React from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  FormControl,
  FormControlLabel,
  Checkbox,
  Stack,
  Select,
  MenuItem,
  FormHelperText,
  Paper,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router";
import dayjs, { Dayjs } from "dayjs";
import type { Campaign } from "../../../data/campaign";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import BannerUploadField from "../BannerUploadField";
import { callGetModulesByProject } from "../../../config/api";

export interface CampaignFormState {
  values: Partial<Omit<Campaign, "id">>;
  errors: Partial<Record<keyof CampaignFormState["values"], string>>;
}

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      mb: 3,
      borderRadius: 2,
      border: "1px solid #e0e0e0",
      // backgroundColor: "#fafafa",
    }}
  >
    <Typography variant="h6" fontWeight={600} mb={2}>
      {title}
    </Typography>
    {children}
  </Paper>
);

export default function CampaignForm(props: CampaignFormProps) {
  const {
    formState,
    onFieldChange,
    onSubmit,
    onReset,
    submitButtonLabel,
    backButtonPath,
  } = props;

  const navigate = useNavigate();
  const formValues = formState.values;
  const formErrors = formState.errors;
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [modules, setModules] = React.useState<any[]>([]);
  const { campaignId, projectId } = useParams();

  React.useEffect(() => {
    if (!projectId) return;
    (async () => {
      try {
        const res = await callGetModulesByProject(projectId);
        setModules(res.data || []);
      } catch (err) {
        console.error("Failed to load modules", err);
      }
    })();
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formValues);
    } finally {
      setIsSubmitting(false);
    }
  };
  // console.log(formValues);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFieldChange(
      e.target.name as keyof CampaignFormState["values"],
      e.target.value
    );
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFieldChange(
      e.target.name as keyof CampaignFormState["values"],
      Number(e.target.value)
    );
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    onFieldChange(e.target.name as keyof CampaignFormState["values"], checked);
  };

  const handleDateChange =
    (fieldName: keyof CampaignFormState["values"]) => (value: Dayjs | null) => {
      onFieldChange(fieldName, value?.isValid() ? value.toISOString() : null);
    };

  const handleSelectChange = (e: any) => {
    onFieldChange(
      e.target.name as keyof CampaignFormState["values"],
      e.target.value
    );
  };
  const handleQuillChange =
    (fieldName: keyof CampaignFormState["values"]) => (value: string) => {
      onFieldChange(fieldName, value);
    };

  const handleBack = () => navigate(backButtonPath ?? "/dashboard/projects");
  const handleReset = () => onReset && onReset(formValues);

  const handleContinue = () => {
    navigate(
      `/dashboard/projects/${projectId}/campaigns/new/${campaignId}/createRecruiting`
    );
  };

  return (
    <Box component="form" onSubmit={handleSubmit} onReset={handleReset}>
      {/* HEADER */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight={600} mb={3}>
            {formValues.title || "New Beta Test Form"}{" "}
            <Typography
              component="span"
              variant="body2"
              sx={{
                ml: 1,
                // backgroundColor: "#e0e0e0",
                borderRadius: 1,
                px: 1,
              }}
            >
              Draft
            </Typography>
          </Typography>
        </Box>
        <Button className="ml-3" onClick={handleContinue} variant="contained">
          Continue to Recruiting
        </Button>
      </Box>

      {/* === Test Details === */}
      <Section title="Test Details">
        <Grid container spacing={2} sx={{ mb: 2, width: "100%" }}>
          <Grid item size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" fontWeight={500} mb={1}>
              Title
            </Typography>
            <TextField
              label="Test title"
              name="title"
              value={formValues.title ?? ""}
              onChange={handleTextChange}
              error={!!formErrors.title}
              helperText={formErrors.title ?? " "}
              fullWidth
              placeholder="New app to create a daily health plan"
            />
          </Grid>
          <Grid item size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <Typography variant="body2" mb={1}>
                Campaign Type
              </Typography>
              <Select
                name="campaignType"
                value={(formValues as any).campaignType ?? ""}
                onChange={handleSelectChange}
                displayEmpty
              >
                <MenuItem value="1">IOS</MenuItem>
                <MenuItem value="2">Android</MenuItem>
                <MenuItem value="3">Website</MenuItem>
                <MenuItem value="4">Game</MenuItem>
                <MenuItem value="5">Desktop</MenuItem>
                <MenuItem value="6">Other</MenuItem>
              </Select>
              <FormHelperText>
                {formErrors.campaignType ?? "Choose campaign type"}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <Typography variant="body2" mb={1}>
                Select Module
              </Typography>
              <Select
                name="moduleId"
                value={formValues.moduleId ?? ""}
                onChange={handleSelectChange}
                displayEmpty
              >
                <MenuItem value="">
                  <em>Choose module</em>
                </MenuItem>
                {modules.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.moduleName}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {formErrors.moduleId ?? "Select a module for this campaign"}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item size={{ xs: 12, sm: 12 }} className="pb-5">
            <Typography variant="body2" fontWeight={500} mb={1}>
              Description
            </Typography>
            <ReactQuill
              theme="snow"
              value={formValues.description ?? ""}
              onChange={(value) => onFieldChange("description", value)}
              style={{
                width: "100%",
                height: "150px",
                borderRadius: "8px",
              }}
            />
            {formErrors.description && (
              <FormHelperText error>{formErrors.description}</FormHelperText>
            )}
          </Grid>
        </Grid>
      </Section>

      {/* === Instructions === */}
      <Section title="Instructions">
        <Grid item size={{ xs: 12, sm: 12 }} className="pb-5">
          <ReactQuill
            theme="snow"
            value={formValues.instructions ?? ""}
            onChange={(value) => onFieldChange("instructions", value)}
            style={{
              width: "100%",
              height: "150px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          />
          {formErrors.instructions && (
            <FormHelperText error>{formErrors.instructions}</FormHelperText>
          )}
        </Grid>
      </Section>

      {/* === Timing & Incentives === */}
      <Section title="Timing & Incentives">
        <Grid container spacing={3} sx={{ mb: 2, width: "100%" }}>
          <Grid item size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <Typography variant="body2" mb={1}>
                How long will it take to complete your test?
              </Typography>
              <Select
                name="estimatedTime"
                value={(formValues as any).estimatedTime ?? ""}
                onChange={handleSelectChange}
                displayEmpty
              >
                <MenuItem value="30">30 minutes</MenuItem>
                <MenuItem value="45">45 minutes</MenuItem>
                <MenuItem value="60">60 minutes</MenuItem>
                <MenuItem value="90">90 minutes</MenuItem>
              </Select>
              <FormHelperText>
                {formErrors.estimatedTime ?? "Choose estimated time"}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" mb={1}>
              How much will it take to complete your test?
            </Typography>
            <TextField
              label="Incentive ($)"
              name="rewardValue"
              type="number"
              value={(formValues as any).rewardValue ?? ""}
              onChange={handleNumberChange}
              fullWidth
              helperText="Average reward for this test type: $22"
            />
          </Grid>
        </Grid>
      </Section>

      {/* === Status & Dates (optional reuse) === */}
      <Section title="Additional Info">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                value={
                  formValues.startDate ? dayjs(formValues.startDate) : null
                }
                onChange={handleDateChange("startDate")}
                slotProps={{
                  textField: { fullWidth: true },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="End Date"
                value={formValues.endDate ? dayjs(formValues.endDate) : null}
                onChange={handleDateChange("endDate")}
                slotProps={{
                  textField: { fullWidth: true },
                }}
              />
            </LocalizationProvider>
          </Grid>

          {/* <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!formValues.isPublic}
                  onChange={handleCheckboxChange}
                  name="isPublic"
                />
              }
              label="Active test (visible to participants)"
            />
          </Grid> */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              Upload Campaign Banner
            </Typography>
            <BannerUploadField
              value={formValues.bannerUrl ?? null}
              onChange={(fileName) =>
                onFieldChange("bannerUrl" as any, fileName)
              }
            />
          </Grid>
        </Grid>
      </Section>

      {/* === Buttons === */}
      <Stack direction="row" spacing={2} justifyContent="space-between" mt={3}>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={isSubmitting}
        >
          {submitButtonLabel}
        </Button>
      </Stack>
    </Box>
  );
}
