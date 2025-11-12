import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  callGetUseCasesByCampaign,
  callCreateUseCase,
  callUpdateUseCase,
  callDeleteUseCase,
} from "../../../../config/api";
import PageContainer from "../../../dashboard/project/PageContainer";
import useNotifications from "../../../../hooks/useNotifications/useNotifications";
import UseCaseDialog from "./UseCaseDialog";
import { type UseCase } from "../../../../data/usecase";
import queryString from "query-string";
import { sfLike } from "spring-filter-query-builder";
import { useNavigate, useParams } from "react-router-dom";
import UploadUseCaseDialog from "./UploadUseCaseDialog";

export default function UseCasePage() {
  const notifications = useNotifications();
  const [open, setOpen] = React.useState(false);
  const { projectId, campaignId } = useParams();
  const navigate = useNavigate();
  const [useCases, setUseCases] = React.useState<UseCase[]>([]);
  const [selectedUseCase, setSelectedUseCase] = React.useState<UseCase | null>(
    null
  );
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openUploadDialog, setOpenUploadDialog] = React.useState(false);

  // ================= BUILD QUERY =================
  const buildQuery = (params, sort, filter) => {
    const q = {
      page: params.current,
      size: params.pageSize,
      filter: "",
    };

    const clone = { ...params };
    if (clone.name) q.filter = `${sfLike("name", clone.name)}`;

    let temp = queryString.stringify(q);

    let sortBy = "";
    if (sort && sort.name) {
      sortBy = sort.name === "ascend" ? "sort=name,asc" : "sort=name,desc";
    }

    if (!sortBy) temp = `${temp}&sort=updatedAt,desc`;
    else temp = `${temp}&${sortBy}`;

    return temp;
  };

  // ================= FETCH =================
  const fetchUseCases = React.useCallback(async () => {
    const initialQuery = buildQuery({ current: 1, pageSize: 15 }, {}, {});
    try {
      const res = await callGetUseCasesByCampaign(campaignId, initialQuery);
      if (res?.data?.result) {
        setUseCases(res.data.result);
      } else {
        setUseCases([]);
      }
    } catch (err) {
      notifications.show("Failed to load use cases.", { severity: "error" });
    }
  }, [campaignId, notifications]);

  React.useEffect(() => {
    fetchUseCases();
  }, [fetchUseCases]);

  // ================= CRUD =================
  const handleCreate = () => {
    setSelectedUseCase(null);
    setOpenDialog(true);
  };

  const handleEdit = (useCase: UseCase) => {
    setSelectedUseCase(useCase);
    setOpenDialog(true);
  };

  const handleDialogClose = () => setOpenDialog(false);

  const handleDialogSave = async (data: Partial<UseCase>) => {
    try {
      const payload = {
        name: data.title || data.name || "",
        description: data.description || "",
        campaign: {
          id: campaignId,
        },
      };

      if (selectedUseCase) {
        await callUpdateUseCase(selectedUseCase.id, payload);
        notifications.show("UseCase updated successfully.", {
          severity: "success",
        });
      } else {
        await callCreateUseCase(payload);
        notifications.show("UseCase created successfully.", {
          severity: "success",
        });
      }

      handleDialogClose();
      fetchUseCases();
    } catch (error) {
      notifications.show("Failed to save usecase.", { severity: "error" });
    }
  };

  const handleViewScenarios = (useCaseId: number) => {
    navigate(
      `/dashboard/projects/${projectId}/campaigns/new/${campaignId}/test_scenario/${useCaseId}`
    );
  };
  const handleBack = () => {
    navigate(`/dashboard/projects/${projectId}/campaigns/new/${campaignId}/createRecruiting`);
  };
  const handleContinue = () => {
    navigate(
      `/dashboard/projects/${projectId}/campaigns/new/${campaignId}/survey`
    );
  };

  const handleDeleteUseCase = async (usecaseId: number) => {
    try {
      await callDeleteUseCase(usecaseId);
      setOpen(false);
      fetchUseCases();
    } catch (error) {
      console.error("Error deleting use case:", error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    const handleReload = () => {
      console.log("🔁 Received usecase-reload event → reloading...");
      fetchUseCases();
    };

    window.addEventListener("usecase-reload", handleReload);
    return () => window.removeEventListener("usecase-reload", handleReload);
  }, [fetchUseCases]);

  return (
    <PageContainer
      title="Use Cases"
      breadcrumbs={[
        { title: "Campaigns", path: "/dashboard/campaigns" },
        { title: "Use Cases" },
      ]}
    >
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold">
          UseCases in Campaign #{campaignId}
        </h2>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" color="primary" onClick={handleCreate}>
            + Create UseCase
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent("open-betabot", {
                  detail: {
                    from: "usecase",
                    mode: "@usecase ",
                    campaignId: campaignId,
                  },
                })
              );
            }}
          >
            + Create UseCase with BetaBot
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenUploadDialog(true)}
          >
            + Upload Excel
          </Button>
        </Stack>
      </div>

      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Title</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-left">Created By</th>
            <th className="px-4 py-2 text-left">Created At</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {useCases.length > 0 ? (
            useCases.map((u) => (
              <tr key={u.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">
                  {u.title || u.name || "(No title)"}
                </td>
                <td className="px-4 py-2">
                  {u.description || "(No description)"}
                </td>
                <td className="px-4 py-2">{u.createdBy || "—"}</td>
                <td className="px-4 py-2">
                  {u.createdAt ? new Date(u.createdAt).toLocaleString() : "—"}
                </td>
                <td className="px-4 py-2 text-center space-x-2">
                  <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    onClick={() => handleViewScenarios(u.id)} // 👈 Chuyển sang TestScenario
                  >
                    View Scenarios
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleEdit(u)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={handleClickOpen}
                  >
                    Delete
                  </Button>
                  <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {"Delete Use Case?"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this use case? This
                        action cannot be undone.
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose}>Disagree</Button>
                      <Button
                        onClick={() => handleDeleteUseCase(u.id)}
                        autoFocus
                      >
                        Agree
                      </Button>
                    </DialogActions>
                  </Dialog>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-4 text-gray-500">
                No use cases found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-between mb-4 mt-7">
        <Button
          variant="contained"
          color="inherit"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Back
        </Button>
        <Button variant="contained" color="primary" onClick={handleContinue}>
          Continue
        </Button>
      </div>

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedUseCase ? "Edit UseCase" : "Create UseCase"}
        </DialogTitle>
        <DialogContent>
          <UseCaseDialog
            initialData={selectedUseCase}
            onSave={handleDialogSave}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
      <UploadUseCaseDialog
        open={openUploadDialog}
        onClose={() => setOpenUploadDialog(false)}
        campaignId={campaignId!}
        onUploaded={fetchUseCases}
      />
    </PageContainer>
  );
}
