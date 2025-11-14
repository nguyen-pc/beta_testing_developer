import * as React from "react";
import { useNavigate, useParams } from "react-router";
import useNotifications from "../../../hooks/useNotifications/useNotifications";
import {
  validate as ValidateCampaign,
  type Campaign,
} from "../../../data/campaign"; // 👈 validate & model riêng cho Campaign
import DetailCampaignForm, {
  type FormFieldValue,
  type DetailCampaignFormState,
} from "./CampaignForm";
import PageContainer from "../../dashboard/project/PageContainer";
import { callCreateCampaign } from "../../../config/api";
import dayjs from "dayjs";
import { useCampaignContext } from "../../../context/CampaignContext";

const INITIAL_FORM_VALUES: Partial<DetailCampaignFormState["values"]> = {
  title: "",
  description: "",
  campaignType: "",
  instructions: "",
  startDate: "",
  endDate: "",
  estimatedTime: "",
  rewardValue: 0,
  isPublic: false,
  moduleId: "",
};

export default function DetailCampaignCreate() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const notifications = useNotifications();
  const { setCampaignId } = useCampaignContext();

  const [formState, setFormState] = React.useState<DetailCampaignFormState>(
    () => ({
      values: INITIAL_FORM_VALUES,
      errors: {},
    })
  );

  const formValues = formState.values;
  const formErrors = formState.errors;

  const setFormValues = React.useCallback(
    (newFormValues: Partial<DetailCampaignFormState["values"]>) => {
      setFormState((prev) => ({
        ...prev,
        values: newFormValues,
      }));
    },
    []
  );

  const setFormErrors = React.useCallback(
    (newFormErrors: Partial<DetailCampaignFormState["errors"]>) => {
      setFormState((prev) => ({
        ...prev,
        errors: newFormErrors,
      }));
    },
    []
  );

  const handleFormFieldChange = React.useCallback(
    (name: keyof DetailCampaignFormState["values"], value: FormFieldValue) => {
      const validateField = async (
        values: Partial<DetailCampaignFormState["values"]>
      ) => {
        const { issues } = ValidateCampaign(values);
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
    const { issues } = ValidateCampaign(formValues);
    if (issues && issues.length > 0) {
      setFormErrors(
        Object.fromEntries(issues.map((i) => [i.path?.[0], i.message]))
      );
      return;
    }
    setFormErrors({});

    try {
      const payload = {
        ...formValues,
        // campaignStatus: "PENDING",
        campaignType: {
          id: Number(formValues.campaignType),
        },
        project: {
          id: Number(projectId),
        },
        module: formValues.moduleId 
          ? { id: Number(formValues.moduleId) }
          : null,
        startDate: formValues.startDate
          ? dayjs(formValues.startDate, "YYYY-MM-DD").toDate()
          : null,
        endDate: formValues.endDate
          ? dayjs(formValues.endDate, "YYYY-MM-DD").toDate()
          : null,
      };
      console.log("payload", payload);

      const res = await callCreateCampaign(payload);
      const campaignId = res.data.id;

      notifications.show("Campaign created successfully.", {
        severity: "success",
        autoHideDuration: 3000,
      });
      setCampaignId(campaignId);

      navigate(
        `/dashboard/projects/${projectId}/campaigns/new/${campaignId}/createRecruiting`
      );
    } catch (error) {
      notifications.show(
        `Failed to create campaign. Reason: ${(error as Error).message}`,
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
      title="New Campaign"
      breadcrumbs={[
        { title: "Campaigns", path: "/dashboard/campaigns" },
        { title: "New" },
      ]}
    >
      <DetailCampaignForm
        formState={formState}
        onFieldChange={handleFormFieldChange}
        onSubmit={handleFormSubmit}
        onReset={handleFormReset}
        submitButtonLabel="Create and Continue"
      />
    </PageContainer>
  );
}
