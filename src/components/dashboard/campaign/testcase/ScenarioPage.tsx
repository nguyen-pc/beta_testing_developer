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
import {
  callGetScenariosByUseCase,
  callCreateScenario,
  callUpdateScenario,
  callDeleteScenario,
} from "../../../../config/api";
import PageContainer from "../../../dashboard/project/PageContainer";
import useNotifications from "../../../../hooks/useNotifications/useNotifications";
import ScenarioDialog from "./ScenarioDialog";
import { type Scenario } from "../../../../data/testscenario";
import queryString from "query-string";
import { useNavigate, useParams } from "react-router-dom";
import UploadScenarioDialog from "./UploadScenarioDialog";
// import { sfLike } from "spring-filter-query-builder";

export default function ScenarioPage() {
  const notifications = useNotifications();
  const [open, setOpen] = React.useState(false);
  const { useCaseId, projectId, campaignId } = useParams();
  const navigate = useNavigate();
  const [scenarios, setScenarios] = React.useState<Scenario[]>([]);
  const [selectedScenario, setSelectedScenario] =
    React.useState<Scenario | null>(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openUploadDialog, setOpenUploadDialog] = React.useState(false);

  const buildQuery = (params) => {
    const q = {
      page: params.current,
      size: params.pageSize,
    };
    return queryString.stringify(q);
  };

  const fetchScenarios = React.useCallback(async () => {
    const query = buildQuery({ current: 1, pageSize: 15 });
    try {
      const res = await callGetScenariosByUseCase(useCaseId, query);
      if (res?.data?.result) setScenarios(res.data.result);
      else setScenarios([]);
    } catch (err) {
      notifications.show("Failed to load scenarios.", { severity: "error" });
    }
  }, [useCaseId, notifications]);

  React.useEffect(() => {
    fetchScenarios();
  }, [fetchScenarios]);

  const handleCreate = () => {
    setSelectedScenario(null);
    setOpenDialog(true);
  };

  const handleEdit = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDialogSave = async (data: Partial<Scenario>) => {
    try {
      const payload = {
        title: data.title || "",
        description: data.description || "",
        precondition: data.precondition || "",
        useCase: {
          id: useCaseId,
        },
      };

      console.log("Saving scenario with payload:", payload);

      if (selectedScenario) {
        const payloadUpdate = {
          id: selectedScenario.id,
          title: data.title || "",
          description: data.description || "",
          precondition: data.precondition || "",
          useCase: {
            id: useCaseId,
          },
        };
        await callUpdateScenario(selectedScenario.id, payloadUpdate);
        notifications.show("Scenario updated successfully.", {
          severity: "success",
        });
      } else {
        await callCreateScenario(payload);
        notifications.show("Scenario created successfully.", {
          severity: "success",
        });
      }

      handleDialogClose();
      fetchScenarios();
    } catch (error) {
      notifications.show("Failed to save scenario.", { severity: "error" });
    }
  };

  const handleViewTestCase = (testScenarioId: number) => {
    navigate(
      `/dashboard/projects/${projectId}/campaigns/new/${campaignId}/testcase/${testScenarioId}`
    );
  };

  const handleDeleteScenario = async (scenarioId: number) => {
    try {
      await callDeleteScenario(scenarioId);
      setOpen(false);
      fetchScenarios();
    } catch (error) {
      console.error("Error deleting scenario:", error);
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
      console.log("🔁 Reloading Scenarios...");
      fetchScenarios();
    };
    window.addEventListener("scenario-reload", handleReload);
    return () => window.removeEventListener("scenario-reload", handleReload);
  }, [fetchScenarios]);
  return (
    <PageContainer
      title="Test Scenarios"
      breadcrumbs={[
        { title: "Use Cases", path: "/dashboard/usecases" },
        { title: "Scenarios" },
      ]}
    >
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Scenarios for UseCase #{useCaseId}
        </h2>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" color="primary" onClick={handleCreate}>
            + Create Scenario
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent("open-betabot", {
                  detail: {
                    from: "scenario",
                    mode: "@testscenario ",
                    useCaseId: useCaseId,
                  },
                })
              );
            }}
          >
            + Create Scenario with BetaBot
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
            <th className="px-4 py-2 text-left">Precondition</th>
            <th className="px-4 py-2 text-left">Created By</th>
            <th className="px-4 py-2 text-left">Created At</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {scenarios.length > 0 ? (
            scenarios.map((s) => (
              <tr key={s.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{s.title || "(No title)"}</td>
                <td className="px-4 py-2">{s.description || "—"}</td>
                <td className="px-4 py-2">{s.precondition || "—"}</td>
                <td className="px-4 py-2">{s.createdBy || "—"}</td>
                <td className="px-4 py-2">
                  {s.createdAt ? new Date(s.createdAt).toLocaleString() : "—"}
                </td>
                <td className="px-4 py-2 text-center">
                  <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    onClick={() => handleViewTestCase(s.id)} // 👈 Chuyển sang TestScenario
                  >
                    View TestCase
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleEdit(s)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => handleClickOpen()}
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
                      {"Delete Test Scenario?"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this test scenario? This
                        action cannot be undone.
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose}>Disagree</Button>
                      <Button
                        onClick={() => handleDeleteScenario(s.id)}
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
              <td colSpan={6} className="text-center py-4 text-gray-500">
                No scenarios found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedScenario ? "Edit Scenario" : "Create Scenario"}
        </DialogTitle>
        <DialogContent>
          <ScenarioDialog
            initialData={selectedScenario}
            onSave={handleDialogSave}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>

      <UploadScenarioDialog
        open={openUploadDialog}
        onClose={() => setOpenUploadDialog(false)}
        useCaseId={useCaseId!}
        onUploaded={fetchScenarios}
      />
    </PageContainer>
  );
}
