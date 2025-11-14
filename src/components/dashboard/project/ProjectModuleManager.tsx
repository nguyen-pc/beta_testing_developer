import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  Alert,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  callGetModulesByProject,
  callCreateModule,
  callUpdateModule,
  callDeleteModule,
} from "../../../config/api";

const riskLevels = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export default function ProjectModuleManager({ projectId }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  // dialogs
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // For add/edit
  const [formData, setFormData] = useState({
    id: null,
    moduleName: "",
    description: "",
    riskLevel: "LOW",
  });

  const [deleteId, setDeleteId] = useState(null);

  const fetchModules = async () => {
    setLoading(true);
    try {
      const res = await callGetModulesByProject(projectId);
      console.log("Modules fetched:", res.data);
      setModules(res.data);
    } catch (err) {
      console.error("Failed to load modules", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (projectId) fetchModules();
  }, [projectId]);

  const handleOpenAdd = () => {
    setFormData({
      id: null,
      moduleName: "",
      description: "",
      riskLevel: "LOW",
    });
    setOpenForm(true);
  };

  const handleOpenEdit = (module) => {
    setFormData({
      id: module.id,
      moduleName: module.moduleName,
      description: module.description,
      riskLevel: module.riskLevel,
    });
    setOpenForm(true);
  };

  const handleSave = async () => {
    try {
      if (!formData.moduleName.trim()) return;

      const payload = {
        moduleName: formData.moduleName,
        description: formData.description,
        riskLevel: formData.riskLevel,
        projectId: projectId,
      };

      if (formData.id == null) {
        await callCreateModule(payload);
      } else {
        await callUpdateModule(formData.id, payload);
      }

      setOpenForm(false);
      fetchModules();
    } catch (err) {
      console.error("Failed to save module", err);
    }
  };

  const handleOpenDelete = (id) => {
    setDeleteId(id);
    setOpenDelete(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await callDeleteModule(deleteId);
      setOpenDelete(false);
      fetchModules();
    } catch (err) {
      console.error("Failed to delete module", err);
    }
  };

  return (
    <Box sx={{ mt: 5 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Modules
        </Typography>

        <Button variant="contained" onClick={handleOpenAdd}>
          + Add Module
        </Button>
      </Box>

      {/* LIST MODULE UI */}
      {modules.length === 0 ? (
        <Alert severity="info">No modules available for this project.</Alert>
      ) : (
        <Grid container spacing={3}>
          {modules.map((m) => (
            <Grid item size={{ xs: 12, md: 6, lg: 4 }} key={m.id}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                  transition: "0.2s",
                  "&:hover": { transform: "translateY(-3px)" },
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight={600}>
                    {m.moduleName}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      display: "-webkit-box",
                      mb: 1,
                    }}
                  >
                    {m.description || "No description."}
                  </Typography>

                  <ChipDisplay risk={m.riskLevel} />

                  <Stack direction="row" spacing={1} mt={2}>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenEdit(m)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleOpenDelete(m.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* ADD / EDIT DIALOG */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{formData.id ? "Edit Module" : "Add Module"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Module Name"
            value={formData.moduleName}
            sx={{ mt: 2 }}
            onChange={(e) =>
              setFormData({ ...formData, moduleName: e.target.value })
            }
          />

          <TextField
            fullWidth
            multiline
            minRows={5}
            maxRows={12}
            label="Description"
            sx={{ mt: 2, "& .MuiInputBase-root": { minHeight: "120px" } }}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <TextField
            fullWidth
            select
            label="Risk Level"
            sx={{ mt: 2 }}
            value={formData.riskLevel}
            onChange={(e) =>
              setFormData({ ...formData, riskLevel: e.target.value })
            }
          >
            {riskLevels.map((lvl) => (
              <MenuItem key={lvl} value={lvl}>
                {lvl}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {formData.id ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE CONFIRM */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Delete Module?</DialogTitle>
        <DialogContent>
          <Typography>This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function ChipDisplay({ risk }) {
  const colorMap = {
    LOW: "success",
    MEDIUM: "warning",
    HIGH: "error",
    CRITICAL: "error",
  };

  return (
    <Box mt={1}>
      <Button
        size="small"
        variant="outlined"
        color={colorMap[risk] || "default"}
        sx={{ fontSize: "12px", borderRadius: 2 }}
      >
        {risk}
      </Button>
    </Box>
  );
}
