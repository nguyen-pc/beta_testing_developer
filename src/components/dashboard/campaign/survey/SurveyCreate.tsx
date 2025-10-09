import * as React from "react";
import { useNavigate, useParams } from "react-router";
import useNotifications from "../../../../hooks/useNotifications/useNotifications";
import {
  validate as ValidateSurvey,
  type Survey,
} from "../../../../data/survey"; // 👈 validate & model riêng cho Campaign
import DetailCampaignForm, {
  type FormFieldValue,
  type DetailSurveyFormState,
} from "./SurveyForm"; // 👈 form component tương tự ProjectForm
import PageContainer from "../../../dashboard/project/PageContainer";
import { callCreateSurvey } from "../../../../config/api"; // 👈 API riêng cho campaign
import dayjs from "dayjs";
import SurveyForm from "./SurveyForm";

const INITIAL_FORM_VALUES: Partial<DetailSurveyFormState["values"]> = {
  surveyName: "",
  subTitle: "",
  description: "",
  startDate: "",
  endDate: "",
};

export default function DetailSurveyCreate() {
  const navigate = useNavigate();
  const {projectId, campaignId} = useParams();
  const notifications = useNotifications();

  const [formState, setFormState] = React.useState<DetailSurveyFormState>(() => ({
    values: INITIAL_FORM_VALUES,
    errors: {},
  }));

  const formValues = formState.values;
  const formErrors = formState.errors;

  const setFormValues = React.useCallback(
    (newFormValues: Partial<DetailSurveyFormState["values"]>) => {
      setFormState((prev) => ({
        ...prev,
        values: newFormValues,
      }));
    },
    []
  );

  const setFormErrors = React.useCallback(
    (newFormErrors: Partial<DetailSurveyFormState["errors"]>) => {
      setFormState((prev) => ({
        ...prev,
        errors: newFormErrors,
      }));
    },
    []
  );

  const handleFormFieldChange = React.useCallback(
    (name: keyof DetailSurveyFormState["values"], value: FormFieldValue) => {
      const validateField = async (
        values: Partial<DetailSurveyFormState["values"]>
      ) => {
        const { issues } = ValidateSurvey(values);
        setFormErrors({
          ...formErrors,
          [name]: issues?.find((i) => i.path?.[0] === name)?.message,
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
    const { issues } = ValidateSurvey(formValues);
    if (issues && issues.length > 0) {
      setFormErrors(
        Object.fromEntries(issues.map((i) => [i.path?.[0], i.message]))
      );
      return;
    }
    setFormErrors({});

    try {
      // Convert date strings → Date objects
      const payload = {
        ...formValues,
        startDate: dayjs(formValues.startDate, "YYYY-MM-DD").toDate(),
        endDate: dayjs(formValues.endDate, "YYYY-MM-DD").toDate(),
      };
      console.log("Submitting survey:", campaignId, payload);

      const res = await callCreateSurvey(campaignId, payload);
      const surveyId  = res.data.surveyId

      notifications.show("Survey created successfully.", {
        severity: "success",
        autoHideDuration: 3000,
      });

      navigate(`/dashboard/projects/${projectId}/campaigns/new/${campaignId}/surveys/${surveyId}/question`);
    } catch (error) {
      notifications.show(
        `Failed to create survey. Reason: ${(error as Error).message}`,
        {
          severity: "error",
          autoHideDuration: 3000,
        }
      );
      throw error;
    }
  }, [formValues, navigate, notifications, setFormErrors]);

  return (
    <PageContainer
      title="New Survey"
      breadcrumbs={[
        { title: "Surveys", path: "/dashboard/surveys" },
        { title: "New" },
      ]}
    >
      <SurveyForm
        formState={formState}
        onFieldChange={handleFormFieldChange}
        onSubmit={handleFormSubmit}
        onReset={handleFormReset}
        submitButtonLabel="Create and Continue"
      />
    </PageContainer>
  );
}
