import * as React from "react";
import { useNavigate, useParams } from "react-router";
import useNotifications from "../../../hooks/useNotifications/useNotifications";
import {
  validate as ValidateProject,
  type Project,
} from "../../../data/project";
import ProjectForm, {
  type FormFieldValue,
  type ProjectFormState,
} from "./ProjectForm";
import PageContainer from "./PageContainer";
import { callGetProject, callUpdateProject } from "../../../config/api";
import dayjs from "dayjs";
import { Box, CircularProgress } from "@mui/material";

function ProjectEditForm({
  initialValues,
  onSubmit,
}: {
  initialValues: Partial<ProjectFormState["values"]>;
  onSubmit: (formValues: Partial<ProjectFormState["values"]>) => Promise<void>;
}) {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const notifications = useNotifications();

  const [formState, setFormState] = React.useState<ProjectFormState>(() => ({
    values: initialValues,
    errors: {},
  }));
  const formValues = formState.values;
  const formErrors = formState.errors;

  const setFormValues = React.useCallback(
    (newFormValues: Partial<ProjectFormState["values"]>) => {
      setFormState((previousState) => ({
        ...previousState,
        values: newFormValues,
      }));
    },
    []
  );

  const setFormErrors = React.useCallback(
    (newFormErrors: Partial<ProjectFormState["errors"]>) => {
      setFormState((previousState) => ({
        ...previousState,
        errors: newFormErrors,
      }));
    },
    []
  );

  const handleFormFieldChange = React.useCallback(
    (name: keyof ProjectFormState["values"], value: FormFieldValue) => {
      const validateField = async (
        values: Partial<ProjectFormState["values"]>
      ) => {
        const { issues } = ValidateProject(values);
        setFormErrors({
          ...formErrors,
          [name]: issues?.find((issue) => issue.path?.[0] === name)?.message,
        });
      };

      const newFormValues = { ...formValues, [name]: value };

      setFormValues(newFormValues);
      validateField(newFormValues);
    },
    [formValues, formErrors, setFormErrors, setFormValues]
  );

  const handleFormReset = React.useCallback(() => {
    setFormValues(initialValues);
  }, [initialValues, setFormValues]);

  const handleFormSubmit = React.useCallback(async () => {
    const { issues } = ValidateProject(formValues);
    if (issues && issues.length > 0) {
      setFormErrors(
        Object.fromEntries(
          issues.map((issue) => [issue.path?.[0], issue.message])
        )
      );
      return;
    }
    setFormErrors({});

    try {
      await onSubmit(formValues);
      notifications.show("Employee edited successfully.", {
        severity: "success",
        autoHideDuration: 3000,
      });

      navigate("/dashboard/projects");
    } catch (editError) {
      notifications.show(
        `Failed to edit project. Reason: ${(editError as Error).message}`,
        {
          severity: "error",
          autoHideDuration: 3000,
        }
      );
      throw editError;
    }
  }, [formValues, navigate, notifications, onSubmit, setFormErrors]);

  return (
    <ProjectForm
      formState={formState}
      onFieldChange={handleFormFieldChange}
      onSubmit={handleFormSubmit}
      onReset={handleFormReset}
      submitButtonLabel="Save"
      backButtonPath={`/dashboard/projects`}
    />
  );
}

export default function ProjectEdit() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [project, setProject] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const notifications = useNotifications();

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const showData = await callGetProject(projectId);

      setProject(showData.data);
    } catch (showDataError) {
      setError(showDataError as Error);
    }
    setIsLoading(false);
  }, [projectId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);
  console.log(project);

  const handleSubmit = React.useCallback(
    async (formValues: Partial<ProjectFormState["values"]>) => {
      const updatedData = await callUpdateProject(projectId, formValues);
      setProject(updatedData);
    },
    [projectId]
  );

  const renderEdit = React.useMemo(() => {
    if (isLoading) {
      return (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            m: 1,
          }}
        >
          <CircularProgress />
        </Box>
      );
    }
    if (error) {
      return (
        <Box sx={{ flexGrow: 1 }}>
          <Alert severity="error">{error.message}</Alert>
        </Box>
      );
    }

    return project ? (
      <ProjectEditForm initialValues={project} onSubmit={handleSubmit} />
    ) : null;
  }, [isLoading, error, project, handleSubmit]);

  return (
    <PageContainer
      title="Edit Project"
      breadcrumbs={[
        { title: "Projects", path: "/dashboard/projects" },
        { title: "Edit" },
      ]}
    >
      <Box sx={{ display: "flex", flex: 1 }}>{renderEdit}</Box>
    </PageContainer>
  );
}
