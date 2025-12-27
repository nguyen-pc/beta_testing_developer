import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import useNotifications from "../../../../hooks/useNotifications/useNotifications";
import {
  validate as ValidateSurvey,
  type Survey,
} from "../../../../data/survey";
import type { FormFieldValue, DetailSurveyFormState } from "./SurveyForm";
import PageContainer from "../../../dashboard/project/PageContainer";
import SurveyForm from "./SurveyForm";
import {
  callCreateSurvey,
  callUpdateSurvey,
  callGetSurveysByCampaign,
  callGetSurvey,
  callDeleteSurvey,
} from "../../../../config/api";
import dayjs from "dayjs";
import parse from "html-react-parser";

const INITIAL_FORM_VALUES: Partial<DetailSurveyFormState["values"]> = {
  surveyName: "",
  subTitle: "",
  description: "",
  startDate: "",
  endDate: "",
};

export default function DetailSurveyManager() {
  const navigate = useNavigate();
  const { projectId, campaignId } = useParams();
  const notifications = useNotifications();

  const [loading, setLoading] = React.useState(true);
  const [surveys, setSurveys] = React.useState<Survey[]>([]);
  const [editingSurvey, setEditingSurvey] = React.useState<Survey | null>(null);
  const [isCreating, setIsCreating] = React.useState(false); // ✅ thêm state phân biệt chế độ tạo mới

  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  const [surveyToDelete, setSurveyToDelete] = React.useState<Survey | null>(
    null
  );
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  // Mở dialog xác nhận xóa
  const handleOpenDeleteDialog = (event: React.MouseEvent, survey: Survey) => {
    event.stopPropagation(); // ✅ tránh click lan xuống Card (tránh mở form edit)
    setSurveyToDelete(survey);
    setConfirmDeleteOpen(true);
  };

  // Gọi API xóa (soft delete) sau khi người dùng xác nhận
  const handleConfirmDelete = async () => {
    if (!campaignId || !surveyToDelete) return;

    try {
      setDeleteLoading(true);
      await callDeleteSurvey(campaignId, String(surveyToDelete.surveyId));

      // Cập nhật lại danh sách survey trên UI
      setSurveys((prev) =>
        prev.filter((s) => s.surveyId !== surveyToDelete.surveyId)
      );

      notifications.show("Xóa khảo sát (survey) thành công.", {
        severity: "success",
      });
    } catch (error) {
      notifications.show(
        `Xóa khảo sát thất bại. Lý do: ${(error as Error).message}`,
        { severity: "error" }
      );
    } finally {
      setDeleteLoading(false);
      setConfirmDeleteOpen(false);
      setSurveyToDelete(null);
    }
  };

  const [formState, setFormState] = React.useState<DetailSurveyFormState>({
    values: INITIAL_FORM_VALUES,
    errors: {},
  });

  // 🟢 Lấy danh sách survey theo campaign
  React.useEffect(() => {
    const fetchSurveys = async () => {
      if (!campaignId) return;
      try {
        setLoading(true);
        const res = await callGetSurveysByCampaign(campaignId);
        console.log("Fetched surveys:", res.data);
        setSurveys(res.data || []);
      } catch (err) {
        console.error("Error fetching surveys:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSurveys();
  }, [campaignId]);

  // 🟢 Khi chọn survey để edit → load chi tiết
  React.useEffect(() => {
    const fetchDetail = async () => {
      if (
        !editingSurvey ||
        !campaignId ||
        !editingSurvey.surveyId ||
        isCreating
      )
        return; // ✅ bỏ qua khi đang tạo mới
      try {
        setLoading(true);
        const res = await callGetSurvey(
          campaignId,
          String(editingSurvey.surveyId)
        );
        console.log("Fetched survey detail:", res.data);
        const s = res.data;
        setFormState({
          values: {
            surveyName: s.surveyName || "",
            subTitle: s.subTitle || "",
            description: s.description || "",
            startDate: s.startDate
              ? dayjs(s.startDate).format("YYYY-MM-DD")
              : "",
            endDate: s.endDate ? dayjs(s.endDate).format("YYYY-MM-DD") : "",
          },
          errors: {},
        });
      } catch (err) {
        console.error("Error fetching survey detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [editingSurvey, campaignId, isCreating]);

  // 🧩 Form helper
  const setFormValues = (values: Partial<DetailSurveyFormState["values"]>) =>
    setFormState((prev) => ({ ...prev, values }));

  const setFormErrors = (errors: Partial<DetailSurveyFormState["errors"]>) =>
    setFormState((prev) => ({ ...prev, errors }));

  const handleFormFieldChange = (
    name: keyof DetailSurveyFormState["values"],
    value: FormFieldValue
  ) => {
    const newValues = { ...formState.values, [name]: value };
    setFormValues(newValues);
    const { issues } = ValidateSurvey(newValues);
    setFormErrors({
      ...formState.errors,
      [name]: issues?.find((i) => i.path?.[0] === name)?.message,
    });
  };

  const handleFormReset = () => setFormValues(INITIAL_FORM_VALUES);

  // 🟢 Submit form
  const handleFormSubmit = async () => {
    const { issues } = ValidateSurvey(formState.values);
    if (issues?.length) {
      setFormErrors(
        Object.fromEntries(issues.map((i) => [i.path?.[0], i.message]))
      );
      return;
    }

    const payload = {
      ...formState.values,
      startDate: dayjs(formState.values.startDate, "YYYY-MM-DD").toDate(),
      endDate: dayjs(formState.values.endDate, "YYYY-MM-DD").toDate(),
    };

    try {
      if (editingSurvey && !isCreating) {
        // ✅ Update survey
        const resUpdate = await callUpdateSurvey(
          campaignId!,
          editingSurvey.surveyId,
          payload
        );
        notifications.show("Survey updated successfully.", {
          severity: "success",
        });
        console.log(resUpdate);
        navigate(
          `/dashboard/projects/${projectId}/campaigns/new/${campaignId}/surveys/${resUpdate.data.surveyId}/question`
        );
      } else {
        // ✅ Create new
        const res = await callCreateSurvey(campaignId!, payload);
        notifications.show("Survey created successfully.", {
          severity: "success",
        });
        setEditingSurvey(res.data);
        navigate(
          `/dashboard/projects/${projectId}/campaigns/new/${campaignId}/surveys/${res.data.surveyId}/question`
        );
      }

      // Reload danh sách
      const updated = await callGetSurveysByCampaign(campaignId!);
      setSurveys(updated.data || []);
      setEditingSurvey(null);
      setIsCreating(false); // ✅ reset chế độ tạo mới
    } catch (error) {
      notifications.show(
        `Failed to save survey. Reason: ${(error as Error).message}`,
        { severity: "error" }
      );
    }
  };

  // 🟡 Loading
  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress />
      </Box>
    );

  // 🟢 Hiển thị form khi đang edit / tạo mới / chưa có survey
  if (editingSurvey || isCreating || surveys.length === 0) {
    return (
      <PageContainer
        title={
          editingSurvey && !isCreating ? "Edit Survey" : "Create New Survey"
        }
        breadcrumbs={[
          { title: "Campaigns", path: "/dashboard/campaigns" },
          { title: "Surveys" },
        ]}
      >
        <SurveyForm
          formState={formState}
          onFieldChange={handleFormFieldChange}
          onSubmit={handleFormSubmit}
          onReset={handleFormReset}
          submitButtonLabel={
            editingSurvey && !isCreating ? "Update Survey" : "Create Survey"
          }
        />

        {(editingSurvey || isCreating) && (
          <Box textAlign="center" mt={3}>
            <Button
              variant="contained"
              onClick={() => {
                setEditingSurvey(null);
                setIsCreating(false); // ✅ quay lại danh sách
              }}
            >
              Back to List Survey
            </Button>
          </Box>
        )}
      </PageContainer>
    );
  }

  // 🟢 Nếu có danh sách survey → hiển thị dạng card
  return (
    <PageContainer
      title="Existing Surveys"
      breadcrumbs={[
        { title: "Campaigns", path: "/dashboard/campaigns" },
        { title: "Surveys" },
      ]}
    >
      <Typography variant="h6" fontWeight={600} mb={2}>
        Click a survey to view or edit.
      </Typography>
      <Grid container spacing={2}>
        {surveys.map((survey) => (
          <Grid item size={{ xs: 12, md: 6, lg: 4 }} key={survey.surveyId}>
            <Card
              variant="outlined"
              sx={{
                height: "100%", // ✅ đảm bảo full height
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                cursor: "pointer",
                transition: "0.2s",
                "&:hover": { boxShadow: 4, transform: "scale(1.02)" },
              }}
              onClick={() => {
                setEditingSurvey(survey);
                setIsCreating(false);
              }}
            >
              <CardContent
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    gutterBottom
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {survey.surveyName}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mb={2}
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2, // ✅ giới hạn 2 dòng
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      minHeight: "40px", // ✅ để chiều cao đồng đều hơn
                    }}
                  >
                    {parse(survey.description) || "No description provided"}
                  </Typography>
                </Box>

                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ justifyContent: "space-between", mt: "auto" }}
                >
                  <Typography variant="caption">
                    Start: {dayjs(survey.startDate).format("DD/MM/YYYY")}
                  </Typography>
                  <Typography variant="caption">
                    End: {dayjs(survey.endDate).format("DD/MM/YYYY")}
                  </Typography>
                </Stack>
                <Button
                  variant="text"
                  color="error"
                  size="small"
                  onClick={(e) => handleOpenDeleteDialog(e, survey)}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box mt={4} textAlign="center">
        <Button
          variant="contained"
          color="primary"
          sx={{ mr: 4 }}
          onClick={() =>
            navigate(
              `/dashboard/projects/${projectId}/campaigns/new/${campaignId}/test-case`
            )
          }
        >
          Back to Testcase
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setIsCreating(true);
            setEditingSurvey(null);
            setFormState({
              values: INITIAL_FORM_VALUES,
              errors: {},
            });
          }}
        >
          Create New Survey
        </Button>
        <Button
          sx={{ ml: 4 }}
          variant="contained"
          color="primary"
          onClick={() =>
            navigate(
              `/dashboard/projects/${projectId}/campaigns/new/${campaignId}/launch`
            )
          }
        >
          Continue to Launch
        </Button>
      </Box>

      <Dialog
        open={confirmDeleteOpen}
        onClose={() => {
          if (!deleteLoading) {
            setConfirmDeleteOpen(false);
            setSurveyToDelete(null);
          }
        }}
      >
        <DialogTitle>Xóa khảo sát?</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa khảo sát{" "}
            <strong>{surveyToDelete?.surveyName}</strong> không?
            <br />
            Hành động này sẽ xóa các dữ liệu liên quan đến khảo sát.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              if (!deleteLoading) {
                setConfirmDeleteOpen(false);
                setSurveyToDelete(null);
              }
            }}
            disabled={deleteLoading}
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={deleteLoading}
          >
            {deleteLoading ? "Đang xóa..." : "Xóa"}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}
