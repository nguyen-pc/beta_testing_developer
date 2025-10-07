import * as React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import PageContainer from "../../../dashboard/project/PageContainer";
import useNotifications from "../../../../hooks/useNotifications/useNotifications";
import queryString from "query-string";
import { useParams } from "react-router-dom";
import {
  callGetTestcasesByScenario,
  callCreateTestcase,
  callUpdateTestcase,
  callDeleteTestcase,
} from "../../../../config/api";
import { type Testcase } from "../../../../data/testcase";
import TestcaseDialog from "./TestcaseDialog";

export default function TestcasePage() {
  const notifications = useNotifications();
  const [open, setOpen] = React.useState(false);
  const { testScenarioId } = useParams();
  const [testcases, setTestcases] = React.useState<Testcase[]>([]);
  const [selectedTestcase, setSelectedTestcase] =
    React.useState<Testcase | null>(null);
  const [openDialog, setOpenDialog] = React.useState(false);

  const buildQuery = (params) => {
    const q = {
      page: params.current,
      size: params.pageSize,
    };
    return queryString.stringify(q);
  };

  const fetchTestcases = React.useCallback(async () => {
    const query = buildQuery({ current: 1, pageSize: 15 });
    try {
      const res = await callGetTestcasesByScenario(testScenarioId, query);
      if (res?.data?.result) setTestcases(res.data.result);
      else setTestcases([]);
    } catch (err) {
      notifications.show("Failed to load test cases.", { severity: "error" });
    }
  }, [testScenarioId, notifications]);

  React.useEffect(() => {
    fetchTestcases();
  }, [fetchTestcases]);

  const handleCreate = () => {
    setSelectedTestcase(null);
    setOpenDialog(true);
  };

  const handleEdit = (testcase: Testcase) => {
    setSelectedTestcase(testcase);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDialogSave = async (data: Partial<Testcase>) => {
    try {
      const payload = {
        title: data.title || "",
        description: data.description || "",
        preCondition: data.preCondition || "",
        dataTest: data.dataTest || "",
        steps: data.steps || "",
        expectedResult: data.expectedResult || "",
        status: data.priority || "",
        testScenario: {
          id: testScenarioId,
        },
      };

      if (selectedTestcase) {
        await callUpdateTestcase(selectedTestcase.id, payload);
        notifications.show("Test case updated successfully.", {
          severity: "success",
        });
      } else {
        await callCreateTestcase(payload);
        notifications.show("Test case created successfully.", {
          severity: "success",
        });
      }

      handleDialogClose();
      fetchTestcases();
    } catch (error) {
      notifications.show("Failed to save test case.", { severity: "error" });
    }
  };

  const handleDeleteTestCase = async (testCaseId: number) => {
    try {
      await callDeleteTestcase(testCaseId);
      setOpen(false);
      fetchTestcases();
    } catch (error) {
      console.error("Error deleting test case:", error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <PageContainer
      title="Test Cases"
      breadcrumbs={[
        { title: "Scenarios", path: "/dashboard/scenarios" },
        { title: "Test Cases" },
      ]}
    >
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Test Cases for Scenario #{testScenarioId}
        </h2>
        <Button variant="contained" color="primary" onClick={handleCreate}>
          + Create Test Case
        </Button>
      </div>

      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-left">Precondition</th>
            <th className="px-4 py-2 text-left">Steps</th>
            <th className="px-4 py-2 text-left">Expected Result</th>
            <th className="px-4 py-2 text-center">Status</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {testcases.length > 0 ? (
            testcases.map((t) => (
              <tr key={t.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{t.title}</td>
                <td className="px-4 py-2">{t.description || "—"}</td>
                <td className="px-4 py-2">{t.preCondition || "—"}</td>
                <td className="px-4 py-2">{t.steps || "—"}</td>
                <td className="px-4 py-2">{t.expectedResult || "—"}</td>
                <td className="px-4 py-2 text-center">
                  {t.status ? (
                    <span className="text-green-600 font-medium">Passed</span>
                  ) : (
                    <span className="text-red-600 font-medium">Failed</span>
                  )}
                </td>
                <td className="px-4 py-2 text-center">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleEdit(t)}
                  >
                    Edit
                  </Button>
                   <Button
                    variant="outlined"
                    size="small"
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
                      {"Delete Test Case?"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this test case? This
                        action cannot be undone.
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose}>Disagree</Button>
                      <Button
                        onClick={() => handleDeleteTestCase(t.id)}
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
              <td colSpan={7} className="text-center py-4 text-gray-500">
                No test cases found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedTestcase ? "Edit Test Case" : "Create Test Case"}
        </DialogTitle>
        <DialogContent>
          <TestcaseDialog
            initialData={selectedTestcase}
            onSave={handleDialogSave}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
