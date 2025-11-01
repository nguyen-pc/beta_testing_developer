import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import type { SelectChangeEvent, SelectProps } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router";
import dayjs, { Dayjs } from "dayjs";
import type { Project } from "../../../data/project";
import BannerUploadField from "../BannerUploadField";
import { Typography } from "@mui/material";

export interface ProjectFormState {
  values: Partial<Omit<Project, "id">>;
  errors: Partial<Record<keyof ProjectFormState["values"], string>>;
}

export type FormFieldValue = string | string[] | number | boolean | File | null;

export interface ProjectFormProps {
  formState: ProjectFormState;
  onFieldChange: (
    name: keyof ProjectFormState["values"],
    value: FormFieldValue
  ) => void;
  onSubmit: (formValues: Partial<ProjectFormState["values"]>) => Promise<void>;
  onReset?: (formValues: Partial<ProjectFormState["values"]>) => void;
  submitButtonLabel: string;
  backButtonPath?: string;
}

export default function ProjectForm(props: ProjectFormProps) {
  const {
    formState,
    onFieldChange,
    onSubmit,
    onReset,
    submitButtonLabel,
    backButtonPath,
  } = props;

  const formValues = formState.values;
  const formErrors = formState.errors;

  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      console.log("Submitting form...");

      setIsSubmitting(true);
      try {
        console.log(formValues);
        await onSubmit(formValues);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formValues, onSubmit]
  );

  const handleTextFieldChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      console.log("Check");
      onFieldChange(
        event.target.name as keyof ProjectFormState["values"],
        event.target.value
      );
    },
    [onFieldChange]
  );

  const handleNumberFieldChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFieldChange(
        event.target.name as keyof ProjectFormState["values"],
        Number(event.target.value)
      );
    },
    [onFieldChange]
  );

  const handleCheckboxFieldChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      onFieldChange(
        event.target.name as keyof ProjectFormState["values"],
        checked
      );
    },
    [onFieldChange]
  );

  const handleDateFieldChange = React.useCallback(
    (fieldName: keyof ProjectFormState["values"]) => (value: Dayjs | null) => {
      if (value?.isValid()) {
        onFieldChange(fieldName, value.toISOString() ?? null);
      } else if (formValues[fieldName]) {
        onFieldChange(fieldName, null);
      }
    },
    [formValues, onFieldChange]
  );

  const handleSelectFieldChange = React.useCallback(
    (event: SelectChangeEvent) => {
      onFieldChange(
        event.target.name as keyof ProjectFormState["values"],
        event.target.value
      );
    },
    [onFieldChange]
  );

  const handleReset = React.useCallback(() => {
    if (onReset) {
      onReset(formValues);
    }
  }, [formValues, onReset]);

  const handleBack = React.useCallback(() => {
    navigate(backButtonPath ?? "/dashboard/projects");
  }, [navigate, backButtonPath]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
      onReset={handleReset}
      sx={{ width: "100%" }}
    >
      <FormGroup>
        <Grid container spacing={2} sx={{ mb: 2, width: "100%" }}>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: "flex" }}>
            <TextField
              value={formValues.projectName ?? ""}
              onChange={handleTextFieldChange}
              name="projectName"
              label="Name"
              error={!!formErrors.projectName}
              helperText={formErrors.projectName ?? " "}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: "flex" }}>
            <TextField
              value={formValues.description ?? ""}
              onChange={handleTextFieldChange}
              name="description"
              label="Description"
              error={!!formErrors.description}
              helperText={formErrors.description ?? " "}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: "flex" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={
                  formValues.startDate ? dayjs(formValues.startDate) : null
                }
                onChange={handleDateFieldChange("startDate")}
                name="startDate"
                label="Start date"
                slotProps={{
                  textField: {
                    error: !!formErrors.startDate,
                    helperText: formErrors.startDate ?? " ",
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: "flex" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={formValues.endDate ? dayjs(formValues.endDate) : null}
                onChange={handleDateFieldChange("endDate")}
                name="endDate"
                label="End date"
                slotProps={{
                  textField: {
                    error: !!formErrors.endDate,
                    helperText: formErrors.endDate ?? " ",
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          {/* <Grid size={{ xs: 12, sm: 6 }} sx={{ display: "flex" }}>
            <FormControl>
              <FormControlLabel
                name="status"
                control={
                  <Checkbox
                    size="large"
                    checked={formValues.status ?? false}
                    onChange={handleCheckboxFieldChange}
                  />
                }
                label="Status"
              />
              <FormHelperText error={!!formErrors.status}>
                {formErrors.status ?? " "}
              </FormHelperText>
            </FormControl>
          </Grid> */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              Upload Project Banner
            </Typography>
            <BannerUploadField
              value={formValues.bannerUrl ?? null}
              onChange={(fileName) =>
                onFieldChange("bannerUrl" as any, fileName)
              }
            />
          </Grid>
        </Grid>
      </FormGroup>
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
        >
          {submitButtonLabel}
        </Button>
      </Stack>
    </Box>
  );
}
