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
import { useNavigate } from "react-router";
import dayjs, { Dayjs } from "dayjs";
import type { Survey } from "../../../../data/survey";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export interface SurveyFormState {
  values: Partial<Omit<Survey, "id">>;
  errors: Partial<Record<keyof SurveyFormState["values"], string>>;
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

export default function SurveyForm(props: SurveyFormProps) {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formValues);
    } finally {
      setIsSubmitting(false);
    }
  };
  console.log(formValues);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFieldChange(
      e.target.name as keyof SurveyFormState["values"],
      e.target.value
    );
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFieldChange(
      e.target.name as keyof SurveyFormState["values"],
      Number(e.target.value)
    );
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    onFieldChange(e.target.name as keyof SurveyFormState["values"], checked);
  };

  const handleDateChange =
    (fieldName: keyof SurveyFormState["values"]) => (value: Dayjs | null) => {
      onFieldChange(fieldName, value?.isValid() ? value.toISOString() : null);
    };

  const handleSelectChange = (e: any) => {
    onFieldChange(
      e.target.name as keyof SurveyFormState["values"],
      e.target.value
    );
  };
  const handleQuillChange =
    (fieldName: keyof SurveyFormState["values"]) => (value: string) => {
      onFieldChange(fieldName, value);
    };

  const handleBack = () => navigate(backButtonPath ?? "/dashboard/projects");
  const handleReset = () => onReset && onReset(formValues);

  return (
    <Box component="form" onSubmit={handleSubmit} onReset={handleReset}>
      {/* HEADER */}
      <Typography variant="h5" fontWeight={600} mb={3}>
        {formValues.surveyName || "New Beta Test Survey"}{" "}
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

      {/* === Test Details === */}
      <Section title="Test Details">
        <Grid container spacing={2} sx={{ mb: 2, width: "100%" }}>
          <Grid item size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" fontWeight={500} mb={1}>
              Survey Name
            </Typography>
            <TextField
              label="Survey title"
              name="surveyName"
              value={formValues.surveyName ?? ""}
              onChange={handleTextChange}
              error={!!formErrors.surveyName}
              helperText={formErrors.surveyName ?? " "}
              fullWidth
              placeholder="New app to create a daily health plan"
            />
          </Grid>
          <Grid item size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" fontWeight={500} mb={1}>
              Sub title
            </Typography>
            <TextField
              label="Survey sub title"
              name="subTitle"
              value={formValues.subTitle ?? ""}
              onChange={handleTextChange}
              error={!!formErrors.subTitle}
              helperText={formErrors.subTitle ?? " "}
              fullWidth
              placeholder="New app to create a daily health plan"
            />
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
