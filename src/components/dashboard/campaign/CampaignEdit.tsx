import * as React from "react";
import { useNavigate, useParams } from "react-router";
import useNotifications from "../../../hooks/useNotifications/useNotifications";
import {
  validate as ValidateCampaign,
  type Campaign,
} from "../../../data/campaign";
import CampaignForm, {
  type FormFieldValue,
  type CampaignFormState,
} from "./CampaignForm";
import PageContainer from "../../dashboard/project/PageContainer";
import { callGetCampaign, callUpdateCampaign } from "../../../config/api";
import dayjs from "dayjs";
import { Alert, Box, CircularProgress } from "@mui/material";

function DetailCampaignEditForm({
  initialValues,
  onSubmit,
}: {
  initialValues: Partial<CampaignFormState["values"]>;
  onSubmit: (formValues: Partial<CampaignFormState["values"]>) => Promise<void>;
}) {
  const { projectId, campaignId } = useParams();

  const navigate = useNavigate();

  const notifications = useNotifications();

  const [formState, setFormState] = React.useState<CampaignFormState>(() => ({
    values: initialValues,
    errors: {},
  }));
  const formValues = formState.values;
  const formErrors = formState.errors;

  const setFormValues = React.useCallback(
    (newFormValues: Partial<CampaignFormState["values"]>) => {
      setFormState((previousState) => ({
        ...previousState,
        values: newFormValues,
      }));
    },
    []
  );

  const setFormErrors = React.useCallback(
    (newFormErrors: Partial<CampaignFormState["errors"]>) => {
      setFormState((previousState) => ({
        ...previousState,
        errors: newFormErrors,
      }));
    },
    []
  );

  const handleFormFieldChange = React.useCallback(
    (name: keyof CampaignFormState["values"], value: FormFieldValue) => {
      const validateField = async (
        values: Partial<CampaignFormState["values"]>
      ) => {
        const { issues } = ValidateCampaign(values);
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
    const { issues } = ValidateCampaign(formValues);
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
      const payload = {
        ...formValues,
        campaignType: {
          id: Number(formValues.campaignType),
        },
        project: {
          id: Number(projectId),
        },
        startDate: formValues.startDate
          ? dayjs(formValues.startDate, "YYYY-MM-DD").toDate()
          : null,
        endDate: formValues.endDate
          ? dayjs(formValues.endDate, "YYYY-MM-DD").toDate()
          : null,
      };
      await onSubmit(payload);
      notifications.show("Campaign edited successfully.", {
        severity: "success",
        autoHideDuration: 3000,
      });

      navigate(`/dashboard/projects/${projectId}/campaigns/${campaignId}`);
    } catch (editError) {
      notifications.show(
        `Failed to edit campaign. Reason: ${(editError as Error).message}`,
        {
          severity: "error",
          autoHideDuration: 3000,
        }
      );
      throw editError;
    }
  }, [formValues, navigate, notifications, onSubmit, setFormErrors]);

  return (
    <CampaignForm
      formState={formState}
      onFieldChange={handleFormFieldChange}
      onSubmit={handleFormSubmit}
      onReset={handleFormReset}
      submitButtonLabel="Save"
      backButtonPath={`/dashboard/projects/${projectId}/campaigns/${campaignId}`}
    />
  );
}

export default function CampaignEdit() {
  const navigate = useNavigate();
  const { projectId, campaignId } = useParams();
  const [campaign, setCampaign] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const notifications = useNotifications();

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const showData = await callGetCampaign(campaignId);

      setCampaign(showData.data);
    } catch (showDataError) {
      setError(showDataError as Error);
    }
    setIsLoading(false);
  }, [campaignId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);
  console.log(campaign);

  const handleSubmit = React.useCallback(
    async (formValues: Partial<CampaignFormState["values"]>) => {
      const payload = {
        ...formValues,
        campaignType: {
          id: Number(formValues.campaignType),
        },
        project: {
          id: Number(projectId),
        },
        startDate: formValues.startDate
          ? dayjs(formValues.startDate, "YYYY-MM-DD").toDate()
          : null,
        endDate: formValues.endDate
          ? dayjs(formValues.endDate, "YYYY-MM-DD").toDate()
          : null,
      };
      console.log("payload", payload);
      const updatedData = await callUpdateCampaign(campaignId, formValues);
      setCampaign(updatedData);
    },
    [campaignId]
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

    return campaign ? (
      <DetailCampaignEditForm
        initialValues={campaign}
        onSubmit={handleSubmit}
      />
    ) : null;
  }, [isLoading, error, campaign, handleSubmit]);

  return (
    <PageContainer
      title="Edit Campaign"
      breadcrumbs={[
        { title: "Campaigns", path: "/dashboard/campaigns" },
        { title: "Edit" },
      ]}
    >
      <Box sx={{ display: "flex", flex: 1 }}>{renderEdit}</Box>
    </PageContainer>
  );
}
