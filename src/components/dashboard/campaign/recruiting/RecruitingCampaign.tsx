import * as React from "react";
import { useNavigate } from "react-router";
import useNotifications from "../../../../hooks/useNotifications/useNotifications";
import {
  validate as ValidateCampaign,
  type Campaign,
} from "../../../../data/campaign"; // 👈 validate & model riêng cho Campaign
import DetailCampaignForm, {
  type FormFieldValue,
  type DetailCampaignFormState,
} from "../CampaignForm"; // 👈 form component tương tự ProjectForm
import PageContainer from "../../project/PageContainer";
import { callCreateCampaign } from "../../../../config/api"; // 👈 API riêng cho campaign
import dayjs from "dayjs";

const INITIAL_FORM_VALUES: Partial<DetailCampaignFormState["values"]> = {
  title: "",
  description: "",
  campaignType: "",
  Instructions: "",
  startDate: "",
  endDate: "",
  estimatedTime: "",
  RewardValue: 0,
  isPublic: false,
};

export default function RecruitingCampaignCreate() {
  const navigate = useNavigate();
  const notifications = useNotifications();

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
      // Convert date strings → Date objects
      const payload = {
        ...formValues,
        startDate: dayjs(formValues.startDate, "YYYY-MM-DD").toDate(),
        endDate: dayjs(formValues.endDate, "YYYY-MM-DD").toDate(),
      };

      await callCreateCampaign(payload);

      notifications.show("Campaign created successfully.", {
        severity: "success",
        autoHideDuration: 3000,
      });

      navigate("/dashboard/campaigns");
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
      <h1>Create Recruiting Campaign</h1>
    </PageContainer>
  );
}
