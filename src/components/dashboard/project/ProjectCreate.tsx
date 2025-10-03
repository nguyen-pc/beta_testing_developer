import * as React from "react";
import { useNavigate } from "react-router";
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
import { callCreateProject } from "../../../config/api";
import dayjs from "dayjs";

const INITIAL_FORM_VALUES: Partial<ProjectFormState["values"]> = {
  projectName: "",
  description: "",
  startDate: "",
  endDate: "",
  status: false,
};

export default function ProjectCreate() {
  const navigate = useNavigate();

  const notifications = useNotifications();

  const [formState, setFormState] = React.useState<ProjectFormState>(() => ({
    values: INITIAL_FORM_VALUES,
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
    setFormValues(INITIAL_FORM_VALUES);
  }, [setFormValues]);

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
      await callCreateProject(formValues);
      formValues.startDate = dayjs(formValues.startDate, "YYYY-MM-DD").toDate();
      formValues.endDate = dayjs(formValues.endDate, "YYYY-MM-DD").toDate();
      console.log(formValues);
      notifications.show("Project created successfully.", {
        severity: "success",
        autoHideDuration: 3000,
      });

      navigate("/dashboard/projects");
    } catch (createError) {
      notifications.show(
        `Failed to create project. Reason: ${(createError as Error).message}`,
        {
          severity: "error",
          autoHideDuration: 3000,
        }
      );
      throw createError;
    }
  }, [formValues, navigate, notifications, setFormErrors]);

  return (
    <PageContainer
      title="New Project"
      breadcrumbs={[
        { title: "Projects", path: "/dashboard/projects" },
        { title: "New" },
      ]}
    >
      <ProjectForm
        formState={formState}
        onFieldChange={handleFormFieldChange}
        onSubmit={handleFormSubmit}
        onReset={handleFormReset}
        submitButtonLabel="Create"
      />
    </PageContainer>
  );
}
